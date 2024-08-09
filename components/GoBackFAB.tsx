import { FAB, FABProps, useTheme } from "@rneui/themed";
import { useRouter } from "expo-router";
export const GoBackFAB = ({ size = "small", ...props }: FABProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <FAB
      icon={{ name: "arrow-back", color: theme.colors.black }}
      {...props}
      size={size}
      color="transparent"
      containerStyle={{ shadowColor: "transparent" }}
      onPress={() => router.canGoBack() && router.back()}
    />
  );
};
