import { Drawer } from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View } from "@/components/ui/View";
import { Text, Avatar, Icon } from "@rneui/themed";
import { Redirect } from "expo-router";
import { useAuthSession } from "@/store/auth";
import { useIsValidToken } from "@/data/auth";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "expo-router";
import { LoadingScreen } from "@/components/LoadingScreen";
import { log } from "@/utils/logger";
type Props = {};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const session = useAuthSession(
    useShallow((state) => ({
      user: state.user,
      signOut: state.signOut,
    }))
  );
  return (
    <DrawerContentScrollView {...props}>
      <View
        transparent
        style={{
          paddingHorizontal: 12,
          paddingVertical: 20,
          gap: 12,
        }}
      >
        <Avatar
          title="JH"
          rounded
          containerStyle={{ backgroundColor: "red" }}
        />
        <View transparent>
          <Text h4>
            {session.user?.first_name} {session.user?.last_name}
          </Text>
          <Text>{session.user?.phone_number}</Text>
          <Text>{session.user?.email}</Text>
        </View>
      </View>
      <DrawerItem
        label="Points"
        icon={() => <Icon name="emoji-events" />}
        onPress={() => {}}
      />
      <DrawerItem
        label="Settings"
        icon={() => <Icon name="settings" />}
        onPress={() => {}}
      />

      <DrawerItem
        label="Signout"
        icon={() => <Icon name="logout" />}
        onPress={() => {
          session.signOut();
          router.replace("/auth");
        }}
      />
    </DrawerContentScrollView>
  );
}

const MainLayout = (props: Props) => {
  const { isError, isPending, error } = useIsValidToken();

  if (isPending) {
    return <LoadingScreen />;
  }
  if (isError) {
    log.debug("Not Authenticated", error.errors);
    return <Redirect href="/auth" />;
  }
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* All other screens should be hidden */}
    </Drawer>
  );
};

const DrawerItemSignOut = () => {
  const session = useAuthSession(
    useShallow((state) => {
      return state.signOut;
    })
  );
};

export default MainLayout;
