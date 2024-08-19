import { useMemo, useState } from "react";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { usePickImage } from "@/lib/images/pick-image";
import { createUser } from "@/data/users";
import { useSignupFormState } from "@/store/create-account-form";
import { useShallow } from "zustand/react/shallow";
import { Avatar } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { useRouter } from "expo-router";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import UploadPhotoForm from "@/components/forms/auth/UploadPhotoForm";
export default function ImagePickerExample() {
  const router = useRouter();
  const { theme } = useTheme();
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password,
    photo,
    setFormState,
  } = useSignupFormState(
    useShallow((state) => ({
      first_name: state.first_name,
      last_name: state.last_name,
      email: state.email,
      phone_number: state.phone_number,
      password: state.password,
      photo: state.photo,
      setFormState: state.setFormState,
    }))
  );

  return (
    <View style={styles.container}>
      <UploadPhotoForm />
      <View style={{ gap: 12 }}>
        <Button
          onPress={() => {
            router.dismiss();
          }}
          size="lg"
          type="outline"
          buttonStyle={{ borderWidth: 1.5 }}
          radius="lg"
        >
          Go back
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingBottom: 32,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  image: {
    width: 200,
    height: 200,
  },
});
