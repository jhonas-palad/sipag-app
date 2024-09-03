import { Tabs } from "expo-router";
import { COLOR_PALLETE } from "@/config/colors";
import { TabBar } from "@/components/tabs/TabBar";
export const HomeTabsLayout = ({ segment }: any) => {
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
          tabBarBadge: "",
          headerShown: true,
          headerLeft: () => null,
        }}
      />
    </Tabs>
  );
};

export default HomeTabsLayout;
