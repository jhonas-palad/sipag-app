import React from "react";
import { StyleSheet, Image, View } from "react-native";
import { LinkButton } from "@/components/ui/Button";
import { ThemedText } from "@/components/ThemedText";
import { SignupForm } from "@/components/forms/auth/SignupForm";

import { COLOR_PALLETE } from "@/config/colors";
type Props = {};

const Signup = (props: Props) => {
  return (
    <View
      style={{
        flex: 1,
        paddingTop: 100,
        paddingHorizontal: 24,
        paddingBottom: 32,
      }}
    >
      <View>
        <SignupForm />
      </View>
    </View>
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
