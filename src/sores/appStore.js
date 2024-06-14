import create from 'zustand';

const useAppStore = create((set) => ({
  user: null,
  favorites: [],
  busData: [],
  setUser: (user) => set({ user }),
  setFavorites: (favorites) => set({ favorites }),
  setBusData: (busData) => set({ busData }),
}));

export default useAppStore;