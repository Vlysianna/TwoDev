import { createContext } from 'react';

type Toast = { id: number; title?: string; description?: string; type?: 'success' | 'error' | 'info', duration?: number };

export const ToastContext = createContext<{
  show: (t: Omit<Toast, 'id'>) => void;
} | null>(null);

export default ToastContext;
