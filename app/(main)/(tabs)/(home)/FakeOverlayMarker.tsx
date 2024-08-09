import { memo } from "react";
import { View } from "@/components/ui/View";
import { Icon, useTheme } from "@rneui/themed";
import { StyleSheet } from "react-native";

export const FakeOverlayMarker = memo(({ show }: { show: boolean }) => {
  const { theme } = useTheme();
  if (!show) return null;
  return (
    <View transparent style={styles.fakeMarker}>
      <Icon name="location-pin" color={theme.colors.error} size={60} />
    </View>
  );
});

const styles = StyleSheet.create({
  fakeMarker: {
    zIndex: 50,
    position: "absolute",
    marginTop: -60,
    marginLeft: -30,
    left: "50%",
    top: "50%",
    // borderWidth: 1,
  },
  fakeMarkerImage: {
    // borderWidth: 1,
    width: 40,
    height: 40,
  },
});
