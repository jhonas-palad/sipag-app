import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useMemo } from "react";
import * as Location from "expo-location";
import { Image } from "react-native";
import { View } from "@/components/ui/View";
import { Text } from "@/components/ui/Text";

import MapView, {
  LatLng,
  Callout,
  Region,
  Marker,
  type MarkerPressEvent,
  type MapMarkerProps,
} from "react-native-maps";
import { WastePost } from "@/types/maps";
import { Maps, useMapContext } from "@/components/Maps";
import { useWasteReportStore } from "@/store/waste-report";
import { WastePostsBottomSheet } from "./waste-posts";
import { regionCoordinates } from "@/lib/maps/gotoRegion";
import { useTheme, Icon } from "@rneui/themed";
import { useWasteReportPosts } from "@/data/waste-reports";
import { WastePostContent } from "./WastePostContents";
import { GarbageSVG } from "@/components/svg/garbage";
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
              title={title}
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

type CommunityMapMarkerProps = Pick<WastePost, "id" | "location" | "title"> &
  Omit<MapMarkerProps, "coordinate" | "id">;

export const WasteMapMarker = ({
  id,
  location,
  ...props
}: CommunityMapMarkerProps) => {
  const { theme } = useTheme();
  const coordinates = useMemo(() => {
    return regionCoordinates({
      latitude: location.lat,
      longitude: location.lng,
    });
  }, [location]);
  const { mapRef } = useMapContext();
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const handleOnpress = (e: MarkerPressEvent) => {
    e.preventDefault();
    selectPost(id);
    // mapRef.current?.animateToRegion(
    //   {
    //     ...coordinates,
    //   },
    //   400
    // );

    mapRef.current?.animateCamera({
      center: {
        longitude: location.lng + 0.0003,
        latitude: location.lat - 0.0031,
      },
      zoom: 1,
      pitch: 12,
    });
    // Promise.all([
    //   new Promise<void>((resolve, reject) => {
    //     resolve();
    //   }),
    //   new Promise<void>((resolve, reject) => {
    //     resolve();
    //   }),
    // ]);
  };
  return (
    <Marker
      {...props}
      onPress={handleOnpress}
      tracksViewChanges={false}
      coordinate={{ latitude: location.lat, longitude: location.lng }}
    >
      <View
        style={{
          backgroundColor: theme.colors.white,
          position: "absolute",
          zIndex: 10,
          // width: "100%",
          borderRadius: 60,
          left: "23%",
          top: "12%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <GarbageSVG />
      </View>
      <Icon name="location-pin" color={theme.colors.divider} size={60} />
    </Marker>
  );
};
