import { View, StyleSheet } from "react-native";
import React from "react";
import { TabBarButton } from "./TabBarButton";
import { useToggleHideTab } from "@/store/tab";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useTheme } from "@rneui/themed";

//@ts-ignore
export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { theme } = useTheme();
  const hide = useToggleHideTab((state) => state.hide);
  return (
    <View
      style={[
        styles.tabbar,
        {
          backgroundColor: theme.colors.white,
          display: hide ? "none" : "flex",
          opacity:0.5
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];

        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        if (["_sitemap", "+not-found"].includes(route.name)) return null;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.name}
            badge={options.tabBarBadge}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? theme.colors.primary : theme.colors.grey5}
            //@ts-ignore
            label={label}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabbar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
  },
});
