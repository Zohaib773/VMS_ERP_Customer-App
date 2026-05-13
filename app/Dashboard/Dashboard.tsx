
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from "react";
//import WifiManager from "react-native-wifi-reborn";

import {
  ActivityIndicator,
  Alert,
  Modal,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from 'expo-router';
import { Animated } from "react-native";
import CustomerSidebar from '../component/sidebarlayout';
import CaptivePortalScreen from './Captive_portal';

export default function CustomerDashboardScreen() {
  const scanLock = useRef<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [portalVisible, setPortalVisible] = useState(false);
  const [portalData, setPortalData] = useState<any>(null);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const [connectingWifi, setConnectingWifi] = useState(false);
  const manualButtonScale = useRef(new Animated.Value(1)).current;
  const params = useLocalSearchParams();

  const { manual, ssid, password } = useLocalSearchParams();

  const [handledManual, setHandledManual] = useState(false);




  // ----------------------------
  // Load auth data
  // ----------------------------
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const [[, userData], [, access]] = await AsyncStorage.multiGet([
          "userData",
          "accessToken",
        ]);

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setLoggedInUser(parsedUser);
          console.log("Customer logged in:", parsedUser);
        }

        setAccessToken(access);
        console.log("Access token:", access);
      } catch (error) {
        console.error("Failed to load auth data", error);
      }
    };

    loadAuthData();
  }, []);

  // useEffect(() => {
  //   if (manual === "true" && !handledManual) {
  //     console.log("📡 Manual config received");

  //     setPortalData({
  //       ssid,
  //       password,
  //       userId: loggedInUser.id
  //     });

  //     setPortalVisible(true);
  //     setHandledManual(true); // stop loop
  //   }
  // }, [manual, handledManual]);
  useEffect(() => {
    if (manual === "true" && !handledManual && loggedInUser) { // ✅ wait for user
      console.log("📡 Manual config received");

      setPortalData({
        ssid,
        password,
        userId: loggedInUser.id  // ✅ safe now
      });

      setPortalVisible(true);
      setHandledManual(true);
    }
  }, [manual, handledManual, loggedInUser]); // ✅ add loggedInUser as dependency

  // ----------------------------
  // Request location permission for Android
  // ----------------------------
  const requestLocationPermission = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: "Location Permission",
          message: "Required to connect to Wi-Fi networks",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // ----------------------------
  // Ping device
  // ----------------------------
  const pingDevice = async (ip: string) => {
    try {
      console.log("📡 Pinging device:", ip);
      const res = await axios.get(`http://${ip}:8000/ping`, { timeout: 3000 });
      console.log("✅ Device ping success:", res.data);
      return true;
    } catch (err) {
      console.log("❌ Device ping failed at", ip);
      return false;
    }
  };

  // ----------------------------
  // Scan QR Code
  // ----------------------------
  const handleScanQRCode = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert("Permission Required", "Camera permission is required to scan QR codes.");
        return;
      }
    }
    setScanned(false);
    setCameraVisible(true);
  };

  // ----------------------------
  // Handle QR Code scanned
  // ----------------------------
  ////////////////////////////////  FINAL WORKING  /////////////////////
  // const handleBarCodeScanned = async ({ data }: { data: string }) => {
  //   if (scanLock.current) return;
  //   scanLock.current = true;

  //   console.log("========================================");
  //   console.log("📸 QR SCAN TRIGGERED:", data);

  //   let ssid: string | null = null;
  //   let password: string | null = null;
  //   let deviceIp: string | null = null;

  //   console.log("🔹 Step 1: Parsing QR");

  //   try {
  //     // 1️⃣ Try JSON first
  //     const parsed = JSON.parse(data);
  //     ssid = parsed.ssid || null;
  //     password = parsed.password || null;
  //     deviceIp = parsed.ip || null;
  //     console.log("🧩 JSON QR Parsed:", parsed);
  //   } catch {
  //     // 2️⃣ Try pipe-separated format
  //     if (data.includes("|")) {
  //       const parts = data.split("|");
  //       ssid = parts[0].trim();
  //       password = parts[1].trim();
  //       console.log("📄 Pipe QR Parsed:", { ssid, password });
  //     }
  //     // 3️⃣ Space-separated format
  //     else {
  //       const parts = data.trim().split(" ");
  //       if (parts.length >= 2) {
  //         ssid = parts.slice(0, parts.length - 1).join(" ");
  //         password = parts[parts.length - 1];
  //         console.log("⚠️ Space QR Parsed:", { ssid, password });
  //       } else {
  //         console.log("❌ QR Parsing Failed: not enough parts");
  //         Alert.alert("Invalid QR", "SSID or Password missing");
  //         scanLock.current = false;
  //         return;
  //       }
  //     }
  //   }

  //   if (!ssid || !password) {
  //     console.log("❌ QR Parsing Failed: missing SSID or Password");
  //     Alert.alert("Invalid QR", "SSID or Password missing");
  //     scanLock.current = false;
  //     return;
  //   }

  //   console.log("🔹 Step 2: Android permissions check");

  //   if (Platform.OS === "android") {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     console.log("📍 Location permission result:", granted);

  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       console.log("❌ Permission Denied");
  //       Alert.alert("Permission Denied", "Location must be ON");
  //       scanLock.current = false;
  //       return;
  //     }
  //   }

  //   console.log("🔹 Step 3: Attempting Wi-Fi connection");

  //   try {
  //     console.log(`📡 Connecting to SSID: ${ssid} with password: ${password}`);
  //     await WifiManager.connectToProtectedSSID(ssid, password, false, false);
  //     console.log("⏳ Connection command sent...");

  //     if (Platform.OS === "android") {
  //       console.log("🔧 Forcing Android to route traffic via hotspot");
  //       await WifiManager.forceWifiUsage(true);
  //     }

  //     // Wait a moment and check the current SSID
  //     await new Promise(resolve => setTimeout(resolve, 2000)); // 2 seconds delay
  //     let currentSSID = null;
  //     try {
  //       currentSSID = await WifiManager.getCurrentWifiSSID();
  //     } catch (err) {
  //       console.log("⚠️ getCurrentWifiSSID() failed:", err);
  //     }

  //     console.log("✅ Connection attempt finished. Reported SSID:", currentSSID);
  //     // 🔹 Step 3a: Test connectivity to the device hotspot
  //     if (deviceIp) {
  //       console.log("🌐 Testing connectivity to device IP:", deviceIp);
  //       try {
  //         const response = await fetch(`http://${deviceIp}`, { method: "GET" });
  //         console.log("✅ Device reachable! HTTP status:", response.status);
  //       } catch (err) {
  //         console.log("❌ Device not reachable yet:", err);
  //       }
  //     }

  //     // Optional: Test connectivity to device IP
  //     // if (deviceIp) {
  //     //   console.log("🌐 Testing connectivity to device IP:", deviceIp);
  //     //   try {
  //     //     const response = await fetch(`http://${deviceIp}`, { method: "GET" });
  //     //     console.log("✅ Device reachable!", response.status);
  //     //   } catch (err) {
  //     //     console.log("❌ Device not reachable yet", err);
  //     //   }
  //     // }

  //     Alert.alert("Connected", `Connection attempt finished. SSID: ${currentSSID || ssid}`);
  //   } catch (error) {
  //     console.log("❌ Wi-Fi Connection Failed:", error);
  //     Alert.alert("Connection Failed", "Could not connect to Wi-Fi");
  //     scanLock.current = false;
  //     return;
  //   }

  //   console.log("🔹 Step 4: Continuing app flow");
  //   setCameraVisible(false);
  //   // if (deviceIp) {
  //     console.log("📡 Showing portal with device IP:", deviceIp);
  //     setPortalData({ device_ip: deviceIp });
  //     setPortalVisible(true);
  //   // }
  //   console.log("========================================");
  // };

  // const handleBarCodeScanned = async ({ data }: { data: string }) => {

  //     setPortalVisible(true);
  // };

  ////////////////////// NEW TESTING OF QR WITH TOKEN AND DEVICE NAME ///////////////////
  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanLock.current) return;
    scanLock.current = true;

    console.log("========================================");
    console.log("📸 QR SCAN TRIGGERED:", data);

    let qrToken: string | null = null;
    let deviceName: string | null = null;

    console.log("🔹 Step 1: Parsing simple QR");

    try {
      // Split by new lines
      const lines = data.split("\n");

      lines.forEach(line => {
        const trimmed = line.trim();

        if (trimmed.toLowerCase().startsWith("qr-token")) {
          qrToken = trimmed.split(":")[1]?.trim() || null;
        }

        if (trimmed.toLowerCase().startsWith("device")) {
          deviceName = trimmed.split(":")[1]?.trim() || null;
        }
      });

      console.log("🧩 Parsed QR Data:", { qrToken, deviceName });
    } catch (err) {
      console.log("❌ QR Parsing Failed:", err);
    }

    if (!qrToken || !deviceName) {
      console.log("❌ Invalid QR: Missing token or device name");
      Alert.alert("Invalid QR", "QR token or device name missing");
      scanLock.current = false;
      return;
    }

    // 🚫 Wi-Fi logic disabled for testing
    /*
    await WifiManager.connectToProtectedSSID(...)
    await WifiManager.forceWifiUsage(true)
    */

    console.log("🔹 Step 2: Passing data to portal");

    setCameraVisible(false);

    setPortalData({
      qr_token: qrToken,
      device_name: deviceName,
    });

    setPortalVisible(true);

    console.log("✅ Portal data set successfully");
    console.log("========================================");
  };










  // ----------------------------
  // UI
  // ----------------------------
  return (
    <CustomerSidebar activeTab="Dashboard" userData={loggedInUser}>
      <ScrollView style={styles.contentContainer}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome back, {loggedInUser?.first_name || 'Customer'}! 👋</Text>
          <Text style={styles.welcomeSubtitle}>Here's what's happening with your account today</Text>
        </View>


        {/* Scan Device Section */}
        <View style={styles.scanSection}>
          <View style={styles.scanSectionHeader}>
            <MaterialIcons name="qr-code-scanner" size={24} color="#2196F3" />
            <Text style={styles.scanSectionTitle}>Quick Actions</Text>
          </View>

          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanQRCode}
            activeOpacity={0.8}
          >
            <View style={styles.scanButtonContent}>
              <View style={styles.scanIconContainer}>
                <MaterialIcons name="camera-alt" size={32} color="#fff" />
                <View style={styles.qrCodeIcon}>
                  <MaterialIcons name="qr-code-2" size={16} color="#2196F3" />
                </View>
              </View>
              <View style={styles.scanButtonTextContainer}>
                <Text style={styles.scanButtonTitle}>Scan Device QR Code</Text>
                <Text style={styles.scanButtonSubtitle}>
                  Link new devices to your account instantly
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color="#2196F3"
                style={styles.chevronIcon}
              />
            </View>

            {/* Decorative background elements */}
            <View style={styles.scanButtonDecoration}>
              <View style={[styles.decorationCircle, styles.decorationCircle1]} />
              <View style={[styles.decorationCircle, styles.decorationCircle2]} />
            </View>
          </TouchableOpacity>

          <View style={styles.scanTipsContainer}>
            <Text style={styles.scanTipsTitle}>How to scan:</Text>
            <View style={styles.scanTips}>
              <View style={styles.tipItem}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Ensure good lighting</Text>
              </View>
              <View style={styles.tipItem}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Hold steady 6-12 inches away</Text>
              </View>
              <View style={styles.tipItem}>
                <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.tipText}>Align QR code within frame</Text>
              </View>
            </View>
          </View>

          {/* Manual Open Captive Portal Button */}
          {/* <TouchableOpacity
            style={styles.manualPortalButton}
            activeOpacity={0.8}
            onPress={() => {
              setPortalData(null); // optional
              setPortalVisible(true);
            }}
          >
            <View style={styles.manualPortalContent}>
              <View style={styles.manualIconContainer}>
                <MaterialIcons name="settings-ethernet" size={26} color="#fff" />
              </View>

              <View style={styles.manualTextContainer}>
                <Text style={styles.manualPortalTitle}>
                  Configure Device Manually
                </Text>
                <Text style={styles.manualPortalSubtitle}>
                  Configure device without scanning QR
                </Text>
              </View>

              <MaterialIcons name="chevron-right" size={22} color="#4CAF50" />
            </View>
          </TouchableOpacity> */}
          {/* Premium Manual Captive Portal Button */}
          <Animated.View style={{ transform: [{ scale: manualButtonScale }] }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={() => {
                Animated.spring(manualButtonScale, {
                  toValue: 0.96,
                  useNativeDriver: true,
                }).start();
              }}
              onPressOut={() => {
                Animated.spring(manualButtonScale, {
                  toValue: 1,
                  friction: 3,
                  useNativeDriver: true,
                }).start();
              }}
              onPress={() => {
                // setPortalData(null);
                // setPortalVisible(true);
                router.push('/Dashboard/wifiConfigScreen');
              }}
            >
              <LinearGradient
                colors={["#4CAF50", "#2E7D32"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumButton}
              >
                <View style={styles.premiumContent}>
                  <View style={styles.premiumIconWrapper}>
                    <MaterialIcons name="settings-ethernet" size={26} color="#4CAF50" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={styles.premiumTitle}>
                      Open Captive Portal
                    </Text>
                    <Text style={styles.premiumSubtitle}>
                      Configure device manually
                    </Text>
                  </View>

                  <MaterialIcons name="arrow-forward-ios" size={18} color="#fff" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>

      {/* Camera Scanner Modal */}
      <Modal visible={cameraVisible} animationType="slide">
        <CameraView
          style={{ flex: 1 }}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        />

        <TouchableOpacity
          onPress={() => setCameraVisible(false)}
          style={{
            position: 'absolute',
            bottom: 40,
            alignSelf: 'center',
            backgroundColor: '#000',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16 }}>Close Scanner</Text>
        </TouchableOpacity>
      </Modal>
      <Modal visible={connectingWifi} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}>
          <View style={{
            width: 250,
            padding: 20,
            backgroundColor: "#fff",
            borderRadius: 10,
            alignItems: "center",
          }}>
            <ActivityIndicator size="large" color="#2196F3" />
            <Text style={{ marginTop: 15, fontSize: 16, textAlign: "center" }}>
              Connecting to Wi-Fi...
            </Text>
          </View>
        </View>
      </Modal>


      {/* Captive Portal */}
      <CaptivePortalScreen
        visible={portalVisible}
        data={portalData}
        accessToken={accessToken}
        qrToken={qrToken}
        onClose={() => setPortalVisible(false)}
        onSubmit={(data) => {
          console.log("✅ Final Captive Portal Data:", data);
          setPortalVisible(false);
        }}
      />
    </CustomerSidebar>
  );
}
// const styles = StyleSheet.create({
//   contentContainer: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   welcomeSection: {
//     padding: 20,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   welcomeTitle: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 5,
//   },
//   welcomeSubtitle: {
//     fontSize: 14,
//     color: '#666',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//     padding: 20,
//   },
//   statCard: {
//     width: '48%',
//     padding: 15,
//     borderRadius: 12,
//     marginBottom: 15,
//     alignItems: 'center',
//     elevation: 2,
//   },
//   statNumber: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#fff',
//     marginVertical: 8,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//   },
//   // Scan Section Styles
//   scanSection: {
//     backgroundColor: '#fff',
//     margin: 20,
//     borderRadius: 16,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   scanSectionHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   scanSectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginLeft: 10,
//   },
//   scanButton: {
//     backgroundColor: '#F0F8FF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     borderWidth: 1.5,
//     borderColor: '#E3F2FD',
//     position: 'relative',
//     overflow: 'hidden',
//   },
//   scanButtonContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   scanIconContainer: {
//     position: 'relative',
//     width: 60,
//     height: 60,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   qrCodeIcon: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 4,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     elevation: 2,
//   },
//   scanButtonTextContainer: {
//     flex: 1,
//     marginHorizontal: 16,
//   },
//   scanButtonTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#2196F3',
//     marginBottom: 4,
//   },
//   scanButtonSubtitle: {
//     fontSize: 12,
//     color: '#666',
//     lineHeight: 16,
//   },
//   chevronIcon: {
//     opacity: 0.8,
//   },
//   scanButtonDecoration: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     zIndex: -1,
//   },
//   decorationCircle: {
//     position: 'absolute',
//     borderRadius: 100,
//     backgroundColor: 'rgba(33, 150, 243, 0.05)',
//   },
//   decorationCircle1: {
//     width: 100,
//     height: 100,
//     top: -40,
//     right: -40,
//   },
//   decorationCircle2: {
//     width: 80,
//     height: 80,
//     bottom: -30,
//     left: -30,
//   },
//   scanTipsContainer: {
//     backgroundColor: '#F9F9F9',
//     borderRadius: 12,
//     padding: 16,
//   },
//   scanTipsTitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 12,
//   },
//   scanTips: {
//     gap: 8,
//   },
//   tipItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   tipText: {
//     fontSize: 12,
//     color: '#555',
//     marginLeft: 8,
//   },
//   // Manual button styles
//   manualPortalButton: {
//     marginTop: 15,
//     backgroundColor: "#E8F5E9",
//     borderRadius: 16,
//     paddingVertical: 18,
//     paddingHorizontal: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     elevation: 3,
//   },

//   manualPortalContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },

//   manualIconContainer: {
//     width: 45,
//     height: 45,
//     borderRadius: 12,
//     backgroundColor: "#4CAF50",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },

//   manualTextContainer: {
//     flex: 1,
//   },

//   manualPortalTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#2E7D32",
//   },

//   manualPortalSubtitle: {
//     fontSize: 13,
//     color: "#4CAF50",
//     marginTop: 3,
//   },
//   premiumButton: {
//     marginTop: 18,
//     borderRadius: 20,
//     paddingVertical: 18,
//     paddingHorizontal: 18,
//     shadowColor: "#2E7D32",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.35,
//     shadowRadius: 12,
//     elevation: 8,
//   },

//   premiumContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },

//   premiumIconWrapper: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     backgroundColor: "#ffffff",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 14,
//   },

//   premiumTitle: {
//     fontSize: 17,
//     fontWeight: "700",
//     color: "#ffffff",
//   },

//   premiumSubtitle: {
//     fontSize: 13,
//     color: "#E8F5E9",
//     marginTop: 3,
//   },
// });


const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#0a0e1a', // Dark background
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#131826', // Dark header background
    borderBottomWidth: 1,
    borderBottomColor: '#2a2f3e', // Dark border
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff', // White text
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#9ca3af', // Light gray
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 20,
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  // Scan Section Styles
  scanSection: {
    backgroundColor: '#1a1f2e', // Dark card background
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scanSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scanSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff', // White text
    marginLeft: 10,
  },
  scanButton: {
    backgroundColor: '#131826', // Dark button background
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#2a3e5c', // Darker border
    position: 'relative',
    overflow: 'hidden',
  },
  scanButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scanIconContainer: {
    position: 'relative',
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrCodeIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1a1f2e', // Dark background
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  scanButtonTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  scanButtonTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4FC3F7', // Lighter blue for dark mode
    marginBottom: 4,
  },
  scanButtonSubtitle: {
    fontSize: 12,
    color: '#9ca3af', // Light gray
    lineHeight: 16,
  },
  chevronIcon: {
    opacity: 0.8,
    color: '#6b7280', // Medium gray
  },
  scanButtonDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
  decorationCircle: {
    position: 'absolute',
    borderRadius: 100,
    backgroundColor: 'rgba(79, 195, 247, 0.05)', // Subtle blue tint
  },
  decorationCircle1: {
    width: 100,
    height: 100,
    top: -40,
    right: -40,
  },
  decorationCircle2: {
    width: 80,
    height: 80,
    bottom: -30,
    left: -30,
  },
  scanTipsContainer: {
    backgroundColor: '#131826', // Dark background
    borderRadius: 12,
    padding: 16,
  },
  scanTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff', // White text
    marginBottom: 12,
  },
  scanTips: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 12,
    color: '#9ca3af', // Light gray
    marginLeft: 8,
  },
  // Manual button styles
  manualPortalButton: {
    marginTop: 15,
    backgroundColor: "#132a1a", // Dark green-tinted background
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  manualPortalContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  manualIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#2E7D32", // Dark green
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  manualTextContainer: {
    flex: 1,
  },
  manualPortalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#81C784", // Light green for dark mode
  },
  manualPortalSubtitle: {
    fontSize: 13,
    color: "#A5D6A7", // Light green
    marginTop: 3,
  },
  premiumButton: {
    marginTop: 18,
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 18,
    shadowColor: "#2E7D32",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  premiumIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#1a1f2e", // Dark background
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  premiumTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#ffffff",
  },
  premiumSubtitle: {
    fontSize: 13,
    color: "#A5D6A7", // Light green tint
    marginTop: 3,
  },
});