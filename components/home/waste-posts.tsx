import "react-native-reanimated";
import { StyleSheet, Pressable, ViewProps, Dimensions } from "react-native";
import { BottomView, View } from "../ui/View";
import { useShallow } from "zustand/react/shallow";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Text, ListItem, useTheme, Avatar } from "@rneui/themed";
import { Button } from "../ui/Button";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { WastePostContent } from "./WastePostContents";
import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { useToggleHideTab } from "@/store/tab";
import { useWasteReportStore } from "@/store/waste-report";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { useMapContext } from "../Maps";
import { Badge } from "@rneui/base";
import { WastePost } from "@/types/maps";
import { LinkFAB, FAB } from "../ui/FAB";

import { format } from "date-fns";

//Currently selected marker details
export const WastePostsBottomSheet = () => {
  const { selectedPost, posts } = useWasteReportStore(
    useShallow((state) => ({ ...state }))
  );

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
      ></BottomSheetBackdrop>
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
        handleComponent={() => (
          <>
            <View
              style={{
                position: "absolute",
                top: -50,
                backgroundColor: "transparent",
                width: "100%",
              }}
            >
              <View
                transparent
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 12,
                  marginHorizontal: 20,
                }}
              >
                <LinkFAB
                  href={"/create-waste-report"}
                  icon={{ name: "add" }}
                  size="small"
                />

                <FAB icon={{ name: "sync" }} size="small" />
              </View>
            </View>
            <View
              style={{
                paddingVertical: 12,
                alignItems: "center",
                borderRadius: 50,
              }}
            >
              <View
                style={{
                  backgroundColor: theme.colors.grey3,
                  borderRadius: 50,
                  width: 30,
                  height: 4,
                }}
              />
            </View>
          </>
        )}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.greyOutline,
          height: 3.5,
          width: 30,
        }}
      >
        {selectedPost ? (
          <WastePostContent detail={selectedPost} />
        ) : posts.length ? (
          <WastePostList posts={posts} />
        ) : null}
      </BottomSheet>
      {selectedPost && (
        <>
          <WasteContentFAB />
          <BottomView>
            <Button title="Accept" />
          </BottomView>
        </>
      )}
    </>
  );
};
const WastePostList = ({ posts }: { posts: WastePost[] }) => {
  const { theme } = useTheme();
  const router = useRouter();

  const renderItemPost = useCallback(
    ({ item }: { item: WastePost }) => <WasteItemPost {...item} />,
    [posts, theme]
  );

  const renderEmptyListComponent = useCallback(
    () => (
      <View
        style={{
          borderRadius: 22,
          paddingTop: 50,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Text h4>Clean and Green! 🌿</Text>
        <Text style={{ textAlign: "center" }}>
          There's no trash in your barangay at the moment. Enjoy the clean
          surroundings and refresh the screen for any updates.
        </Text>
        <Button title="Post your waste concerns" />
      </View>
    ),
    [theme]
  );
  const renderHeaderComponent = () => (
    <View style={{ paddingTop: 12 }}>
      <Text
        h4
        style={{ paddingHorizontal: 24, paddingTop: 20, paddingBottom: 4 }}
      >
        Community Waste Reports
      </Text>
    </View>
  );
  return (
    <BottomSheetFlatList
      bounces
      style={{ paddingBottom: 100 }}
      ListHeaderComponent={renderHeaderComponent}
      ListFooterComponent={() => (
        <View style={{ height: 150, paddingTop: 20, paddingHorizontal: 24 }}>
          <Button type="clear" title="Load more..." />
        </View>
      )}
      ListEmptyComponent={renderEmptyListComponent}
      data={posts}
      keyExtractor={({ id }) => id as string}
      renderItem={renderItemPost}
    />
  );
};
export const WasteItemPost = (item: WastePost) => {
  const { theme } = useTheme();
  const { mapRef } = useMapContext();
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const { longitude, latitude } = useMemo(
    () => ({
      longitude: item.location.lng,
      latitude: item.location.lat,
    }),
    [item.location]
  );
  const fullName = useMemo(() => {
    return `${item.posted_by.first_name} ${item.posted_by.last_name}`;
  }, [item.posted_by.first_name, item.posted_by.last_name]);
  const createdAt = useMemo(() => {
    return format(new Date(item.created_at), "MMM dd, yyyy");
  }, [item.created_at]);
  const handleZoomtoMarker = () => {
    mapRef.current?.animateToRegion(
      {
        latitude,
        longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.0004,
      },
      400
    );
    selectPost(item.id);
  };
  return (
    <ListItem.Swipeable
      bottomDivider
      onPress={handleZoomtoMarker}
      rightContent={(reset) => (
        <Button
          title="Report (FE)"
          disabled
          radius="sm"
          size="lg"
          onPress={() => reset()}
          buttonStyle={{
            top: 2,
            height: "100%",
            backgroundColor: theme.colors.error,
          }}
        />
      )}
    >
      <Avatar
        size={32}
        rounded
        source={require("@/assets/icons/garbage-svgrepo-com.svg")}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "bold" }}>
          {fullName}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{
            fontWeight: "300",
            color: theme.colors.greyOutline,
            marginBottom: 8,
          }}
        >
          {createdAt}
        </ListItem.Subtitle>
        <Badge
          value={item.status}
          status="warning"
          badgeStyle={{
            marginTop: 4,
            borderRadius: 50,
            padding: 4,
            height: "auto",
          }}
        />

        <Text numberOfLines={2} style={{ marginTop: 4 }}>
          {item.description}
        </Text>
      </ListItem.Content>
      <ListItem.Chevron />
    </ListItem.Swipeable>
  );
};

export const WasteContentFAB = () => {
  const { top, left } = useSafeAreaInsets();
  const { theme } = useTheme();
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const setTabShow = useToggleHideTab(useShallow((state) => state.setTabHide));
  const { initialRegion, mapRef } = useMapContext();
  return (
    <FAB
      style={{
        position: "absolute",
        top: top + 20,
        left: left + 12,
      }}
      size="small"
      color={theme.colors.background}
      icon={{ name: "arrow-back", color: theme.colors.black }}
      onPress={() => {
        Promise.all([
          new Promise<void>((resolve) => {
            setTabShow(true);
            resolve();
          }),
          new Promise<void>((resolve) => {
            selectPost(null);
            resolve();
          }),
          new Promise<void>((resolve) => {
            mapRef.current?.animateToRegion(
              {
                longitude: initialRegion?.longitude!,
                latitude: initialRegion?.latitude!,
                latitudeDelta: 1,
                longitudeDelta: 1,
              },
              400
            );
          }),
        ]);
      }}
    />
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
