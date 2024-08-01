import React from "react";
import { StyleSheet, Image } from "react-native";
import { SignupForm } from "@/components/forms/auth/SignupForm";
import { View } from "@/components/ui/View";
import { Button } from "@/components/ui/Button";
import { Text } from "@rneui/themed";
import { KBDAvodingWrapper } from "./KBDAvodingWrapper";
import { useRouter } from "expo-router";
type Props = {};

const Signup = (props: Props) => {
  const router = useRouter();
  return (
    <KBDAvodingWrapper>
      <View style={{ marginTop: 20 }}>
        <Text h4 style={{ marginBottom: 16 }}>
          Create your account
        </Text>
        <SignupForm />
      </View>
      <Button
        onPress={() => {
          router.dismiss();
        }}
        size="lg"
        type="outline"
        buttonStyle={{ borderWidth: 1.5 }}
        radius="lg"
      >
        Go Back
      </Button>
    </KBDAvodingWrapper>
  );
};

export default Signup;

const styles = StyleSheet.create({
  headingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 36,
  },
  inputContainer: {
    marginBottom: 28,
  },
});
