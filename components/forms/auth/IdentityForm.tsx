import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { Input } from "@/components/ui/Input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { SignupSchema } from "@/schemas/auth";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useSignupFormState } from "@/store/create-account-form";
import { useShallow } from "zustand/react/shallow";
import * as zod from "zod";

const IdentityFormSchema = SignupSchema.omit({
  phone_number: true,
  email: true,
  password: true,
  photo: true,
});
type IdentityFormSchemaType = zod.infer<typeof IdentityFormSchema>;
export const IdentityForm = () => {
  const router = useRouter();
  const { setFormState, first_name, last_name } = useSignupFormState(
    useShallow((state) => ({
      setFormState: state.setFormState,
      first_name: state.first_name,
      last_name: state.last_name,
    }))
  );

  const form = useForm<IdentityFormSchemaType>({
    resolver: zodResolver(IdentityFormSchema),
    defaultValues: {
      first_name: first_name,
      last_name: last_name,
    },
  });

  const handleSubmit = useCallback(
    (data: IdentityFormSchemaType) => {
      setFormState({
        first_name: data.first_name,
        last_name: data.last_name,
      });
      router.push("/auth/sign-up/credentials-form");
    },
    [setFormState, router]
  );
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => {
          return (
            <FormItem>
              <View transparent style={styles.inputContainer}>
                <Input
                  {...field}
                  label="First Name"
                  inputContainerStyle={{ alignSelf: "stretch" }}
                  style={{ flex: 1 }}
                  onChangeText={field.onChange}
                  placeholder="Enter Your First Name"
                  ErrorComponent={() => <FormMessage />}
                />
              </View>
            </FormItem>
          );
        }}
      />
      <FormField
        control={form.control}
        name="last_name"
        render={({ field }) => {
          return (
            <FormItem>
              <View transparent style={styles.inputContainer}>
                <Input
                  {...field}
                  label="Last Name"
                  inputContainerStyle={{ alignSelf: "stretch" }}
                  onChangeText={field.onChange}
                  placeholder="Enter Your Last Name"
                  ErrorComponent={() => <FormMessage />}
                />
              </View>
            </FormItem>
          );
        }}
      />
      <Button
        radius="lg"
        size="lg"
        containerStyle={{ marginTop: 16 }}
        buttonStyle={{ borderWidth: 1.5 }}
        onPress={form.handleSubmit(handleSubmit)}
        raised
      >
        Continue
      </Button>
    </Form>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
});
