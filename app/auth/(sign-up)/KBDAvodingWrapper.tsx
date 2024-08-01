import { KeyboardAvoidingView } from "react-native";
import React from "react";
import { useTheme } from "@rneui/themed";

type Props = {} & React.PropsWithChildren;

export const KBDAvodingWrapper = ({ children, ...props }: Props) => {
  const { theme } = useTheme();
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: "space-between",
        paddingTop: 50,
        paddingHorizontal: 24,
        paddingBottom: 32,
        backgroundColor: theme.colors.background,
      }}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
