import { View, ViewSafe } from "@/components/ui/View";
import { Text, useTheme } from "@rneui/themed";
import { Image } from "expo-image";
import { FAB } from "@/components/ui/FAB";
import React   from "react";
import { useRouter } from "expo-router";
import { useSetOnboardingFlag } from "@/hooks/useGetOnboardingFlag";
type Props = {};

const OnboardingIndex = (props: Props) => {
  const { theme } = useTheme();
  const { mutate } = useSetOnboardingFlag({
    onSuccess() {
      router.replace("/auth/");
    },
  });
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
      {/* <Text h1 style={{ color: theme.colors.primary }}>
        S.I.P.A.G
        
      </Text> */}
      <View transparent style={{ marginHorizontal: 32 }}>
        <Text h2 style={{ textAlign: "center" }}>
          Join us, and be the reason why Brgy San Benito is the place to live!!!
        </Text>
      </View>
      <View transparent style={{ flexDirection: "row", gap: 20 }}>
        <FAB
          title="Back"
          onPress={() => router.back()}
          style={{ marginTop: 32 }}
          titleStyle={{ color: theme.colors.primary }}
        />
        <FAB
          // icon={{ name: "arrow-forward-ios", size: 24 }}
          title="Done"
          onPress={() => mutate("false")}
          style={{ marginTop: 32 }}
          titleStyle={{ color: theme.colors.primary }}
        />
      </View>
    </ViewSafe>
  );
};

export default OnboardingIndex;
