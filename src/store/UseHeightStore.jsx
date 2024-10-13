import { create } from 'zustand'

const useHeightStore = create((set, get) => ({
    footerHeight: 60,
    minHeight: window.innerHeight * 0.03,
    midHeight: window.innerHeight * 0.4,
    maxHeight: window.innerHeight * 0.75,
    tabHeight: window.innerHeight * 0.3,
    mapHeight: window.innerHeight * 0.7,
    setTabHeight: (height) => {
        const footerHeight = get().footerHeight;
        const maxAllowedHeight = window.innerHeight - footerHeight - 20;
        const newHeight = Math.min(Math.max(height, get().minHeight), maxAllowedHeight);
        set({ tabHeight: newHeight });
    },
    updateMapHeight: () => {
        const windowHeight = window.innerHeight;
        const tabHeight = get().tabHeight;
        const footerHeight = get().footerHeight;
        const newMapHeight = windowHeight - tabHeight - footerHeight;
        set({ mapHeight: newMapHeight });
    }
}));

export const useHeightState = () => useHeightStore(state => ({
    footerHeight: state.footerHeight,
    minHeight: state.minHeight,
    midHeight: state.midHeight,
    maxHeight: state.maxHeight,
    tabHeight: state.tabHeight,
    mapHeight: state.mapHeight
}));

export const useHeightActions = () => useHeightStore(state => ({
    setTabHeight: state.setTabHeight,
    updateMapHeight: state.updateMapHeight
}));

export default useHeightStore;