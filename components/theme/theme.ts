import { createTheme } from "@rneui/themed";
export const theme = createTheme({
  lightColors: {
    primary: "#00563B",
    secondary: "#D8F6E8",
    background: "#FAFAFA",
    white: "#FFFFFF",
    black: "#242424",
    grey5: "#EDEDED",
    grey4: "#DBDBDB",
    grey3: "#C8C8C8",
    grey2: "#B6B6B6",
    grey1: "#A4A4A4",
    grey0: "#808080",
  },
  darkColors: {
    primary: "#177245",
    secondary: "#C4E0D3",
    background: "#212121",
    black: "#FFFFFF",
    white: "#1C1C1C",
    grey5: "#EDEDED",
    grey4: "#DBDBDB",
    grey3: "#C8C8C8",
    grey2: "#B6B6B6",
    grey1: "#A4A4A4",
    grey0: "#808080",
  },
  mode: "light",
  components: {
    Button(props, theme) {
      return {
        buttonStyle: {
          borderWidth: 1.5,
          containerStyle: {
            borderCurve: "continuous",
          },
        },
        radius: theme.spacing.lg,
      };
    },
  },
});
