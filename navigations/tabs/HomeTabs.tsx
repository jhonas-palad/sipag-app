import { Pressable, StyleSheet, Text, View } from "react-native";
import { Tabs, useNavigation } from "expo-router";
import { COLOR_PALLETE } from "@/config/colors";
import { TabBar } from "@/components/tabs/TabBar";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export const HomeTabs = ({ segment }: any) => {
  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLOR_PALLETE.primary,
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          title: "Activities",
          tabBarBadge: "20+",
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: "Announcements",
        }}
      />
    </Tabs>
  );
};
