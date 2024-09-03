import React from "react";
import { IdentityForm } from "@/components/forms/auth/IdentityForm";
import { View } from "@/components/ui/View";
import { Text } from "@rneui/themed";
import AuthScreenContainer from "../AuthScreenContainer";
type Props = {};

const IdentityFormScreen = (props: Props) => {
  return (
    <AuthScreenContainer
      style={{
        justifyContent: "center",
      }}
    >
      <View transparent style={{ marginBottom: 12 }}>
        <View transparent style={{ marginTop: 12 }}>
          <Text h4 style={{ marginBottom: 16 }}>
            Let's get started
          </Text>
        </View>
        <IdentityForm />
      </View>
    </AuthScreenContainer>
  );
};

export default IdentityFormScreen;
