import create from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      // 사용자 정보
      user: null,
      setUser: (user) => set({ user }),

      // 즐겨찾기 정류장
      favoriteStops: [],
      setFavoriteStops: (stops) => set({ favoriteStops: stops }),

      // 정류장 목록
      busStations: [],
      setBusStations: (stops) => set({ busStations: stops }),

      // 로딩 상태 관리
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // 에러 메시지 관리
      errorMessage: null,
      setErrorMessage: (message) => set({ errorMessage: message }),

      // 검색 모달 상태 관리
      isSearchModalOpen: false,
      setSearchModalOpen: (isOpen) => set({ isSearchModalOpen: isOpen }),
    }),
    {
      name: 'bus-app-storage', // localStorage 키
      getStorage: () => localStorage, // localStorage 사용
    }
  )
);

export default useStore;