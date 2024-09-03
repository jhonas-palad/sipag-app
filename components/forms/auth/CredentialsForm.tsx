import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "@/components/ui/View";
import { Input } from "@/components/ui/Input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { useForm } from "react-hook-form";
import { SignupSchema, type SignupFormSchemaType } from "@/schemas/auth";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignupFormState } from "@/store/create-account-form";
import { useShallow } from "zustand/react/shallow";
import { useValidateCredentials } from "@/data/auth";
import { NON_FIELD_ERROR, ERR_DETAIL } from "@/constants/response-props";
import { ResponseError } from "@/errors/response-error";
import Toast from "react-native-simple-toast";
import { useRouter } from "expo-router";
type Props = {};

export const CredentialsForm = (props: Props) => {
  const [using, setUsing] = useState<"email" | "phone_number">("phone_number");
  const router = useRouter();
  const { setFormState, phone_number, email, password } = useSignupFormState(
    useShallow((state) => ({
      getFormState: state.getFormState,
      setFormState: state.setFormState,
      phone_number: state.phone_number,
      email: state.email,
      password: state.password,
    }))
  );
  const resolver = useMemo(() => {
    if (using === "email") {
      return SignupSchema.omit({
        first_name: true,
        last_name: true,
        phone_number: true,
        photo: true,
      });
    }
    return SignupSchema.omit({
      first_name: true,
      last_name: true,
      email: true,
      photo: true,
    });
  }, [using]);
  const form = useForm<SignupFormSchemaType>({
    resolver: zodResolver(resolver),
    defaultValues: {
      password: password,
      email: email,
      phone_number: phone_number,
    },
  });

  const { mutateAsync, status } = useValidateCredentials({
    async onError(error, variables, context) {
      if (error instanceof ResponseError) {
        const errors = error.errors;
        if (NON_FIELD_ERROR in errors!) {
          form.setError(using, { message: errors?.[NON_FIELD_ERROR] });
        }
        if (ERR_DETAIL in errors!) {
          form.setError("root", { message: errors?.[ERR_DETAIL] });
        }
        Object.keys(errors!).forEach((err_field: string) => {
          form.setError(err_field as keyof SignupFormSchemaType, {
            message: errors?.[err_field],
          });
        });
        return;
      }
      Toast.showWithGravityAndOffset(
        (error as Error)?.message as string,
        Toast.LONG,
        1,
        Toast.TOP,
        Toast.TOP
      );
      form.setError("root", { message: (error as Error)?.message as string });
    },
    async onSuccess(response_data) {
      const formValues = form.getValues();
      const { data } = response_data;
      setFormState({
        ...data,
        password: formValues["password"],
      });
      router.push("/auth/(sign-up)/upload-image");
    },
  });

  const handleSubmit = useCallback(
    async (data: SignupFormSchemaType) => {
      await mutateAsync(data);
    },
    [mutateAsync]
  );

  useEffect(() => {
    form.resetField(using);
    return () => {
      setFormState({ [using]: "" });
    };
  }, [using, form, setFormState]);

  return (
    <Form {...form}>
      {using === "phone_number" ? (
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => {
            return (
              <FormItem>
                <View transparent style={styles.inputContainer}>
                  <Input
                    {...field}
                    label="Phone number"
                    onChangeText={field.onChange}
                    keyboardType="decimal-pad"
                    placeholder="Enter a Phone number"
                    ErrorComponent={() => <FormMessage />}
                  />
                </View>
              </FormItem>
            );
          }}
        />
      ) : (
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <View transparent style={styles.inputContainer}>
                  <Input
                    {...field}
                    label="Email"
                    onChangeText={field.onChange}
                    keyboardType="email-address"
                    placeholder="Enter an Email"
                    ErrorComponent={() => <FormMessage />}
                  />
                </View>
              </FormItem>
            );
          }}
        />
      )}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <View transparent style={styles.inputContainer}>
              <Input
                label="Password"
                {...field}
                onChangeText={field.onChange}
                placeholder="Enter a Password"
                secureTextEntry
                ErrorComponent={() => <FormMessage />}
              />
            </View>
          </FormItem>
        )}
      />
      <Button
        type="clear"
        radius="lg"
        onPress={() =>
          setUsing((prev) => (prev === "email" ? "phone_number" : "email"))
        }
        containerStyle={{ alignSelf: "center", marginBottom: 12 }}
      >
        Use {using === "email" ? "phone number" : "email"} instead?
      </Button>
      <Button
        radius="lg"
        size="lg"
        raised
        loading={status === "pending"}
        disabled={status === "pending"}
        buttonStyle={{ borderWidth: 1.5 }}
        onPress={form.handleSubmit(handleSubmit)}
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
