import { View, ActivityIndicator } from "react-native";
import { Text } from "@rneui/themed";
import React from "react";

type Props = {
  messageText?: string;
};

export const LoadingScreen = ({ messageText }: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator />
      <Text>{messageText}</Text>
    </View>
  );
};
