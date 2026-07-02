import type { Toast, ToastType } from '../core/types';

const SVG_NS = 'http://www.w3.org/2000/svg';

// daisyUI's ".alert" already provides layout (flex, gap, alignment) and
// themed colors via "alert-{type}" — we only add non-color utilities here.
const BASE_CLASSES =
  'wiss-toast alert shadow-lg pointer-events-auto opacity-0 translate-y-2 scale-95 ' +
  'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]';

const MESSAGE_CLASSES = 'wiss-toast-message text-sm';

const TYPE_CLASS: Record<ToastType, string> = {
  success: 'alert-success',
  error: 'alert-error',
  warning: 'alert-warning',
  info: 'alert-info',
};

const ICON_PATH: Record<ToastType, string> = {
  success: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  warning:
    'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z',
};

function applyType(el: HTMLElement, type: ToastType): void {
  const previous = el.dataset.wissAlertType;
  if (previous) {
    el.classList.remove(previous);
  }
  const next = TYPE_CLASS[type];
  el.classList.add(next);
  el.dataset.wissAlertType = next;
}

function createIcon(type: ToastType): SVGSVGElement {
  const svg = document.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('wiss-toast-icon', 'h-6', 'w-6', 'shrink-0');

  const path = document.createElementNS(SVG_NS, 'path');
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  path.setAttribute('stroke-width', '1.5');
  path.setAttribute('d', ICON_PATH[type]);

  svg.appendChild(path);
  return svg;
}

function updateIcon(svg: SVGSVGElement, type: ToastType): void {
  const path = svg.querySelector('path');
  if (path) {
    path.setAttribute('d', ICON_PATH[type]);
  }
}

export function renderDaisyToast(toast: Toast): HTMLElement {
  const el = document.createElement('div');
  el.className = BASE_CLASSES;
  el.setAttribute('role', 'alert');
  el.dataset.wissId = toast.id;
  applyType(el, toast.type);

  el.appendChild(createIcon(toast.type));

  const message = document.createElement('span');
  message.className = MESSAGE_CLASSES;
  message.textContent = toast.message;
  el.appendChild(message);

  return el;
}

export function updateDaisyToast(el: HTMLElement, toast: Toast): void {
  applyType(el, toast.type);

  const icon = el.querySelector<SVGSVGElement>('.wiss-toast-icon');
  if (icon) {
    updateIcon(icon, toast.type);
  }

  const message = el.querySelector<HTMLElement>('.wiss-toast-message');
  if (message) {
    message.textContent = toast.message;
  }
}
