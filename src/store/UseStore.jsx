import create from 'zustand';

const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  favoriteStops: [],
  setFavoriteStops: (stops) => set({ favoriteStops: stops }),
  busStations: [],
  setbusStations: (stops) => set({ busStations: stops }),
  isSearchModalOpen: false,
  setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),

  // ScrollBar 관련 State
  viewBusHeight: window.innerHeight / 2, // 초기 ViewBusComponent 높이 (50%)
  mapHeight: window.innerHeight / 2,     // 초기 KakaoMap 높이 (50%),
  
  setViewBusHeight: (height) => set({ viewBusHeight: height }),
  setMapHeight: (height) => set({ mapHeight: height }),
}));

export default useStore;