import { View, Pressable, StyleSheet } from "react-native";
import { Badge, Icon } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import React from "react";
import { type BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";

export const icons = (route: string, color: string) => {
  let name: string = "";
  switch (route) {
    case "(home)":
      name = "location-pin";
      break;
    case "activities":
      name = "local-activity";
      break;
    case "announcements":
      name = "campaign";
      break;
  }
  return <Icon name={name} color={color} size={24} />;
};

type TabBarButtonProps = {
  isFocused: boolean;
  label: string | React.ReactNode;
  routeName: string;
  color: string;
  badge: string | undefined | number;
} & BottomTabBarButtonProps;

export const TabBarButton = ({
  isFocused,
  label,
  routeName,
  color,
  badge,
  ...props
}: TabBarButtonProps) => {
  const { theme } = useTheme();
  return (
    <Pressable {...props} style={styles.container}>
      <View>
        {badge && (
          <Badge
            value={badge}
            containerStyle={{
              position: "absolute",
              right: -20,
              backgroundColor: theme.colors.white,
              padding:2,
              zIndex:5,
              borderRadius: 32
            }}
            status="error"
          />
        )}
        {icons(routeName as "(home)" | "activities" | "announcements", color)}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
});
