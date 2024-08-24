import { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useMemo, useState } from "react";
import { View } from "@/components/ui/View";
import { type SuccessResponseData } from "@/types/response";
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
import {
  useWasteReportStore,
  useWasteContainerState,
} from "@/store/waste-report";
import { WastePostsBottomSheet } from "./waste-posts";
import { regionCoordinates } from "@/lib/maps/gotoRegion";
import { useTheme, Icon } from "@rneui/themed";
import { useWasteReportPosts } from "@/data/waste-reports";
import { WastePostContent } from "./WastePostContents";
import { GarbageSVG } from "@/components/svg/garbage";
import { useShallow } from "zustand/react/shallow";
import { log } from "@/utils/logger";
export const WasteMapView = () => {
  const { theme } = useTheme();
  // const { wastePosts, setPosts } = useWasteReportStore(
  //   useShallow((state) => ({
  //     wastePosts: state.posts,
  //     setPosts: state.setPosts,
  //   }))
  // );
  const {
    data: wastePosts,
    isFetching,
    isLoading,
    isError,
  } = useWasteReportPosts(null);
  const selectedPost = useWasteReportStore(
    useShallow((state) => state.selectedPost)
  );
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
            posts={wastePosts as WastePost[]}
            error={isError}
            loading={isFetching || isLoading}
          />
          {selectedPost && <WastePostContent selectedPost={selectedPost} />}
        </>
      }
    >
      {wastePosts &&
        (wastePosts as WastePost[]).map(({ id, location }, key) => (
          <WasteMapMarker key={key} id={id} location={location} />
        ))}
    </Maps>
  );
};

type CommunityMapMarkerProps = Pick<WastePost, "id" | "location"> &
  Omit<MapMarkerProps, "coordinate" | "id" | "title" | "description">;

export const WasteMapMarker = ({
  id,
  location,
  ...props
}: CommunityMapMarkerProps) => {
  const { theme } = useTheme();
  const { mapRef } = useMapContext();
  const setContainerState = useWasteContainerState(
    useShallow((state) => state.setContainerState)
  );
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const handleOnpress = (e: MarkerPressEvent) => {
    e.preventDefault();
    selectPost(id);
    setContainerState({ showBtmModal: true });

    mapRef.current?.animateCamera({
      center: {
        longitude: location.lng,
        latitude: location.lat,
      },
      pitch: 12,
    });
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
