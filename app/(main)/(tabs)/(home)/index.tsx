import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import React from "react";
import { WasteMapView } from "@/components/home/waste-map";
import { useThemeMode } from "@rneui/themed";

type Props = {};

const IndexPage = (props: Props) => {
  const { mode, setMode } = useThemeMode();

  return (
    <View style={[styles.container]}>
      <WasteMapView />
    </View>
  );
};

export default IndexPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
