import type { Listener, Toast, ToastOptions, ToastType } from './types';

let toasts: Toast[] = [];
let listeners: Listener[] = [];

export function subscribe(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

export function notify(): void {
  const snapshot = [...toasts];
  listeners.forEach((listener) => listener(snapshot));
}

export function addToast(message: string, type: ToastType, options: ToastOptions = {}): string {
  const id = options.id ?? crypto.randomUUID();

  const toast: Toast = {
    id,
    message,
    type,
    ...(options.description !== undefined ? { description: options.description } : {}),
    ...(options.duration !== undefined ? { duration: options.duration } : {}),
    ...(options.position !== undefined ? { position: options.position } : {}),
    ...(options.action !== undefined ? { action: options.action } : {}),
  };

  const existingIndex = toasts.findIndex((t) => t.id === id);
  if (existingIndex !== -1) {
    toasts = [
      ...toasts.slice(0, existingIndex),
      toast,
      ...toasts.slice(existingIndex + 1),
    ];
  } else {
    toasts = [...toasts, toast];
  }

  notify();
  return id;
}

export function removeToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
  notify();
}

export function clearToasts(): void {
  toasts = [];
  notify();
}
