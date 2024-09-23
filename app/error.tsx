import { View } from "@/components/ui/View";
import { Text } from "@rneui/themed";
import { Link } from "expo-router";
import React from "react";

type Props = {};

const error = (props: Props) => {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>error</Text>
      <Link href="/">Reload</Link>
    </View>
  );
};

export default error;
