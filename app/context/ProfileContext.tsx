import React, { createContext, useContext, useState } from "react";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  country: string;
  flag: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (data: Partial<ProfileData>) => void;
}

const defaultProfile: ProfileData = {
  fullName: "Name Surname",
  email: "youremail@domain.com",
  phone: "",
  gender: "",
  country: "",
  flag: "🇺🇸",
};

const ProfileContext = createContext<ProfileContextType>({
  profile: defaultProfile,
  updateProfile: () => {},
});

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);

  const updateProfile = (data: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);

// Silences Expo Router "missing default export" warning for context files
export default function ProfileContextModule() {
  return null;
}
