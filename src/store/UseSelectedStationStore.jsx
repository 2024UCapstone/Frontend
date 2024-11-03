import { setSelectionRange } from "@testing-library/user-event/dist/utils";
import { create } from "zustand";

const useSelectedStationStore = create((set, get) => ({
  selectedStation: null,
  setSelectedStation: (station) =>
    set({
      selectedStation: station,
    }),
}));

export default useSelectedStationStore;
