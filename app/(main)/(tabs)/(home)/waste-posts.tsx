import "react-native-reanimated";
import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { View } from "@/components/ui/View";
import { useShallow } from "zustand/react/shallow";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Text, ListItem, useTheme, Avatar } from "@rneui/themed";
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
import { useMapContext } from "@/components/Maps";
import { Badge } from "@rneui/base";
import { WastePost } from "@/types/maps";
import { LinkFAB, FAB } from "@/components/ui/FAB";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";
import { WASTE_REPORTS } from "@/data/waste-reports";

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

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: [WASTE_REPORTS] });
  }, [queryClient]);
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

                <FAB
                  icon={{ name: "sync" }}
                  size="small"
                  onPress={handleRefresh}
                />
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
        <Button title="Post your waste concerns" />
      </BottomTextWrapper>
    ),
    []
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
  const itemStatus = useCallback(
    (
      status: "AVAILABLE" | "INPROGRESS" | "DONE"
    ): "primary" | "warning" | "success" => {
      switch (status) {
        case "AVAILABLE":
          return "primary";
        case "INPROGRESS":
          return "warning";
        case "DONE":
          return "success";
      }
    },
    []
  );

  const fullName = useMemo(() => {
    return `${item.posted_by.first_name} ${item.posted_by.last_name}`;
  }, [item.posted_by.first_name, item.posted_by.last_name]);
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
    <ListItem bottomDivider onPress={handleZoomtoMarker}>
      <Avatar
        size={32}
        rounded
        source={{ uri: item.posted_by.photo?.img_file }}
      />
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "bold" }}>
          {fullName}
        </ListItem.Title>
        <View
          style={{
            // color: theme.colors.greyOutline,
            marginBottom: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            // backgroundColor: "red",
          }}
        >
          <Text>{createdAt}</Text>
          <Badge
            value={item.status}
            status={itemStatus(
              item.status as "AVAILABLE" | "INPROGRESS" | "DONE"
            )}
            badgeStyle={{
              marginTop: 4,
              borderRadius: 50,
              padding: 4,
              height: "auto",
            }}
          />
        </View>

        <Text numberOfLines={2} style={{ marginTop: 4 }}>
          {item.description}
        </Text>
      </ListItem.Content>
      {/* <ListItem.Chevron /> */}
    </ListItem>
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
