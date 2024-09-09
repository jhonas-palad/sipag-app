import { View, ViewSafe } from "@/components/ui/View";
import { Text, useTheme } from "@rneui/themed";
import { Image } from "expo-image";
import { FAB } from "@/components/ui/FAB";
import React from "react";
import { useRouter } from "expo-router";

type Props = {};

const OnboardingIndex = (props: Props) => {
  const { theme } = useTheme();
  const router = useRouter();
  return (
    <ViewSafe
      transparent
      style={{
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View transparent style={{ marginTop: 100 }}>
        <Image
          source={require("@/assets/images/sipag-logo.png")}
          style={{ width: 100, height: 100 }}
        />
      </View>
      <Text h1 style={{ color: theme.colors.primary }}>
        S.I.P.A.G
      </Text>
      <Text h4 style={{ textAlign: "center" }}>
        Support Initiative of People Action in Government
      </Text>
      <FAB
        title="Continue"
        onPress={() => {
          router.push("/onboarding-b");
        }}
        style={{ marginTop: 32 }}
        titleStyle={{ color: theme.colors.primary }}
      />
    </ViewSafe>
  );
};

export default OnboardingIndex;
