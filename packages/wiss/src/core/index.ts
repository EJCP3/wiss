import { getConfig, setConfig } from './config';
import { addToast, clearToasts, removeToast } from './store';
import { cancelDismiss, scheduleDismiss } from './timers';
import type { ToastOptions, ToastType, WissConfig } from './types';

function resolveDuration(options?: ToastOptions): number {
  return options?.duration ?? getConfig().duration;
}

function createToast(type: ToastType, message: string, options?: ToastOptions): string {
  const id = addToast(message, type, options);
  scheduleDismiss(id, resolveDuration(options));
  return id;
}

export const toast = {
  show(message: string, options?: ToastOptions): string {
    return createToast('info', message, options);
  },
  success(message: string, options?: ToastOptions): string {
    return createToast('success', message, options);
  },
  error(message: string, options?: ToastOptions): string {
    return createToast('error', message, options);
  },
  warning(message: string, options?: ToastOptions): string {
    return createToast('warning', message, options);
  },
  info(message: string, options?: ToastOptions): string {
    return createToast('info', message, options);
  },
  dismiss(id: string): void {
    cancelDismiss(id);
    removeToast(id);
  },
  clear(): void {
    clearToasts();
  },
};

export function initWiss(config?: WissConfig): void {
  setConfig(config ?? {});
}

export type { Listener, Position, Toast, ToastOptions, ToastType, WissConfig } from './types';
