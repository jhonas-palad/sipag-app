// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
import { Feather, Ionicons } from '@expo/vector-icons';
import { type IconProps } from "@expo/vector-icons/build/createIconSet";
import { type ComponentProps } from "react";

export function Icon({
  style,
  size = 20,
  ...rest
}: IconProps<ComponentProps<typeof Ionicons>["name"]>) {
  return <Ionicons size={size} style={[style]} {...rest} />;
}
