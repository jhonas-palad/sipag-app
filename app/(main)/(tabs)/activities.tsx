import { View } from "react-native";
import React from "react";
import { Button } from "@rneui/themed";
import { useThemeMode } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
type Props = {};

const activities = (props: Props) => {
  const { mode, setMode } = useThemeMode();
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, padding: 50, backgroundColor: "red" }}>
      <Button
        type="solid"
        color="secondary"
        onPress={() => setMode(mode === "dark" ? "light" : "dark")}
        title={mode}
      />
    </View>
  );
};

export default activities;
