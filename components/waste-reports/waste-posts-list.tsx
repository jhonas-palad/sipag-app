import { View } from "../ui/View";
import { Text, Button, useTheme, Badge } from "@rneui/themed";
import { FlatList } from "react-native-gesture-handler";
import React, { useCallback, useMemo } from "react";
import { useWasteReportsTags, Tag } from "./waste-reports-tags-provider";
import { WastePost } from "@/types/maps";
import { useRouter } from "expo-router";
import { useGetFilteredWasteReports } from "@/data/waste-reports";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useMapContext } from "../Maps";
import {
  useWasteContainerState,
  useWasteReportStore,
} from "@/store/waste-report";
import { useShallow } from "zustand/react/shallow";
import { format } from "date-fns";
import { Pressable } from "react-native";
import { Image } from "expo-image";
type Props = {
  posts: WastePost[];
};

const WastePostsList = ({ posts }: Props) => {
  const { tag, tags } = useWasteReportsTags();
  return (
    <>
      <View transparent style={{ marginBottom: 16 }}>
        <View style={{ paddingTop: 12, marginBottom: 12 }}>
          <Text h4 style={{ paddingHorizontal: 24, paddingVertical: 4 }}>
            Community Waste Reports
          </Text>
        </View>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 16 }}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(s) => s}
          horizontal
          data={tags}
          renderItem={({ item }: { item: string }) => (
            <Tag key={item} name={item} />
          )}
        />
      </View>
      <WastePostList tag={tag} posts={posts} />
    </>
  );
};

const WastePostList = ({ tag, posts }: { tag: string; posts: WastePost[] }) => {
  const router = useRouter();
  const { data: filteredData, isLoading } = useGetFilteredWasteReports(tag, {
    initialData: { data: posts, status: 200 },
  });
  const handlePushToCreateWasteReportScreen = useCallback(() => {
    router.push("/(home)/create-waste-report");
  }, [router]);
  const renderItemPost = useCallback(
    ({ item }: { item: WastePost }) => <WasteItemPost {...item} />,
    []
  );
  const renderEmptyListComponent = useCallback(() => {
    let message = "";

    if (tag === "all") {
      message =
        "There's no waste report in your barangay at the moment. Enjoy the clean surroundings and refresh the screen for any updates.";
    } else {
      message = `There's no ${tag} waste report in your barangay at the moment. Enjoy the clean surroundings and refresh the screen for any updates.`;
    }
    return (
      <View
        style={{
          borderRadius: 22,
          paddingTop: 50,
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          paddingHorizontal: 14,
        }}
      >
        <Text h4>Clean and Green! 🌿</Text>
        <Text style={{ textAlign: "center" }}>{message}</Text>
        <Button
          title="Post your waste concerns"
          onPress={handlePushToCreateWasteReportScreen}
        />
      </View>
    );
  }, [handlePushToCreateWasteReportScreen, tag]);
  // const renderHeaderComponent = () => (

  // );
  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  return (
    <BottomSheetFlatList
      bounces
      // ListHeaderComponent={renderHeaderComponent}
      ListEmptyComponent={renderEmptyListComponent}
      data={filteredData}
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

export { WastePostsList };
