import "react-native-reanimated";
import React, { useRef, useMemo, useCallback, useEffect } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { View } from "@/components/ui/View";
import { useShallow } from "zustand/react/shallow";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Text, useTheme } from "@rneui/themed";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useWasteReportStore } from "@/store/waste-report";
import { WastePost } from "@/types/maps";
import BottomSheetHandleComponent from "@/components/waste-reports/bottom-sheet-handle-component";
import WasteReportsTagsProvider from "./waste-reports-tags-provider";

import { WastePostsList } from "./waste-posts-list";
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
          <WasteReportsTagsProvider>
            <WastePostsList posts={posts} />
          </WasteReportsTagsProvider>
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
