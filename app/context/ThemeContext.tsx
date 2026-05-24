import React, { createContext, useContext, useState } from "react";
import { Colors } from "../../constants/theme";

export const lightTheme = {
  ...Colors.light,
  dark: false,
  background: "#F2F2F2",
  background2: "#E8E8E8",
  card: "#FFFFFF",
  card2: "#EFEFEF",
  text: "#0F0F0F",
  textSecondary: "#555555",
  textMuted: "#888888",
  accent: "#E50914",
  accentLight: "#FF4B55",
  border: "#DDDDDD",
  tabBar: "#FFFFFF",
  tabBarBorder: "#E0E0E0",
  header: "#FFFFFF",
  inputBg: "#EBEBEB",
  inputBorder: "#D0D0D0",
  settingsRow: "#FFFFFF",
  premiumBorder: "#E50914",
  shimmer: ["#E0E0E0", "#F5F5F5", "#E0E0E0"],
};

export const darkTheme = {
  ...Colors.dark,
  dark: true,
  background: "#0F0F0F",
  background2: "#141414",
  card: "#1A1A1A",
  card2: "#222222",
  text: "#FFFFFF",
  textSecondary: "#CCCCCC",
  textMuted: "#888888",
  accent: "#E50914",
  accentLight: "#FF4B55",
  border: "#2A2A2A",
  tabBar: "#0F0F0F",
  tabBarBorder: "#1F1F1F",
  header: "#0F0F0F",
  inputBg: "#1E1E1E",
  inputBorder: "#2E2E2E",
  settingsRow: "#1A1A1A",
  premiumBorder: "#E50914",
  shimmer: ["#1A1A1A", "#2A2A2A", "#1A1A1A"],
};

type Theme = typeof darkTheme;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: darkTheme,
  isDark: true,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider
      value={{ theme: isDark ? darkTheme : lightTheme, isDark, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// Silences Expo Router "missing default export" warning for context files
export default function ThemeContextModule() {
  return null;
}
