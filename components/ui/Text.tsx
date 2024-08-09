import { Text as RNEText, TextProps } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { StyleSheet } from "react-native";
import React from "react";

type Props = {
  size?: "sm" | "md" | "lg";
} & TextProps;

export const Text = ({ children, ...props }: Props) => {
  return (
    <RNEText h4Style={{}} {...props}>
      {children}
    </RNEText>
  );
};

const styles = StyleSheet.create({
  sm: {
    fontSize: 16,
  },
  md: {
    fontSize: 20,
  },
  lg: {
    fontSize: 24,
  },
});
