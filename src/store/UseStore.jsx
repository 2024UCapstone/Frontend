import create from 'zustand';

const useStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  favoriteStops: [],
  setFavoriteStops: (stops) => set({ favoriteStops: stops }),
  busStations: [],
  setbusStations: (stops) => set({ busStations: stops }),
  isSearchModalOpen: false,
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),

  // Draggable 관련 State
  footerHeight: 60, 
  minHeight: window.innerHeight * 0.03,
  midHeight: window.innerHeight * 0.4,
  maxHeight: window.innerHeight * 0.75,
  tabHeight: window.innerHeight * 0.3, // default

  setTabHeight: (height) => {
    const footerHeight = get().footerHeight;
    const maxAllowedHeight = window.innerHeight - footerHeight - 20; // 20px는 상단 여백
    const newHeight = Math.min(Math.max(height, get().minHeight), maxAllowedHeight);
    set({ tabHeight: newHeight });
  },

  updateMapHeight: () => set((state) => ({
    mapHeight: window.innerHeight - state.tabHeight - state.footerHeight
  })),
}));

export default useStore;