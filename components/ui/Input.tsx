import {
  TextInput,
  TextInputProps,
  StyleSheet,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  TextInputFocusEventData,
  Pressable,
} from "react-native";
import { mergeRefs } from "@/utils/refs";
import { Icon, InputProps, Input as RNEInput, useTheme } from "@rneui/themed";
import React, {
  useState,
  forwardRef,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { FormDescription, FormItem } from "./Form";

type TextInputP = {
  type?: "clear";
} & InputProps;

export const Input = forwardRef<React.ElementRef<typeof TextInput>, TextInputP>(
  (
    {
      style,
      onFocus,
      onBlur,
      label,
      disabled,
      multiline,
      inputContainerStyle,
      type,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<TextInput>(null);
    const upperCaseLabel = useMemo(
      () => label?.toString().toUpperCase(),
      [label]
    );
    const [focused, setFocused] = useState<boolean>(false);
    const { theme } = useTheme();
    const handleFocus = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        onFocus?.(e);
        setFocused(true);
      },
      [onFocus]
    );
    const handleBlur = useCallback(
      (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        onBlur?.(e);
        setFocused(false);
      },
      [onBlur]
    );
    const innerStyle = useMemo<TextInputProps["style"]>(() => {
      return {
        borderColor:
          type === "clear"
            ? "transparent"
            : focused
            ? theme.colors.primary
            : "transparent",
        borderRadius: theme.spacing.lg,
        backgroundColor:
          type === "clear"
            ? "transparent"
            : !disabled
            ? theme.colors.grey5
            : theme.colors.grey4,
        borderWidth: 1.5,
        borderBottomWidth: 1.5, //We need to set this, because borderBottomWidth is implictly set by REInput
      };
    }, [theme, focused, disabled, type]);
    return (
      <RNEInput
        multiline={multiline}
        label={upperCaseLabel}
        ref={mergeRefs([innerRef, ref])}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor={theme.colors.grey0}
        containerStyle={{ paddingHorizontal: 0 }}
        labelStyle={{ ...styles.labelStyle, color: theme.colors.grey0 }}
        inputStyle={[
          styles.input,
          {
            padding: theme.spacing.lg,
            color: theme.colors.black,
            textAlignVertical: multiline ? "top" : "center",
          },
          style,
        ]}
        inputContainerStyle={[innerStyle, inputContainerStyle]}
        disabled={disabled}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

export const TextArea = forwardRef<
  React.ElementRef<typeof TextInput>,
  React.PropsWithoutRef<Omit<TextInputP, "multiline">> & {
    asFormItem: boolean;
  }
>(({ asFormItem, maxLength = 150, onChange, ...props }, ref) => {
  const [count, setCount] = useState<number>(maxLength);
  const handleCharsLeft = useCallback(
    (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
      if (maxLength > e.nativeEvent.text.length) {
        setCount(maxLength - e.nativeEvent.text.length);
      } else {
        setCount(0);
      }
      onChange?.(e);
    },
    [setCount, maxLength, onChange]
  );
  if (asFormItem) {
    return (
      <FormItem>
        <Input
          multiline
          maxLength={maxLength}
          onChange={handleCharsLeft}
          {...props}
        />
        <FormDescription style={{ textAlign: "right" }}>
          {count} characters left
        </FormDescription>
      </FormItem>
    );
  }
  return <Input ref={ref} multiline maxLength={maxLength} {...props} />;
});

TextArea.displayName = "TextArea";

export const PasswordInput = forwardRef<
  React.ElementRef<typeof TextInput>,
  TextInputP
>(({ ...props }, ref) => {
  const { theme } = useTheme();
  const [hide, setHide] = useState<boolean>(false);
  return (
    <Input
      ref={ref}
      label="Password"
      secureTextEntry={!hide}
      rightIcon={
        <Pressable
          style={({pressed}) => ({ opacity: pressed ? 1 : 0.6})}
          onPress={() => setHide((prev) => !prev)}
        >
          {hide ? (
            <Icon
              name="visibility-off"
              color={theme.colors.grey0}
              style={{ marginRight: 16 }}
              size={24}
            />
          ) : (
            <Icon
              name="visibility"
              color={theme.colors.grey0}
              style={{ marginRight: 16 }}
              size={24}
            />
          )}
        </Pressable>
      }
      {...props}
    />
  );
});

PasswordInput.displayName = "PasswordInput";

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    fontWeight: "medium",
  },

  labelStyle: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "medium",
  },
  inputWithIcon: {
    flex: 1,
  },
});
