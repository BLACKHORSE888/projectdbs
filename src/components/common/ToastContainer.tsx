import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-2 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 32, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border bg-white ${
              toast.type === 'error'
                ? 'border-red-200 text-red-800'
                : toast.type === 'info'
                ? 'border-saffron-200 text-charcoal-900'
                : 'border-forest-100 text-charcoal-900'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-saffron-500 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-forest-500 shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="text-charcoal-600 hover:text-charcoal-900 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
