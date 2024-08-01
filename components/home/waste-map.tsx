import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useState, useLayoutEffect, useRef, useMemo } from "react";
import * as Location from "expo-location";
import { Text, Platform } from "react-native";

import MapView, {
  LatLng,
  Region,
  Marker,
  type MarkerPressEvent,
  type MapMarkerProps,
} from "react-native-maps";
import { WastePost } from "@/types/maps";
import { Maps, useMapContext } from "../Maps";
import { useWasteReportStore } from "@/store/waste-report";
import { WastePostsBottomSheet } from "./waste-posts";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@rneui/themed";

export const WasteMapView = () => {
  const { theme } = useTheme();
  const posts = useWasteReportStore(useShallow((state) => state.posts));
  const barangaySalaGeoPoints = useMemo<Region>(
    () => ({
      latitude: 14.103416743102299,
      longitude: 121.11668691609796,
      longitudeDelta: 0.2,
      latitudeDelta: 0.02,
    }),
    []
  );
  return (
    <Maps
      showsMyLocationButton={false}
      showsCompass={false}
      zoomControlEnabled={false}
      toolbarEnabled={false}
      loadingEnabled
      loadingIndicatorColor={theme.colors.primary}
      initialRegion={barangaySalaGeoPoints}
      overlayChildren={<WastePostsBottomSheet />}
    >
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
    </Maps>
  );
};

type CommunityMapMarkerProps = WastePost &
  Omit<MapMarkerProps, "coordinate" | "id">;

export const WasteMapMarker = ({
  id,
  geo_coordinates: coordinate,
  ...props
}: CommunityMapMarkerProps) => {
  const { mapRef } = useMapContext();
  const selectPost = useWasteReportStore((state) => state.selectPost);
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
