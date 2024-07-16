import * as React from "react";

import { ThemeProvider as REThemeProvider } from "@rneui/themed";
import { theme } from "./theme";
type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  return <REThemeProvider theme={theme}>{children}</REThemeProvider>;
}
