import { create } from "zustand";

const useSelectedStationStore = create(set => ({
  selectedStation: null,
  setSelectedStation: (station) =>
    set({
      selectedStation: station,
    }),
}));

export default useSelectedStationStore;
