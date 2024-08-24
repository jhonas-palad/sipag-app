import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
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
import { format, set } from "date-fns";
import {
  useDeleteWastReport,
  useWasteReportActions,
  useWasteReportPosts,
} from "@/data/waste-reports";
import { BottomView } from "@/components/ui/View";
import { BottomModalSheet } from "@/components/ui/ModalSheet";
import { useRef } from "react";
import {
  useWasteContainerState,
  useWasteReportStore,
} from "@/store/waste-report";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMapContext } from "@/components/Maps";
import { FAB } from "@/components/ui/FAB";
import { Button } from "@/components/ui/Button";
import { LoadingScreen } from "@/components/LoadingScreen";
import { useAuthSession } from "@/store/auth";
import Toast from "react-native-simple-toast";
import { ResponseError } from "@/errors/response-error";
import { boolean } from "zod";
import { log } from "@/utils/logger";

export const WastePostContent = ({
  selectedPost,
}: {
  selectedPost: string;
}) => {
  const { theme } = useTheme();
  const modalRef = useRef<BottomSheetModal>(null);
  const { showBtmModal } = useWasteContainerState(
    useShallow((state) => ({
      showBtmModal: state.showBtmModal,
    }))
  );
  // const { wasteReportDetail, setWasteReportDetail } = useWasteReportStore(
  //   useShallow((state) => ({
  //     wasteReportDetail: state.wasteReportDetail,
  //     setWasteReportDetail: state.setWasteReportDetail,
  //   }))
  // );
  const user = useAuthSession(useShallow((state) => state.user));
  const {
    data: wasteReportPost,
    isFetching,
    isLoading,
    isError,
  } = useWasteReportPosts(selectedPost);

  // const detail: WastePost | null = useMemo(() => {
  //   if (!postData) {
  //     return null;
  //   }
  //   if (postData.created_at) {
  //     postData.created_at = format(new Date(postData.created_at), "yyyy-MM-dd");
  //   }
  //   return {
  //     id: postData.id,
  //     created_at: postData.created_at,
  //     description: postData.description,
  //     location: postData.location,
  //     posted_by: postData.posted_by,
  //     status: postData.status,
  //     thumbnail: postData.thumbnail,
  //     title: postData.title,
  //   };
  // }, [wasteReportPost]);

  const myPost = useMemo(() => {
    return user?.id === wasteReportPost?.posted_by.id;
  }, [user, wasteReportPost]);

  if (wasteReportPost === null || !showBtmModal) {
    return null;
  }
  return (
    <>
      {showBtmModal !== null && <WasteContentFAB />}

      <BottomModalSheet
        enablePanDownToClose={false}
        ref={modalRef}
        open={showBtmModal}
        snapPoints={["60%", "80%"]}
      >
        {isFetching || isLoading ? (
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
                <ImageGradientUser {...wasteReportPost!} />

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
                        {wasteReportPost?.location.lng}{" "}
                        {wasteReportPost?.location.lat}
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
                        {wasteReportPost?.description}
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
                        {wasteReportPost?.posted_by.phone_number}
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
                        {wasteReportPost?.posted_by.email
                          ? wasteReportPost.posted_by.email
                          : "None"}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                  </ListItem>
                </View>
              </View>
            </BottomSheetScrollView>
            <BottomView>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingHorizontal: 4,
                }}
              >
                <Text>Status</Text>
                <Text style={{ marginBottom: 4, fontWeight: "700" }}>
                  {wasteReportPost?.status}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {!myPost ? (
                  <AvailableInProgButton
                    postId={String(wasteReportPost?.id)}
                    status={wasteReportPost?.status as string}
                  />
                ) : (
                  <DeleteButton postId={String(wasteReportPost?.id)} />
                )}
              </View>
            </BottomView>
          </>
        )}
      </BottomModalSheet>
    </>
  );
};

const AvailableInProgButton = ({
  postId,
  status,
}: {
  postId: string;
  status: string;
}) => {
  const [statusState, setStatus] = useState<string>(status);
  const { mutate } = useWasteReportActions(postId, {
    mutationKey: [status],
    async onSuccess() {},
    onError(error) {
      log.error(error);
    },
  });
  const handleAccept = () => {
    setStatus("INPROGRESS");
    mutate({ action: "accept" });
    Toast.show("Accepted", Toast.LONG);
  };
  const handleFinish = () => {
    setStatus("DONE");
    mutate({ action: "done" });
    Toast.show("Task completed.", Toast.LONG);
  };
  const handleCancel = () => {
    setStatus("AVAILABLE");
    mutate({ action: "cancel" });
    Toast.show("Task cancelled.", Toast.LONG);
  };
  if (statusState === "AVAILABLE") {
    return (
      <Button onPress={handleAccept} containerStyle={{ flex: 1 }}>
        ACCEPT TASK
      </Button>
    );
  }

  if (statusState === "INPROGRESS") {
    return (
      <>
        <Button onPress={handleFinish} containerStyle={{ flex: 1 }}>
          Finish
        </Button>
        <Button
          onPress={handleCancel}
          type="outline"
          containerStyle={{ flex: 1 }}
        >
          Cancel
        </Button>
      </>
    );
  }
  return null;
};

const DeleteButton = ({
  postId,
  onSuccess,
}: {
  postId: string;
  onSuccess?: () => void;
}) => {
  const selectPost = useWasteReportStore(
    useShallow((state) => state.selectPost)
  );
  const setContainerState = useWasteContainerState(
    useShallow((state) => state.setContainerState)
  );
  const mutation = useDeleteWastReport({
    async onError(error, variables, context) {
      let errMsg = "An error occurred";

      if (error instanceof ResponseError) {
        const errors = error.errors;
        // console.log(errors.statu);
      }
      selectPost(null);
      setContainerState({ showBtmModal: true });
      Toast.show(`${errMsg}: ${error.status ?? "None"}`, Toast.LONG);
    },
    async onSuccess() {
      selectPost(null);
      setContainerState({ showBtmModal: false });
      onSuccess?.();
    },
  });
  const handleDelete = useCallback(() => {
    mutation.mutate(postId);
  }, [postId]);
  return (
    <Button
      containerStyle={{ flex: 1 }}
      color="error"
      onPress={handleDelete}
      raised
      loading={mutation.isPending}
      buttonStyle={{ borderColor: "transparent" }}
      disabled={mutation.isPending}
    >
      DELETE POST
    </Button>
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
  const setContainerState = useWasteContainerState(
    useShallow((state) => state.setContainerState)
  );
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
          // new Promise<void>((resolve) => {
          //   setTabShow(true);
          //   resolve();
          // }),
          new Promise<void>((resolve) => {
            selectPost(null);
            setContainerState({ showBtmModal: false });
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
