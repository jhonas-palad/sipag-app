import { useCallback, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useTheme } from "@rneui/themed";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { View } from "@/components/ui/View";
import { Image } from "expo-image";
import { Text, Avatar, Icon } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";
import { ListItem } from "@rneui/themed";
import { WastePost } from "@/types/maps";
import {
  useDeleteWastReport,
  useWasteReportActions,
  useWasteReportPosts,
} from "@/data/waste-reports";
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
import Toast from "react-native-simple-toast";
import { log } from "@/utils/logger";

const BOTTOM_SHEET_NAME = "waste-post-detail";
export const WastePostContent = ({
  selectedPost,
}: {
  selectedPost: string;
}) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [showBack, setShowBack] = useState(true);

  const { mapRef } = useMapContext();
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const user = useAuthSession(useShallow((state) => state.user));
  const {
    data: wasteReportPost,
    isFetching,
    isLoading,
    isError,
    error,
  } = useWasteReportPosts(selectedPost);

  const myPost = useMemo(() => {
    return user?.id === wasteReportPost?.posted_by.id;
  }, [user, wasteReportPost]);

  const handleClose = useCallback(() => {
    modalRef.current?.close();
    setShowBack(false);
    selectPost(null);
    mapRef.current?.animateToRegion(
      {
        latitude: 14.100202432834427,
        latitudeDelta: 0.03370272545660313,
        longitude: 121.11851876601577,
        longitudeDelta: 0.016310177743420695,
      },
      400
    );
  }, [mapRef, selectPost]);
  return (
    <>
      {showBack && <WasteContentFAB onClose={handleClose} />}

      <BottomModalSheet
        key={BOTTOM_SHEET_NAME}
        name={BOTTOM_SHEET_NAME}
        enablePanDownToClose={false}
        open
        ref={modalRef}
        snapPoints={["60%", "80%"]}
      >
        {isError ? (
          <BottomSheetView>
            <View>
              <Text>Something went wrong. Details: {error.message}</Text>
            </View>
          </BottomSheetView>
        ) : isFetching || isLoading ? (
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
                  <LabelledContent
                    iconName="location-pin"
                    content={`${wasteReportPost?.location.lng}, ${wasteReportPost?.location.lat}`}
                    label="Location"
                  />
                  <LabelledContent
                    iconName="description"
                    label="Description"
                    content={
                      wasteReportPost?.description
                        ? wasteReportPost.description
                        : "No description provided"
                    }
                  />

                  <LabelledContent
                    label="Phone number"
                    iconName="call"
                    content={
                      wasteReportPost?.posted_by?.phone_number
                        ? wasteReportPost.posted_by.phone_number
                        : "None"
                    }
                  />
                  <LabelledContent
                    iconName="mail"
                    content={
                      wasteReportPost?.posted_by.email
                        ? wasteReportPost.posted_by.email
                        : "None"
                    }
                    label="Email"
                  />
                  {wasteReportPost?.cleaner && (
                    <LabelledContent
                      iconName="mail"
                      content={`
                      ${wasteReportPost.cleaner.id} ${
                        wasteReportPost.cleaner.first_name ?? "No firstname"
                      } ${wasteReportPost.cleaner.last_name ?? "No lastname"}`}
                      label={
                        wasteReportPost?.status === "INPROGRESS"
                          ? "Accepted by"
                          : "Cleared by"
                      }
                    />
                  )}
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
                <Text style={{ marginBottom: 16, fontWeight: "700" }}>
                  {wasteReportPost?.status}
                </Text>
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {myPost && wasteReportPost?.status === "AVAILABLE" ? (
                  <DeleteButton
                    postId={String(wasteReportPost?.id)}
                    onSuccess={handleClose}
                  />
                ) : wasteReportPost?.status === "AVAILABLE" ? (
                  <AvailableInProgButton
                    postId={String(wasteReportPost?.id)}
                    status={wasteReportPost?.status as string}
                  />
                ) : wasteReportPost?.status === "INPROGRESS" &&
                  String(wasteReportPost?.cleaner?.id) === String(user?.id) ? (
                  <InProgressButton
                    postId={String(wasteReportPost?.id)}
                    status={wasteReportPost?.status as string}
                    cleanerId={String(wasteReportPost?.cleaner?.id)}
                  />
                ) : null}
              </View>
            </BottomView>
          </>
        )}
      </BottomModalSheet>
    </>
  );
};

const LabelledContent = ({
  label,
  iconName,
  content,
}: {
  label: string;
  iconName: string;
  content: string;
}) => {
  const { theme } = useTheme();
  return (
    <ListItem
      bottomDivider
      style={{
        alignItems: "center",
        flexDirection: "row",
        gap: 8,
      }}
    >
      <Icon name={iconName} size={20} color={theme.colors.grey3} />
      <ListItem.Content>
        <ListItem.Title>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>{label}</Text>
        </ListItem.Title>
        <ListItem.Subtitle>{content}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};
const AvailableInProgButton = ({
  postId,
  status,
}: {
  postId: string;
  status: string;
}) => {
  const { mutate, isPending } = useWasteReportActions(postId, {
    mutationKey: [status],
    async onSuccess() {
      Toast.show("Accepted", Toast.LONG);
    },
    onError(error) {
      Toast.show(
        error.errors?.cleaner ?? "Can't accept the task at the moment",
        Toast.LONG
      );
    },
  });
  const handleAccept = () => {
    mutate({ action: "accept" });
  };

  return (
    <Button
      loading={isPending}
      disabled={isPending}
      onPress={handleAccept}
      containerStyle={{ flex: 1 }}
    >
      Accept task
    </Button>
  );
};

const InProgressButton = ({
  postId,
  status,
  cleanerId,
}: {
  postId: string;
  status: string;
  cleanerId: string;
}) => {
  const { mutate, isPending } = useWasteReportActions(postId, {
    mutationKey: [status],
    async onSuccess(data, variables) {
      Toast.show(
        `Task ${variables.action === "done" ? "completed" : "cancelled"}.`,
        Toast.LONG
      );
    },
    onError(error) {
      log.error(error.errors);
    },
  });
  const handleFinish = () => {
    mutate({ action: "done" });
  };
  const handleCancel = () => {
    mutate({ action: "cancel" });
  };
  return (
    <>
      <Button
        onPress={handleFinish}
        disabled={isPending}
        containerStyle={{ flex: 1 }}
      >
        Finish
      </Button>
      <Button
        disabled={isPending}
        onPress={handleCancel}
        type="outline"
        containerStyle={{ flex: 1 }}
      >
        Cancel
      </Button>
    </>
  );
};

const DeleteButton = ({
  postId,
  onSuccess,
}: {
  postId: string;
  onSuccess?: () => void;
}) => {
  const mutation = useDeleteWastReport({
    async onError(error) {
      let errMsg = "An error occurred";
      Toast.show(`${errMsg}: ${error.status ?? "None"}`, Toast.LONG);
    },
    async onSuccess() {
      onSuccess?.();
    },
  });
  const handleDelete = useCallback(() => {
    mutation.mutate(postId);
  }, [mutation, postId]);
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
              {detail.created_at as string} USERID: {detail.posted_by.id}
            </Text>
          </View>
        </View>
        <View></View>
      </LinearGradient>
    </View>
  );
};

export const WasteContentFAB = ({ onClose }: any) => {
  const { top, left } = useSafeAreaInsets();
  const { theme } = useTheme();
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
        onClose();
      }}
    />
  );
};
