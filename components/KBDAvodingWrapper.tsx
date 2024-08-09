import {
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableWithoutFeedbackProps,
} from "react-native";
import React from "react";
import { useTheme } from "@rneui/themed";
type Props = {
  style?: TouchableWithoutFeedbackProps["style"];
} & React.PropsWithChildren;

export const KBDAvodingWrapper = ({ children, style, ...props }: Props) => {
  const { theme } = useTheme();
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "height" : "padding"}
      keyboardVerticalOffset={50}
    >
      <TouchableWithoutFeedback
        onPress={Keyboard.dismiss}
        style={[
          {
            // flex: 1,
            // justifyContent: "space-between",
            // paddingTop: 50,
            // paddingHorizontal: 24,
            // paddingBottom: 32,
            backgroundColor: theme.colors.background,
          },
          style,
        ]}
      >
        {children}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};
