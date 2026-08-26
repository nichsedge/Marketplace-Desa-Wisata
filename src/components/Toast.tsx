import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-stone-950/95 text-white rounded-2xl shadow-2xl border border-stone-700/60 backdrop-blur-md max-w-md pointer-events-auto"
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
          {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />}
          <p className="text-xs sm:text-sm font-medium text-stone-100">{toast.message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
