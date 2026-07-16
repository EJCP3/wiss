import { getConfig } from '../core/config';
import type { Position, Toast, ToastType } from '../core/types';
import { getFilterId } from './gooey';
import './wiss.css';

// The whole expand/collapse geometry depends on these — don't tweak them
// without re-checking every formula that reads them.
const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 18;
const BLUR_RATIO = 0.5;
const PILL_PADDING = 10;
const MIN_EXPAND_RATIO = 2.25;
const DURATION_MS = 600;

// We don't expose a per-toast roundness override yet, so this is constant —
// getFilterId() caches by blur value, so all toasts share one <filter>.
const BLUR = DEFAULT_ROUNDNESS * BLUR_RATIO;

// Measuring descriptionDiv.scrollHeight alone ignores its own wrapper's
// padding. Without this, the expanded height only budgets room for the raw
// text, so the description ends up pressed against the rounded bottom
// corners. Must match [data-wiss-content]'s top+bottom padding in wiss.css.
const CONTENT_PADDING_Y = 40;

// Fixed delays (expand almost immediately, collapse a few seconds later),
// clamped against this toast's *actual* resolved duration so a short toast
// never schedules a collapse past its own dismissal (see resolveAutopilot).
const AUTO_EXPAND_DELAY_MS = 150;
const AUTO_COLLAPSE_DELAY_MS = 4000;

type PillAlign = 'left' | 'center' | 'right';
type ExpandEdge = 'top' | 'bottom';

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string | number> = {},
): SVGElementTagNameMap[K] {
  const el = document.createElementNS(SVG_NS, tag) as SVGElementTagNameMap[K];
  for (const [key, value] of Object.entries(attrs)) {
    el.setAttribute(key, String(value));
  }
  return el;
}

// Only success/error/warning/info — our ToastType has no loading/action
// states. Static, developer-authored markup only: safe to use with
// innerHTML since it never mixes in toast content.
function svgIcon(title: string, inner: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><title>${title}</title>${inner}</svg>`;
}

const STATE_ICONS: Record<ToastType, string> = {
  success: svgIcon('Check', '<path d="M20 6 9 17l-5-5"/>'),
  error: svgIcon('X', '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  warning: svgIcon(
    'Circle Alert',
    '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
  ),
  info: svgIcon(
    'Life Buoy',
    '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>',
  ),
  loading: svgIcon(
    'Loading',
    '<path class="wiss-spinner" d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  ),
};

function pillAlign(position: Position): PillAlign {
  if (position.endsWith('right')) return 'right';
  if (position.endsWith('center')) return 'center';
  return 'left';
}

function expandDir(position: Position): ExpandEdge {
  return position.startsWith('top') ? 'bottom' : 'top';
}

// No per-toast `autopilot` override object yet — always uses the delays
// above, clamped to this toast's duration.
function resolveAutopilot(duration: number): { expandDelayMs: number; collapseDelayMs: number } | null {
  if (!Number.isFinite(duration) || duration <= 0) return null;
  const clamp = (v: number) => Math.min(duration, Math.max(0, v));
  return {
    expandDelayMs: clamp(AUTO_EXPAND_DELAY_MS),
    collapseDelayMs: clamp(AUTO_COLLAPSE_DELAY_MS),
  };
}

interface WissState {
  toastRef: Toast;
  isExpanded: boolean;
  pillWidth: number;
  contentHeight: number;
  frozenExpanded: number;
  headerPad: number | null;
  headerRO: ResizeObserver | null;
  contentRO: ResizeObserver | null;
  headerRafId: number;
  contentRafId: number;
  autoExpandTimer: ReturnType<typeof setTimeout> | null;
  hasContent: boolean;
  align: PillAlign;
  edge: ExpandEdge;
  canvasDiv: HTMLDivElement;
  svg: SVGSVGElement;
  pillRect: SVGRectElement;
  bodyRect: SVGRectElement;
  headerDiv: HTMLDivElement;
  headerInner: HTMLDivElement;
  badgeDiv: HTMLDivElement;
  titleSpan: HTMLSpanElement;
  contentDiv: HTMLDivElement | null;
  descriptionDiv: HTMLDivElement | null;
  actionButton: HTMLButtonElement | null;
}

// Per-instance mutable state, keyed by the root <button>. render() creates
// it, update() looks it up.
const instances = new WeakMap<HTMLButtonElement, WissState>();

function applyCSS(el: HTMLButtonElement, state: WissState): void {
  const minExpanded = HEIGHT * MIN_EXPAND_RATIO;
  const rawExpanded = state.hasContent
    ? Math.max(minExpanded, HEIGHT + state.contentHeight + CONTENT_PADDING_Y)
    : minExpanded;
  const open = state.hasContent && state.isExpanded;

  if (open) {
    state.frozenExpanded = rawExpanded;
  }
  const expanded = open ? rawExpanded : state.frozenExpanded;
  const svgHeight = state.hasContent ? Math.max(expanded, minExpanded) : HEIGHT;
  const expandedContent = Math.max(0, expanded - HEIGHT);
  const resolvedPillWidth = Math.max(state.pillWidth || HEIGHT, HEIGHT);
  const pillHeight = HEIGHT + BLUR * 3;
  const pillX =
    state.align === 'right'
      ? WIDTH - resolvedPillWidth
      : state.align === 'center'
        ? (WIDTH - resolvedPillWidth) / 2
        : 0;

  const s = el.style;
  const visibleWidth = open ? WIDTH : resolvedPillWidth;
  const visibleX = open ? 0 : pillX;
  
  s.setProperty('--_h', `${open ? expanded : HEIGHT}px`);
  s.setProperty('--_pw', `${resolvedPillWidth}px`);
  s.setProperty('--_px', `${pillX}px`);
  s.setProperty('--_vw', `${visibleWidth}px`);
  s.setProperty('--_vx', `${visibleX}px`);
  s.setProperty('--_sy', `${open ? 1 : HEIGHT / pillHeight}`);
  s.setProperty('--_ph', `${pillHeight}px`);
  s.setProperty('--_by', `${open ? 1 : 0}`);
  s.setProperty(
    '--_ht',
    `translateY(${open ? (state.edge === 'bottom' ? 3 : -3) : 0}px) scale(${open ? 0.9 : 1})`,
  );
  s.setProperty('--_co', `${open ? 1 : 0}`);

  state.svg.setAttribute('height', String(svgHeight));
  state.svg.setAttribute('viewBox', `0 0 ${WIDTH} ${svgHeight}`);
  state.pillRect.setAttribute('x', String(pillX));
  state.bodyRect.setAttribute('height', String(expandedContent));

  el.dataset.expanded = String(open);
  el.dataset.state = state.toastRef.type;
  if (state.contentDiv) {
    state.contentDiv.dataset.visible = String(open);
  }
}

// Measures the header's real width so the pill hugs its content instead of
// using a fixed width.
function measureHeader(el: HTMLButtonElement, state: WissState): void {
  if (state.headerPad === null || Number.isNaN(state.headerPad)) {
    const cs = getComputedStyle(state.headerDiv);
    const pad = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    if (Number.isNaN(pad)) return;
    state.headerPad = pad;
  }
  const w = state.headerInner.scrollWidth + state.headerPad + PILL_PADDING;
  if (w > PILL_PADDING && w !== state.pillWidth) {
    state.pillWidth = w;
    applyCSS(el, state);
  }
}

function setupHeaderObserver(el: HTMLButtonElement, state: WissState): void {
  measureHeader(el, state);
  state.headerRO = new ResizeObserver(() => {
    cancelAnimationFrame(state.headerRafId);
    state.headerRafId = requestAnimationFrame(() => measureHeader(el, state));
  });
  state.headerRO.observe(state.headerInner);
}

function measureContent(el: HTMLButtonElement, state: WissState): void {
  if (!state.contentDiv) return;
  const h = state.contentDiv.scrollHeight;
  if (h !== state.contentHeight) {
    state.contentHeight = h;
    applyCSS(el, state);
  }
}

function setupContentObserver(el: HTMLButtonElement, state: WissState): void {
  if (!state.contentDiv) return;
  measureContent(el, state);
  state.contentRO = new ResizeObserver(() => {
    cancelAnimationFrame(state.contentRafId);
    state.contentRafId = requestAnimationFrame(() => measureContent(el, state));
  });
  state.contentRO.observe(state.contentDiv);
}

function setExpanded(el: HTMLButtonElement, state: WissState, value: boolean): void {
  if (state.isExpanded === value) return;
  state.isExpanded = value;
  applyCSS(el, state);
}

// mouseenter/mouseleave only — swipe-to-dismiss and header cross-fade are
// out of scope for this pass.
function setupEvents(el: HTMLButtonElement, state: WissState): void {
  el.addEventListener('mouseenter', () => {
    if (state.hasContent) setExpanded(el, state, true);
  });
  el.addEventListener('mouseleave', () => {
    setExpanded(el, state, false);
  });
}

function scheduleAutoExpandCollapse(el: HTMLButtonElement, state: WissState, duration: number): void {
  if (state.autoExpandTimer !== null) {
    clearTimeout(state.autoExpandTimer);
    state.autoExpandTimer = null;
  }
  if (!state.hasContent) return;

  const auto = resolveAutopilot(duration);
  if (!auto) return;

  if (auto.expandDelayMs > 0) {
    state.autoExpandTimer = setTimeout(() => setExpanded(el, state, true), auto.expandDelayMs);
  } else {
    setExpanded(el, state, true);
  }
}

function createContentSection(edge: ExpandEdge, description: string, action?: { label: string; onClick: () => void }): {
  contentDiv: HTMLDivElement;
  descriptionDiv: HTMLDivElement | null;
  actionButton: HTMLButtonElement | null;
} {
  const contentDiv = document.createElement('div');
  contentDiv.dataset.wissContent = '';
  contentDiv.dataset.edge = edge;
  contentDiv.dataset.visible = 'false';

  let descriptionDiv = null;
  if (description) {
    descriptionDiv = document.createElement('div');
    descriptionDiv.dataset.wissDescription = '';
    descriptionDiv.textContent = description;
    contentDiv.append(descriptionDiv);
  }

  let actionButton = null;
  if (action) {
    actionButton = document.createElement('button');
    actionButton.dataset.wissAction = '';
    actionButton.dataset.cuelumePress = '';
    actionButton.dataset.cuelumeRelease = '';
    actionButton.dataset.cuelumeHover = 'tick';
    actionButton.textContent = action.label;
    actionButton.addEventListener('click', (e) => {
      e.stopPropagation();
      action.onClick();
    });
    contentDiv.append(actionButton);
  }

  return { contentDiv, descriptionDiv, actionButton };
}

export function renderWissToast(toast: Toast): HTMLElement {
  const config = getConfig();
  const resolvedPosition = toast.position ?? config.position;
  const resolvedDuration = toast.duration ?? config.duration;
  const hasContent = Boolean(toast.description) || Boolean(toast.action);
  const align = pillAlign(resolvedPosition);
  const edge = expandDir(resolvedPosition);
  const minExpanded = HEIGHT * MIN_EXPAND_RATIO;

  const el = document.createElement('button');
  el.type = 'button';
  el.dataset.wissId = toast.id;
  el.dataset.wissToast = '';
  el.dataset.ready = 'false';
  el.dataset.expanded = 'false';
  el.dataset.exiting = 'false';
  el.dataset.edge = edge;
  el.dataset.position = align;
  el.dataset.state = toast.type;
  el.style.setProperty('--_dur', `${DURATION_MS}ms`);

  // Two-rect (pill + body) model wrapped in a <g filter="url(#gooey)"> so
  // the blur+threshold filter fuses them into one continuous blob instead
  // of two shapes with a visible seam.
  const canvasDiv = document.createElement('div');
  canvasDiv.dataset.wissCanvas = '';
  canvasDiv.dataset.edge = edge;

  const svgHeight = hasContent ? minExpanded : HEIGHT;
  const svg = createSvgElement('svg', {
    width: WIDTH,
    height: svgHeight,
    viewBox: `0 0 ${WIDTH} ${svgHeight}`,
    'data-wiss-svg': '',
  });
  const titleEl = createSvgElement('title');
  titleEl.textContent = 'wiss notification';
  const group = createSvgElement('g', { filter: `url(#${getFilterId(BLUR)})` });
  const pillRect = createSvgElement('rect', {
    x: 0,
    rx: DEFAULT_ROUNDNESS,
    ry: DEFAULT_ROUNDNESS,
    'data-wiss-pill': '',
  });
  const bodyRect = createSvgElement('rect', {
    y: HEIGHT,
    width: WIDTH,
    height: 0,
    rx: DEFAULT_ROUNDNESS,
    ry: DEFAULT_ROUNDNESS,
    'data-wiss-body': '',
  });
  group.append(pillRect, bodyRect);
  svg.append(titleEl, group);
  canvasDiv.append(svg);

  const headerDiv = document.createElement('div');
  headerDiv.dataset.wissHeader = '';
  headerDiv.dataset.edge = edge;
  const headerStack = document.createElement('div');
  headerStack.dataset.wissHeaderStack = '';
  const headerInner = document.createElement('div');
  headerInner.dataset.wissHeaderInner = '';
  const badgeDiv = document.createElement('div');
  badgeDiv.dataset.wissBadge = '';
  badgeDiv.dataset.state = toast.type;
  badgeDiv.innerHTML = STATE_ICONS[toast.type];
  const titleSpan = document.createElement('span');
  titleSpan.dataset.wissTitle = '';
  titleSpan.dataset.state = toast.type;
  titleSpan.textContent = toast.message;
  headerInner.append(badgeDiv, titleSpan);
  headerStack.append(headerInner);
  headerDiv.append(headerStack);

  el.append(canvasDiv, headerDiv);

  const showProgressBar = toast.progressBar ?? config.progressBar;
  if (showProgressBar) {
    const progressWrapper = document.createElement('div');
    progressWrapper.className = 'wiss-progress-wrapper';
    
    const progressBar = document.createElement('div');
    progressBar.className = 'wiss-progress-bar';
    progressBar.style.animationDuration = `${resolvedDuration}ms`;
    
    progressWrapper.append(progressBar);
    el.append(progressWrapper);
  }

  let contentDiv: HTMLDivElement | null = null;
  let descriptionDiv: HTMLDivElement | null = null;
  let actionButton: HTMLButtonElement | null = null;
  if (hasContent) {
    const section = createContentSection(edge, toast.description ?? '', toast.action);
    contentDiv = section.contentDiv;
    descriptionDiv = section.descriptionDiv;
    actionButton = section.actionButton;
    el.append(contentDiv);
  }

  const state: WissState = {
    toastRef: toast,
    isExpanded: false,
    pillWidth: 0,
    contentHeight: 0,
    frozenExpanded: minExpanded,
    headerPad: null,
    headerRO: null,
    contentRO: null,
    headerRafId: 0,
    contentRafId: 0,
    autoExpandTimer: null,
    hasContent,
    align,
    edge,
    canvasDiv,
    svg,
    pillRect,
    bodyRect,
    headerDiv,
    headerInner,
    badgeDiv,
    titleSpan,
    contentDiv,
    descriptionDiv,
    actionButton,
  };

  instances.set(el, state);

  applyCSS(el, state);
  setupHeaderObserver(el, state);
  if (contentDiv) {
    setupContentObserver(el, state);
  }
  setupEvents(el, state);

  // Wait a frame so the initial hidden state (data-ready="false") actually
  // paints before we flip it — otherwise there's nothing for the enter
  // transition to animate from.
  requestAnimationFrame(() => {
    el.dataset.ready = 'true';
    scheduleAutoExpandCollapse(el, state, resolvedDuration);
  });

  return el;
}

export function updateWissToast(el: HTMLElement, toast: Toast): void {
  const button = el as HTMLButtonElement;
  const state = instances.get(button);
  if (!state) return;

  const changed = state.toastRef !== toast;
  state.toastRef = toast;

  if (!changed) {
    applyCSS(button, state);
    return;
  }

  const config = getConfig();
  const resolvedPosition = toast.position ?? config.position;
  const resolvedDuration = toast.duration ?? config.duration;
  const hasContent = Boolean(toast.description) || Boolean(toast.action);
  const align = pillAlign(resolvedPosition);
  const edge = expandDir(resolvedPosition);

  state.hasContent = hasContent;
  state.align = align;
  state.edge = edge;

  button.dataset.edge = edge;
  button.dataset.position = align;
  button.dataset.state = toast.type;
  state.canvasDiv.dataset.edge = edge;
  state.headerDiv.dataset.edge = edge;

  state.badgeDiv.dataset.state = toast.type;
  state.badgeDiv.innerHTML = STATE_ICONS[toast.type];
  state.titleSpan.dataset.state = toast.type;
  state.titleSpan.textContent = toast.message;

  if (hasContent && !state.contentDiv) {
    const section = createContentSection(edge, toast.description ?? '', toast.action);
    state.contentDiv = section.contentDiv;
    state.descriptionDiv = section.descriptionDiv;
    state.actionButton = section.actionButton;
    button.append(section.contentDiv);
    setupContentObserver(button, state);
  } else if (!hasContent && state.contentDiv) {
    state.contentRO?.disconnect();
    state.contentRO = null;
    state.contentDiv.remove();
    state.contentDiv = null;
    state.descriptionDiv = null;
    state.actionButton = null;
    state.contentHeight = 0;
  } else if (state.contentDiv) {
    // Basic inner update for now
    if (state.descriptionDiv) {
      state.descriptionDiv.textContent = toast.description ?? '';
    }
  }

  applyCSS(button, state);
  scheduleAutoExpandCollapse(button, state, resolvedDuration);
}

export function closeWissToast(el: HTMLElement, onComplete: () => void): void {
  const button = el as HTMLButtonElement;
  const state = instances.get(button);
  if (!state) {
    onComplete();
    return;
  }
  
  if (state.autoExpandTimer) clearTimeout(state.autoExpandTimer);
  
  if (state.isExpanded) {
    setExpanded(button, state, false);
    setTimeout(onComplete, 600); // Match --_dur transition
  } else {
    onComplete();
  }
}
