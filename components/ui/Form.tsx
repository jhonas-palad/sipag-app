import {
  type PropsWithChildren,
  createContext,
  useContext,
  forwardRef,
  useId,
} from "react";

import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from "react-hook-form";
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

const FormDescription = ({ children }: PropsWithChildren) => {
  return (
    <ThemedText type="small" style={[styles.baseText, styles.formDescription]}>
      {children}
    </ThemedText>
  );
};
const FormMessage = ({ children }: PropsWithChildren) => {
  const { error } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return null;
  }

  return (
    <ThemedText style={[styles.baseText, styles.formMessage]}>
      {body}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  baseText: {
    marginVertical: 8,
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
