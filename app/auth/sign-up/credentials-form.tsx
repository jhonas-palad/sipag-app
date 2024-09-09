import React from "react";
import { CredentialsForm } from "@/components/forms/auth/CredentialsForm";
import { View } from "@/components/ui/View";
import { Text } from "@rneui/themed";
import AuthScreenContainer from "../AuthScreenContainer";
type Props = {};

const CredentialsFormScreen = (props: Props) => {
  return (
    <AuthScreenContainer style={{ justifyContent: "center" }}>
      <View transparent style={{ marginBottom: 12 }}>
        <View transparent style={{ marginTop: 12, paddingTop: 24 }}>
          <Text h4 style={{ marginBottom: 16 }}>
            Create your account
          </Text>
        </View>
        <CredentialsForm />
      </View>
    </AuthScreenContainer>
  );
};

export default CredentialsFormScreen;
