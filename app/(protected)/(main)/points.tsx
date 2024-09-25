import { ViewSafe } from "@/components/ui/View";
import React from "react";
import { useNavigation } from "expo-router";
import { Button } from "@rneui/themed";
type Props = {};

const Points = (props: Props) => {
  const navigation = useNavigation();

  return (
    <ViewSafe
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Button
        title="Go back"
        onPress={() => {
          navigation.canGoBack() && navigation.goBack();
        }}
      />
    </ViewSafe>
  );
};

export default Points;
