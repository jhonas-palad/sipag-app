import { useEffect, useLayoutEffect, useMemo, useTransition } from "react";
import { useToggleHideTab } from "@/store/tab";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@rneui/themed";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View } from "@/components/ui/View";
import { Image } from "expo-image";
import { Text, Avatar, Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { ListItem } from "@rneui/themed";
import { WastePost } from "@/types/maps";
import { format } from "date-fns";
import { useWasteReportPosts } from "@/data/waste-reports";
import { BottomView } from "@/components/ui/View";
import { BottomModalSheet } from "@/components/ui/ModalSheet";
import { useRef } from "react";
import { useWasteReportStore } from "@/store/waste-report";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMapContext } from "@/components/Maps";
import { FAB } from "@/components/ui/FAB";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuthSession } from "@/store/auth";
export const WastePostContent = () => {
  const { theme } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);
  const selectedPost = useWasteReportStore(
    useShallow((state) => state.selectedPost)
  );
  const user = useAuthSession(useShallow((state) => state.user));
  const wasteQuery = useWasteReportPosts(selectedPost ?? false);
  const detail: WastePost | null = useMemo(() => {
    const postData: WastePost = wasteQuery?.data?.data;
    if (!postData) {
      return null;
    }
    if (postData.created_at) {
      postData.created_at = format(new Date(postData.created_at), "yyyy-MM-dd");
    }
    return {
      id: postData.id,
      created_at: postData.created_at,
      description: postData.description,
      location: postData.location,
      posted_by: postData.posted_by,
      status: postData.status,
      thumbnail: postData.thumbnail,
      title: postData.title,
    };
  }, [wasteQuery?.data]);
  const myPost = useMemo(() => {
    return user?.id === detail?.posted_by.id;
  }, [user, detail]);
  if (wasteQuery === null || selectedPost === null) {
    return null;
  }
  console.log("myPost", myPost);
  return (
    <>
      {selectedPost && <WasteContentFAB />}

      <BottomModalSheet
        enablePanDownToClose={false}
        ref={modalRef}
        open
        snapPoints={["60%"]}
      >
        {wasteQuery?.isFetching && !detail ? (
          <LoadingScreen />
        ) : (
          <>
            <BottomSheetScrollView>
              <View
                style={{
                  paddingTop: 16,
                  paddingBottom: 100,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageGradientUser {...detail!} />

                <View style={[{ gap: 16 }]}>
                  <ListItem
                    bottomDivider
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <Icon
                      name="location-pin"
                      size={20}
                      // color={theme.colors.secondary}
                    />
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                          Location
                        </Text>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        {detail!.location.lng} {detail!.location.lat}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                  <ListItem
                    bottomDivider
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <Icon
                      name="description"
                      size={20}
                      color={theme.colors.grey3}
                    />
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                          Description
                        </Text>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        {detail!.description}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                  <ListItem
                    bottomDivider
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <Icon name="call" size={20} color={theme.colors.grey3} />
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                          Phone number
                        </Text>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        {detail!.posted_by.phone_number}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                  <ListItem
                    style={{
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 8,
                    }}
                  >
                    <Icon name="mail" size={20} color={theme.colors.grey3} />
                    <ListItem.Content>
                      <ListItem.Title>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                          Email
                        </Text>
                      </ListItem.Title>
                      <ListItem.Subtitle>
                        {detail?.posted_by.email
                          ? detail.posted_by.email
                          : "None"}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                </View>
              </View>
            </BottomSheetScrollView>
            <BottomView>
              <Text>{detail?.status}</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {!myPost ? (
                  detail?.status === "AVAILABLE" ? (
                    <Button containerStyle={{ flex: 1 }}>ACCEPT TASK</Button>
                  ) : (
                    <>
                      <Button containerStyle={{ flex: 1 }}>Finish</Button>
                      <Button type="outline" containerStyle={{ flex: 1 }}>
                        Cancel
                      </Button>
                    </>
                  )
                ) : (
                  <Button
                    containerStyle={{ flex: 1 }}
                    color="error"
                    raised
                    buttonStyle={{ borderColor: "transparent" }}
                  >
                    DELETE POST
                  </Button>
                  // <Text>Accepted by: {detail?.posted_by.first_name}</Text>
                )}
              </View>
            </BottomView>
          </>
        )}
      </BottomModalSheet>
    </>
  );
};

const ImageGradientUser = (detail: WastePost) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        width: "100%",
        position: "relative",
      }}
    >
      <Image
        style={{
          height: 200,
          width: "100%",
          objectFit: "contain",
        }}
        placeholder={{ blurhash: detail.thumbnail.hash }}
        source={{
          //@ts-ignore
          uri: detail.thumbnail.img_file,
        }}
      />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        start={{ x: 0, y: 0.1 }}
        end={{ y: 1, x: 0 }}
        style={{
          position: "absolute",
          bottom: 0,
          padding: 12,
          width: "100%",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <View
          transparent
          style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
        >
          <Avatar
            size={40}
            rounded
            source={{ uri: detail.posted_by.photo?.img_file }}
            containerStyle={{ backgroundColor: theme.colors.error }}
          />
          <View transparent>
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 16,
                color: theme.colors.white,
              }}
            >
              {detail.posted_by.first_name} {detail.posted_by.last_name}
            </Text>
            <Text
              style={{
                fontWeight: "light",
                fontSize: 12,
                color: theme.colors.white,
              }}
            >
              {detail.created_at as string}
            </Text>
          </View>
        </View>
        <View></View>
      </LinearGradient>
    </View>
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
                latitude: 14.100202432834427,
                latitudeDelta: 0.03370272545660313,
                longitude: 121.11851876601577,
                longitudeDelta: 0.016310177743420695,
              },
              400
            );
          }),
        ]);
      }}
    />
  );
};
