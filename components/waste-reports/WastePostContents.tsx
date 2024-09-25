import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import { useShallow } from "zustand/react/shallow";
import { Badge, Icon, useTheme } from "@rneui/themed";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetFooter,
  BottomSheetFooterProps,
} from "@gorhom/bottom-sheet";
import { View } from "@/components/ui/View";
import { Image } from "expo-image";
import { Text } from "@rneui/themed";
import {
  useDeleteWastReport,
  useWasteReportActions,
  useGetWasteReportPostDetail,
  WASTE_REPORTS,
} from "@/data/waste-reports";

import { useWasteReportStore } from "@/store/waste-report";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMapContext } from "@/components/Maps";
import { FAB } from "@/components/ui/FAB";
import { Button } from "@/components/ui/Button";
import { useAuthSession } from "@/store/auth";
import Toast from "react-native-simple-toast";
import { log } from "@/utils/logger";
import { useRouter } from "expo-router";
import { ErrorBottomSheetView } from "../bottom-sheet/ErrorBottomSheetView";
import { ActivityIndicator, StyleSheet } from "react-native";
import { UserProfileBox } from "./UserProfileBox";
import { formatPPpp } from "@/lib/date";

const BOTTOM_SHEET_NAME = "waste-post-detail";

type WastePostDetailContextT = {
  close: () => void;
  sheetRef: React.Ref<BottomSheetModal>;
};

const WastePostDetailContext = createContext<WastePostDetailContextT | null>(
  null
);
export const WastePostContent = ({
  selectedPost,
}: {
  selectedPost: string;
}) => {
  const modalRef = useRef<BottomSheetModal>(null);
  const [showBack, setShowBack] = useState(true);
  const { theme } = useTheme();
  const { mapRef } = useMapContext();
  const selectPost = useWasteReportStore((state) => state.selectPost);
  const user = useAuthSession(useShallow((state) => state.user));
  const {
    data: wasteReportPost,
    isFetching,
    isLoading,
    isError,
    error,
  } = useGetWasteReportPostDetail(selectedPost);

  useEffect(() => {
    if (selectedPost) {
      modalRef.current?.present();
    }
  }, [selectedPost]);

  const myPost = useMemo(() => {
    return user?.id === wasteReportPost?.posted_by.id;
  }, [user, wasteReportPost]);

  const handleClose = useCallback(() => {
    modalRef.current?.close();
    setShowBack(false);
    selectPost(null);
  }, [selectPost]);

  const renderFooter = (props: BottomSheetFooterProps) => {
    return (
      <BottomSheetFooter
        {...props}
        style={{
          paddingVertical: 8,
          paddingHorizontal: 20,
          backgroundColor: theme.colors.white,
          // backgroundColor: "transparent",
          elevation: 10,
        }}
      >
        <View
          transparent
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <Text>Status</Text>
          <Text style={{ fontWeight: "700" }}>{wasteReportPost?.status}</Text>
        </View>
        <View transparent style={{ flexDirection: "row", gap: 8 }}>
          {myPost && wasteReportPost?.status === "AVAILABLE" ? (
            <DeleteButton
              postId={String(wasteReportPost?.id)}
              closeBottomSheet={handleClose}
            />
          ) : wasteReportPost?.status === "AVAILABLE" ? (
            <AvailableInProgButton
              postId={String(wasteReportPost?.id)}
              status={wasteReportPost?.status as string}
            />
          ) : wasteReportPost?.status === "INPROGRESS" &&
            String(wasteReportPost?.cleaner?.id) === String(user?.id) ? (
            <InProgressButton
              closeBottomSheet={handleClose}
              postId={String(wasteReportPost?.id)}
              status={wasteReportPost?.status as string}
              cleanerId={String(wasteReportPost?.cleaner?.id)}
            />
          ) : null}
        </View>
      </BottomSheetFooter>
    );
  };

  return (
    <WastePostDetailContext.Provider
      value={{ close: handleClose, sheetRef: modalRef }}
    >
      {showBack && <WasteContentFAB />}

      <BottomSheetModal
        key={BOTTOM_SHEET_NAME}
        name={BOTTOM_SHEET_NAME}
        enablePanDownToClose={false}
        footerComponent={(props) => renderFooter(props)}
        animateOnMount
        enableDismissOnClose
        onDismiss={() => {
          setShowBack(false);
          selectPost(null);
        }}
        ref={modalRef}
        snapPoints={["60%", "80%", "100%"]}
      >
        {isError ? (
          <ErrorBottomSheetView queryKey={[WASTE_REPORTS + selectedPost]}>
            <View
              transparent
              style={{
                paddingTop: 128,
                paddingHorizontal: 32,
              }}
            >
              <Text h4 style={{ textAlign: "center", marginBottom: 4 }}>
                Something went wrong.
              </Text>
              <Text style={{ textAlign: "center" }}>
                Details: {error.message}
              </Text>
            </View>
          </ErrorBottomSheetView>
        ) : isFetching || isLoading ? (
          // <LoadingScreen />
          <BottomSheetView
            style={{
              flex: 1,
              paddingTop: 128 * 2,
              paddingHorizontal: 32,
              justifyContent: "flex-start",
            }}
          >
            <ActivityIndicator />
          </BottomSheetView>
        ) : (
          <>
            <BottomSheetScrollView>
              <View
                transparent
                style={{
                  paddingTop: 16,
                  paddingHorizontal: 16,
                  paddingBottom: 120,
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <UserProfileBox profile={wasteReportPost?.posted_by} />
                <View
                  transparent
                  style={{
                    width: "100%",
                    height: 250,
                    marginBotton: 12,
                    // paddingHorizontal: 12,
                  }}
                >
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: theme.spacing.lg,
                    }}
                    source={wasteReportPost?.thumbnail.img_file}
                    placeholder={wasteReportPost?.thumbnail.placeholder}
                  />
                </View>

                <View transparent style={[{ gap: 16, marginTop: 24 }]}>
                  <Text
                    style={{
                      fontSize: 24,
                      fontWeight: "bold",
                      color: theme.colors.black,
                    }}
                  >
                    {wasteReportPost?.title}
                  </Text>
                  <Text style={{ fontSize: 18 }}>
                    {wasteReportPost?.description}
                  </Text>
                  <Text>{formatPPpp(wasteReportPost.created_at)}</Text>
                </View>
                {wasteReportPost?.cleaner && (
                  <View
                    style={{
                      borderRadius: 12,
                      elevated: 12,
                      borderWidth: 0.5,
                      borderColor: theme.colors.grey1,
                      padding: 12,
                      marginTop: 12,
                    }}
                  >
                    <Badge
                      containerStyle={{
                        position: "absolute",
                        right: 5,
                        top: 5,
                      }}
                      value="Cleaner"
                    />
                    <UserProfileBox profile={wasteReportPost?.cleaner} />
                    <View style={{ marginLeft: 12 }}>
                      {wasteReportPost?.accepted_at && (
                        <View style={[styles.row, { marginBottom: 8 }]}>
                          <Icon
                            name="schedule"
                            size={24}
                            color={theme.colors.warning}
                          />
                          <Text>
                            {formatPPpp(wasteReportPost?.accepted_at)}
                          </Text>
                        </View>
                      )}
                      {wasteReportPost?.completed_at && (
                        <View style={styles.row}>
                          <Icon
                            name="done-all"
                            size={24}
                            color={theme.colors.success}
                          />
                          <Text>
                            {formatPPpp(wasteReportPost?.completed_at)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </BottomSheetScrollView>
          </>
        )}
      </BottomSheetModal>
    </WastePostDetailContext.Provider>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});

const useWastePostDetailContext = () => {
  return useContext(WastePostDetailContext);
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
  closeBottomSheet,
}: {
  postId: string;
  status: string;
  cleanerId: string;
  closeBottomSheet: () => void;
}) => {
  const router = useRouter();
  const { mutate, isPending } = useWasteReportActions(postId, {
    mutationKey: [status],
    async onSuccess(data, variables) {
      if (variables.action === "done") {
        closeBottomSheet();
        router.push("/(home)/finished-task");
      }
      Toast.show(
        `Task ${variables.action === "done" ? "completed" : "cancelled"}.`,
        Toast.LONG
      );
    },
    onError(error) {
      if (typeof error.errors === "object") {
        if (error.errors?.count) {
          Toast.show(
            "Already reached the maximum points, redeem it first to reset the count",
            Toast.SHORT
          );
        }
      }
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
  closeBottomSheet,
}: {
  postId: string;
  onSuccess?: () => void;
  closeBottomSheet: () => void;
}) => {
  const mutation = useDeleteWastReport({
    async onError(error) {
      let errMsg = "An error occurred";
      Toast.show(`${errMsg}: ${error.status ?? "None"}`, Toast.LONG);
    },
    async onSuccess() {
      onSuccess?.();
      closeBottomSheet();
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

export const WasteContentFAB = () => {
  const { close } = useWastePostDetailContext()!;
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
        close();
      }}
    />
  );
};
