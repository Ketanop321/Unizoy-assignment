import { create } from 'zustand';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastState {
  items: ToastItem[];
  push: (toast: Omit<ToastItem, 'id'>) => void;
  remove: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (toast) => {
    const id = crypto.randomUUID();
    set((state) => ({ items: [...state.items, { id, ...toast }] }));

    setTimeout(() => {
      set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
    }, 4000);
  },
  remove: (id) => {
    set((state) => ({ items: state.items.filter((item) => item.id !== id) }));
  },
}));
