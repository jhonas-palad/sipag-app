import { Tabs } from "expo-router";
import { COLOR_PALLETE } from "@/config/colors";
import { TabBar } from "@/components/tabs/TabBar";
import { usePushNotifications } from "@/components/PushNotificationProvider";
import { useNetInfoContext } from "@/components/netinfo-provider";
import { useEffect } from "react";
import { toast } from "sonner-native";
export const HomeTabsLayout = ({ segment }: any) => {
  // useRealtimeAnnouncements();
  const { notifCount } = usePushNotifications();
  const internetConnected = useNetInfoContext(
    (state) => state.internetConnected
  );
  useEffect(() => {
    if (!internetConnected) {
      toast("No internet connection", {description: "Some features will not work."});
    }
  });
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
          tabBarBadge: notifCount ? notifCount : "",
          headerShown: true,
          headerLeft: () => null,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "notifications",
          tabBarBadge: "",
          headerShown: true,
          headerLeft: () => null,
        }}
      />
    </Tabs>
  );
};

export default HomeTabsLayout;
