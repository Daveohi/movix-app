import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import { Movie } from "../../constants/tmdb";
import MovieCard from "../../components/MovieCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

export default function MyListScreen({ navigation }: { navigation: any }) {
  const { theme } = useTheme();
  const { watchlist, removeFromWatchlist } = useWatchlist();

  function goToDetail(movie: Movie) {
    navigation.navigate("Detail", { movie });
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.background}
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.logoWrap}>
          <Text style={[styles.logoM, { color: theme.accent }]}>M</Text>
          <Text style={[styles.logoText, { color: theme.text }]}>ovix</Text>
        </View>
        <Text style={[styles.headerTitle, { color: theme.text }]}>My List</Text>
      </View>

      {watchlist.length === 0 ? (
        <View style={styles.empty}>
          <Ionicons name="bookmark-outline" size={64} color={theme.textMuted} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            Nothing saved yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
            Tap the bookmark icon on any movie to add it here
          </Text>
          <TouchableOpacity
            style={[styles.browseBtn, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.browseBtnText}>Browse Movies</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          ListHeaderComponent={
            <Text style={[styles.countLabel, { color: theme.textSecondary }]}>
              {watchlist.length} {watchlist.length === 1 ? "movie" : "movies"}{" "}
              saved
            </Text>
          }
          renderItem={({ item }) => (
            <View style={{ position: "relative" }}>
              <MovieCard
                movie={item}
                onPress={goToDetail}
                width={CARD_WIDTH}
                height={210}
              />
              <TouchableOpacity
                style={[
                  styles.removeBtn,
                  { backgroundColor: "rgba(0,0,0,0.6)" },
                ]}
                onPress={() => removeFromWatchlist(item.id)}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
              >
                <Ionicons name="bookmark" size={16} color={theme.accent} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
  },
  logoWrap: { flexDirection: "row", alignItems: "baseline" },
  logoM: { fontSize: 20, fontWeight: "900" },
  logoText: { fontSize: 16, fontWeight: "700" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  countLabel: { fontSize: 13, marginBottom: 14 },
  grid: { padding: 16, paddingBottom: 32 },
  removeBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 28,
  },
  browseBtn: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 50,
  },
  browseBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});
