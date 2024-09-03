import { Text as RNEText, TextProps } from "@rneui/themed";
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
