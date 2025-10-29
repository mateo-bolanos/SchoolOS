import { create } from 'zustand';

const createToast = (toast) => ({
  id: toast.id ?? `toast-${Date.now()}-${Math.round(Math.random() * 1000)}`,
  message: toast.message,
  severity: toast.severity ?? 'info'
});

const useUiStore = create((set, get) => ({
  mobileNavOpen: false,
  setMobileNavOpen: (open) => set({ mobileNavOpen: open }),
  toggleMobileNav: () => set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  toasts: [],
  enqueueToast: (toast) => {
    const toastEntry = createToast(toast);
    set((state) => ({ toasts: [...state.toasts, toastEntry] }));
    return toastEntry.id;
  },
  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((item) => item.id !== id) })),
  shiftToast: () => {
    const current = get().toasts[0];
    set((state) => ({ toasts: state.toasts.slice(1) }));
    return current;
  }
}));

export const enqueueToast = (toast) => useUiStore.getState().enqueueToast(toast);
export const removeToast = (id) => useUiStore.getState().removeToast(id);

export default useUiStore;
