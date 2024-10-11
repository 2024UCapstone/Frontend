import { create } from 'zustand';

const useMapStore = create(set => ({
  center: {
    lat: 35.495789,
    lng: 129.415649,
  },
  errMsg: null,
  isLoading: true,
  actions: {
    setErrMsg : (value) => 
      set(state => ({
        errMsg: value
      })),
    setIsLoading : (value) => 
      set(state => ({
        isLoading: value
      })),
    setCenter : (lat, lng) => 
      set(state => ({
        ...state,
        center: {
          lat: lat,
          lng: lng
        }
      })),
    resetMapState : () =>
      set({
        center: {
          lat: 35.495789,
          lng: 129.415649,
        },
        errMsg: null,
        isLoading: true,
      })
  }
}))


export const useMap = () => {
  return useMapStore(state => ({
    center: state.center,
    errMsg: state.errMsg,
    isLoading: state.isLoading  
  }));
};

export const useMapActions = () => useMapStore((state) => state.actions);