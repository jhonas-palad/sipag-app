import { ScrollView, ViewProps } from "react-native";
import { View } from "@/components/ui/View";
import React from "react";

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
      transparent
      style={[
        {
          flex: 1,
        },
        style,
      ]}
    >
      <ScrollView
        style={{
          paddingHorizontal: 24,
        }}
      >
        <View transparent style={{ marginBottom: 12 }}>
          {children}
        </View>
      </ScrollView>
      {bottomChildren && (
        <View transparent style={{ paddingHorizontal: 24, paddingBottom: 12 }}>
          {bottomChildren}
        </View>
      )}
    </View>
  );
};

export default AuthScreenContainer;
