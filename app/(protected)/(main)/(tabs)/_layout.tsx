import { Tabs } from "expo-router";
import { COLOR_PALLETE } from "@/config/colors";
import { TabBar } from "@/components/tabs/TabBar";
import { useRealtimeAnnouncements } from "@/hooks/queries/useRealtimeAnnouncements";
export const HomeTabsLayout = ({ segment }: any) => {
  useRealtimeAnnouncements();
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
        name="announcements"
        options={{
          title: "Announcements",
          tabBarBadge: "",
          headerShown: true,
          headerLeft: () => null,
        }}
      />
    </Tabs>
  );
};

export default HomeTabsLayout;
