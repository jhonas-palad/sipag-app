import React from "react";
import { IdentityForm } from "@/components/forms/auth/IdentityForm";
import { View } from "@/components/ui/View";
import { Text } from "@rneui/themed";
import { KBDAvodingWrapper } from "./KBDAvodingWrapper";
import { Link } from "expo-router";
import { Button } from "@/components/ui/Button";
import { useRouter } from "expo-router";
type Props = {};

const IdentityFormScreen = (props: Props) => {
  const router = useRouter();
  return (
    <KBDAvodingWrapper>
      <View style={{ marginTop: 20 }}>
        <Text h4 style={{ marginBottom: 16 }}>
          Let's get started
        </Text>
        <IdentityForm />
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
        Sign in
      </Button>
    </KBDAvodingWrapper>
  );
};

export default IdentityFormScreen;
