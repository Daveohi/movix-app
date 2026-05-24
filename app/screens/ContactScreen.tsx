import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const contacts = [
  { id: 1, name: "Alice Johnson", phone: "555-1234", city: "New York" },
  { id: 2, name: "Bob Smith", phone: "555-5678", city: "Los Angeles" },
  { id: 3, name: "Charlie Brown", phone: "555-9012", city: "Chicago" },
  { id: 4, name: "David Lee", phone: "555-3456", city: "Houston" },
  { id: 5, name: "Eve Davis", phone: "555-7890", city: "Phoenix" },
  { id: 6, name: "Frank Miller", phone: "555-2345", city: "Philadelphia" },
  { id: 7, name: "Grace Wilson", phone: "555-6789", city: "San Antonio" },
  { id: 8, name: "Hannah Taylor", phone: "555-0123", city: "San Diego" },
  { id: 9, name: "Ian Anderson", phone: "555-4567", city: "Dallas" },
  { id: 10, name: "Jane Doe", phone: "555-8901", city: "San Jose" },
];

const avatarColors = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E9",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

export default function ContactScreen({ navigation }: { navigation: any }) {
  const [search, setSearch] = useState("");

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Contacts</Text>
        <Text style={styles.headerSubtitle}>{contacts.length} people</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#94A3B8"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search contacts..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View
              style={[
                styles.avatar,
                { backgroundColor: getAvatarColor(item.id) },
              ]}
            >
              <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.phoneRow}>
                <Ionicons name="call-outline" size={14} color="#94A3B8" />
                <Text style={styles.cardPhone}>{item.phone}</Text>
                <Text style={styles.cardPhone}> - {item.city}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    backgroundColor: "#6366F1",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 15,
    color: "#C7D2FE",
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  cardBody: {
    flex: 1,
    marginLeft: 14,
  },
  cardName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1E293B",
  },
  phoneRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  cardPhone: {
    fontSize: 14,
    color: "#94A3B8",
    marginLeft: 6,
  },
});
