import { useMemo, useState } from "react";
import { Text } from "@rneui/themed";
import { Button } from "@/components/ui/Button";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { pickImage as libPickImage } from "@/lib/images/pick-image";
import { useLocalSearchParams } from "expo-router";
import { createUser } from "@/data/users";
import { useSignupFormState } from "@/store/create-account-form";
import { useShallow } from "zustand/react/shallow";
import { Avatar } from "@rneui/themed";
import { useTheme } from "@rneui/themed";
import { useRouter } from "expo-router";
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
    onSuccess(data) {},
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
      <View transparent style={{ alignItems: "center" }}>
        <Avatar
          size={300}
          onPress={pickImage}
          source={image ? { uri: image! } : undefined}
          title={image ? undefined : "JP"}
          containerStyle={{
            borderRadius: 12,
            backgroundColor: theme.colors.grey3,
            overflow: "hidden",
            position: "relative",
            marginBottom: 16,
          }}
          // style={styles.image}
        >
          <View
            style={{
              width: "100%",
              height: 35,
              bottom: 0,
              paddingBottom: 8,
              backgroundColor: theme.colors.grey0,
              opacity: 0.5,
              position: "absolute",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: theme.colors.white }}>Upload Image</Text>
          </View>
        </Avatar>
        <View style={{ gap: 12, alignItems: "center" }}>
          <Text h3 style={{ color: theme.colors.black }}>
            {first_name} {last_name}
          </Text>
          {email && (
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.grey2,
                }}
              >
                Email
              </Text>
              <Text style={{ fontSize: 20, color: theme.colors.grey0 }}>
                {email}
              </Text>
            </View>
          )}
          {phone_number && (
            <View
              style={{ flexDirection: "row", gap: 8, alignItems: "center" }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: theme.colors.grey2,
                }}
              >
                Mobile
              </Text>
              <Text style={{ fontSize: 20, color: theme.colors.grey0 }}>
                {phone_number}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* {error && <Text>{error}</Text>} */}
      <View style={{ gap: 12 }}>
        <Button
          radius="lg"
          size="lg"
          title="Submit"
          raised
          buttonStyle={{ borderWidth: 1.5 }}
          onPress={handleSubmit}
        />

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
