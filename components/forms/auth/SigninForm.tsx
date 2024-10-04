import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, PasswordInput } from "@/components/ui/Input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Link, useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useTheme } from "@rneui/themed";
import * as Haptics from "expo-haptics";
import { useShallow } from "zustand/react/shallow";
import { SiginFormSchema, type SiginFormSchemaType } from "@/schemas/auth";
import Toast from "react-native-simple-toast";

import { useSigninUser } from "@/data/auth";
import { NON_FIELD_ERROR, ERR_DETAIL } from "@/constants/response-props";
import { useAuthSession } from "@/store/auth";
import { log } from "@/utils/logger";
import { ResponseError } from "@/errors/response-error";
import { useQueryClient } from "@tanstack/react-query";
import { KEYWORDS } from "@/lib/constants";
type Props = {};

export const SigninForm = (props: Props) => {
  const { theme } = useTheme();
  const session = useAuthSession(
    useShallow((state) => ({
      setToken: state.setToken,
      setUser: state.setUser,
    }))
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
  const queryClient = useQueryClient();
  const { mutateAsync, status } = useSigninUser({
    async onError(error, variables, context) {
      let errMsg = "Sign in failed";
      if (error instanceof ResponseError) {
        const errors = error.errors;
        Object.keys(errors!).forEach((err_field: string) => {
          let key = err_field;
          if (NON_FIELD_ERROR === err_field) {
            key = using;
          }
          if (ERR_DETAIL === err_field) {
            key = "root";
          }
          if (key === "root") {
            errMsg = errors?.[err_field];
          }
          form.setError(key as "email" | "phone_number", {
            message: errors?.[err_field],
          });
        });
      } else {
        errMsg = (error as Error)?.message as string;
        form.setError("root", { message: errMsg });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Toast.show(errMsg, Toast.LONG, {
        // backgroundColor: theme.colors.error,
        textColor: theme.colors.error,
      });
    },
    onSuccess(data, variables, context) {
      const { data: responseData } = data;
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        queryClient.setQueryData([KEYWORDS.USER_DETAIL], () => {
          return responseData.user;
        });
        if (!responseData.user.is_verified) {
          router.replace("/auth/not-verified");
        }
        router.replace("/");
        log.debug("Navigating to home screen");
      } catch (err) {
        log.error(err);
      } finally {
        session.setToken(responseData?.token ?? null);
        session.setUser(responseData?.user ?? null);
      }
    },
  });

  useEffect(() => {
    form.setValue(using, form.getValues(using));
    return () => {
      form.resetField(using);
    };
  }, [using, form]);

  const handleSubmit = async (data: SiginFormSchemaType) => {
    await mutateAsync(data);
  };

  return (
    <Form {...form}>
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
              <PasswordInput
                onChangeText={field.onChange}
                disabled={status === "pending"}
                placeholder="Enter Your Password"
                ErrorComponent={() => <FormMessage></FormMessage>}
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
          onPress={() => {
            Haptics.selectionAsync();
            setUsing((prev) => (prev === "email" ? "phone_number" : "email"));
          }}
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
        loading={status === "pending"}
        disabled={status === "pending"}
        onPress={form.handleSubmit(handleSubmit)}
      >
        Sign in
      </Button>
    </Form>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 12,
  },
});
