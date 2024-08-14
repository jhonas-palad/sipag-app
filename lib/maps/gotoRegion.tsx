import { type LatLng } from "react-native-maps";

export function regionCoordinates(location: LatLng) {
  return {
    longitude: location.longitude + 0.0003,
    latitude: location.latitude - 0.0031,
    latitudeDelta: 0.013094078606753712,
    longitudeDelta: 0.006337054073824788,
  };
}
