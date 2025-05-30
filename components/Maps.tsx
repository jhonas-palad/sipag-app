import React, { useRef } from "react";
import { ActivityIndicator } from "react-native";
import MapView, { PROVIDER_GOOGLE, type MapViewProps } from "react-native-maps";
import { createContext, memo, useContext } from "react";
import { Overlay, Text } from "@rneui/themed";
export interface MapProviderContextProps {
  mapRef: React.RefObject<MapView>;
  initialRegion: MapViewProps["initialRegion"];
}
export const MapContext = createContext<MapProviderContextProps | null>(null);
export const Maps = memo(
  ({
    overlayChildren,
    initialRegion,
    loading = false,
    style,
    ...props
  }: { overlayChildren?: React.ReactNode; loading?: boolean } & Omit<
    MapViewProps,
    "ref"
  >) => {
    const mapRef = useRef<MapView>(null);
    return (
      <MapContext.Provider value={{ mapRef, initialRegion }}>
        <MapView
          ref={mapRef}
          showsUserLocation={false}
          provider={PROVIDER_GOOGLE}
          style={[
            {
              width: "100%",
              height: "65%",
            },
            style,
          ]}
          initialRegion={initialRegion}
          {...props}
        />
        {loading && (
          <Overlay isVisible={true}>
            <Text>Fetching data...</Text>
            <ActivityIndicator size="small" />
          </Overlay>
        )}

        {overlayChildren}
      </MapContext.Provider>
    );
  }
);
Maps.displayName = "Maps";

export const useMapContext = (): MapProviderContextProps => {
  const val = useContext(MapContext);
  if (!val) {
    throw new Error("useMapContext should be used within Maps");
  }
  return val;
};
