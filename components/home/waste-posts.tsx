import "react-native-reanimated";
import { StyleSheet, Pressable, ViewProps, Dimensions } from "react-native";
import { BottomView, View } from "../ui/View";
import { useShallow } from "zustand/react/shallow";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import {
  Text,
  Icon,
  FAB,
  ListItem,
  useTheme,
  Avatar,
  Button,
} from "@rneui/themed";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { WastePostContent } from "./WastePostContents";
import React, { useRef, useMemo, useCallback, useLayoutEffect } from "react";
import { useToggleHideTab } from "@/store/tab";
import { useWasteReportStore } from "@/store/waste-report";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useRouter } from "expo-router";
import { UserPost } from "@/types/user";
import { useMapContext } from "../Maps";
import { Badge } from "@rneui/base";

type Props = {
  selectedCleanUpPost?: UserPost | null;
  wastePosts?: UserPost[] | null;
};

//Currently selected marker details
export const WastePostsBottomSheet = () => {
  const { selectedPost, posts } = useWasteReportStore(
    useShallow((state) => ({ ...state }))
  );

  const bottomSheetRef = useRef<BottomSheetMethods>(null);
  const snapPoints = useMemo(() => ["40%", "60%", "80%"], []);

  const { theme } = useTheme();

  const sheetStyle = useMemo(
    () => ({
      ...styles.sheetContainer,
    }),
    []
  );
  useLayoutEffect(() => {
    selectedPost && bottomSheetRef.current?.snapToIndex(1);
  }, [selectedPost]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={1}
        appearsOnIndex={2}
      />
    ),
    []
  );
  return (
    <>
      <BottomSheet
        style={sheetStyle}
        backdropComponent={renderBackdrop}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        backgroundStyle={{
          backgroundColor: theme.colors.background,
        }}
        handleStyle={{
          backgroundColor: theme.colors.background,
          borderRadius: 32,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.greyOutline,
          height: 6,
          width: 40,
        }}
      >
        {selectedPost ? (
          <WastePostContent detail={selectedPost!} />
        ) : (
          <WastePostList posts={posts} />
        )}
      </BottomSheet>
      {selectedPost && (
        <>
          {/* Top of the screen */}
          <WasteContentFAB />
          {/* Bottom of the screen */}
          <BottomView>
            <Button title="Accept" />
          </BottomView>
        </>
      )}
    </>
  );
};
const WastePostList = ({ posts }: { posts: UserPost[] }) => {
  const { theme } = useTheme();
  const router = useRouter();
  const headerButtons = useMemo(() => {
    return [
      {
        title: "Report feed",
        children: (
          <>
            <Icon color={theme.colors.white} name="view-stream" size={24} />
          </>
        ),
      },
      {
        href: "/create-waste-report",
        title: "Create waste report",
        children: (
          <>
            <Icon color={theme.colors.white} name="create" size={24} />
          </>
        ),
      },
      {
        title: "Create report",
        children: (
          <>
            <Icon color={theme.colors.white} name="create" size={24} />
          </>
        ),
      },
    ];
  }, [theme]);
  const renderItemPost = useCallback(
    ({ item }: { item: UserPost }) => <WasteItemPost {...item} />,
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
      <View
        transparent
        style={{
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-around",
          marginHorizontal: 24,
          gap: 16,
        }}
      >
        {headerButtons.map(
          (
            {
              children,
              title,
              href,
            }: {
              title: string;
              children: React.ReactNode;
              href?: string;
            },
            key
          ) => (
            <Pressable
              onPress={() => {
                if (!href) return;

                router.push(href);
              }}
              style={({ pressed }) => ({
                flex: 1,
                flexShrink: 0,
                backgroundColor: pressed
                  ? theme.colors.primary
                  : theme.colors.grey5,
                borderRadius: 50,
                padding: 8,
              })}
              key={key}
              // title={title}
            >
              {/* {title} */}
              {children}
            </Pressable>
          )
        )}
      </View>
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
export const WasteItemPost = (item: UserPost) => {
  const { theme } = useTheme();
  const { mapRef } = useMapContext();
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const { longitude, latitude } = useMemo(
    () => ({
      longitude: item.geo_coordinates.longitude,
      latitude: item.geo_coordinates.latitude,
    }),
    []
  );
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
          {item.user.firstName} {item.user.lastName}
        </ListItem.Title>
        <ListItem.Subtitle
          style={{
            fontWeight: "300",
            color: theme.colors.greyOutline,
            marginBottom: 8,
          }}
        >
          August 24, 2024 - 1hr ago
        </ListItem.Subtitle>
        <Badge
          value="Pending"
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
