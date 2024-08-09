import React from "react";
import { SafeAreaView } from "react-native";

import { Stack } from "expo-router";
const AuthLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{ headerTitle: "Sign in", headerTitleAlign: "center" }}
        />
        <Stack.Screen name="(sign-up)" options={{ headerShown: false }} />
      </Stack>
    </SafeAreaView>
  );
};

export default AuthLayout;
