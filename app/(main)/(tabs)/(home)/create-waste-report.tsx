import {
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useToggleHideTab } from "@/store/tab";
import React, { useLayoutEffect, useMemo } from "react";
import { View } from "@/components/ui/View";
import { useTheme } from "@rneui/themed";

import { useForm } from "react-hook-form";
import { CreateWasteReportForm } from "./CreateWasteReportForm";
type Props = {};

const AddContents = (props: Props) => {
  const snapPoints = useMemo(() => ["20%"], []);
  const { theme } = useTheme();
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });
  const setHideTab = useToggleHideTab((state) => state.setTabHide);
  useLayoutEffect(() => {
    setHideTab(true);
    return () => {
      setHideTab(false);
    };
  }, [setHideTab]);
  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={Keyboard.dismiss}
    >
      <View style={{ paddingHorizontal: 16, flex: 1 }}>
        <CreateWasteReportForm />
      </View>
    </TouchableWithoutFeedback>
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
