import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingViewProps,
  PressableProps,
  ViewProps,
} from "react-native";
import React from "react";

type Props = React.PropsWithChildren;

export const KeyboardAvoidingWrapper = ({
  children,
  style,
}: Props & Pick<ViewProps, "style">) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container]}
    >
      <Pressable
        style={(_) => [{ flex: 1 }, style]}
        onPress={() => Keyboard.dismiss()}
      >
        {children}
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
