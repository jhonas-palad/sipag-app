import { ScrollView, View } from "react-native";
import { Text } from "@rneui/themed";
import React from "react";
import { usePushNotifications } from "@/components/PushNotificationProvider";

type Props = {};

const NotificationsScreen = (props: Props) => {
  const { notification, expoPushToken } = usePushNotifications();
  return (
    <ScrollView style={{ paddingHorizontal: 12 }}>
      <Text h4>ExpoPushToken: {expoPushToken}</Text>
      <Text>{JSON.stringify(notification, null, 4)}</Text>
    </ScrollView>
  );
};

export default NotificationsScreen;
