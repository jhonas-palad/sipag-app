import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { Avatar } from "@rneui/themed";
import React from "react";
import { WasteMapView } from "@/components/waste-reports/waste-map";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";
import { Image } from "expo-image";
import {
  useRealTimeWasteReportActivities,
  useWasteReportActivitiesPrefetch,
} from "@/data/waste-reports";

type Props = {};

const IndexPage = (props: Props) => {
  const { top, left } = useSafeAreaInsets();
  const navigation = useNavigation();

  const user = useAuthSession(useShallow((state) => state.user));

  // useRealTimeWasteReportActivities();
  useWasteReportActivitiesPrefetch();

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
        <Avatar
          size={50}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
          rounded
        >
          <Image
            contentFit="cover"
            style={{ width: "100%", height: "100%", borderRadius: 50 }}
            source={{ uri: user?.photo?.img_file }}
          />
        </Avatar>
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
