import { Drawer } from "expo-router/drawer";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Linking } from "react-native";
import { Link } from "expo-router";

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

const HomeLayout = (props: Props) => {
  return (
    
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        {/* All other screens should be hidden */}
      </Drawer>
  );
};

export default HomeLayout;
