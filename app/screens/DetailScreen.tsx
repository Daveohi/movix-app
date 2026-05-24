import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useWatchlist } from "../context/WatchlistContext";
import {
  Movie,
  MovieDetail,
  endpoints,
  getPosterUrl,
  getYear,
} from "../../constants/tmdb";
import MovieCard from "../../components/MovieCard";
// import { navigate } from "expo-router/build/global-state/routing";

const { width, height } = Dimensions.get("window");
const POSTER_HEIGHT = height * 0.48;

export default function DetailScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { movie } = route.params as { movie: Movie };
  const { theme } = useTheme();
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [detail, setDetail] = useState<MovieDetail | null>(null);
  const [similar, setSimilar] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"more" | "comments">("more");
  const [expanded, setExpanded] = useState(false);
  const inList = isInWatchlist(movie.id);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [loading, fadeAnim]);

  useEffect(() => {
    let cancelled = false;
    async function fetchDetail() {
      setLoading(true);
      try {
        const [detailRes, similarRes] = await Promise.all([
          fetch(endpoints.detail(movie.id)),
          fetch(endpoints.similar(movie.id)),
        ]);
        const detailData = await detailRes.json();
        const similarData = await similarRes.json();
        if (!cancelled) {
          setDetail(detailData);
          setSimilar(similarData.results?.slice(0, 10) || []);
        }
      } catch (e) {
        console.error("Failed to fetch movie detail:", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDetail();
    return () => {
      cancelled = true;
    };
  }, [movie.id]);

  function handleWatchlist() {
    if (inList) removeFromWatchlist(movie.id);
    else addToWatchlist(movie);
  }

  const posterUrl = getPosterUrl(
    movie.backdrop_path || movie.poster_path,
    "original",
  );
  const rating = movie.vote_average.toFixed(1);
  const year = getYear(movie.release_date);
  const genres = detail?.genres?.map((g) => g.name).join(", ") || "";
  const director = detail?.credits?.crew?.find((c) => c.job === "Director");
  const cast = detail?.credits?.cast?.slice(0, 5) || [];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* <StatusBar barStyle="light-content" /> */}
      <StatusBar
        translucent={false}
        backgroundColor={theme.background}
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Poster + Gradient */}
        <View style={{ height: POSTER_HEIGHT }}>
          {posterUrl ? (
            <Image
              source={{ uri: posterUrl }}
              style={styles.poster}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.poster, { backgroundColor: theme.card }]} />
          )}
          <LinearGradient
            colors={["rgba(0,0,0,0.35)", theme.background]}
            style={styles.posterGradient}
            locations={[0.2, 1]}
          />
          {/* Back + Bookmark */}
          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.topActionsRight}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleWatchlist}
              >
                <Ionicons
                  name={inList ? "bookmark" : "bookmark-outline"}
                  size={22}
                  color={inList ? theme.accent : "#FFFFFF"}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons
                  name="share-social-outline"
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Info Section */}
        <Animated.View style={[styles.infoSection, { opacity: fadeAnim }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {movie.title}
          </Text>

          {/* Rating + Meta Chips */}
          <View style={styles.metaRow}>
            <Ionicons name="star" size={14} color="#F5C518" />
            <Text style={[styles.rating, { color: theme.text }]}>{rating}</Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={theme.textMuted}
            />
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {year}
            </Text>
            <View style={styles.chip}>
              <Text style={styles.chipText}>13+</Text>
            </View>
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                {detail?.runtime ? `${detail.runtime}m` : "HD"}
              </Text>
            </View>
          </View>

          {/* Play + Download Buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.playBtn}>
              <Ionicons name="play-circle" size={20} color="#FFFFFF" />
              <Text style={styles.playBtnText}>Play</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.downloadBtn, { borderColor: theme.accent }]}
              onPress={handleWatchlist}
            >
              <Ionicons
                name={inList ? "checkmark-circle" : "download-outline"}
                size={20}
                color={theme.accent}
              />
              <Text style={[styles.downloadBtnText, { color: theme.accent }]}>
                {inList ? "In My List" : "My List"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Genre */}
          {genres !== "" && (
            <Text style={[styles.genres, { color: theme.textSecondary }]}>
              Genre: {genres}
            </Text>
          )}

          {/* Overview */}
          <TouchableOpacity onPress={() => setExpanded(!expanded)}>
            <Text
              style={[styles.overview, { color: theme.textSecondary }]}
              numberOfLines={expanded ? undefined : 3}
            >
              {movie.overview}
            </Text>
            <Text style={[styles.viewMore, { color: theme.accent }]}>
              {expanded ? "Show Less" : "View More"}
            </Text>
          </TouchableOpacity>

          {/* Cast Row */}
          {(director || cast.length > 0) && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.castRow}
            >
              {director && (
                <CastCard
                  name={director.name}
                  role="Director"
                  photo={director.profile_path}
                  theme={theme}
                />
              )}
              {cast.map((c) => (
                <CastCard
                  key={c.id}
                  name={c.name}
                  role="Cast"
                  photo={c.profile_path}
                  theme={theme}
                />
              ))}
            </ScrollView>
          )}

          {/* Tabs */}
          <View style={[styles.tabs, { borderBottomColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "more" && styles.tabActive]}
              onPress={() => setActiveTab("more")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "more" ? theme.accent : theme.textMuted,
                  },
                ]}
              >
                More Like This
              </Text>
              {activeTab === "more" && (
                <View
                  style={[styles.tabLine, { backgroundColor: theme.accent }]}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "comments" && styles.tabActive]}
              onPress={() => setActiveTab("comments")}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      activeTab === "comments" ? theme.accent : theme.textMuted,
                  },
                ]}
              >
                Comments
              </Text>
              {activeTab === "comments" && (
                <View
                  style={[styles.tabLine, { backgroundColor: theme.accent }]}
                />
              )}
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {loading ? (
            <ActivityIndicator color={theme.accent} style={{ marginTop: 24 }} />
          ) : activeTab === "more" ? (
            <FlatList
              data={similar}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={styles.similarRow}
              renderItem={({ item }) => (
                <MovieCard
                  movie={item}
                  onPress={(mv) => navigation.push("Detail", { movie: mv })}
                  width={(width - 52) / 2}
                  height={190}
                />
              )}
            />
          ) : (
            <CommentsSection theme={theme} />
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function CastCard({ name, role, photo, theme }: any) {
  const photoUrl = photo ? `https://image.tmdb.org/t/p/w185${photo}` : null;
  return (
    <View style={styles.castCard}>
      {photoUrl ? (
        <Image source={{ uri: photoUrl }} style={styles.castPhoto} />
      ) : (
        <View style={[styles.castPhoto, { backgroundColor: theme.card2 }]}>
          <Ionicons name="person" size={20} color={theme.textMuted} />
        </View>
      )}
      <Text style={[styles.castName, { color: theme.text }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[styles.castRole, { color: theme.textMuted }]}>{role}</Text>
    </View>
  );
}

const mockComments = [
  {
    id: 1,
    name: "Kristin Watson",
    text: "Absolutely loved this movie! The visuals were stunning and the story kept me hooked from start to finish.",
    time: "3 days ago",
    likes: 938,
  },
  {
    id: 2,
    name: "James Holloway",
    text: "One of the best films I have seen this year. Highly recommend to anyone who loves great cinema.",
    time: "5 days ago",
    likes: 412,
  },
  {
    id: 3,
    name: "Sophie Nguyen",
    text: "The cinematography alone is worth the watch. A real visual treat from the first scene.",
    time: "1 week ago",
    likes: 278,
  },
];

function CommentsSection({ theme }: { theme: any }) {
  return (
    <View style={{ paddingBottom: 20 }}>
      <View style={styles.commentsHeader}>
        <Text style={[styles.commentsCount, { color: theme.text }]}>
          24.6K Comments
        </Text>
        <TouchableOpacity>
          <Text
            style={[{ color: theme.accent, fontSize: 13, fontWeight: "600" }]}
          >
            See all
          </Text>
        </TouchableOpacity>
      </View>
      {mockComments.map((c) => (
        <View key={c.id} style={styles.commentCard}>
          <View
            style={[styles.commentAvatar, { backgroundColor: theme.card2 }]}
          >
            <Ionicons name="person" size={18} color={theme.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.commentTopRow}>
              <Text style={[styles.commentName, { color: theme.text }]}>
                {c.name}
              </Text>
              <TouchableOpacity>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={16}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.commentText, { color: theme.textSecondary }]}>
              {c.text}
            </Text>
            <View style={styles.commentBottom}>
              <Ionicons name="heart" size={14} color={theme.accent} />
              <Text style={[styles.commentLikes, { color: theme.textMuted }]}>
                {c.likes}
              </Text>
              <Text style={[styles.commentTime, { color: theme.textMuted }]}>
                {c.time}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  poster: { width, height: POSTER_HEIGHT, position: "absolute" },
  posterGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: POSTER_HEIGHT,
  },
  topActions: {
    position: "absolute",
    top: 52,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  topActionsRight: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  infoSection: { paddingHorizontal: 20, paddingTop: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 10 },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    flexWrap: "wrap",
  },
  rating: { fontSize: 14, fontWeight: "700" },
  metaText: { fontSize: 13 },
  chip: {
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chipText: { color: "#999", fontSize: 11 },
  actionRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  playBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E50914",
    paddingVertical: 13,
    borderRadius: 50,
    gap: 8,
  },
  playBtnText: { color: "#FFF", fontWeight: "700", fontSize: 15 },
  downloadBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    paddingVertical: 13,
    borderRadius: 50,
    gap: 8,
  },
  downloadBtnText: { fontWeight: "700", fontSize: 15 },
  genres: { fontSize: 13, marginBottom: 10 },
  overview: { fontSize: 14, lineHeight: 22, marginBottom: 4 },
  viewMore: { fontSize: 13, fontWeight: "600", marginBottom: 16 },
  castRow: { marginBottom: 20 },
  castCard: { alignItems: "center", marginRight: 16, width: 70 },
  castPhoto: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginBottom: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  castName: { fontSize: 11, fontWeight: "600", textAlign: "center" },
  castRole: { fontSize: 10, textAlign: "center" },
  tabs: { flexDirection: "row", borderBottomWidth: 1, marginBottom: 16 },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingBottom: 12,
    position: "relative",
  },
  tabActive: {},
  tabText: { fontSize: 14, fontWeight: "600" },
  tabLine: {
    position: "absolute",
    bottom: -1,
    left: "10%",
    right: "10%",
    height: 2,
    borderRadius: 2,
  },
  similarGrid: { gap: 0 },
  similarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 0,
  },
  commentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  commentsCount: { fontSize: 17, fontWeight: "700" },
  commentCard: { flexDirection: "row", gap: 12, marginBottom: 20 },
  commentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  commentTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentName: { fontSize: 14, fontWeight: "700" },
  commentText: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  commentBottom: { flexDirection: "row", alignItems: "center", gap: 6 },
  commentLikes: { fontSize: 12, marginRight: 8 },
  commentTime: { fontSize: 12 },
});
