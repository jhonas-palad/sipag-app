import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { FAB } from "@rneui/themed";
import React from "react";
import { WasteMapView } from "@/app/(main)/(tabs)/(home)/waste-map";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
type Props = {};

const IndexPage = (props: Props) => {
  const { top, left } = useSafeAreaInsets();
  const navigation = useNavigation();
  return (
    <View transparent style={[styles.container]}>
      <View
        transparent
        style={{
          pointerEvents: "box-none",
          alignItems: "flex-end",
          position: "absolute",
          top: top + 20,
          paddingHorizontal: left + 16,
          width: "100%",
          zIndex: 1,
        }}
      >
        <FAB
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
          size="small"
          icon={{ name: "add" }}
        />
      </View>
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
