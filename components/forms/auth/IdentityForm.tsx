import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { Input } from "@/components/ui/Input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { SignupSchema, type SignupFormSchemaType } from "@/schemas/auth";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, router, useRouter } from "expo-router";
import { useSignupFormState } from "@/store/create-account-form";
import { useShallow } from "zustand/react/shallow";
import { signUpUser } from "@/data/auth";
import { NON_FIELD_ERROR, ERR_DETAIL } from "@/constants/response-props";
import { ErrorDialog } from "./ErrorDialog";
import * as zod from "zod";

type Props = {};

const IdentityFormSchema = SignupSchema.omit({
  phone_number: true,
  email: true,
  password: true,
  photo: true,
});
type IdentityFormSchemaType = zod.infer<typeof IdentityFormSchema>;
export const IdentityForm = (props: Props) => {
  const router = useRouter();
  const { getFormState, setFormState, first_name, last_name } =
    useSignupFormState(
      useShallow((state) => ({
        getFormState: state.getFormState,
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
      console.log(data);
      setFormState({
        first_name: data.first_name,
        last_name: data.last_name,
      });
      router.push("/auth/(sign-up)/credentials-form");
    },
    [setFormState]
  );
  return (
    <Form {...form}>
      {form.formState.errors.root?.message && (
        <ErrorDialog
          title="Signup Failed"
          description={form.formState.errors.root?.message}
        />
      )}

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
