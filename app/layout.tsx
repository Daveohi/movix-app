import { Stack } from "expo-router";
import React from "react";
import { ProfileProvider } from "./context/ProfileContext";
import { ThemeProvider } from "./context/ThemeContext";
import { WatchlistProvider } from "./context/WatchlistContext";

export default function RootLayout() {
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
