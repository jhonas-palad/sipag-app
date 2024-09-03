import { createContext, useContext, useCallback, useMemo } from "react";

import React from "react";

type Props<T extends string> = {
  using: T;
  switchInput: () => void;
  inputs?: T[];
};

const SwitchInpuContext = createContext<Props<string> | null>(null);

export const SwitchInputProvider = <T extends string>({
  children,
  initialValue,
  inputs,
}: {
  children: React.ReactNode;
  initialValue: T;
  inputs: T[];
}) => {
  const [using, setUsing] = React.useState<T>(initialValue);
  const inputLen = useMemo(() => {
    return inputs.length;
  }, [inputs]);
  const switchInput = useCallback(() => {
    const currIdx = (inputs.indexOf(using) + 1) % inputLen;
    setUsing(inputs[currIdx]);
  }, [inputs, using, inputLen]);
  return (
    <SwitchInpuContext.Provider value={{ using, switchInput, inputs }}>
      {children}
    </SwitchInpuContext.Provider>
  );
};

export const useSwitchEmailPhone = () => {
  let value = useContext(SwitchInpuContext);
  if (!value) {
    throw new Error(
      "useSwitchEmailPhone must use within <SwitchInputProvider/>"
    );
  }
  return value;
};
