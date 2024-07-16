import { View, Pressable, Alert, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Input, InputWrapper } from "@/components/ui/Input";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Button } from "@/components/ui/Button";
import { Feather } from "@expo/vector-icons";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";

type Props = {};

export const SigninForm = (props: Props) => {
  const form = useForm({
    defaultValues: {
      email_phone_number: "",
      password: "",
    },
  });
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email_phone_number"
        render={({ field }) => {
          return (
            <FormItem>
              <View style={styles.inputContainer}>
                <InputWrapper>
                  <Input
                    {...field}
                    onChangeText={field.onChange}
                    placeholder="Email or phone number"
                  />
                </InputWrapper>
                <FormMessage />
              </View>
            </FormItem>
          );
        }}
      />
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
        variant="primary"
        style={{ marginBottom: 8 }}
        onPress={form.handleSubmit((data) =>
          Alert.alert("DATA", JSON.stringify(data))
        )}
      >
        <ThemedText type="defaultSemiBold" style={{ color: "white" }}>
          Sign in
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
