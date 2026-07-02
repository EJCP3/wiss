export type ToastType = 'success' | 'error' | 'warning' | 'info';

export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  description?: string;
  duration?: number;
  position?: Position;
}

export interface ToastOptions {
  description?: string;
  duration?: number;
  position?: Position;
  id?: string;
}

export interface WissConfig {
  position?: Position;
  duration?: number;
  theme?: 'sileo' | 'daisy';
  offset?: number;
}

export type Listener = (toasts: Toast[]) => void;
