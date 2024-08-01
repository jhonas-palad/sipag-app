import { useEffect, useMemo, useState, useTransition } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Input } from "@/components/ui/Input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Icon, Text, useTheme } from "@rneui/themed";
import { useUserState } from "@/store/user";
import { useShallow } from "zustand/react/shallow";
import { SiginFormSchema, type SiginFormSchemaType } from "@/schemas/auth";
import { Dialog } from "@rneui/themed";
import { signInUser } from "@/data/auth";
import { NON_FIELD_ERROR, ERR_DETAIL } from "@/constants/response-props";
import { ErrorDialog } from "./ErrorDialog";
import { logger } from "@/utils/logger";
import { ResponseError } from "@/errors/response-error";
type Props = {};

export const SigninForm = (props: Props) => {
  const { theme } = useTheme();
  const setUserDetails = useUserState(
    useShallow((state) => state.setUserDetails)
  );
  const [using, setUsing] = useState<"email" | "phone_number">("phone_number");
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SiginFormSchema),
    defaultValues: {
      phone_number: "",
      email: "",
      password: "",
    },
  });

  const { mutateAsync, data, status } = signInUser({
    async onError(error, variables, context) {
      if (error instanceof ResponseError) {
        const { errors } = await error.getErrResponseData();
        if (NON_FIELD_ERROR in errors!) {
          form.setError(using, { message: errors?.[NON_FIELD_ERROR] });
        }
        if (ERR_DETAIL in errors!) {
          form.setError("root", { message: errors?.[ERR_DETAIL] });
        }
        return;
      }
      console.log(error);
      form.setError("root", { message: (error as Error)?.message as string });
    },
    async onSuccess(data, variables, context) {
      logger.info(data);
    },
  });

  useEffect(() => {
    form.setValue(using, form.getValues(using));
    return () => {
      form.resetField(using);
    };
  }, [using]);

  const handleSubmit = async (data: SiginFormSchemaType) => {
    await mutateAsync(data);
  };

  return (
    <Form {...form}>
      {form.formState.errors.root?.message && (
        <ErrorDialog
          title="Signin Failed"
          description={form.formState.errors.root?.message}
        />
      )}
      {using === "phone_number" ? (
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => {
            return (
              <FormItem>
                <View style={styles.inputContainer}>
                  <Input
                    {...field}
                    disabled={status === "pending"}
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
                <View style={styles.inputContainer}>
                  <Input
                    {...field}
                    label="Email"
                    onChangeText={field.onChange}
                    disabled={status === "pending"}
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
            <View style={{ marginBottom: 8 }}>
              <Input
                label="Password"
                onChangeText={field.onChange}
                disabled={status === "pending"}
                placeholder="Enter Your Password"
                secureTextEntry
                ErrorComponent={() => <FormMessage></FormMessage>}
                rightIcon={
                  <Icon
                    name="visibility-off"
                    color={theme.colors.grey1}
                    style={{ marginRight: 16 }}
                    size={16}
                  />
                }
                {...field}
              />
            </View>
          </FormItem>
        )}
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Button
          type="clear"
          radius="lg"
          onPress={() =>
            setUsing((prev) => (prev === "email" ? "phone_number" : "email"))
          }
          buttonStyle={{ alignSelf: "flex-start" }}
        >
          Use {using === "email" ? "phone number" : "email"} instead?
        </Button>
        <Link
          href="/"
          style={{
            color: "gray",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          Forgot password?
        </Link>
      </View>

      <Button
        raised
        type="solid"
        radius="lg"
        size="lg"
        disabled={status === "pending"}
        onPress={form.handleSubmit(handleSubmit)}
      >
        {status === "pending" ? "Signing in..." : "Sign in"}
      </Button>
    </Form>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
});
