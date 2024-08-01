import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Linking } from "react-native";
import { Link, Redirect } from "expo-router";
import { useAuthSession } from "@/store/auth";
import { useShallow } from "zustand/react/shallow";
type Props = {};

function CustomDrawerContent(props: any) {
  // console.log(JSON.stringify(props));
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Website"
        onPress={() => Linking.openURL("https://www.expo.dev/")}
      />
      {/* <Link href={"/"} onPress={() => props.navigation.closeDrawer()}>
        Alpha
      </Link> */}
      <Link href="/profile">Auth</Link>
    </DrawerContentScrollView>
  );
}

const MainLayout = (props: Props) => {
  const { isLoading, session } = useAuthSession(
    useShallow((state) => ({
      isLoading: state.isLoading,
      session: state.session,
    }))
  );
  if (!session) {
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

export default MainLayout;
