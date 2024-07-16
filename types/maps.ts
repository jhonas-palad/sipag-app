import { type LatLng } from "react-native-maps";
import { type ImageProps } from "expo-image";

export type WastePost = {
  id: string | number;
  description: string;
  thumbnail: ImageProps["source"];
  geo_coordinates: LatLng;
  address: string;
};
