import { useEffect, useState } from "react";
import { View, Pressable, Alert, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Input, InputWrapper } from "@/components/ui/Input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button, LinkButton } from "@/components/ui/Button";
import { Feather } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { UserCredentialSchema, useCredentialSchema } from "@/schemas/auth";
import React from "react";
import { COLOR_PALLETE } from "@/config/colors";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
type Props = {};

export const SignupForm = (props: Props) => {
  const [using, setUsing] = useState<"email" | "phone_number">("phone_number");
  const schema = useCredentialSchema(using);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      phone_number: "",
      email: "",
      password: "",
    },
  });
  useEffect(() => {
    form.setValue(using, form.getValues(using));

    return () => {
      form.clearErrors(using);
    };
  }, [using]);

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
                  <InputWrapper>
                    <Input
                      {...field}
                      onChangeText={field.onChange}
                      keyboardType="decimal-pad"
                      placeholder="Phone number"
                    />
                  </InputWrapper>
                  <FormMessage />
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
                  <InputWrapper>
                    <Input
                      {...field}
                      onChangeText={field.onChange}
                      keyboardType="email-address"
                      placeholder="Email"
                    />
                  </InputWrapper>
                  <FormMessage />
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
            <View style={styles.inputContainer}>
              <InputWrapper>
                <Input
                  {...field}
                  onChangeText={field.onChange}
                  placeholder="Password"
                  secureTextEntry
                />
                <Pressable style={{ marginHorizontal: 12 }}>
                  <Feather name="eye-off" size={16} color="gray" />
                </Pressable>
              </InputWrapper>
              <FormMessage />
            </View>
          </FormItem>
        )}
      />

      <Button
        // href="/(auth)/upload-image"
        // push
        onPress={form.handleSubmit(
          (data) => {
            console.log("navigating");
            router.push("/(auth)/upload-image");
          },
          (err) => console.log(err)
        )}
        variant="primary"
        style={{ marginBottom: 20 }}
      >
        <ThemedText type="defaultSemiBold" style={{ color: "white" }}>
          Continue
        </ThemedText>
      </Button>
      <Button
        variant="link"
        onPress={() =>
          setUsing((prev) => (prev === "email" ? "phone_number" : "email"))
        }
        style={{ alignSelf: "center", padding: 0 }}
      >
        <ThemedText
          type="defaultSemiBold"
          style={{ color: COLOR_PALLETE.primary }}
        >
          Use {using === "email" ? "phone number" : "email"} instead?
        </ThemedText>
      </Button>
    </Form>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 28,
  },
});
