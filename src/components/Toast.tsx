import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-stone-950/95 text-white rounded-2xl shadow-2xl border border-stone-700/60 backdrop-blur-md max-w-md pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />}
      {toast.type === 'info' && <Info className="w-5 h-5 text-sky-400 shrink-0" aria-hidden="true" />}
      {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" aria-hidden="true" />}
      <p className="text-xs sm:text-sm font-medium text-stone-100">{toast.message}</p>
    </div>
  );
};
