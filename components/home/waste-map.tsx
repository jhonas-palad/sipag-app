import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useLayoutEffect, useRef } from "react";
import * as Location from "expo-location";
import { Text, Platform } from "react-native";

import { WasteMapProvider, useWasteMapContext } from "./waste-map-context";
import MapView, {
  LatLng,
  Region,
  Marker,
  type MarkerPressEvent,
  type MapMarkerProps,
} from "react-native-maps";
import { WastePost } from "@/types/maps";

import { useMapStore } from "@/store/maps";
import { WastePostsBottomSheet } from "./waste-posts";

export const WasteMapView = () => {
  const [location, setLocation] = useState<LatLng | null>(null);
  const posts = useMapStore((state) => state.posts);
  const mapRef = useRef<MapView>(null);
  useLayoutEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      // if (status !== "granted") {
      //   setErrorMsg("Permission to access location was denied");
      //   return;
      // }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location?.coords.latitude!,
        longitude: location.coords?.longitude!,
      });
    })();
  }, []);
  const handleZoom = () => {};
  const handleOnRegionChange = (region: Region) => {
    setLocation({
      longitude: region.longitude,
      latitude: region.latitude,
    });
  };
  if (!location) {
    return <Text>Map is loading...</Text>;
  }

  return (
    <WasteMapProvider initialLocation={location} mapRef={mapRef}>
      <MapView
        ref={mapRef}
        showsUserLocation={false}
        provider={
          Platform.OS === "android" ? PROVIDER_GOOGLE : PROVIDER_DEFAULT
        }
        style={{
          width: "100%",
          height: "100%",
        }}
        onRegionChangeComplete={(r) => console.log(r)}
        region={{
          latitudeDelta: 0.02,
          longitudeDelta: 0.2,
          latitude: 14.1057851,
          longitude: 121.1198989,
        }}
        // onRegionChangeComplete={handleOnRegionChange}
      >
        {location && (
          <Marker
            pinColor="blue"
            coordinate={{
              ...location!,
            }}
          />
        )}
        {posts.length &&
          posts.map(
            ({ id, thumbnail, geo_coordinates, address, description }, key) => (
              <WasteMapMarker
                address={address}
                thumbnail={thumbnail}
                description={description}
                key={key}
                id={id}
                geo_coordinates={{
                  ...geo_coordinates,
                }}
              />
            )
          )}
      </MapView>

      <WastePostsBottomSheet />

      {/* <WastePostDetail /> */}
    </WasteMapProvider>
  );
};

type CommunityMapMarkerProps = WastePost &
  Omit<MapMarkerProps, "coordinate" | "id">;

export const WasteMapMarker = ({
  id,
  geo_coordinates: coordinate,
  ...props
}: CommunityMapMarkerProps) => {
  const { mapRef } = useWasteMapContext();
  const selectPost = useMapStore((state) => state.selectPost);
  const handleOnpress = (e: MarkerPressEvent) => {
    e.preventDefault();
    Promise.all([
      new Promise<void>((resolve, reject) => {
        mapRef.current?.animateToRegion(
          {
            longitude: coordinate.longitude + 0.0003,
            latitude: coordinate.latitude - 0.0031,
            latitudeDelta: 0.02,
            longitudeDelta: 0.0004,
          },
          400
        );
        resolve();
      }),
      new Promise<void>((resolve, reject) => {
        selectPost(id);
        resolve();
      }),
    ]);
  };
  return (
    <Marker onPress={handleOnpress} {...props} coordinate={{ ...coordinate }} />
  );
};
