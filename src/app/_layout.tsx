import { Slot } from "expo-router";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

const myTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "#d8ff00",
    background: '#181818',
    card: '#151515',
    text: '#e5e5e5',
    border: '#3f3f3f',
    notification: '#ff453a',
  },
};

export default function RootLayout() {
  console.log("RootLayout Rendered");
  return (
    <ThemeProvider value={myTheme}>
      <Slot />
    </ThemeProvider>
  );
}
