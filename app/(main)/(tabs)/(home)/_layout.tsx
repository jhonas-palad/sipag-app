import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import { LinkButton } from "@/components/ui/Button";
type Props = {};

const HomeTabLayout = (props: Props) => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="create-post" options={{ headerShown: true }}>
        </Stack.Screen>
      </Stack>
    </>
  );
};

export default HomeTabLayout;
