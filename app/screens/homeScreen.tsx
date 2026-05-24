import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isLiked, setisLiked] = useState(false);
  const [isLikes, setisLikes] = useState(0);

  function handleLike() {
    setisLiked(!isLiked);
    setisLikes(isLiked ? isLikes - 1 : isLikes + 1);
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Home Screen</Text>
        <Text>Welcome! This is the Home Page</Text>
        <Text style={styles.label}>YOU HAVE TAPPED</Text>
        <Text style={styles.label}>{count}</Text>
        <Text style={styles.label}>TIMES</Text>

        <View style={styles.row}>
          {/* Minus button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCount(count - 1)}
          >
            <Text style={styles.buttonText}>−</Text>
          </TouchableOpacity>
          {/* Plus button */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => setCount(count + 1)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.resetbutton}
          onPress={() => setCount(0)}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>

        <Text style={styles.label}>What is your name?</Text>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, width: "100%", alignItems: "center" }}
        >
          <TextInput
            style={styles.input}
            placeholder="Type your name here..."
            value={name} // Controlled: input shows what
            onChangeText={(text) => {
              setName(text);
              setisLoggedIn(text.length > 0);
            }} // Every keystroke updates
          />
          {name.length > 0 && (
            <Text style={styles.greeting}>Hello, {name}!</Text>
          )}
          {/* Only shows the Text if isLoggedIn is true */}
          {isLoggedIn ? (
            <Text>Welcome back, {name}!</Text>
          ) : (
            <Text>Please log in.</Text>
          )}

          {/* // Useful for toggling button text */}
          <TouchableOpacity
            style={[styles.button, isLiked && styles.likedButton]}
            onPress={handleLike}
          >
            <Text>{isLiked ? "❤️ Liked" : "Like"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Contact")}
          >
            <Text style={styles.buttonText}>Go to Contact</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Data")}
          >
            <Text style={styles.buttonText}>Go to Data</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("Profile", {
              name: "David Ohimai",
              city: "Delta, Nigeria",
              goal: "Build my first React app",
              src: "https://i.pravatar.cc/150?img=49",
            })
          }
        >
          <Text style={styles.buttonText}>Go to profile</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    backgroundColor: "#f5f5f5",
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    paddingBottom: 20,
  },
  body: {
    backgroundColor: "#f5f5f5",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
    textTransform: "uppercase",
  },
  name: {
    color: "#1A56DB",
    marginBottom: 8,
    fontSize: 28,
    fontWeight: "500",
  },
  city: {
    color: "#475569",
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  goal: {
    color: "#059669",
    fontSize: 16,
    fontWeight: "400",
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#1A56DB",
    padding: 14,
    borderRadius: 8,
    margin: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 50,
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
    color: "#1E293B",
    marginTop: 2,
  },
  row: {
    flexDirection: "row",
    margin: 0,
  },
  resetbutton: {
    backgroundColor: "#000000",
    padding: 14,
    borderRadius: 8,
    margin: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F8FAFC",
    marginTop: 5,
  },
  greeting: {
    fontSize: 22,
    marginTop: 5,
    color: "#1A56DB",
    fontWeight: "bold",
  },
  likedButton: {
    backgroundColor: "#FF6B6B",
    
  }
});
