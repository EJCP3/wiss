import type { Toast } from '../core/types';
import { renderWissToast, updateWissToast } from './wiss';

export function renderDaisyToast(toast: Toast): HTMLElement {
  const el = renderWissToast(toast);
  el.classList.add('wiss-theme-daisy');
  return el;
}

export function updateDaisyToast(el: HTMLElement, toast: Toast): void {
  updateWissToast(el, toast);
}
