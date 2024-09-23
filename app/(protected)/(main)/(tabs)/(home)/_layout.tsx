import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@rneui/themed";

const HomeTabLayout = () => {
  const { theme } = useTheme();
  return (
    <>
      <Stack
        screenOptions={{
          headerBackTitleVisible: false,
          headerShown: false,
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTitleStyle: { color: theme.colors.black },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="choose-location"
          options={{ headerShown: true, title: "Create a waste report" }}
        />
        <Stack.Screen
          name="create-waste-report"
          options={{
            headerShown: true,
            headerShadowVisible: false,
            title: "Create Waste Report",
          }}
        />
        <Stack.Screen
          name="finished-task"
          options={{
            headerShown: false,
            headerShadowVisible: false,
          }}
        />
      </Stack>
    </>
  );
};

export default HomeTabLayout;
