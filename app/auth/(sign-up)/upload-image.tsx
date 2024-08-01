import { useMemo, useState } from "react";
import { Text } from "@rneui/themed";
import { Button } from "@/components/ui/Button";
import { Image, View, StyleSheet } from "react-native";
import { pickImage as libPickImage } from "@/lib/images/pick-image";
import { useLocalSearchParams } from "expo-router";
import { createUser } from "@/data/users";
import { useSignupFormState } from "@/store/create-account-form";
import { useShallow } from "zustand/react/shallow";
import { type UploadPhotoParams } from "@/data/users";
export default function ImagePickerExample() {
  const params = useLocalSearchParams();
  const {
    first_name,
    last_name,
    email,
    phone_number,
    password,
    photo,
    setFormState,
    getFields,
  } = useSignupFormState(
    useShallow((state) => ({
      first_name: state.first_name,
      last_name: state.last_name,
      email: state.email,
      phone_number: state.phone_number,
      password: state.password,
      photo: state.photo,
      setFormState: state.setFormState,
      getFields: state.getFields(),
    }))
  );
  const [image, setImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const res = await libPickImage();
    if (res?.error) {
      setError(res.error);
    }
    if (res?.result) {
      setImage(res.result.uri);
      setFormState({
        photo: {
          url: res.result.uri,
        },
      });
    }
  };

  const { mutateAsync, data } = createUser({
    async onError(error) {
      console.log("erro", error.errors);
    },
    onSuccess(data) {
      console.log(data);
    },
  });
  const handleSubmit = async () => {
    mutateAsync({
      first_name,
      last_name,
      email,
      phone_number,
      photo,
      password,
    });
  };
  return (
    <View style={styles.container}>
      <Text h4>
        {first_name} {last_name}
      </Text>

      {error && <Text>{error}</Text>}
      {image && (
        <Image
          source={{ uri: image }}
          width={200}
          height={200}
          style={styles.image}
        />
      )}
      <Button title="Pick an image from camera roll" onPress={pickImage} />

      <Button
        title="Submit"
        onPress={handleSubmit}
        buttonStyle={{ marginTop: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    paddingHorizontal: 24,
  },
  image: {
    width: 200,
    height: 200,
  },
});
