import { View as RNVIew, ViewProps } from "react-native";
import { useTheme } from "@rneui/themed";
import React, { ReactElement } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ViewC = ({
  transparent = false,
  style,
  ...props
}: ViewProps & { transparent?: boolean }) => {
  const { theme } = useTheme();
  return (
    <RNVIew
      style={[
        {
          backgroundColor: transparent
            ? "transparent"
            : theme.colors.background,
        },
        style && style,
      ]}
      {...props}
    />
  );
};

export const BottomView = ({ style, children, ...props }: ViewProps) => {
  const { bottom } = useSafeAreaInsets();
  const { theme } = useTheme();
  return (
    <View
      transparent
      style={[
        {
          position: "absolute",
          bottom: 0,
          width: "100%",
          borderColor: theme.colors.greyOutline,
          borderTopWidth: 0.2,
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: bottom + 20,
          shadowColor: "#000",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const withSafeAreaInsets = (
  withSafeInsets: boolean,
  Element: (props: ViewProps) => React.JSX.Element
) => {
  const Handler = ({ ...props }) => {
    const insets = useSafeAreaInsets();

    if (!withSafeInsets) {
      return <Element {...props} />;
    }
    return (
      <Element
        {...props}
        style={{
          marginBottom: insets.bottom + (props?.style?.marginBottom ?? 0),
          marginTop: insets.top + (props?.style?.marginTop ?? 0),
          ...props.style,
        }}
      />
    );
  };

  return Handler;
};

export const View = withSafeAreaInsets(false, ViewC);
export const ViewSafe = withSafeAreaInsets(true, ViewC);
