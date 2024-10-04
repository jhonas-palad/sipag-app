import { StyleSheet } from "react-native";
import { useToggleHideTab } from "@/store/tab";
import React from "react";
import { useFocusEffect } from "expo-router";
import { View } from "@/components/ui/View";
import { CreateWasteReportForm } from "./CreateWasteReportForm";
import { ImagePickerOptions } from "@/components/image-picker-options";

type Props = {};

const CreateWasteReportScreen = (props: Props) => {
  const setHideTab = useToggleHideTab((state) => state.setTabHide);
  useFocusEffect(() => {
    setHideTab(true);
    return () => {
      setHideTab(false);
    };
  });
  return (
    <View style={[styles.container, { flex: 1 }]}>
      <ImagePickerOptions>
        <CreateWasteReportForm />
      </ImagePickerOptions>
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
export default CreateWasteReportScreen;
