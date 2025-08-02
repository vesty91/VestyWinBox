import React, { createContext, useContext, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    const duration = toast.duration || 5000;
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'info':
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300';
      case 'error':
        return 'border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-300';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300';
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      
      {/* Toast Container */}
      <div className="top-4 right-4 z-50 fixed space-y-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                duration: 0.3
              }}
              className={`
                relative flex items-start gap-3 p-4 rounded-lg border backdrop-blur-xl
                shadow-lg max-w-sm w-full
                ${getToastStyles(toast.type)}
              `}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getToastIcon(toast.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="mb-1 font-semibold text-sm">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="opacity-90 text-sm">
                    {toast.message}
                  </p>
                )}
              </div>
              
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 hover:bg-black/10 dark:hover:bg-white/10 p-1 rounded-full transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}; 