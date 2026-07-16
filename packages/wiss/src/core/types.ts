export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type Position =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  description?: string;
  duration?: number;
  position?: Position;
  action?: ToastAction;
  progressBar?: boolean;
}

export interface ToastOptions {
  description?: string;
  duration?: number;
  position?: Position;
  id?: string;
  action?: ToastAction;
  progressBar?: boolean;
}

export interface WissConfig {
  position?: Position;
  duration?: number;
  theme?: 'wiss' | 'daisy' | 'island' | 'island-daisy';
  offset?: number;
  progressBar?: boolean;
}

export type Listener = (toasts: Toast[]) => void;
