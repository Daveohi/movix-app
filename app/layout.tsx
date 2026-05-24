import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import React from "react";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";
import { WatchlistProvider } from "./context/WatchlistContext";

export default function RootLayout() {
  const [loaded] = useFonts({
    Ionicons: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf"),
  });
  if (!loaded) return null;
  return (
    <ThemeProvider>
      <WatchlistProvider>
        <ProfileProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ProfileProvider>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
