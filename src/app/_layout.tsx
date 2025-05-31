import "../../css/global.css";
import { Slot } from "expo-router";
import { ThemeProvider, DarkTheme } from "@react-navigation/native";

/**
 * Custom dark theme configuration for the application
 * Extends React Navigation's DarkTheme with brand-specific colors
 * Features green accent color (#d8ff00) consistent with app branding
 */
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

/**
 * Root layout component for the entire application
 * Provides theme context and global CSS imports for consistent styling
 * Sets up dark theme with custom brand colors across all screens
 * 
 * @returns JSX element containing ThemeProvider wrapper with Slot for child routes
 */
export default function RootLayout() {
  return (
    <ThemeProvider value={myTheme}>
      <Slot />
    </ThemeProvider>
  );
}