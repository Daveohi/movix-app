import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useTheme } from "../app/context/ThemeContext";
import { Movie, getPosterUrl } from "../constants/tmdb";

const { width } = Dimensions.get("window");

interface MovieCardProps {
  movie: Movie;
  onPress: (movie: Movie) => void;
  width?: number;
  height?: number;
  showRating?: boolean;
}

export default function MovieCard({
  movie,
  onPress,
  width: cardWidth = (width - 48) / 2,
  height: cardHeight = 200,
  showRating = true,
}: MovieCardProps) {
  const { theme } = useTheme();
  const posterUrl = getPosterUrl(movie.poster_path);
  const rating = movie.vote_average.toFixed(1);

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth, height: cardHeight }]}
      onPress={() => onPress(movie)}
      activeOpacity={0.85}
    >
      {posterUrl ? (
        <Image
          source={{ uri: posterUrl }}
          style={styles.poster}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.poster,
            styles.noPoster,
            { backgroundColor: theme.card2 },
          ]}
        >
          <Text style={{ color: theme.textMuted, fontSize: 12 }}>No Image</Text>
        </View>
      )}
      {showRating && (
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>{rating}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  poster: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  noPoster: {
    justifyContent: "center",
    alignItems: "center",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#E50914",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ratingText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },
});
