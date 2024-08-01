import React from "react";
import { SafeAreaView } from "react-native";

import { Stack } from "expo-router";
const AuthLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(sign-up)" />
      </Stack>
    </SafeAreaView>
  );
};

export default AuthLayout;
