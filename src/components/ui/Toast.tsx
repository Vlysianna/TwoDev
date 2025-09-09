import React, { useState, useCallback } from 'react';
import { ToastContext } from './toast-context';
type Toast = { id: number; title?: string; description?: string; type?: 'success' | 'error' | 'info' };

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const show = useCallback((t: Omit<Toast, 'id'>) => {
    setToasts((s) => {
      const id = Date.now();
      const next = [...s, { id, ...t }];
      setTimeout(() => {
        setToasts((cur) => cur.filter((x) => x.id !== id));
      }, 4000);
      return next;
    });
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div aria-live="polite" className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:items-start sm:p-6 z-100">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {toasts.map((t) => (
            <div key={t.id} className={`pointer-events-auto max-w-sm w-full bg-white shadow-lg rounded-lg overflow-hidden border ${t.type === 'success' ? 'border-green-200' : t.type === 'error' ? 'border-red-200' : 'border-gray-200'}`}>
              <div className="p-4">
                <div className="flex items-start">
                  <div className="ml-3 w-0 flex-1">
                    {t.title && <p className="text-sm font-medium text-gray-900">{t.title}</p>}
                    {t.description && <p className="mt-1 text-sm text-gray-500">{t.description}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
