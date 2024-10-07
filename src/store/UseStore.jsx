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

  // ScrollBar 관련 State
  mapHeight: window.innerHeight - window.innerHeight * 0.1,
  tabHeight: window.innerHeight * 0.1,
  setMapHeight: (height) => set({ mapHeight: height }),
  setTabHeight: (height) => set({ tabHeight: height }),
  updateMapHeight: () => set((state) => ({
    mapHeight: window.innerHeight - state.tabHeight
  })),
  getViewBusComponentHeight: () => get().tabHeight - 24, // 드래그 핸들의 높이(24px)를 뺀 값
}));

export default useStore;