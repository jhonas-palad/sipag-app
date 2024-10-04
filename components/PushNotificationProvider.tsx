import {
  useState,
  useEffect,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useRegisterPushToken } from "@/hooks/mutations/useRegisterPushToken";

import { log } from "@/utils/logger";
export interface PushNotificationContextProps {
  expoPushToken: string | null;
  sendPushNotification: () => Promise<any>;
  notification: Notifications.Notification | null;
  notifCount: number;
  resetCount: () => void;
}
const PushNotificationContext =
  createContext<PushNotificationContextProps | null>(null);
function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [notifCount, setNotifCount] = useState(0);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const { mutate } = useRegisterPushToken({
    onSuccess(data, variables, context) {
      setExpoPushToken(variables);
    },
    onError(error) {
      log.error(error);
      alert(
        "Error occurred from the server. Can't recieve notifcations at the moment"
      );
    },
  });
  const resetCount = useCallback(() => {
    setNotifCount(0);
  }, [setNotifCount]);
  const handleRegistrationError = useCallback((errorMessage: string) => {
    alert(errorMessage);
    throw new Error(errorMessage);
  }, []);
  const sendPushNotification = async () => {
    const message = {
      to: expoPushToken,
      sound: "default",
      title: "Original Title",
      body: "And here is the body!",
      data: { someData: "goes here" },
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };
  const registerForPushNotificationsAsync = useCallback(async () => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;

        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }, [handleRegistrationError]);

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => mutate(token as string))
      .catch((error: any) => setExpoPushToken(`${error}`));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification ?? null);
        setNotifCount((prev) => prev + 1);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log({response});
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [registerForPushNotificationsAsync, mutate]);

  return (
    <PushNotificationContext.Provider
      value={{
        sendPushNotification,
        notification,
        expoPushToken,
        notifCount,
        resetCount,
      }}
    >
      {children}
    </PushNotificationContext.Provider>
  );
}

const usePushNotifications = () => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error(
      "usePushNotifications must be used within <PushNotificationContext/>"
    );
  }
  return context;
};

export { PushNotificationProvider, usePushNotifications };
