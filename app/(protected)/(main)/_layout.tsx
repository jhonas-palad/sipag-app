import { Drawer } from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View } from "@/components/ui/View";
import { Text, Avatar, Icon, useTheme } from "@rneui/themed";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
type Props = {};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { theme } = useTheme();
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
          rounded
          title={session.user?.photo ? undefined : "?"}
          containerStyle={{ backgroundColor: theme.colors.greyOutline }}
        >
          {session.user?.photo && (
            <Image
              style={{ height: 35, width: 35 }}
              placeholder={session.user?.photo?.hash}
              source={{ uri: session.user?.photo?.img_file }}
            />
          )}
        </Avatar>
        <View transparent>
          <Text>ID: {session.user?.id}</Text>
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
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* All other screens should be hidden */}
    </Drawer>
  );
};

export default MainLayout;
