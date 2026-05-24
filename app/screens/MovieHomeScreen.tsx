import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { Movie, endpoints, getPosterUrl, getYear } from "../../constants/tmdb";
import MovieCard from "../../components/MovieCard";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.52;

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { theme } = useTheme();
  const [hero, setHero] = useState<Movie | null>(null);
  const [top10, setTop10] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [popRes, nowRes, trendRes] = await Promise.all([
        fetch(endpoints.popular),
        fetch(endpoints.nowPlaying),
        fetch(endpoints.trending),
      ]);
      const popData = await popRes.json();
      const nowData = await nowRes.json();
      const trendData = await trendRes.json();

      const popular: Movie[] = popData.results || [];
      const nowPlaying: Movie[] = nowData.results || [];
      const trendingMovies: Movie[] = trendData.results || [];

      setHero(trendingMovies[0] || popular[0]);
      setTop10(popular.slice(0, 10));
      setNewReleases(nowPlaying.slice(0, 10));
      setTrending(trendingMovies.slice(1, 11));
    } catch (e) {
      console.error("Failed to fetch movies:", e);
    } finally {
      setLoading(false);
    }
  }

  function goToDetail(movie: Movie) {
    navigation.navigate("Detail", { movie });
  }

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.background}
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        {hero && (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => goToDetail(hero)}
          >
            <View style={{ height: HERO_HEIGHT }}>
              <Image
                source={{
                  uri:
                    getPosterUrl(
                      hero.backdrop_path || hero.poster_path,
                      "original",
                    ) || "",
                }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <LinearGradient
                colors={["transparent", theme.background]}
                style={styles.heroGradient}
                locations={[0.3, 1]}
              />
              <View style={styles.heroContent}>
                <Text style={[styles.heroTitle, { color: theme.text }]}>
                  {hero.title}
                </Text>
                <Text
                  style={[styles.heroGenre, { color: theme.textSecondary }]}
                  numberOfLines={1}
                >
                  Action, Superhero, Science Fiction,{" "}
                  {getYear(hero.release_date)}
                </Text>
                <View style={styles.heroButtons}>
                  <TouchableOpacity style={styles.playBtn}>
                    <Ionicons name="play-circle" size={18} color="#FFFFFF" />
                    <Text style={styles.playBtnText}>Play</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.myListBtn, { borderColor: theme.text }]}
                    onPress={() => navigation.navigate("MyList")}
                  >
                    <Ionicons name="add" size={18} color={theme.text} />
                    <Text style={[styles.myListBtnText, { color: theme.text }]}>
                      My List
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Top 10 This Week */}
        <Section
          title="Top 10 Movies This Week"
          data={top10}
          onPress={goToDetail}
          onSeeAll={() => {}}
          theme={theme}
        />

        {/* New Releases */}
        <Section
          title="New Releases"
          data={newReleases}
          onPress={goToDetail}
          onSeeAll={() => {}}
          theme={theme}
        />

        {/* Trending */}
        <Section
          title="Trending Now"
          data={trending}
          onPress={goToDetail}
          onSeeAll={() => {}}
          theme={theme}
        />

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* Top Logo Bar */}
      <View style={[styles.topBar, { backgroundColor: "transparent" }]}>
        <View style={styles.logoWrap}>
          <Text style={[styles.logoM, { color: theme.accent }]}>M</Text>
          <Text style={[styles.logoText, { color: theme.text }]}>ovix</Text>
        </View>
        <View style={styles.topBarRight}>
          <TouchableOpacity
            style={styles.topBarIcon}
            onPress={() => navigation.navigate("Explore")}
          >
            <Ionicons name="search" size={22} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarIcon}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.text}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function Section({
  title,
  data,
  onPress,
  onSeeAll,
  theme,
}: {
  title: string;
  data: Movie[];
  onPress: (m: Movie) => void;
  onSeeAll: () => void;
  theme: any;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {title}
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={[styles.seeAll, { color: theme.accent }]}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item, index }) => (
          <View style={{ position: "relative", marginRight: 10 }}>
            <MovieCard
              movie={item}
              onPress={onPress}
              width={120}
              height={175}
            />
            {index < 10 && (
              <Text
                style={[
                  styles.rankNumber,
                  {
                    color: theme.dark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.07)",
                  },
                ]}
              >
                {index + 1}
              </Text>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  topBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoWrap: { flexDirection: "row", alignItems: "baseline" },
  logoM: { fontSize: 28, fontWeight: "900" },
  logoText: { fontSize: 22, fontWeight: "700" },
  topBarRight: { flexDirection: "row", alignItems: "center" },
  topBarIcon: { marginLeft: 16 },
  heroImage: { width, height: HERO_HEIGHT, position: "absolute" },
  heroGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT * 0.7,
  },
  heroContent: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  heroTitle: { fontSize: 28, fontWeight: "800", marginBottom: 4 },
  heroGenre: { fontSize: 13, marginBottom: 14 },
  heroButtons: { flexDirection: "row", gap: 12 },
  playBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E50914",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 50,
    gap: 6,
  },
  playBtnText: { color: "#FFF", fontWeight: "700", fontSize: 14 },
  myListBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 50,
    gap: 4,
  },
  myListBtnText: { fontWeight: "600", fontSize: 14 },
  section: { marginTop: 24, paddingLeft: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700" },
  seeAll: { fontSize: 13, fontWeight: "600" },
  horizontalList: { paddingRight: 20 },
  rankNumber: {
    position: "absolute",
    bottom: 20,
    right: -6,
    fontSize: 52,
    fontWeight: "900",
  },
});
