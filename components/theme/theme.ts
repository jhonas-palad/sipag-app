import { createTheme } from "@rneui/themed";
export const theme = createTheme({
  lightColors: {
    primary: "#00563B",
    secondary: "#00FF40",
    background: "#FAFAFA",
    white: "#FFFFFF",
    black: "#1C1C1C",
  },
  darkColors: {
    primary: "#177245",
    secondary: "#03C03C",
    background: "#212121",
    black: "#FFFFFF",
    white: "#1C1C1C",
  },
  mode: "light",
  components: {
    Button(props, theme) {
      return {
        radius: 50,
        containerStyle: {
          borderCurve: "continuous",
        },
      };
    },
    
  },
});
