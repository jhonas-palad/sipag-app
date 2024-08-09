import { ButtonProps, Button as RNEButton } from "@rneui/base";
import { forwardRef } from "react";
import { useTheme } from "@rneui/themed";

export const Button = forwardRef(
  ({ children, buttonStyle, ...props }: ButtonProps, ref) => {
    const { theme } = useTheme();
    return (
      <RNEButton
        size="lg"
        radius="lg"
        buttonStyle={[
          { borderWidth: props.type === "clear" ? 0 : 1.5 },
          buttonStyle,
        ]}
        {...props}
        theme={theme}
      >
        {children}
      </RNEButton>
    );
  }
);

Button.displayName = "Button";
