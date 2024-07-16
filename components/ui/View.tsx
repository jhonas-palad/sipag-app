import { View as RNVIew, ViewProps } from "react-native";
import { useTheme } from "@rneui/themed";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const View = ({
  transparent = false,
  style,
  ...props
}: ViewProps & { transparent?: boolean }) => {
  const { theme } = useTheme();
  console.log(transparent);
  return (
    <RNVIew
      style={[
        {
          backgroundColor: transparent
            ? "transparent"
            : theme.colors.background,
        },
        style && style,
      ]}
      {...props}
    />
  );
};

export const BottomView = ({ style, children, ...props }: ViewProps) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  return (
    <View
      style={[
        {
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderColor: theme.colors.greyOutline,
          borderTopWidth: 0.2,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: bottom + 20,
          shadowColor: "#000",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};
