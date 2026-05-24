import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../context/ThemeContext";
import { useProfile } from "../context/ProfileContext";

type Field = {
  key: string;
  label: string;
  value: string;
  keyboardType?: "default" | "email-address" | "phone-pad";
  isDropdown?: boolean;
  hasFlag?: boolean;
};

const GENDERS = ["Male", "Female"];

const FLAGS: { code: string; flag: string; dial: string }[] = [
  { code: "US", flag: "🇺🇸", dial: "+1" },
  { code: "GB", flag: "🇬🇧", dial: "+44" },
  { code: "CA", flag: "🇨🇦", dial: "+1" },
  { code: "AU", flag: "🇦🇺", dial: "+61" },
  { code: "DE", flag: "🇩🇪", dial: "+49" },
  { code: "FR", flag: "🇫🇷", dial: "+33" },
  { code: "IT", flag: "🇮🇹", dial: "+39" },
  { code: "ES", flag: "🇪🇸", dial: "+34" },
  { code: "PT", flag: "🇵🇹", dial: "+351" },
  { code: "NL", flag: "🇳🇱", dial: "+31" },
  { code: "BE", flag: "🇧🇪", dial: "+32" },
  { code: "CH", flag: "🇨🇭", dial: "+41" },
  { code: "SE", flag: "🇸🇪", dial: "+46" },
  { code: "NO", flag: "🇳🇴", dial: "+47" },
  { code: "DK", flag: "🇩🇰", dial: "+45" },
  { code: "FI", flag: "🇫🇮", dial: "+358" },
  { code: "JP", flag: "🇯🇵", dial: "+81" },
  { code: "KR", flag: "🇰🇷", dial: "+82" },
  { code: "CN", flag: "🇨🇳", dial: "+86" },
  { code: "IN", flag: "🇮🇳", dial: "+91" },
  { code: "BR", flag: "🇧🇷", dial: "+55" },
  { code: "MX", flag: "🇲🇽", dial: "+52" },
  { code: "AR", flag: "🇦🇷", dial: "+54" },
  { code: "RU", flag: "🇷🇺", dial: "+7" },
  { code: "ZA", flag: "🇿🇦", dial: "+27" },
  { code: "NG", flag: "🇳🇬", dial: "+234" },
  { code: "EG", flag: "🇪🇬", dial: "+20" },
  { code: "TR", flag: "🇹🇷", dial: "+90" },
  { code: "SA", flag: "🇸🇦", dial: "+966" },
  { code: "AE", flag: "🇦🇪", dial: "+971" },
  { code: "SG", flag: "🇸🇬", dial: "+65" },
  { code: "MY", flag: "🇲🇾", dial: "+60" },
  { code: "TH", flag: "🇹🇭", dial: "+66" },
  { code: "PH", flag: "🇵🇭", dial: "+63" },
  { code: "VN", flag: "🇻🇳", dial: "+84" },
  { code: "HK", flag: "🇭🇰", dial: "+852" },
  { code: "TW", flag: "🇹🇼", dial: "+886" },
  { code: "IL", flag: "🇮🇱", dial: "+972" },
  { code: "NZ", flag: "🇳🇿", dial: "+64" },
  { code: "IE", flag: "🇮🇪", dial: "+353" },
];

const COUNTRIES = [
  "Afghanistan",
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "China",
  "Colombia",
  "Egypt",
  "France",
  "Germany",
  "Ghana",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Italy",
  "Japan",
  "Kenya",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Netherlands",
  "New Zealand",
  "Nigeria",
  "Pakistan",
  "Philippines",
  "Poland",
  "Portugal",
  "Russia",
  "Saudi Arabia",
  "Singapore",
  "South Africa",
  "South Korea",
  "Spain",
  "Sweden",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "Turkey",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Venezuela",
  "Vietnam",
];

export default function EditProfileScreen() {
  const { theme } = useTheme();
  const { profile, updateProfile } = useProfile();
  const router = useRouter();

  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [gender, setGender] = useState(profile.gender);
  const [country, setCountry] = useState(profile.country);
  const [flag, setFlag] = useState(profile.flag);
  const [pickerKey, setPickerKey] = useState<string | null>(null);

  function handleUpdate() {
    updateProfile({ fullName, email, phone, gender, country, flag });
    Alert.alert("Profile Updated", "Your profile has been saved successfully.");
    router.back();
  }

  const fields: Field[] = [
    { key: "fullName", label: "Full Name", value: fullName },
    {
      key: "email",
      label: "Email",
      value: email,
      keyboardType: "email-address",
    },
    {
      key: "phone",
      label: "Phone Number",
      value: phone,
      keyboardType: "phone-pad",
      hasFlag: true,
    },
    { key: "gender", label: "Gender", value: gender, isDropdown: true },
    { key: "country", label: "Country", value: country, isDropdown: true },
  ];

  const fieldSetters: Record<string, (v: string) => void> = {
    fullName: setFullName,
    email: setEmail,
    phone: setPhone,
    gender: setGender,
    country: setCountry,
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      <StatusBar
        translucent={false}
        backgroundColor={theme.background}
        barStyle={theme.dark ? "light-content" : "dark-content"}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Edit Profile
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrap}>
            <Image style={styles.avatar} />
            <TouchableOpacity
              style={[styles.editAvatarBtn, { backgroundColor: theme.accent }]}
            >
              <Ionicons name="pencil" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.form}>
          {fields.map((field) => {
            if (field.hasFlag) {
              return (
                <View
                  key={field.key}
                  style={[
                    styles.inputField,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.flagWrap}
                    onPress={() => setPickerKey("flag")}
                  >
                    <Text style={styles.flag}>{flag}</Text>
                    <Ionicons
                      name="chevron-down"
                      size={14}
                      color={theme.textMuted}
                    />
                  </TouchableOpacity>
                  <View
                    style={[styles.divider, { backgroundColor: theme.border }]}
                  />
                  <TextInput
                    value={field.value}
                    onChangeText={fieldSetters[field.key]}
                    style={[styles.input, { color: theme.text }]}
                    placeholderTextColor={theme.textMuted}
                    placeholder={field.label}
                    keyboardType={field.keyboardType}
                  />
                </View>
              );
            }
            if (field.isDropdown) {
              return (
                <TouchableOpacity
                  key={field.key}
                  style={[
                    styles.inputField,
                    { backgroundColor: theme.card, borderColor: theme.border },
                  ]}
                  onPress={() => setPickerKey(field.key)}
                >
                  <Text
                    style={[
                      styles.input,
                      { color: field.value ? theme.text : theme.textMuted },
                    ]}
                  >
                    {field.value || `Select ${field.label}`}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={18}
                    color={theme.textMuted}
                  />
                </TouchableOpacity>
              );
            }
            return (
              <View
                key={field.key}
                style={[
                  styles.inputField,
                  { backgroundColor: theme.card, borderColor: theme.border },
                ]}
              >
                <TextInput
                  value={field.value}
                  onChangeText={fieldSetters[field.key]}
                  style={[styles.input, { color: theme.text }]}
                  placeholderTextColor={theme.textMuted}
                  placeholder={field.label}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.key === "email" ? "none" : undefined}
                />
                {field.key === "email" && (
                  <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                )}
              </View>
            );
          })}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Update Button */}
      <View style={[styles.footer, { backgroundColor: theme.background }]}>
        <TouchableOpacity
          style={[styles.updateBtn, { backgroundColor: theme.accent }]}
          onPress={handleUpdate}
        >
          <Text style={styles.updateBtnText}>Update</Text>
        </TouchableOpacity>
      </View>

      {/* Picker Modal */}
      <Modal
        visible={pickerKey !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerKey(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setPickerKey(null)}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {pickerKey === "gender"
                ? "Select Gender"
                : pickerKey === "flag"
                  ? "Select Flag"
                  : "Select Country"}
            </Text>
            <FlatList
              data={
                (pickerKey === "gender"
                  ? GENDERS
                  : pickerKey === "flag"
                    ? FLAGS
                    : COUNTRIES) as any[]
              }
              keyExtractor={(_item, idx) => String(idx)}
              renderItem={({ item }) => {
                const isFlag = pickerKey === "flag";
                const fi: any = item;
                return (
                  <TouchableOpacity
                    style={[
                      styles.pickerOption,
                      { borderBottomColor: theme.border },
                    ]}
                    onPress={() => {
                      if (pickerKey === "gender") setGender(item as string);
                      else if (pickerKey === "flag") setFlag(fi.flag);
                      else setCountry(item as string);
                      setPickerKey(null);
                    }}
                  >
                    {isFlag ? (
                      <>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                          }}
                        >
                          <Text style={{ fontSize: 22 }}>{fi.flag}</Text>
                          <Text
                            style={[
                              styles.pickerOptionText,
                              { color: theme.text },
                            ]}
                          >
                            {fi.code}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.pickerOptionText,
                            { color: theme.textMuted },
                          ]}
                        >
                          {fi.dial}
                        </Text>
                      </>
                    ) : (
                      <>
                        <Text
                          style={[
                            styles.pickerOptionText,
                            { color: theme.text },
                          ]}
                        >
                          {item as string}
                        </Text>
                        {(pickerKey === "gender" ? gender : country) ===
                          (item as string) && (
                          <Ionicons
                            name="checkmark"
                            size={20}
                            color={theme.accent}
                          />
                        )}
                      </>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  avatarSection: { alignItems: "center", paddingVertical: 24 },
  avatarWrap: { position: "relative" },
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
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  form: { paddingHorizontal: 20, gap: 14 },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  flagWrap: { flexDirection: "row", alignItems: "center", gap: 4 },
  flag: { fontSize: 20 },
  divider: { width: 1, height: 24, marginHorizontal: 4 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 36,
    paddingTop: 16,
  },
  updateBtn: {
    height: 56,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  updateBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalContent: {
    width: "100%",
    maxHeight: "60%",
    borderRadius: 16,
    paddingVertical: 20,
    overflow: "hidden",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerOptionText: { fontSize: 16 },
});