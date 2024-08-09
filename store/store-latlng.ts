import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { type LatLng } from "react-native-maps";
// namespace "react-native-maps" {
//   type LatLng = {
//     latitude: number | null;
//     longitude: number | null;
//   };
// }
export type LatLngState = {
  longitude: LatLng["longitude"] | null;
  latitude: LatLng["latitude"] | null;
};

export type LatLngAction = {
  setLatLng: (data: LatLngState) => void;
};

export const useLatLngStore = create<LatLngState & LatLngAction>()(
  immer((set) => ({
    latitude: null,
    longitude: null,
    setLatLng(data) {
      set(data);
    },
  })),
);
