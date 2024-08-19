import { View } from "@/components/ui/View";
import React from "react";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { useForm } from "react-hook-form";
import { Avatar, useTheme, Text, Button } from "@rneui/themed";
import { usePickImage } from "@/lib/images/pick-image";
import { useSignupFormState } from "@/store/create-account-form";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "expo-router";
import { createUser } from "@/data/users";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
type Props = {};
const UploadPhotoSchema = zod.object({
  photo: zod
    .string()
    .nullish()
    .refine(
      (url) => {
        return url !== undefined || url !== null;
      },
      { message: "Please upload an image" }
    ),
});
export type UploadPhotoSchemaT = zod.infer<typeof UploadPhotoSchema>;
const UploadPhotoForm = (props: Props) => {
  const { first_name, last_name, email, phone_number, password, photo, reset } =
    useSignupFormState(
      useShallow((state) => ({
        first_name: state.first_name,
        last_name: state.last_name,
        email: state.email,
        phone_number: state.phone_number,
        password: state.password,
        photo: state.photo,
        reset: state.reset,
      }))
    );
  const form = useForm<UploadPhotoSchemaT>({
    resolver: zodResolver(UploadPhotoSchema),
    defaultValues: {
      photo: null,
    },
  });
  const { theme } = useTheme();
  const router = useRouter();
  const { mutate } = createUser({
    async onError(error) {
      console.log("error", error);
    },
    onSuccess(data) {
      router.replace("/auth");
      reset();
    },
  });
  const handleSubmit = async () => {
    mutate({
      first_name,
      last_name,
      email,
      phone_number,
      photo: {
        url: imageData?.uri!,
        fileName: imageData?.fileName as string,
        mimeType: imageData?.mimeType as string,
      },
      password,
    });
  };

  const { mutateAsync: pickImage, data: imageData } = usePickImage({
    onError(error) {
      console.log(error);
      form.setError("photo", { message: "Please choose an image" });
    },
    onSuccess(data) {
      form.setValue("photo", data.uri);
    },
  });
  return (
    <Form {...form}>
      <View transparent style={{ alignItems: "center" }}>
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => {
            return (
              <FormItem>
                <FormMessage />
                <Avatar
                  size={300}
                  onPress={pickImage}
                  source={imageData ? { uri: imageData?.uri! } : undefined}
                  title={imageData ? undefined : "--"}
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
                    <Text style={{ color: theme.colors.white }}>
                      {imageData ? "Change" : "Upload"} Image
                    </Text>
                  </View>
                </Avatar>
              </FormItem>
            );
          }}
        />
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

      <Button
        radius="lg"
        size="lg"
        title="Submit"
        raised
        buttonStyle={{ borderWidth: 1.5 }}
        onPress={form.handleSubmit(handleSubmit)}
      />
    </Form>
  );
};

export default UploadPhotoForm;
