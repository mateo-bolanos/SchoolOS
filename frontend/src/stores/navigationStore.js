import { create } from 'zustand';

const useNavigationStore = create((set) => ({
  isMobileOpen: false,
  toggle: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  close: () => set({ isMobileOpen: false })
}));

export default useNavigationStore;
