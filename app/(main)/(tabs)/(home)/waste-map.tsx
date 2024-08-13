import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import React, {
  useState,
  useLayoutEffect,
  useRef,
  useMemo,
  useEffect,
} from "react";
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
import { Maps, useMapContext } from "@/components/Maps";
import { useWasteReportStore } from "@/store/waste-report";
import { WastePostsBottomSheet } from "./waste-posts";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@rneui/themed";
import { useWasteReportPosts } from "@/data/waste-reports";
import { WastePostContent } from "./WastePostContents";
export const WasteMapView = () => {
  const { theme } = useTheme();
  const { data, isFetching, isLoading, isError, error } = useWasteReportPosts();
  console.log(error);
  const barangaySalaGeoPoints = useMemo<Region>(
    () => ({
      latitude: 14.100202432834427,
      latitudeDelta: 0.03370272545660313,
      longitude: 121.11851876601577,
      longitudeDelta: 0.016310177743420695,
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
      onRegionChangeComplete={(r) => console.log(r)}
      // loading={isFetching || isLoading}
      loadingIndicatorColor={theme.colors.primary}
      initialRegion={barangaySalaGeoPoints}
      overlayChildren={
        <>
          <WastePostsBottomSheet
            posts={isError ? null : data?.data}
            error={isError}
            loading={isFetching || isLoading}
          />
          <WastePostContent />
        </>
      }
    >
      {data?.data &&
        (data.data as WastePost[]).map(
          (
            {
              id,
              title,
              thumbnail,
              location,
              description,
              status,
              posted_by,
              created_at,
            },
            key
          ) => (
            <WasteMapMarker
              created_at={created_at}
              posted_by={posted_by}
              status={status}
              title={title}
              thumbnail={thumbnail}
              description={description}
              key={key}
              id={id}
              location={location}
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
  location,
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
            longitude: location.lng + 0.0003,
            latitude: location.lat - 0.0031,
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
    <Marker
      onPress={handleOnpress}
      {...props}
      coordinate={{ latitude: location.lat, longitude: location.lng }}
    />
  );
};
