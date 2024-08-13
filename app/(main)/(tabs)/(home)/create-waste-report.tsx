import { StyleSheet } from "react-native";
import { useToggleHideTab } from "@/store/tab";
import React, { useLayoutEffect, useMemo } from "react";
import { View } from "@/components/ui/View";
import { useTheme, FAB } from "@rneui/themed";
import { useForm } from "react-hook-form";
import { Text } from "@/components/ui/Text";
import { CreateWasteReportForm } from "./CreateWasteReportForm";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GoBackFAB } from "@/components/GoBackFAB";
type Props = {};

const AddContents = (props: Props) => {
  const setHideTab = useToggleHideTab((state) => state.setTabHide);
  useLayoutEffect(() => {
    setHideTab(true);
    return () => {
      setHideTab(false);
    };
  }, [setHideTab]);
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <CreateWasteReportForm />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fieldSpace: {
    marginBottom: 16,
  },
});
export default AddContents;
