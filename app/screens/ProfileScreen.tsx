import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";

type SettingRow = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  value?: string;
  toggle?: boolean;
  route?: string;
};

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { profile } = useProfile();
  const router = useRouter();

  const settings: SettingRow[] = [
    {
      icon: "person-outline",
      label: "Edit Profile",
      route: "/screens/EditProfileScreen",
    },
    { icon: "notifications-outline", label: "Notification" },
    { icon: "download-outline", label: "Download" },
    { icon: "shield-checkmark-outline", label: "Security" },
    { icon: "language-outline", label: "Language", value: "English (US)" },
    { icon: "moon-outline", label: "Dark Mode", toggle: true },
    { icon: "help-circle-outline", label: "Help Center" },
    { icon: "document-text-outline", label: "Privacy Policy" },
  ];

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.background}
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={styles.headerBar}>
        <View style={styles.logoWrap}>
          <Text style={[styles.logoM, { color: theme.accent }]}>M</Text>
          <Text style={[styles.logoText, { color: theme.text }]}>ovix</Text>
        </View>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image style={styles.avatar} />
            <TouchableOpacity
              style={[styles.editAvatarBtn, { backgroundColor: theme.accent }]}
              onPress={() => router.push("/screens/EditProfileScreen")}
            >
              <Ionicons name="pencil" size={12} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {profile.fullName}
          </Text>
          <Text style={[styles.userEmail, { color: theme.textMuted }]}>
            {profile.email}
          </Text>
          {profile.phone ? (
            <Text style={[styles.userPhone, { color: theme.textMuted }]}>
              {profile.flag} {profile.phone}
            </Text>
          ) : null}
        </View>

        {/* Premium Banner */}
        <TouchableOpacity
          style={[
            styles.premiumCard,
            { borderColor: theme.premiumBorder, backgroundColor: theme.card },
          ]}
          activeOpacity={0.85}
        >
          <View
            style={[
              styles.premiumIconWrap,
              { backgroundColor: "rgba(229,9,20,0.12)" },
            ]}
          >
            <Ionicons name="diamond" size={26} color={theme.accent} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.premiumTitle, { color: theme.accent }]}>
              Join Premium!
            </Text>
            <Text style={[styles.premiumSub, { color: theme.textSecondary }]}>
              Enjoy watching Full-HD movies,{"\n"}without restrictions and
              without ads
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.accent} />
        </TouchableOpacity>

        {/* Settings */}
        <View
          style={[
            styles.settingsList,
            { backgroundColor: theme.settingsRow, borderColor: theme.border },
          ]}
        >
          {settings.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.settingRow,
                i < settings.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: theme.border,
                },
              ]}
              onPress={() => {
                if (item.route) router.push(item.route as any);
              }}
              activeOpacity={item.toggle ? 1 : 0.7}
            >
              <View
                style={[
                  styles.settingIconWrap,
                  { backgroundColor: theme.background2 },
                ]}
              >
                <Ionicons name={item.icon} size={18} color={theme.text} />
              </View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                {item.label}
              </Text>
              <View style={styles.settingRight}>
                {item.value && (
                  <Text
                    style={[styles.settingValue, { color: theme.textMuted }]}
                  >
                    {item.value}
                  </Text>
                )}
                {item.toggle ? (
                  <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    trackColor={{ false: theme.border, true: theme.accent }}
                    thumbColor="#FFFFFF"
                    ios_backgroundColor={theme.border}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.textMuted}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[
            styles.logoutBtn,
            { borderColor: theme.border, backgroundColor: theme.card },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color={theme.accent} />
          <Text style={[styles.logoutText, { color: theme.accent }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  headerBar: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoWrap: { flexDirection: "row", alignItems: "baseline" },
  logoM: { fontSize: 20, fontWeight: "900" },
  logoText: { fontSize: 16, fontWeight: "700" },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  avatarSection: { alignItems: "center", paddingTop: 16, paddingBottom: 24 },
  avatarWrap: { position: "relative", marginBottom: 14 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: "#E50914",
  },
  editAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: { fontSize: 20, fontWeight: "800", marginBottom: 4 },
  userEmail: { fontSize: 13 },
  userPhone: { fontSize: 13, marginTop: 2 },
  premiumCard: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  premiumIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  premiumTitle: { fontSize: 16, fontWeight: "800", marginBottom: 2 },
  premiumSub: { fontSize: 12, lineHeight: 18 },
  settingsList: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 14,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  settingRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  settingValue: { fontSize: 13 },
  logoutBtn: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  logoutText: { fontSize: 15, fontWeight: "700" },
});