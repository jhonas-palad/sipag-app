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
    <>
      <ViewSafe
        style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
      >
        <View transparent style={{ marginTop: -64, padding: 24 }}>
          <View transparent style={{marginBottom: 20}}>
            <Text h2 style={{ textAlign: "center" }}>
              Congratulations!
            </Text>
            <Text
              style={{ textAlign: "center", fontSize: 24,  }}
            >
              You earned 1 point
            </Text>
          </View>
          <Button
            containerStyle={{ zIndex: 50 }}
            onPress={() => router.canGoBack() && router.back()}
          >
            Back
          </Button>
        </View>
      </ViewSafe>
    </>
  );
};

export default FinishTaskScreen;
