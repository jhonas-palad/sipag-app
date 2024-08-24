import React from "react";
import { IdentityForm } from "@/components/forms/auth/IdentityForm";
import { View } from "@/components/ui/View";
import { Text } from "@rneui/themed";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
import AuthScreenContainer from "../AuthScreenContainer";
type Props = {};

const IdentityFormScreen = (props: Props) => {
  const router = useRouter();
  return (
    <AuthScreenContainer
      style={{ justifyContent: "center" }}
      bottomChildren={
        <View transparent>
          <Button
            onPress={() => {
              router.dismiss();
            }}
            size="lg"
            type="outline"
            buttonStyle={{ borderWidth: 1.5 }}
            radius="lg"
          >
            Sign in
          </Button>
        </View>
      }
    >
      <View style={{ marginTop: 12 }}>
        <Text h4 style={{ marginBottom: 16 }}>
          Let's get started
        </Text>
      </View>
      <IdentityForm />
    </AuthScreenContainer>
  );
};

export default IdentityFormScreen;
