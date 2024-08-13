import { StyleSheet, ScrollView } from "react-native";
import { View } from "@/components/ui/View";
import { SigninForm } from "@/components/forms/auth/SigninForm";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Text, useTheme } from "@rneui/themed";
import { postData } from "@/lib/fetch";
import { Link } from "expo-router";
import AuthScreenContainer from "./AuthScreenContainer";

type Props = {};

const LoginScreen = (props: Props) => {
  const { theme } = useTheme();
  return (
    <AuthScreenContainer
      style={{ justifyContent: "space-between" }}
      bottomChildren={
        <View transparent>
          <Link href="/auth/(sign-up)" asChild style={{}}>
            <Button
              size="lg"
              type="outline"
              buttonStyle={{ borderWidth: 1.5 }}
              radius="lg"
            >
              Create new account
            </Button>
          </Link>
        </View>
      }
    >
      <SigninForm />
    </AuthScreenContainer>
  );
};

export default LoginScreen;

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
