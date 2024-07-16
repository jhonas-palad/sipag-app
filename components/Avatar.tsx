import { Pressable, PressableProps, Text } from "react-native";
import React from "react";
import { Image, ImageProps } from "expo-image";

type Props = { source: ImageProps["source"]; size?: number } & PressableProps;

export const Avatar = ({ style, source, size = 30, ...props }: Props) => {
  return (
    <Pressable style={style} {...props}>
      <Image
        style={{
          height: size,
          width: size,
          borderRadius: 50,
        }}
        source={source}
      />
    </Pressable>
  );
};
