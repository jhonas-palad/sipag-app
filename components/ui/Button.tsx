import React, { useState } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  type ViewProps,
  type PressableProps,
} from "react-native";
import { Link } from "expo-router";
import { LinkProps } from "expo-router/build/link/Link";
import { COLOR_PALLETE } from "@/config/colors";

type ButtonProps = { variant: "link" | "primary" | "outline" };
type LinkButtonProps = ButtonProps & Omit<LinkProps, "asChild">;

export const LinkButton = ({
  children,
  style,
  variant = "primary",
  ...props
}: LinkButtonProps) => {
  const [pressed, setPressed] = useState(false);
  return (
    <Link
      {...props}
      style={[
        buttonStyles.base,
        pressed && buttonStyles.pressed,
        variant === "primary" && buttonStyles.primary,
        variant === "link" && buttonStyles.link,
        variant === "outline" && buttonStyles.outline,
        style,
      ]}
      onPressOut={() => setPressed(false)}
      onPressIn={() => setPressed(true)}
      asChild
    >
      <Pressable>{children}</Pressable>
    </Link>
  );
};

export const Button = ({
  style,
  variant = "primary",
  ...props
}: ButtonProps & PressableProps & Pick<ViewProps, "style">) => {
  return (
    <Pressable
      style={({ pressed }) => [
        buttonStyles.base,
        buttonStyles?.[variant],
        variant !== "link" && buttonStyles.shadow,
        pressed && buttonStyles.pressed,
        style,
      ]}
      {...props}
    />
  );
};

const buttonStyles = StyleSheet.create({
  base: {
    padding: 12,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  primary: {
    backgroundColor: COLOR_PALLETE.primary,
  },
  link: {
    backgroundColor: "transparent",
  },
  outline: {
    borderWidth: 2,
    borderColor: COLOR_PALLETE.primary,
  },
  pressed: {
    opacity: 0.8,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,

    elevation: 3,
  },
});
