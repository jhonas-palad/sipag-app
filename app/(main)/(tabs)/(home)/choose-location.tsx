import { StyleSheet, View } from "react-native";
import React, { useCallback, useMemo, useState } from "react";
import { Maps } from "@/components/Maps";
import { Details, LatLng, Marker, Region } from "react-native-maps";
import { Icon, Button, useTheme } from "@rneui/themed";
import { BottomModalSheet } from "@/components/ui/ModalSheet";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Link } from "expo-router";
import { Text } from "@rneui/themed";
import { FakeOverlayMarker } from "./FakeOverlayMarker";

type Props = {};

const ChooseLocation = (props: Props) => {
  const { theme } = useTheme();
  const initialRegion = useMemo<Region>(
    () => ({
      latitude: 14.103991131539573,
      latitudeDelta: 0.017963974717314812,
      longitude: 121.11668379977345,
      longitudeDelta: 0.009622089564814473,
    }),
    []
  );
  const [showFakeMarker, setShowFakeMarker] = useState<boolean>(false);
  const [geoLocation, setGeoLocation] = useState<LatLng>({
    latitude: initialRegion.latitude,
    longitude: initialRegion.longitude,
  });
  const handleChangeRegion = useCallback(
    (region: Region, details: Details) => {
      console.log(region);
      console.log(details);
      details.isGesture &&
        setGeoLocation({
          latitude: region.latitude,
          longitude: region.longitude,
        });
      setShowFakeMarker(false);
    },
    [showFakeMarker]
  );
  return (
    <View style={styles.container}>
      <Maps
        overlayChildren={
          <>
            <FakeOverlayMarker show={showFakeMarker} />
          </>
        }
        onTouchMove={() => setShowFakeMarker(true)}
        rotateEnabled={false}
        scrollDuringRotateOrZoomEnabled={false}
        onRegionChangeComplete={handleChangeRegion}
        initialRegion={initialRegion}
      >
        {!showFakeMarker && (
          <Marker
            zIndex={1}
            coordinate={{
              ...geoLocation,
            }}
          >
            <Icon name="location-pin" color={theme.colors.error} size={60} />
          </Marker>
        )}
        <Marker
          zIndex={0}
          coordinate={{
            ...geoLocation,
          }}
        >
          <View
            style={{
              backgroundColor: "gray",
              height: 16,
              width: 16,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Icon name="lens" size={8} color={theme.colors.white} />
          </View>
        </Marker>
      </Maps>
      <BottomModalSheet
        open
        name="choose-location-maps"
        showHandle={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        enablePanDownToClose={false}
        snapPoints={["20%"]}
      >
        <BottomSheetView
          style={{
            paddingHorizontal: 16,
            justifyContent: "flex-start",
            height: "100%",
          }}
        >
          <View
            style={{
              gap: 16,
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Longitude:
              <Text style={{ fontSize: 16 }}>{geoLocation.longitude}</Text>
            </Text>
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              Latitude:
              <Text style={{ fontSize: 16 }}>{geoLocation.latitude}</Text>
            </Text>
          </View>
          <Link href="/add-contents" asChild>
            <Button size="lg" title="Choose This Location" />
          </Link>
        </BottomSheetView>
      </BottomModalSheet>
    </View>
  );
};

export default ChooseLocation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  baseMarker: {
    width: 16,
    height: 16,
    backgroundColor: "#dbdbdb",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  baseInnerCircle: {
    width: 8,
    height: 8,
    backgroundColor: "red",
    borderRadius: 50,
  },
});
