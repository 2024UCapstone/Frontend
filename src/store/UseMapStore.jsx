import { create } from "zustand";


// 그리고 useMapStore를 정의합니다
const useMapStore = create(set => ({
  center: {
    lat: null,
    lng: null,
  },
  errMsg: null,
  isLoading: true,
  actions: {
    setErrMsg: (value) =>
      set(state => ({
        errMsg: value
      })),
    setIsLoading: (value) =>
      set(state => ({
        isLoading: value
      })),
    setCenter: (lat, lng, source = '') => {
      set(state => ({
        ...state,
        center: {
          lat: lat,
          lng: lng
        },
      }));
    },
    resetMapState: () =>
      set({
        center: {
          lat: null,
          lng: null,
        },
        errMsg: null,
        isLoading: true,
      })
  }
}));

export const useMap = () => {
  return useMapStore(state => ({
    center: state.center,
    errMsg: state.errMsg,
    isLoading: state.isLoading,
  }));
};

export const useMapActions = () => useMapStore((state) => state.actions);

export default useMapStore;