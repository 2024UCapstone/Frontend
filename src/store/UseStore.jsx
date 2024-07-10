import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  favoriteStops: [],
  setFavoriteStops: (stops) => set({ favoriteStops: stops }),
  busStops: [],
  setBusStops: (stops) => set({ busStops: stops }),
  isSearchModalOpen: false,
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
}));

export default useStore;