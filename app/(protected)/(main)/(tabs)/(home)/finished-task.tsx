import { ViewSafe } from "@/components/ui/View";
import { Text } from "@rneui/themed";
import { View } from "@/components/ui/View";
import React from "react";
import { useRouter } from "expo-router";
import { Button } from "@/components/ui/Button";
type Props = {};

const FinishTaskScreen = (props: Props) => {
  const router = useRouter();
  return (
    <ViewSafe
      style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
    >
      <View style={{ marginTop: -64, padding: 24 }}>
        <Text h4 style={{ marginBottom: 12 }}>
          Congratulations! You earned 1 point
        </Text>
        <Button onPress={() => router.canGoBack() && router.back()}>
          Back
        </Button>
      </View>
    </ViewSafe>
  );
};

export default FinishTaskScreen;
