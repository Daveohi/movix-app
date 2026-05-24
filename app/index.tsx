// import ProfileScreen from "./screens/ProfileScreen";
// import HomeScreen from "./screens/homeScreen";
// import ContactScreen from "./screens/ContactScreen";
// import DataScreen from "./screens/DataScreen";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Ionicons } from "@expo/vector-icons";
// import MovieHomeScreen from "./screens/MovieHomeScreen";

// const Tab = createBottomTabNavigator();

// export default function App() {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ color, size }) => {
//           let iconName: keyof typeof Ionicons.glyphMap = "home";
//           if (route.name === "Home") {
//             iconName = "home";
//           } else if (route.name === "Contact") {
//             iconName = "people";
//           } else if (route.name === "Data") {
//             iconName = "menu";
//           } else if (route.name === "Profile") {
//             iconName = "person";
//           }
//           return <Ionicons name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: "#6366F1",
//         tabBarInactiveTintColor: "gray",
//         headerStyle: { backgroundColor: "#105379" },
//         headerTintColor: "#FFFFFF",
//         tabBarStyle: { backgroundColor: "#0f0e0e", borderTopColor: "#E5E7EB" },
//       })}
//     >
//       <Tab.Screen name="Home" component={MovieHomeScreen} />
//       <Tab.Screen name="Contact" component={ContactScreen} />
//       <Tab.Screen name="Data" component={DataScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }

import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../app/context/ThemeContext";

import MovieHomeScreen from "./screens/MovieHomeScreen";
import ExploreScreen from "./screens/ExploreScreen";
import MyListScreen from "./screens/MyListScreen";
import ProfileScreen from "./screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      key={theme.dark ? "dark" : "light"}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: {
          backgroundColor: theme.tabBar,
          borderTopColor: theme.tabBarBorder,
          borderTopWidth: 1,
          height: 64,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "MyList") {
            iconName = focused ? "bookmark" : "bookmark-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person-circle" : "person-circle-outline";
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={MovieHomeScreen}
        options={{ tabBarLabel: "Home" }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{ tabBarLabel: "Explore" }}
      />
      <Tab.Screen
        name="MyList"
        component={MyListScreen}
        options={{ tabBarLabel: "My List" }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: "Profile" }}
      />
    </Tab.Navigator>
  );
}