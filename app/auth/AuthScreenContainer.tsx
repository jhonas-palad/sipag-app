import { ScrollView, ViewProps } from "react-native";
import { View } from "@/components/ui/View";
import React from "react";

type Props = {};

const AuthScreenContainer = ({
  children,
  bottomChildren,
  style,
}: React.PropsWithChildren & {
  style?: ViewProps["style"];
  bottomChildren?: React.ReactNode;
}) => {
  return (
    <View
      style={[
        {
          flex: 1,
          paddingVertical: 24,

          paddingHorizontal: 24,
        },
        style,
      ]}
    >
      <ScrollView
        contentContainerStyle={{
          flex: 1,
        }}
      >
        {children}
      </ScrollView>
      {bottomChildren}
    </View>
  );
};

export default AuthScreenContainer;
