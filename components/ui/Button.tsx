import { ButtonProps, Button as RNEButton } from "@rneui/base";
import { forwardRef } from "react";
import { useTheme } from "@rneui/themed";

export const Button = forwardRef(({ children, ...props }: ButtonProps, ref) => {
  const { theme } = useTheme();
  return (
    <RNEButton {...props} theme={theme}>
      {children}
    </RNEButton>
  );
});

Button.displayName = "Button";
