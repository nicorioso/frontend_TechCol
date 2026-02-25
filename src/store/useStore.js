import create from 'zustand'

export const useStore = create((set) => ({
  selectedEntity: 'customers',
  setSelectedEntity: (entity) => set({ selectedEntity: entity }),
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

export default useStore;
