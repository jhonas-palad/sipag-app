import {
  StyleSheet,
  Image,
  View,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SigninForm } from "@/components/forms/auth/SigninForm";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Text, useTheme } from "@rneui/themed";
import { COLOR_PALLETE } from "@/config/colors";
import { Link } from "expo-router";
type Props = {};

const LoginScreen = (props: Props) => {
  const { theme } = useTheme();
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: "space-between",
        paddingTop: 50,
        paddingHorizontal: 24,
        paddingBottom: 32,
        backgroundColor: theme.colors.background,
      }}
    >
      <View>
        <View style={styles.headingContainer}>
          {/* <Image
            style={{ height: 100, width: 100 }}
            source={require("@/assets/images/sipag-logo.png")}
          /> */}
          <Text h4>Sign in to your account</Text>
        </View>
        <SigninForm />
      </View>
      <View>
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
    </KeyboardAvoidingView>
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
