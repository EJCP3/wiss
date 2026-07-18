import { getConfig, setConfig } from './config';
import { addToast, clearToasts, removeToast, getHistory, clearHistory, subscribeHistory } from './store';
import { cancelDismiss, scheduleDismiss } from './timers';
import type { PromiseToastOptions, ToastOptions, ToastType, WissConfig, Toast } from './types';

function resolveDuration(options?: ToastOptions): number {
  return options?.duration ?? getConfig().duration;
}

function createToast(type: ToastType, message: string | HTMLElement, options?: ToastOptions): string {
  const id = addToast(message, type, options);
  scheduleDismiss(id, resolveDuration(options));
  return id;
}

export const toast = {
  show(message: string | HTMLElement, options?: ToastOptions): string {
    return createToast('info', message, options);
  },
  success(message: string | HTMLElement, options?: ToastOptions): string {
    return createToast('success', message, options);
  },
  error(message: string | HTMLElement, options?: ToastOptions): string {
    return createToast('error', message, options);
  },
  warning(message: string | HTMLElement, options?: ToastOptions): string {
    return createToast('warning', message, options);
  },
  info(message: string | HTMLElement, options?: ToastOptions): string {
    return createToast('info', message, options);
  },
  loading(message: string | HTMLElement, options?: ToastOptions): string {
    return createToast('loading', message, options);
  },
  update(id: string, options: Partial<ToastOptions> & { message?: string | HTMLElement, type?: ToastType }): string {
    const type = options.type ?? 'info';
    return createToast(type, options.message ?? '', { ...options, id });
  },
  promise<T>(
    promise: Promise<T>,
    msgs: PromiseToastOptions<T>,
    options?: ToastOptions
  ): string {
    const toastId = msgs.id ?? undefined;
    const id = toast.loading(msgs.loading, { ...options, duration: 9999999, ...(toastId ? { id: toastId } : {}) });
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
  history(): Toast[] {
    return getHistory();
  },
  clearHistory(): void {
    clearHistory();
  },
};

export { subscribeHistory };

export function initWiss(config?: WissConfig): void {
  setConfig(config ?? {});
}

export type { Listener, Position, Toast, ToastOptions, ToastType, WissConfig } from './types';
