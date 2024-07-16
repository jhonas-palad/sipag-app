import {
  View,
  TextInput,
  TextInputProps,
  StyleSheet,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
  type StyleProp,
  type ViewStyle,
  type ViewProps,
} from "react-native";

import { COLOR_PALLETE } from "@/config/colors";
import React, {
  useState,
  forwardRef,
  createContext,
  useContext,
  useLayoutEffect,
  useEffect,
} from "react";
import { useController } from "react-hook-form";
type Props = TextInputProps;

type FocusBlurStyles = {
  borderColor: "gray" | "blue";
  borderWidth: 1.5 | 2 | 3;
};

export const Input = forwardRef<
  React.ElementRef<typeof TextInput>,
  React.ComponentPropsWithoutRef<typeof TextInput>
>(({ style, onBlur, onFocus, ...props }, ref) => {
  const { blurMode, focusMode } = useInputWrapper();
  const handleFocus = (
    event: NativeSyntheticEvent<TextInputFocusEventData>
  ) => {
    event.preventDefault();
    focusMode?.();
    onFocus?.(event);
  };
  const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
    event.preventDefault();
    blurMode?.();
    onBlur?.(event);
  };
  return (
    <TextInput
      ref={ref}
      onFocus={handleFocus}
      onBlur={handleBlur}
      style={[{ flex: 1 }, style]}
      {...props}
    />
  );
});

type InputWrapperContext = {
  focusMode: () => void;
  blurMode: () => void;
};

const InputWrapperContext = createContext<InputWrapperContext>(
  {} as InputWrapperContext
);

export const InputWrapper = ({
  style,
  children,
  focus = false,
}: Pick<ViewProps, "style" | "children"> & { focus?: boolean }) => {
  const [_focus, setFocus] = useState<boolean>(focus);
  const focusMode = () => setFocus(true);
  const blurMode = () => setFocus(false);
  return (
    <InputWrapperContext.Provider value={{ focusMode, blurMode }}>
      <View style={[styles.input, _focus ? styles.focus : styles.blur, style]}>
        {children}
      </View>
    </InputWrapperContext.Provider>
  );
};

const useInputWrapper = (): InputWrapperContext => {
  const methods = useContext(InputWrapperContext);

  if (!Object.values(methods).length) {
    throw new Error("useInputWrapper must be used within <InputWrapper/>");
  }

  return methods;
};

const styles = StyleSheet.create({
  input: {
    borderRadius: 12,
    padding: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "transparent",
    borderWidth: 2,
    backgroundColor: COLOR_PALLETE.secondary,
  },
  inputWithIcon: {
    flex: 1,
  },
  blur: {},
  focus: {
    borderColor: COLOR_PALLETE.primary,
  },
});
