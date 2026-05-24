import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const emojis = ["😂", "🤣", "😄", "😆", "🤪", "🎯", "🔥", "💡", "🥴", "✨"];

export default function DataScreen() {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchJoke() {
    setLoading(true);
    try {
      const response = await fetch(
        "https://official-joke-api.appspot.com/random_joke",
      );
      const data = await response.json();
      setJoke(`${data.setup} … ${data.punchline}`);
    } catch (e) {
      setJoke("Could not load a joke. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJoke();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>😂 RANDOM JOKE</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={fetchJoke}
            activeOpacity={0.6}
          >
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading a joke…</Text>
          </View>
        ) : (
          <>
            <Text style={styles.emoji}>
              {emojis[joke.length % emojis.length]}
            </Text>
            <Text style={styles.jokeText}>{joke}</Text>
          </>
        )}

        <View style={styles.footerDots}>
          <View style={styles.dotActive} />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={fetchJoke}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Ionicons name="happy-outline" size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>Next Joke</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    borderWidth: 2,
    borderColor: "#FCD34D",
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
    alignItems: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: "#F59E0B",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 1.2,
  },
  refreshButton: {
    backgroundColor: "#6366F1",
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingWrap: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#94A3B8",
    fontWeight: "500",
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  jokeText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
    textAlign: "center",
    lineHeight: 26,
    fontStyle: "italic",
    paddingHorizontal: 4,
  },
  footerDots: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    marginRight: 6,
  },
  dotActive: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#F59E0B",
    marginRight: 6,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 17,
    marginLeft: 8,
  },
});
