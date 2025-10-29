import { create } from 'zustand';

const useUiPreferences = create((set) => ({
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebar: (value) =>
    set((state) => (state.isSidebarOpen === value ? state : { isSidebarOpen: value }))
}));

export default useUiPreferences;
