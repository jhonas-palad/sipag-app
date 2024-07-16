import { StyleSheet, Image, View, SafeAreaView } from "react-native";
import { LinkButton } from "@/components/ui/Button";
import { ThemedText } from "@/components/ThemedText";
import { SigninForm } from "@/components/forms/auth/SigninForm";
import React from "react";
import { KeyboardAvoidingWrapper } from "@/components/KeyboardAvoidingWrapper";
import { COLOR_PALLETE } from "@/config/colors";
type Props = {};

const LoginScreen = (props: Props) => {
  return (
    <View
      style={{
        justifyContent: "space-between",
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 24,
        paddingBottom: 32
      }}
    >
      <View>
        <View style={styles.headingContainer}>
          <Image
            style={{ height: 150, width: 150 }}
            source={require("@/assets/images/sipag-logo.png")}
          />
          <ThemedText type="default">Sign in to your account</ThemedText>
        </View>
        <View style={{}}>
          <SigninForm />
          <LinkButton variant="link" href="/" style={{}}>
            <ThemedText
              style={{ color: "gray", textAlign: "center" }}
              type="defaultSemiBold"
            >
              Forgot password?
            </ThemedText>
          </LinkButton>
        </View>
      </View>
      <View>
        <LinkButton variant="outline" href="/auth/signup" style={{}}>
          <ThemedText
            style={{ color: COLOR_PALLETE.primary, textAlign: "center" }}
            type="defaultSemiBold"
          >
            Create new account
          </ThemedText>
        </LinkButton>
      </View>
    </View>
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
