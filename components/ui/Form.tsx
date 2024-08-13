import {
  type PropsWithChildren,
  createContext,
  useContext,
  forwardRef,
  useId,
  useMemo,
} from "react";
import { View } from "./View";
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
import { Text, TextProps, useTheme } from "@rneui/themed";
import { ThemedText } from "@/components/ThemedText";
import { StyleSheet } from "react-native";
import { COLOR_PALLETE } from "@/config/colors";

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

// Contexts
const FormFieldContext = createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
);

type FormItemContextValue = {
  id: string;
};

const FormItemContext = createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }

  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormItem = ({ children }: PropsWithChildren) => {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      {children}
    </FormItemContext.Provider>
  );
};

const FormLabel = ({ children }: PropsWithChildren) => {
  const { error, formItemId } = useFormField();
  return (
    <ThemedText
      style={[
        styles.baseText,
        styles.formLabel,
        error && styles.formLabelError,
      ]}
    >
      {children}
    </ThemedText>
  );
};

const FormDescription = ({
  children,
  style,
  ...props
}: PropsWithChildren & TextProps) => {
  const { theme } = useTheme();
  return (
    <Text
      style={[
        styles.baseText,
        styles.formDescription,
        { fontSize: 16, color: theme.colors.grey1 },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};
const FormMessage = ({ children }: PropsWithChildren) => {
  const { error, name } = useFormField();

  const body = useMemo(() => {
    if (!error || children) {
      return children;
    }
    if (
      (error?.message as any) instanceof Array &&
      error?.message?.length! > 1
    ) {
      return (error?.message as any).map((err_msg: string, index: number) => (
        <Text key={index} style={[styles.baseText, styles.formMessage]}>
          - {err_msg}
        </Text>
      ));
    }
    return String(error?.message);
  }, [error, children]);

  if (!body) {
    return null;
  }
  if (body instanceof Array) {
    return (
      <View transparent style={{ gap: 4 }}>
        {body}
      </View>
    );
  }
  return (
    <Text
      style={[
        styles.baseText,
        styles.formMessage,
        { display: "flex", flexDirection: "column" },
      ]}
    >
      {body}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    marginVertical: 0,
  },
  formLabel: {},
  formLabelError: {
    color: "red",
  },
  formDescription: {},
  formMessage: {
    color: COLOR_PALLETE.danger,
  },
});
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
  FormField,
};
