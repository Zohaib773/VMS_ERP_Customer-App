// // import { MaterialIcons } from '@expo/vector-icons';
// // import AsyncStorage from '@react-native-async-storage/async-storage';
// // import { useNavigation } from '@react-navigation/native';
// // import React, { useState } from 'react';
// // import {
// //     Alert,
// //     Modal,
// //     SafeAreaView,
// //     StyleSheet,
// //     Text,
// //     TouchableOpacity,
// //     View,
// // } from 'react-native';

// // interface CustomerSidebarProps {
// //     activeTab: string;
// //     children: React.ReactNode;
// //     userData?: any;
// // }

// // export default function CustomerSidebar({ activeTab, children, userData }: CustomerSidebarProps) {
// //     const [sidebarVisible, setSidebarVisible] = useState(false);
// //     const navigation = useNavigation();

// //     const menuItems = [
// //         { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
// //         { id: 'products', label: 'Products', icon: 'shopping-bag' },
// //         { id: 'orders', label: 'My Orders', icon: 'receipt' },
// //         { id: 'cart', label: 'Cart', icon: 'shopping-cart' },
// //         { id: 'wishlist', label: 'Wishlist', icon: 'favorite' },
// //         { id: 'profile', label: 'Profile', icon: 'person' },
// //         { id: 'settings', label: 'Settings', icon: 'settings' },
// //         { id: 'support', label: 'Support', icon: 'help' },
// //     ];

// //     const handleLogout = async () => {
// //         Alert.alert(
// //             'Logout',
// //             'Are you sure you want to logout?',
// //             [
// //                 { text: 'Cancel', style: 'cancel' },
// //                 {
// //                     text: 'Logout',
// //                     style: 'destructive',
// //                     onPress: async () => {
// //                         try {
// //                             await AsyncStorage.clear();
// //                             navigation.reset({
// //                                 index: 0,
// //                                 routes: [{ name: 'Login' as never }],
// //                             });
// //                         } catch (error) {
// //                             console.error('Logout error:', error);
// //                         }
// //                     },
// //                 },
// //             ]
// //         );
// //     };

// //     const navigateToScreen = (screen: string) => {
// //         // You can implement navigation logic here
// //         console.log(`Navigate to ${screen}`);
// //         setSidebarVisible(false);
// //     };

// //     return (
// //         <SafeAreaView style={styles.container}>
// //             {/* Top Navigation Bar */}
// //             <View style={styles.topNav}>
// //                 <TouchableOpacity onPress={() => setSidebarVisible(true)}>
                    
// //                     <MaterialIcons name="menu" size={28} color="#333" />
// //                 </TouchableOpacity>
// //                 <Text style={styles.appTitle}>My Store</Text>
// //                 <View style={styles.iconContainer}>
// //                     <TouchableOpacity style={styles.iconButton}>
// //                         <MaterialIcons name="search" size={24} color="#333" />
// //                     </TouchableOpacity>
// //                     <TouchableOpacity style={styles.iconButton}>
// //                         <MaterialIcons name="shopping-cart" size={24} color="#333" />
// //                         <View style={styles.cartBadge}>
// //                             <Text style={styles.cartBadgeText}>3</Text>
// //                         </View>
// //                     </TouchableOpacity>
// //                 </View>
// //             </View>

// //             {/* Main Content */}
// //             <View style={styles.mainContent}>
// //                 {children}
// //             </View>

// //             {/* Sidebar Modal */}
// //             <Modal
// //                 animationType="slide"
// //                 transparent={true}
// //                 visible={sidebarVisible}
// //                 onRequestClose={() => setSidebarVisible(false)}
// //             >
// //                 <View style={styles.modalOverlay}>
// //                     <View style={styles.sidebar}>
// //                         {/* Sidebar Header */}
// //                         <View style={styles.sidebarHeader}>
// //                             <View style={styles.userInfo}>
// //                                 <MaterialIcons name="account-circle" size={40} color="#4CAF50" />
// //                                 <Text style={styles.userName}>
// //                                     {userData?.first_name || 'Customer'}
// //                                 </Text>
// //                                 <Text style={styles.userEmail}>{userData?.email || 'customer@example.com'}</Text>
// //                             </View>
// //                             <TouchableOpacity
// //                                 style={styles.closeButton}
// //                                 onPress={() => setSidebarVisible(false)}
// //                             >
// //                                 <MaterialIcons name="close" size={24} color="#666" />
// //                             </TouchableOpacity>
// //                         </View>

// //                         {/* Menu Items */}
// //                         <View style={styles.menuContainer}>
// //                             {menuItems.map((item) => (
// //                                 <TouchableOpacity
// //                                     key={item.id}
// //                                     style={[
// //                                         styles.menuItem,
// //                                         activeTab.toLowerCase() === item.id && styles.activeMenuItem,
// //                                     ]}
// //                                     onPress={() => navigateToScreen(item.id)}
// //                                 >
// //                                     <MaterialIcons
// //                                         name={item.icon as any}
// //                                         size={24}
// //                                         color={activeTab.toLowerCase() === item.id ? '#4CAF50' : '#666'}
// //                                     />
// //                                     <Text
// //                                         style={[
// //                                             styles.menuText,
// //                                             activeTab.toLowerCase() === item.id && styles.activeMenuText,
// //                                         ]}
// //                                     >
// //                                         {item.label}
// //                                     </Text>
// //                                 </TouchableOpacity>
// //                             ))}
// //                         </View>

// //                         {/* Bottom Section */}
// //                         <View style={styles.bottomSection}>
// //                             <TouchableOpacity style={styles.sidebarButton}>
// //                                 <MaterialIcons name="contact-support" size={20} color="#666" />
// //                                 <Text style={styles.sidebarButtonText}>Contact Us</Text>
// //                             </TouchableOpacity>
// //                             <TouchableOpacity style={styles.sidebarButton}>
// //                                 <MaterialIcons name="info" size={20} color="#666" />
// //                                 <Text style={styles.sidebarButtonText}>About</Text>
// //                             </TouchableOpacity>
// //                             <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
// //                                 <MaterialIcons name="logout" size={24} color="#ff4444" />
// //                                 <Text style={styles.logoutText}>Logout</Text>
// //                             </TouchableOpacity>
// //                         </View>
// //                     </View>
// //                 </View>
// //             </Modal>
// //         </SafeAreaView>
// //     );
// // }

// // const styles = StyleSheet.create({
// //     container: {
// //         flex: 1,
// //         backgroundColor: '#f5f5f5',
// //     },
// //     topNav: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         paddingHorizontal: 20,
// //         paddingVertical: 15,
// //         backgroundColor: '#fff',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#e0e0e0',
// //         elevation: 2,
// //     },
// //     appTitle: {
// //         fontSize: 20,
// //         fontWeight: '700',
// //         color: '#4CAF50',
// //     },
// //     iconContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// //     iconButton: {
// //         padding: 8,
// //         marginLeft: 15,
// //         position: 'relative',
// //     },
// //     cartBadge: {
// //         position: 'absolute',
// //         top: 0,
// //         right: 0,
// //         backgroundColor: '#ff4444',
// //         borderRadius: 10,
// //         width: 18,
// //         height: 18,
// //         justifyContent: 'center',
// //         alignItems: 'center',
// //     },
// //     cartBadgeText: {
// //         color: '#fff',
// //         fontSize: 10,
// //         fontWeight: 'bold',
// //     },
// //     mainContent: {
// //         flex: 1,
// //     },
// //     //   modalOverlay: {
// //     //     flex: 1,
// //     //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //     //   },
// //     modalOverlay: {
// //         flex: 1,
// //         backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //         flexDirection: 'row',
// //     },

// //     sidebar: {
// //         width: '85%',
// //         height: '100%',
// //         backgroundColor: '#fff',
// //         justifyContent: 'space-between',
// //     },
// //     sidebarHeader: {
// //         flexDirection: 'row',
// //         justifyContent: 'space-between',
// //         alignItems: 'center',
// //         padding: 20,
// //         backgroundColor: '#f8f9fa',
// //         borderBottomWidth: 1,
// //         borderBottomColor: '#e0e0e0',
// //     },
// //     userInfo: {
// //         flex: 1,
// //     },
// //     userName: {
// //         fontSize: 18,
// //         fontWeight: '600',
// //         color: '#333',
// //         marginTop: 10,
// //     },
// //     userEmail: {
// //         fontSize: 14,
// //         color: '#666',
// //         marginTop: 4,
// //     },
// //     closeButton: {
// //         padding: 8,
// //     },
// //     menuContainer: {
// //         paddingVertical: 20,
// //     },
// //     menuItem: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingVertical: 15,
// //         paddingHorizontal: 20,
// //     },
// //     activeMenuItem: {
// //         backgroundColor: '#f0f9f0',
// //         borderRightWidth: 4,
// //         borderRightColor: '#4CAF50',
// //     },
// //     menuText: {
// //         fontSize: 16,
// //         color: '#666',
// //         marginLeft: 15,
// //     },
// //     activeMenuText: {
// //         color: '#4CAF50',
// //         fontWeight: '600',
// //     },
// //     bottomSection: {
// //         padding: 20,
// //         borderTopWidth: 1,
// //         borderTopColor: '#e0e0e0',
// //     },
// //     sidebarButton: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingVertical: 12,
// //     },
// //     sidebarButtonText: {
// //         fontSize: 14,
// //         color: '#666',
// //         marginLeft: 15,
// //     },
// //     logoutButton: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         paddingVertical: 12,
// //         marginTop: 10,
// //         borderTopWidth: 1,
// //         borderTopColor: '#e0e0e0',
// //         paddingTop: 20,
// //     },
// //     logoutText: {
// //         fontSize: 16,
// //         color: '#ff4444',
// //         marginLeft: 15,
// //         fontWeight: '500',
// //     },
// // });









// import { MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useNavigation } from '@react-navigation/native';
// import React, { useState } from 'react';
// import {
//     Alert,
//     Modal,
//     SafeAreaView,
//     StatusBar,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';

// interface CustomerSidebarProps {
//     activeTab: string;
//     children: React.ReactNode;
//     userData?: any;
// }

// export default function CustomerSidebar({ activeTab, children, userData }: CustomerSidebarProps) {
//     const [sidebarVisible, setSidebarVisible] = useState(false);
//     const navigation = useNavigation();

//     const menuItems = [
//         { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
//         { id: 'products', label: 'Products', icon: 'shopping-bag' },
//         { id: 'orders', label: 'My Orders', icon: 'receipt' },
//         { id: 'cart', label: 'Cart', icon: 'shopping-cart' },
//         { id: 'wishlist', label: 'Wishlist', icon: 'favorite' },
//         { id: 'profile', label: 'Profile', icon: 'person' },
//         { id: 'settings', label: 'Settings', icon: 'settings' },
//         { id: 'support', label: 'Support', icon: 'help' },
//     ];

//     const handleLogout = async () => {
//         Alert.alert(
//             'Logout',
//             'Are you sure you want to logout?',
//             [
//                 { text: 'Cancel', style: 'cancel' },
//                 {
//                     text: 'Logout',
//                     style: 'destructive',
//                     onPress: async () => {
//                         try {
//                             await AsyncStorage.clear();
//                             navigation.reset({
//                                 index: 0,
//                                 routes: [{ name: 'Login' as never }],
//                             });
//                         } catch (error) {
//                             console.error('Logout error:', error);
//                         }
//                     },
//                 },
//             ]
//         );
//     };

//     const navigateToScreen = (screen: string) => {
//         // You can implement navigation logic here
//         console.log(`Navigate to ${screen}`);
//         setSidebarVisible(false);
//     };

//     const statusBarHeight = StatusBar.currentHeight || 30;

//     return (
//         <SafeAreaView style={styles.container}>
//             <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            
//             {/* Top Navigation Bar - Moved down */}
//             <View style={[styles.topNav, { marginTop: statusBarHeight }]}>
//                 <TouchableOpacity onPress={() => setSidebarVisible(true)}>
//                     <MaterialIcons name="menu" size={28} color="#333" />
//                 </TouchableOpacity>
//                 <Text style={styles.appTitle}>My Store</Text>
//                 <View style={styles.iconContainer}>
//                     <TouchableOpacity style={styles.iconButton}>
//                         <MaterialIcons name="search" size={24} color="#333" />
//                     </TouchableOpacity>
//                     <TouchableOpacity style={styles.iconButton}>
//                         <MaterialIcons name="shopping-cart" size={24} color="#333" />
//                         <View style={styles.cartBadge}>
//                             <Text style={styles.cartBadgeText}>3</Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             {/* Main Content - Adjusted to start below top bar */}
//             <View style={[styles.mainContent, { marginTop: statusBarHeight + 60 }]}>
//                 {children}
//             </View>

//             {/* Sidebar Modal */}
//             <Modal
//                 animationType="slide"
//                 transparent={true}
//                 visible={sidebarVisible}
//                 onRequestClose={() => setSidebarVisible(false)}
//             >
//                 <View style={styles.modalOverlay}>
//                     <View style={[styles.sidebar, { marginTop: statusBarHeight + 60 }]}>
//                         {/* Sidebar Header */}
//                         <View style={styles.sidebarHeader}>
//                             <View style={styles.userInfo}>
//                                 <MaterialIcons name="account-circle" size={40} color="#4CAF50" />
//                                 <Text style={styles.userName}>
//                                     {userData?.first_name || 'Customer'}
//                                 </Text>
//                                 <Text style={styles.userEmail}>{userData?.email || 'customer@example.com'}</Text>
//                             </View>
//                             <TouchableOpacity
//                                 style={styles.closeButton}
//                                 onPress={() => setSidebarVisible(false)}
//                             >
//                                 <MaterialIcons name="close" size={24} color="#666" />
//                             </TouchableOpacity>
//                         </View>

//                         {/* Menu Items */}
//                         <View style={styles.menuContainer}>
//                             {menuItems.map((item) => (
//                                 <TouchableOpacity
//                                     key={item.id}
//                                     style={[
//                                         styles.menuItem,
//                                         activeTab.toLowerCase() === item.id && styles.activeMenuItem,
//                                     ]}
//                                     onPress={() => navigateToScreen(item.id)}
//                                 >
//                                     <MaterialIcons
//                                         name={item.icon as any}
//                                         size={24}
//                                         color={activeTab.toLowerCase() === item.id ? '#4CAF50' : '#666'}
//                                     />
//                                     <Text
//                                         style={[
//                                             styles.menuText,
//                                             activeTab.toLowerCase() === item.id && styles.activeMenuText,
//                                         ]}
//                                     >
//                                         {item.label}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         {/* Bottom Section */}
//                         <View style={styles.bottomSection}>
//                             <TouchableOpacity style={styles.sidebarButton}>
//                                 <MaterialIcons name="contact-support" size={20} color="#666" />
//                                 <Text style={styles.sidebarButtonText}>Contact Us</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.sidebarButton}>
//                                 <MaterialIcons name="info" size={20} color="#666" />
//                                 <Text style={styles.sidebarButtonText}>About</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//                                 <MaterialIcons name="logout" size={24} color="#ff4444" />
//                                 <Text style={styles.logoutText}>Logout</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </View>
//                 </View>
//             </Modal>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     topNav: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//         backgroundColor: '#fff',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//         elevation: 2,
//         position: 'absolute',
//         left: 0,
//         right: 0,
//         top: 0,
//         zIndex: 20,
//         height: 60,
//     },
//     appTitle: {
//         fontSize: 20,
//         fontWeight: '700',
//         color: '#4CAF50',
//     },
//     iconContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//     },
//     iconButton: {
//         padding: 8,
//         marginLeft: 15,
//         position: 'relative',
//     },
//     cartBadge: {
//         position: 'absolute',
//         top: 0,
//         right: 0,
//         backgroundColor: '#ff4444',
//         borderRadius: 10,
//         width: 18,
//         height: 18,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     cartBadgeText: {
//         color: '#fff',
//         fontSize: 10,
//         fontWeight: 'bold',
//     },
//     mainContent: {
//         flex: 1,
//     },
//     modalOverlay: {
//         flex: 1,
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         flexDirection: 'row',
//     },
//     sidebar: {
//         width: '85%',
//         height: '100%',
//         backgroundColor: '#fff',
//         justifyContent: 'space-between',
//     },
//     sidebarHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         padding: 20,
//         backgroundColor: '#f8f9fa',
//         borderBottomWidth: 1,
//         borderBottomColor: '#e0e0e0',
//     },
//     userInfo: {
//         flex: 1,
//     },
//     userName: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#333',
//         marginTop: 10,
//     },
//     userEmail: {
//         fontSize: 14,
//         color: '#666',
//         marginTop: 4,
//     },
//     closeButton: {
//         padding: 8,
//     },
//     menuContainer: {
//         paddingVertical: 20,
//     },
//     menuItem: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//     },
//     activeMenuItem: {
//         backgroundColor: '#f0f9f0',
//         borderRightWidth: 4,
//         borderRightColor: '#4CAF50',
//     },
//     menuText: {
//         fontSize: 16,
//         color: '#666',
//         marginLeft: 15,
//     },
//     activeMenuText: {
//         color: '#4CAF50',
//         fontWeight: '600',
//     },
//     bottomSection: {
//         padding: 20,
//         borderTopWidth: 1,
//         borderTopColor: '#e0e0e0',
//     },
//     sidebarButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//     },
//     sidebarButtonText: {
//         fontSize: 14,
//         color: '#666',
//         marginLeft: 15,
//     },
//     logoutButton: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         paddingVertical: 12,
//         marginTop: 10,
//         borderTopWidth: 1,
//         borderTopColor: '#e0e0e0',
//         paddingTop: 20,
//     },
//     logoutText: {
//         fontSize: 16,
//         color: '#ff4444',
//         marginLeft: 15,
//         fontWeight: '500',
//     },
// });

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
  { id: 1, title: "Dashboard", icon: "dashboard", route: "/Customer/Customer_dashboard", color: "#667eea" },
  { id: 2, title: "Products", icon: "shopping-bag", route: "/Customer/Products", color: "#4CAF50" },
  { id: 3, title: "My Orders", icon: "receipt", route: "/Customer/Orders", color: "#2196F3" },
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  const handleLogout = () => {
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