import { Button } from "@/components/ui/Button";
import { ViewSafe, View } from "@/components/ui/View";
import { Text, useTheme } from "@rneui/themed";
import { Link } from "expo-router";
import React from "react";

type Props = {};

const NotVerified = (props: Props) => {
  const { theme } = useTheme();
  return (
    <ViewSafe style={{ flex: 1, justifyContent: "center" }}>
      <View
        transparent
        style={{
          paddingHorizontal: 24,
          marginTop: -24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text h3 style={{ textAlign: "center" }}>
          Welcome user!
        </Text>
        <Text style={{ textAlign: "center", fontSize: 16 }}>
          This account should be verified first by the admin. It will take a few
          days to verify your account.
        </Text>

        <Link
          href="/"
          style={{
            marginTop: 12,
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.spacing.md,
            color: "white",
          }}
        >
          Refresh
        </Link>
      </View>
    </ViewSafe>
  );
};

export default NotVerified;
