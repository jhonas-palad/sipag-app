import { type LatLng } from "react-native-maps";
import { ImageSchemaType } from "@/schemas/image";
import { User } from "./user";
export type WastePost = {
  id: string | number;
  description: string;
  thumbnail: ImageSchemaType;
  location: { lat: LatLng["latitude"]; lng: LatLng["longitude"] };
  title: string;
  status: string;
  created_at: string | Date;
  posted_by: User;
};

export type WastePostOptionals = {
  [K in keyof WastePost]?: WastePost[K];
};
