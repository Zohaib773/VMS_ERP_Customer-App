import { Feather, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Animated, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type MenuItem = {
  id: number;
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  route: string;
  color: string;
};

// Customer-specific menu items
const menuItems: MenuItem[] = [
  { id: 1, title: "Dashboard", icon: "dashboard", route: "/Dashboard/Dashboard", color: "#667eea" },
  { id: 2, title: "My Devices", icon: "shopping-bag", route: "/Dashboard/All_devices", color: "#4CAF50" },
  { id: 3, title: "Cams Management", icon: "receipt", route: "/Dashboard/cams_management", color: "#2196F3" },
  { id: 4, title: "Cart", icon: "shopping-cart", route: "/Customer/Cart", color: "#FF9800" },
  { id: 5, title: "Wishlist", icon: "favorite", route: "/Customer/Wishlist", color: "#E91E63" },
  { id: 6, title: "Profile", icon: "person", route: "/Customer/Profile", color: "#9C27B0" },
  { id: 7, title: "Payments", icon: "payment", route: "/Customer/Payments", color: "#00BCD4" },
  { id: 8, title: "Settings", icon: "settings", route: "/Customer/Settings", color: "#795548" },
  { id: 9, title: "Help & Support", icon: "help-center", route: "/Customer/Support", color: "#607D8B" },
];

type Props = {
  activeTab: string;
  children: React.ReactNode;
  userData?: any;
};

export default function CustomerSidebarLayout({ activeTab, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const translateX = React.useRef(new Animated.Value(sidebarOpen ? 0 : -250)).current;

  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [[, userData], [, access], [, refresh]] =
          await AsyncStorage.multiGet([
            "userData",
            "accessToken",
            "refreshToken",
          ]);

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setLoggedInUser(parsedUser);
          console.log("Logged in customer:", parsedUser);
        }

        setAccessToken(access);
        setRefreshToken(refresh);

        console.log("Access token:", access);
        console.log("Refresh token:", refresh);

      } catch (error) {
        console.error("Failed to load auth data", error);
      }
    };

    loadAuthData();
  }, []);

  const toggleSidebar = () => {
    Animated.timing(translateX, {
      toValue: sidebarOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const navigateTo = (route: string, title: string) => {
    router.push(route as any);
  };

  // const handleLogout = () => {
  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.replace("/");
  };

  const statusBarHeight = StatusBar.currentHeight || 30;

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Top Navigation Bar */}
      <View style={[styles.topBar, { marginTop: statusBarHeight }]}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Feather name={sidebarOpen ? "x" : "menu"} size={24} color="#333" />
        </TouchableOpacity>

        <View style={styles.topBarContent}>
          <Text style={styles.topBarTitle}>CustomerPortal</Text>
          <Text style={styles.topBarSubtitle}>{activeTab}</Text>
        </View>

        <TouchableOpacity style={styles.profileButton}>
          <MaterialIcons name="account-circle" size={40} color="#667eea" />
        </TouchableOpacity>
      </View>

      {/* Main Container - Now starts below the top bar */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sidebar - Adjusted to start below top bar */}
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX }],
              position: 'absolute',
              top: statusBarHeight + 60, // Top bar height + status bar
              bottom: 0,
              zIndex: 10,
            },
          ]}
        >
          <ScrollView
            style={styles.sidebarScroll}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.profileSection}>
              <View style={styles.profileAvatar}>
                <MaterialIcons name="person" size={50} color="#fff" />
              </View>
              <Text style={styles.profileName}>{loggedInUser?.first_name} {loggedInUser?.last_name}</Text>
              <Text style={styles.profileEmail}>{loggedInUser?.email}</Text>
              <Text style={styles.profileRole}>Customer</Text>
            </View>

            {/* Menu Items */}
            <View style={styles.menuSection}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, activeTab === item.title && styles.activeMenuItem]}
                  onPress={() => navigateTo(item.route, item.title)}
                >
                  <View
                    style={[
                      styles.menuIconContainer,
                      { backgroundColor: activeTab === item.title ? item.color : "#f0f0f0" },
                    ]}
                  >
                    <MaterialIcons
                      name={item.icon}
                      size={22}
                      color={activeTab === item.title ? "#fff" : item.color}
                    />
                  </View>
                  <Text style={[styles.menuText, activeTab === item.title && styles.activeMenuText]}>
                    {item.title}
                  </Text>
                  {activeTab === item.title && <View style={[styles.activeIndicator, { backgroundColor: item.color }]} />}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.divider} />

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <View style={styles.logoutIconContainer}>
                <MaterialIcons name="logout" size={22} color="#f44336" />
              </View>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Main Content - Adjusted to start below top bar */}
        <View style={{ flex: 1, marginTop: statusBarHeight + 60 }}>
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 20,
  },
  menuButton: { padding: 5 },
  topBarContent: { flex: 1, marginLeft: 10 },
  topBarTitle: { fontSize: 18, fontWeight: "bold" },
  topBarSubtitle: { fontSize: 14, color: "#666" },
  profileButton: {},
  sidebar: {
    width: 250,
    backgroundColor: "#fff",
    borderRightWidth: 1,
    borderRightColor: "#eee",
    zIndex: 10,
    elevation: 5,
  },
  sidebarScroll: { flex: 1 },
  profileSection: { alignItems: "center", paddingVertical: 30, borderBottomWidth: 1, borderBottomColor: "#eee" },
  profileAvatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "#667eea", justifyContent: "center", alignItems: "center", marginBottom: 15 },
  profileName: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 5 },
  profileEmail: { fontSize: 14, color: "#666", marginBottom: 5 },
  profileRole: { fontSize: 14, color: "#4CAF50", fontWeight: "500" },
  menuSection: { paddingVertical: 20 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 20, position: "relative" },
  activeMenuItem: { backgroundColor: "rgba(102,126,234,0.05)" },
  menuIconContainer: { width: 40, height: 40, borderRadius: 8, justifyContent: "center", alignItems: "center", marginRight: 15 },
  menuText: { fontSize: 16, color: "#555", flex: 1 },
  activeMenuText: { color: "#333", fontWeight: "600" },
  activeIndicator: { position: "absolute", right: 0, top: "50%", transform: [{ translateY: -10 }], width: 4, height: 20, borderTopLeftRadius: 2, borderBottomLeftRadius: 2 },
  divider: { height: 1, backgroundColor: "#eee", marginHorizontal: 20, marginVertical: 10 },
  logoutButton: { flexDirection: "row", alignItems: "center", paddingVertical: 15, paddingHorizontal: 20, marginTop: 10 },
  logoutIconContainer: { width: 40, height: 40, borderRadius: 8, backgroundColor: "rgba(244,67,54,0.1)", justifyContent: "center", alignItems: "center", marginRight: 15 },
  logoutText: { fontSize: 16, color: "#f44336", fontWeight: "600" },
});