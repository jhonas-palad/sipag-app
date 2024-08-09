import React from "react";
import { StyleSheet, Image } from "react-native";
import { CredentialsForm } from "@/components/forms/auth/CredentialsForm";
import { View } from "@/components/ui/View";
import { Button } from "@/components/ui/Button";
import { Text } from "@rneui/themed";
import { KBDAvodingWrapper } from "@/components/KBDAvodingWrapper";
import { useRouter } from "expo-router";
import AuthScreenContainer from "../AuthScreenContainer";
type Props = {};

const CredentialsFormScreen = (props: Props) => {
  const router = useRouter();
  return (
    <AuthScreenContainer
      style={{ justifyContent: "center" }}
      bottomChildren={
        <View transparent>
          <Button
            onPress={() => {
              router.replace("/auth");
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
          Create your account
        </Text>
      </View>
      <CredentialsForm />
    </AuthScreenContainer>
  );
};

export default CredentialsFormScreen;
