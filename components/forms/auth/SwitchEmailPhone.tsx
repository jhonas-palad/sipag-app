import { View, ViewProps } from "react-native";
import React, { useMemo } from "react";
import { FormField, FormItem, FormMessage } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { type Control, type FieldValues } from "react-hook-form";
import { useSwitchEmailPhone } from "./SwitchInputProvider";
import { Button } from "@rneui/themed";

export const SwitchEmailPhone = ({
  control,
  style,
}: {
  control: Control<FieldValues>;
  style: ViewProps["style"];
}) => {
  const { using } = useSwitchEmailPhone();
  const title = useMemo(() => {
    let splittedTitle = using.split("_");
    return splittedTitle.map((s) => s.toUpperCase()).join(" ");
  }, [using]);

  return (
    <FormField
      control={control}
      name={using}
      render={({ field }) => {
        return (
          <FormItem>
            <View style={style}>
              <Input
                label={title}
                onChangeText={field.onChange}
                placeholder={`Type here...`}
                ErrorComponent={() => <FormMessage />}
                {...field}
              />
            </View>
          </FormItem>
        );
      }}
    />
  );
};

export const SwitchButton = () => {
  const { switchInput, using } = useSwitchEmailPhone();
  return (
    <Button
      onPress={switchInput}
      type="clear"
      buttonStyle={{
        alignSelf: "center",
        borderColor: "transparent",
      }}
    >
      Use {using === "email" ? "Phone number" : "Email"} Instead?
    </Button>
  );
};
