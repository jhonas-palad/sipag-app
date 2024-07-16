import { Slot } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Pressable,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Keyboard,
  SafeAreaView,
} from "react-native";

import { Stack } from "expo-router";
const AuthLayout = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="signup"
          options={{
            title: "Create an account",
            headerTransparent: true,
          }}
        />
        <Stack.Screen
          name="upload-image"
          options={{
            title: "Upload an image",
            headerTransparent: true,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
});

export default AuthLayout;
