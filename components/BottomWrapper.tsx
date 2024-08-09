import { StyleSheet, ViewProps } from "react-native";
import { View } from "@/components/ui/View";
import { useTheme } from "@rneui/themed";
import React from "react";

type Props = {} & ViewProps;

export const BottomWrapper = ({ style, children, ...props }: Props) => {
  const { theme } = useTheme();
  return (
    <View
      transparent
      style={[
        styles.wrapper,
        {
          borderColor: theme.colors.greyOutline,
          paddingVertical: theme.spacing.md,
          paddingHorizontal: theme.spacing.lg,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderTopWidth: 0.2,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f6f6f6",
  },
});
