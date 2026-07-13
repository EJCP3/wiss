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
  loading(message: string, options?: ToastOptions): string {
    return createToast('loading', message, options);
  },
  promise<T>(
    promise: Promise<T>,
    msgs: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((err: any) => string);
    },
    options?: ToastOptions
  ): string {
    const id = toast.loading(msgs.loading, { ...options, duration: 9999999 });
    promise
      .then((data) => {
        toast.success(
          typeof msgs.success === 'function' ? msgs.success(data) : msgs.success,
          { ...options, id }
        );
      })
      .catch((err) => {
        toast.error(
          typeof msgs.error === 'function' ? msgs.error(err) : msgs.error,
          { ...options, id }
        );
      });
    return id;
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
