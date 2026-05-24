import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Movie, endpoints, getPosterUrl } from "../../constants/tmdb";
import MovieCard from "../../components/MovieCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

// Top searches shown before user types — mix of TMDB popular IDs with poster paths
// These are static placeholders matching the UI design (real poster paths from TMDB)
const TOP_SEARCHES = [
  {
    id: 84958,
    title: "Stranger Things",
    poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
  },
  {
    id: 91239,
    title: "Vincenzo",
    poster_path: "/dAnUAuXP0PLBZ5TWNaJWMmhO7xS.jpg",
  },
  {
    id: 667538,
    title: "Money Heist",
    poster_path: "/reEMJA1OlOoRY1NjcTkEuF9CZJA.jpg",
  },
  {
    id: 93405,
    title: "Squid Game",
    poster_path: "/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
  },
];

export default function ExploreScreen({ navigation }: { navigation: any }) {
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!text.trim()) {
      setResults([]);
      setSearched(false);
      setNotFound(false);
      return;
    }
    debounceTimer.current = setTimeout(() => doSearch(text), 500);
  }, []);

  async function doSearch(q: string) {
    setLoading(true);
    setNotFound(false);
    setSearched(true);
    try {
      const res = await fetch(endpoints.search(q));
      const data = await res.json();
      const found: Movie[] = data.results || [];
      setResults(found);
      setNotFound(found.length === 0);
    } catch {
      setResults([]);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setNotFound(false);
    inputRef.current?.focus();
  }, []);

  const goToDetail = useCallback((movie: Movie) => {
    Keyboard.dismiss();
    navigation.navigate("Detail", { movie });
  }, [navigation]);

  const isSearching = query.trim().length > 0;

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.background}
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />

      {/* Search Bar */}
      <View style={styles.topBar}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.inputBg,
              borderColor: isSearching ? theme.accent : theme.inputBorder,
            },
          ]}
        >
          <Ionicons
            name="search"
            size={18}
            color={theme.textMuted}
            style={{ marginRight: 8 }}
          />
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={handleChangeText}
            placeholder="Search movies..."
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
            returnKeyType="search"
            onSubmitEditing={() => query.trim() && doSearch(query)}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={clearSearch}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close-circle" size={18} color={theme.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, { backgroundColor: theme.inputBg }]}
        >
          <Ionicons name="options" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Content */}
      {!isSearching && !searched ? (
        /* Top Searches Grid */
        <FlatList
          data={TOP_SEARCHES}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.topSearchList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Top Searches
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.topSearchCard, { backgroundColor: theme.card }]}
              onPress={() => goToDetail(item as Movie)}
              activeOpacity={0.8}
            >
              <Image
                source={{
                  uri: getPosterUrl(item.poster_path, "w500") || undefined,
                }}
                style={styles.topSearchPoster}
                resizeMode="cover"
              />
              <Text
                style={[styles.topSearchTitle, { color: theme.text }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          )}
        />
      ) : loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.accent} size="large" />
        </View>
      ) : notFound ? (
        /* 404 Not Found */
        <View style={styles.center}>
          <Text style={[styles.notFoundCode, { color: theme.textMuted }]}>
            404
          </Text>
          <Text style={[styles.notFoundTitle, { color: theme.accent }]}>
            Not Found
          </Text>
          <Text style={[styles.notFoundSub, { color: theme.textSecondary }]}>
            Sorry, the keyword you entered could not be{"\n"}found. Try to check
            again or search with other{"\n"}keywords.
          </Text>
        </View>
      ) : (
        /* Results Grid */
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.resultsGrid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => (
            <MovieCard
              movie={item}
              onPress={goToDetail}
              width={CARD_WIDTH}
              height={200}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, paddingTop: 52 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  topSearchList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  topSearchCard: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
    flexDirection: "row",
    alignItems: "center",
    height: 64,
  },
  topSearchPoster: {
    width: 64,
    height: 64,
  },
  topSearchTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 12,
  },
  resultsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  notFoundCode: {
    fontSize: 72,
    fontWeight: "900",
    letterSpacing: -4,
    marginBottom: 8,
  },
  notFoundTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 12,
  },
  notFoundSub: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
});
