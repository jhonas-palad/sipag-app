import "react-native-reanimated";
import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { View } from "@/components/ui/View";
import { useShallow } from "zustand/react/shallow";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Badge, Text, useTheme } from "@rneui/themed";
import { Button } from "@/components/ui/Button";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import {
  useWasteContainerState,
  useWasteReportStore,
} from "@/store/waste-report";
import { Image } from "expo-image";
import { useMapContext } from "@/components/Maps";
import { WastePost } from "@/types/maps";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import BottomSheetHandleComponent from "@/components/waste-reports/bottom-sheet-handle-component";

//Currently selected marker details
export const WastePostsBottomSheet = ({
  posts,
  error,
  loading = false,
}: {
  posts: WastePost[] | never;
  error?: boolean;
  loading?: boolean;
}) => {
  const { selectedPost } = useWasteReportStore(
    useShallow((state) => ({
      selectedPost: state.selectedPost,
    }))
  );
  const queryClient = useQueryClient();
  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const snapPoints = useMemo(() => ["40%", "60%", "80%"], []);

  const { theme } = useTheme();

  useEffect(() => {
    selectedPost && bottomSheetRef.current?.snapToIndex(0);
  }, [selectedPost]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="collapse"
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    []
  );
  return (
    <>
      <BottomSheet
        style={[styles.sheetContainer]}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
        }}
        handleStyle={{
          backgroundColor: "transparent",
          borderRadius: 32,
        }}
        handleComponent={() => <BottomSheetHandleComponent />}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.greyOutline,
          height: 3.5,
          width: 30,
        }}
      >
        {loading ? (
          <BottomTextWrapper>
            <ActivityIndicator size={"large"} />
          </BottomTextWrapper>
        ) : error ? (
          <BottomTextWrapper>
            <Text h4>Oh oh! 😔</Text>
            <Text style={{ textAlign: "center" }}>
              Something went wrong. We will fix it right away
            </Text>
          </BottomTextWrapper>
        ) : (
          <WastePostList posts={posts} />
        )}
      </BottomSheet>
    </>
  );
};

const BottomTextWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={{
        borderRadius: 22,
        paddingTop: 50,
        justifyContent: "center",
        alignItems: "center",
        gap: 16,
      }}
    >
      {children}
    </View>
  );
};

const WastePostList = ({ posts }: { posts: WastePost[] }) => {
  const router = useRouter();
  const handlePushToCreateWasteReportScreen = useCallback(() => {
    router.push("/(home)/create-waste-report");
  }, [router]);
  const renderItemPost = useCallback(
    ({ item }: { item: WastePost }) => <WasteItemPost {...item} />,
    []
  );
  const renderEmptyListComponent = useCallback(
    () => (
      <BottomTextWrapper>
        <Text h4>Clean and Green! 🌿</Text>
        <Text style={{ textAlign: "center" }}>
          There's no trash in your barangay at the moment. Enjoy the clean
          surroundings and refresh the screen for any updates.
        </Text>
        <Button
          title="Post your waste concerns"
          onPress={handlePushToCreateWasteReportScreen}
        />
      </BottomTextWrapper>
    ),
    [handlePushToCreateWasteReportScreen]
  );
  const renderHeaderComponent = () => (
    <View style={{ paddingTop: 12 }}>
      <Text h4 style={{ paddingHorizontal: 24, paddingVertical: 4 }}>
        Community Waste Reports
      </Text>
    </View>
  );
  return (
    <BottomSheetFlatList
      bounces
      ListHeaderComponent={renderHeaderComponent}
      ListEmptyComponent={renderEmptyListComponent}
      data={posts}
      keyExtractor={({ id }) => id as string}
      renderItem={renderItemPost}
    />
  );
};
export const WasteItemPost = (item: WastePost) => {
  const { mapRef } = useMapContext();
  const { theme } = useTheme();
  const { setContainerState } = useWasteContainerState(
    useShallow((state) => ({
      setContainerState: state.setContainerState,
    }))
  );
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const { longitude, latitude } = useMemo(
    () => ({
      longitude: item.location.lng,
      latitude: item.location.lat,
    }),
    [item.location]
  );
  const statusColor = useMemo(() => {
    switch (item.status) {
      case "AVAILABLE":
        return theme.colors.success;
      case "INPROGRESS":
        return theme.colors.warning;
      case "CLEARED":
        return theme.colors.primary;
    }
  }, [item.status, theme]);

  const createdAt = useMemo(() => {
    return format(new Date(item.created_at), "MMM dd, yyyy");
  }, [item.created_at]);
  const handleZoomtoMarker = () => {
    mapRef.current?.animateCamera({
      center: {
        latitude,
        longitude,
      },
      pitch: 12,
    });
    selectPost(item.id);
    setContainerState({ showBtmModal: true });
  };
  return (
    <Pressable
      style={({ pressed }) => ({
        opacity: pressed ? 0.5 : 1,
      })}
      onPress={handleZoomtoMarker}
    >
      <View
        style={{
          flexDirection: "row",
          marginVertical: 12,
          marginHorizontal: 16,
        }}
      >
        <View>
          <Image
            style={{ height: 100, width: 100 }}
            source={item.thumbnail.img_file}
            placeholder={item.thumbnail.hash}
          />
        </View>
        <View
          style={{
            marginLeft: 12,
            flexDirection: "column",
            flex: 1,
          }}
        >
          <Badge
            value={item.status}
            badgeStyle={{
              backgroundColor: "transparent",
              width: "auto",
              alignSelf: "flex-start",
            }}
            textStyle={{
              color: statusColor,
              fontWeight: "bold",
              margin: 0,
              paddingHorizontal: 0,
            }}
          />
          <Text numberOfLines={1} style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.title}
          </Text>
          <Text numberOfLines={1} style={{ fontSize: 16 }}>
            {item.description}
          </Text>
          <Text
            numberOfLines={1}
            style={{ fontSize: 15, color: theme.colors.grey0 }}
          >
            {createdAt}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  sheetContainer: {
    backgroundColor: "white",
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.8,
    shadowRadius: 16.0,
    elevation: 30,
  },
});
