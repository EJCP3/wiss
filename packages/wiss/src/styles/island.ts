import { getConfig } from '../core/config';
import type { Toast, ToastType } from '../core/types';
import './island.css';

const AUTO_EXPAND_DELAY_MS = 50;
const AUTO_COLLAPSE_DELAY_MS = 4000;

function svgIcon(title: string, paths: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><title>${title}</title>${paths}</svg>`;
}

const ICONS: Record<ToastType, string> = {
  success: svgIcon('Check', '<path d="M20 6 9 17l-5-5"/>'),
  error: svgIcon('X', '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>'),
  warning: svgIcon('Alert', '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>'),
  info: svgIcon('Info', '<circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="m14.83 14.83 4.24 4.24"/><path d="m9.17 14.83-4.24 4.24"/><circle cx="12" cy="12" r="4"/>'),
  loading: svgIcon('Loading', '<path class="island-spinner" d="M21 12a9 9 0 1 1-6.219-8.56"/>'),
};

interface IslandState {
  toastRef: Toast;
  stage: 0 | 1 | 2;
  titleWidth: number;
  contentWidth: number;
  contentHeight: number;
  stageTimer: ReturnType<typeof setTimeout> | null;
  contentDiv: HTMLDivElement;
  titleDiv: HTMLDivElement;
  descDiv: HTMLDivElement | null;
  actionBtn: HTMLButtonElement | null;
  contentRO: ResizeObserver | null;
  rafId: number;
}

const instances = new WeakMap<HTMLButtonElement, IslandState>();

function applyCSS(el: HTMLButtonElement, state: IslandState): void {
  // Stage 0: 40x40
  // Stage 1: titleWidth + 48, 40px
  // Stage 2: contentWidth + 48, contentHeight + 16
  
  let w = 40;
  let h = 40;

  if (state.stage === 1) {
    w = state.contentWidth + 48;
    h = 40;
  } else if (state.stage === 2) {
    w = state.contentWidth + 48;
    h = Math.max(40, state.contentHeight + 16);
  }
  
  el.style.setProperty('--island-w', `${w}px`);
  el.style.setProperty('--island-h', `${h}px`);
  el.dataset.stage = String(state.stage);
  state.contentDiv.dataset.stage = String(state.stage);
}

function measure(el: HTMLButtonElement, state: IslandState): void {
  // To measure title only, we can use scrollWidth of titleDiv.
  const tw = state.titleDiv.scrollWidth;
  const cw = state.contentDiv.scrollWidth;
  const ch = state.contentDiv.scrollHeight;

  if (cw > 0 && (cw !== state.contentWidth || ch !== state.contentHeight || tw !== state.titleWidth)) {
    state.titleWidth = tw;
    state.contentWidth = cw;
    state.contentHeight = ch;
    applyCSS(el, state);
  }
}

function setStage(el: HTMLButtonElement, state: IslandState, newStage: 0 | 1 | 2): void {
  if (state.stage === newStage) return;
  state.stage = newStage;
  applyCSS(el, state);
}

function scheduleAutopilot(el: HTMLButtonElement, state: IslandState, duration: number): void {
  if (state.stageTimer) clearTimeout(state.stageTimer);

  // Animate to Stage 1, then Stage 2
  state.stageTimer = setTimeout(() => {
    setStage(el, state, 1);
    
    // Check if we need Stage 2 (if there is desc or action)
    if (state.descDiv || state.actionBtn) {
      state.stageTimer = setTimeout(() => setStage(el, state, 2), 300);
    } else {
      // Just keep it at stage 1
      setStage(el, state, 1); // wait, it's already 1, this is fine
    }
  }, AUTO_EXPAND_DELAY_MS);
}

export function renderIslandToast(toast: Toast): HTMLElement {
  const resolvedDuration = toast.duration ?? getConfig().duration;

  const el = document.createElement('button');
  el.className = 'wiss-island';
  el.dataset.wissId = toast.id;
  el.dataset.state = toast.type;
  el.dataset.stage = '0';

  const iconContainer = document.createElement('div');
  iconContainer.className = 'island-icon';
  iconContainer.innerHTML = ICONS[toast.type];

  const contentDiv = document.createElement('div');
  contentDiv.className = 'island-content';
  contentDiv.dataset.visible = 'false';

  const titleDiv = document.createElement('div');
  titleDiv.className = 'island-title';
  titleDiv.textContent = toast.message;
  contentDiv.append(titleDiv);

  let descDiv = null;
  if (toast.description) {
    descDiv = document.createElement('div');
    descDiv.className = 'island-desc';
    descDiv.textContent = toast.description;
    contentDiv.append(descDiv);
  }

  let actionBtn = null;
  if (toast.action) {
    actionBtn = document.createElement('button');
    actionBtn.className = 'island-action';
    actionBtn.dataset.cuelumePress = '';
    actionBtn.dataset.cuelumeRelease = '';
    actionBtn.dataset.cuelumeHover = 'tick';
    actionBtn.textContent = toast.action.label;
    actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toast.action?.onClick();
    });
    contentDiv.append(actionBtn);
  }

  el.append(iconContainer, contentDiv);

  const showProgressBar = toast.progressBar ?? getConfig().progressBar;
  if (showProgressBar) {
    const progressBar = document.createElement('div');
    progressBar.className = 'wiss-progress-bar';
    progressBar.style.animationDuration = `${resolvedDuration}ms`;
    el.append(progressBar);
  }

  const state: IslandState = {
    toastRef: toast,
    stage: 0,
    titleWidth: 0,
    contentWidth: 0,
    contentHeight: 0,
    stageTimer: null,
    contentDiv,
    titleDiv,
    descDiv,
    actionBtn,
    contentRO: null,
    rafId: 0,
  };

  instances.set(el, state);

  state.contentRO = new ResizeObserver(() => {
    cancelAnimationFrame(state.rafId);
    state.rafId = requestAnimationFrame(() => measure(el, state));
  });
  state.contentRO.observe(contentDiv);

  el.addEventListener('mouseenter', () => {
    if (state.stage === 0) return; // Don't expand if fully closed
    const maxStage = (state.descDiv || state.actionBtn) ? 2 : 1;
    setStage(el, state, maxStage);
  });

  el.addEventListener('wiss:collapse', () => {
    if (state.stageTimer) clearTimeout(state.stageTimer);
    setStage(el, state, 0);
  });

  requestAnimationFrame(() => {
    scheduleAutopilot(el, state, resolvedDuration);
  });

  return el;
}

export function updateIslandToast(el: HTMLElement, toast: Toast): void {
  const button = el as HTMLButtonElement;
  const state = instances.get(button);
  if (!state) return;

  const changed = state.toastRef !== toast;
  state.toastRef = toast;
  if (!changed) return;

  const resolvedDuration = toast.duration ?? getConfig().duration;
  button.dataset.state = toast.type;
  
  const iconContainer = button.querySelector('.island-icon');
  if (iconContainer) iconContainer.innerHTML = ICONS[toast.type];
  
  state.titleDiv.textContent = toast.message;

  if (toast.description && !state.descDiv) {
    state.descDiv = document.createElement('div');
    state.descDiv.className = 'island-desc';
    state.descDiv.textContent = toast.description;
    if (state.actionBtn) state.contentDiv.insertBefore(state.descDiv, state.actionBtn);
    else state.contentDiv.append(state.descDiv);
  } else if (!toast.description && state.descDiv) {
    state.descDiv.remove();
    state.descDiv = null;
  } else if (state.descDiv) {
    state.descDiv.textContent = toast.description ?? null;
  }

  if (toast.action && !state.actionBtn) {
    state.actionBtn = document.createElement('button');
    state.actionBtn.className = 'island-action';
    state.actionBtn.dataset.cuelumePress = '';
    state.actionBtn.dataset.cuelumeRelease = '';
    state.actionBtn.dataset.cuelumeHover = 'tick';
    state.actionBtn.textContent = toast.action.label;
    state.actionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toast.action?.onClick();
    });
    state.contentDiv.append(state.actionBtn);
  } else if (!toast.action && state.actionBtn) {
    state.actionBtn.remove();
    state.actionBtn = null;
  } else if (state.actionBtn && toast.action) {
    state.actionBtn.textContent = toast.action.label;
  }

  const showProgressBar = toast.progressBar ?? getConfig().progressBar;
  let progressBar = button.querySelector('.wiss-progress-bar');
  
  if (showProgressBar) {
    if (progressBar) progressBar.remove();
    progressBar = document.createElement('div');
    progressBar.className = 'wiss-progress-bar';
    progressBar.style.animationDuration = `${resolvedDuration}ms`;
    button.append(progressBar);
  } else if (progressBar) {
    progressBar.remove();
  }

  measure(button, state);
  scheduleAutopilot(button, state, resolvedDuration);
}

export function closeIslandToast(el: HTMLElement, onComplete: () => void): void {
  const button = el as HTMLButtonElement;
  const state = instances.get(button);
  if (!state) {
    onComplete();
    return;
  }
  
  if (state.stageTimer) clearTimeout(state.stageTimer);
  
  if (state.stage === 2) {
    setStage(button, state, 1);
    setTimeout(() => {
      setStage(button, state, 0);
      setTimeout(onComplete, 400); // Wait 400ms for width transition to finish
    }, 400); // 400ms for height
  } else if (state.stage === 1) {
    setStage(button, state, 0);
    setTimeout(onComplete, 400); // Wait 400ms for width transition to finish
  } else {
    onComplete();
  }
}
