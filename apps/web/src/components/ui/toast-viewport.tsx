'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useToastStore } from '@/lib/store/toast-store';
import { cn } from '@/lib/utils';

export function ToastViewport(): JSX.Element {
  const toasts = useToastStore((state) => state.items);
  const remove = useToastStore((state) => state.remove);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-[360px] max-w-[92vw] flex-col gap-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className={cn(
              'pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur-xl',
              toast.variant === 'success' && 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
              toast.variant === 'error' && 'border-red-500/30 bg-red-500/10 text-red-200',
              toast.variant === 'info' && 'border-cyan-500/30 bg-cyan-500/10 text-cyan-200',
            )}
            role="status"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description && <p className="mt-1 text-xs opacity-85">{toast.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                className="text-xs opacity-80 hover:opacity-100"
                aria-label="Close toast"
              >
                Close
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
