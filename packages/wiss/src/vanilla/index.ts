import { bind, play } from 'cuelume';
import type { ResolvedConfig } from '../core/config';
import { getConfig, setConfig } from '../core/config';
import { subscribe } from '../core/store';
import { pauseAll, resumeAll } from '../core/timers';
import type { Position, Toast, ToastType, WissConfig } from '../core/types';
import { renderDaisyToast, updateDaisyToast } from '../styles/daisy';
import { renderWissToast, updateWissToast } from '../styles/wiss';
import { renderIslandToast, updateIslandToast } from '../styles/island';

const CONTAINER_ID = 'wiss-toaster';
const ENTER_HIDDEN_CLASSES = ['opacity-0', 'translate-y-2', 'scale-95'];
const EXIT_TIMEOUT_MS = 400;

let container: HTMLDivElement | null = null;
let unsubscribeStore: (() => void) | null = null;

function applyContainerPosition(el: HTMLDivElement, position: Position, offset: number): void {
  const [vertical, horizontal] = position.split('-') as [
    'top' | 'bottom',
    'left' | 'center' | 'right',
  ];

  el.style.top = vertical === 'top' ? `${offset}px` : '';
  el.style.bottom = vertical === 'bottom' ? `${offset}px` : '';
  el.style.left = '';
  el.style.right = '';
  el.style.transform = '';

  if (horizontal === 'left') {
    el.style.left = `${offset}px`;
    el.style.alignItems = 'flex-start';
  } else if (horizontal === 'right') {
    el.style.right = `${offset}px`;
    el.style.alignItems = 'flex-end';
  } else {
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.alignItems = 'center';
  }

  // Newest toast stays closest to the screen edge it entered from.
  el.style.flexDirection = vertical === 'top' ? 'column' : 'column-reverse';
}

function createContainer(position: Position, offset: number): HTMLDivElement {
  const el = document.createElement('div');
  el.id = CONTAINER_ID;
  el.setAttribute('data-wiss-toaster', '');
  el.style.position = 'fixed';
  el.style.display = 'flex';
  el.style.gap = '0.5rem';
  el.style.zIndex = '2147483647';
  el.style.pointerEvents = 'none';
  el.style.maxWidth = '100vw';

  applyContainerPosition(el, position, offset);
  document.body.appendChild(el);
  return el;
}

function getThemeRenderer(theme: ResolvedConfig['theme']) {
  if (theme === 'daisy') return { render: renderDaisyToast, update: updateDaisyToast };
  if (theme === 'island' || theme === 'island-daisy') return { render: renderIslandToast, update: updateIslandToast };
  return { render: renderWissToast, update: updateWissToast };
}

function animateOut(node: HTMLElement): void {
  if (node.dataset.wissExiting === 'true' || node.dataset.exiting === 'true') {
    return;
  }
  
  if (node.hasAttribute('data-wiss-toast')) {
    // Wiss theme (handled via wiss.css)
    node.dataset.exiting = 'true';
  } else if (node.classList.contains('wiss-island')) {
    // Island theme (handled via island.css or directly via JS exit if we wanted)
    // Actually, island doesn't have an exit transition in CSS yet, let's just fade it out using tailwind classes
    node.classList.add(...ENTER_HIDDEN_CLASSES, 'transition-all', 'duration-300');
    node.dataset.exiting = 'true';
  } else {
    // Daisy theme (handled via Tailwind classes)
    node.dataset.wissExiting = 'true';
    node.classList.add(...ENTER_HIDDEN_CLASSES);
  }

  const remove = () => node.remove();
  node.addEventListener('transitionend', remove, { once: true });
  setTimeout(remove, EXIT_TIMEOUT_MS);
}

function playToastSound(type: ToastType) {
  switch (type) {
    case 'success': play('success'); break;
    case 'error': play('press'); break;
    case 'warning': play('chime'); break;
    case 'info': play('droplet'); break;
    case 'loading': play('bloom'); break;
  }
}

function reconcile(el: HTMLDivElement, toasts: Toast[], theme: ResolvedConfig['theme']): void {
  const { render, update } = getThemeRenderer(theme);

  const existingById = new Map<string, HTMLElement>();
  Array.from(el.children).forEach((child) => {
    if (child instanceof HTMLElement && child.dataset.wissId) {
      existingById.set(child.dataset.wissId, child);
    }
  });

  const seen = new Set<string>();

  toasts.forEach((toast) => {
    seen.add(toast.id);
    const existing = existingById.get(toast.id);

    if (existing) {
      const prevType = existing.dataset.state as ToastType;
      update(existing, toast);
      if (prevType !== toast.type && toast.type === 'success') {
        playToastSound('success'); // Re-play if a promise resolves successfully
      } else if (prevType !== toast.type && toast.type === 'error') {
        playToastSound('error');
      }
      return;
    }

    const node = render(toast);
    if (theme === 'island-daisy') {
      node.classList.add('wiss-theme-daisy');
    }
    node.style.pointerEvents = 'auto';
    el.appendChild(node);
    
    // Play enter sound
    playToastSound(toast.type);

    // Double rAF: let the browser commit the hidden state before
    // removing it, otherwise the enter transition never plays.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        node.classList.remove(...ENTER_HIDDEN_CLASSES);
      });
    });
  });

  existingById.forEach((node, id) => {
    if (!seen.has(id)) {
      animateOut(node);
    }
  });
}

export function initToaster(config?: WissConfig): void {
  if (config) {
    setConfig(config);
  }
  
  // Wire up cuelume attributes globally
  bind();

  const { position, theme, offset } = getConfig();

  if (!container) {
    container = createContainer(position, offset);
    container.addEventListener('mouseenter', pauseAll);
    container.addEventListener('mouseleave', resumeAll);
  } else {
    applyContainerPosition(container, position, offset);
  }

  if (!unsubscribeStore) {
    const activeContainer = container;
    unsubscribeStore = subscribe((toasts) => {
      reconcile(activeContainer, toasts, getConfig().theme);
    });
  }
}
