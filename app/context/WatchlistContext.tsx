import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Movie } from "../../constants/tmdb";

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (id: number) => void;
  isInWatchlist: (id: number) => boolean;
  watchedIds: number[];
  toggleWatched: (id: number) => void;
  isWatched: (id: number) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType>({
  watchlist: [],
  addToWatchlist: () => {},
  removeFromWatchlist: () => {},
  isInWatchlist: () => false,
  watchedIds: [],
  toggleWatched: () => {},
  isWatched: () => false,
});

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [watchedIds, setWatchedIds] = useState<number[]>([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  async function loadWatchlist() {
    try {
      const stored = await AsyncStorage.getItem("watchlist");
      const storedWatched = await AsyncStorage.getItem("watchedIds");
      if (stored) setWatchlist(JSON.parse(stored));
      if (storedWatched) setWatchedIds(JSON.parse(storedWatched));
    } catch (e) {}
  }

  async function addToWatchlist(movie: Movie) {
    const updated = [movie, ...watchlist.filter((m) => m.id !== movie.id)];
    setWatchlist(updated);
    await AsyncStorage.setItem("watchlist", JSON.stringify(updated));
  }

  async function removeFromWatchlist(id: number) {
    const updated = watchlist.filter((m) => m.id !== id);
    setWatchlist(updated);
    await AsyncStorage.setItem("watchlist", JSON.stringify(updated));
  }

  function isInWatchlist(id: number) {
    return watchlist.some((m) => m.id === id);
  }

  async function toggleWatched(id: number) {
    const updated = watchedIds.includes(id)
      ? watchedIds.filter((w) => w !== id)
      : [...watchedIds, id];
    setWatchedIds(updated);
    await AsyncStorage.setItem("watchedIds", JSON.stringify(updated));
  }

  function isWatched(id: number) {
    return watchedIds.includes(id);
  }

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        watchedIds,
        toggleWatched,
        isWatched,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export const useWatchlist = () => useContext(WatchlistContext);

// Silences Expo Router "missing default export" warning for context files
export default function WatchlistContextModule() {
  return null;
}
