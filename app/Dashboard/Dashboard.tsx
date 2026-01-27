// import { MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import { CameraView, useCameraPermissions } from 'expo-camera';
// import React, { useEffect, useState } from "react";
// import { Platform, PermissionsAndroid } from "react-native";
// import WifiManager from "react-native-wifi-reborn";
// import {
//   Alert,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View
// } from "react-native";
// import CustomerSidebar from '../component/sidebarlayout';
// import urls from '../urls/urls';
// import CaptivePortalScreen from './Captive_portal';


// export default function CustomerDashboardScreen() {
//   const [loggedInUser, setLoggedInUser] = useState<any>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false);
//   const [portalVisible, setPortalVisible] = useState(false);
//   const [portalData, setPortalData] = useState<any>(null);
//   const [qrToken, setQrToken] = useState<string | null>(null);




//   useEffect(() => {
//     const loadAuthData = async () => {
//       try {
//         const [[, userData], [, access]] = await AsyncStorage.multiGet([
//           "userData",
//           "accessToken",
//         ]);

//         if (userData) {
//           const parsedUser = JSON.parse(userData);
//           setLoggedInUser(parsedUser);
//           console.log("Customer logged in:", parsedUser);
//         }

//         setAccessToken(access);
//         console.log("Access token:", access);

//       } catch (error) {
//         console.error("Failed to load auth data", error);
//       }
//     };

//     loadAuthData();
//   }, []);

//   // Mock function for scanning QR code
//   // const handleScanQRCode = async () => {
//   //   try {
//   //     // TODO: Replace with actual QR scanner implementation
//   //     // Example using expo-camera or react-native-vision-camera
//   //     Alert.alert(
//   //       "Scan QR Code",
//   //       "This would open the camera for QR code scanning.\n\nImplement using:\n• expo-camera with expo-barcode-scanner\n• react-native-vision-camera\n• react-native-qrcode-scanner",
//   //       [
//   //         { text: "Cancel", style: "cancel" },
//   //         {
//   //           text: "Simulate Scan",
//   //           onPress: () => {
//   //             // Simulate a successful scan
//   //             Alert.alert(
//   //               "QR Code Scanned!",
//   //               "Device Linked Successfully!\n\nDevice ID: DEV-789XYZ\nStatus: Connected",
//   //               [{ text: "OK" }]
//   //             );
//   //           }
//   //         }
//   //       ]
//   //     );
//   //   } catch (error) {
//   //     console.error("Failed to scan QR code:", error);
//   //     Alert.alert("Error", "Failed to open scanner. Please try again.");
//   //   }
//   // };

//   const handleScanQRCode = async () => {
//     if (!permission?.granted) {
//       const result = await requestPermission();
//       if (!result.granted) {
//         Alert.alert("Permission Required", "Camera permission is required to scan QR codes.");
//         return;
//       }
//     }

//     setScanned(false);
//     setCameraVisible(true);
//   };

//   //   const handleBarCodeScanned = ({ data, type }: { data: string; type: string }) => {
//   //   if (scanned) return;

//   //   console.log(" QR SCAN TRIGGERED");
//   //   console.log(" Raw QR Data:", data);
//   //   console.log(" QR Code Type:", type);
//   //   console.log(" Data Length:", data.length);
//   //   console.log(" Scan Time:", new Date().toISOString());

//   //   // Try to detect JSON payload
//   //   try {
//   //     const parsedData = JSON.parse(data);
//   //     console.log(" Parsed QR JSON:", parsedData);
//   //     console.log(" QR Keys:", Object.keys(parsedData));
//   //   } catch (e) {
//   //     console.log(" QR data is NOT JSON");
//   //   }

//   //   setScanned(true);
//   //   setCameraVisible(false);

//   //   Alert.alert(
//   //     "QR Code Scanned!",
//   //     `Scanned Data:\n\n${data}`,
//   //     [{ text: "OK" }]
//   //   );
//   // };

//   const pingMockDevice = async (ip: string) => {
//     try {
//       console.log("📡 Pinging device:", ip);

//       const res = await axios.get(`http://${ip}:8000/ping`, {
//         timeout: 3000,
//       });

//       console.log("✅ Device ping success:", res.data);
//       return true;
//     } catch (err) {
//       console.log("❌ Device ping failed");
//       return false;
//     }
//   };


//   // const handleBarCodeScanned = async (
//   //   { data, type }: { data: string; type: string }
//   // ) => {
//   //   if (scanned) return;
//   //   const url = urls.configure_device
//   //   let deviceIpFromQr = null;

//   //   if (!deviceIpFromQr) {
//   //     Alert.alert("Invalid QR", "No device IP found in QR code");
//   //     return;
//   //   }

//   //   const isDeviceOnline = await pingMockDevice(deviceIpFromQr);

//   //   if (!isDeviceOnline) {
//   //     Alert.alert(
//   //       "Device Not Reachable",
//   //       "Please make sure your phone is on the same Wi-Fi network as the device."
//   //     );
//   //     return;
//   //   }

//   //   console.log("📸 QR SCAN TRIGGERED");
//   //   console.log("📦 Raw QR Data:", data);
//   //   console.log("🏷️ QR Code Type:", type);
//   //   console.log("📏 Data Length:", data.length);
//   //   console.log("🕒 Scan Time:", new Date().toISOString());

//   //   // Try to parse JSON (optional, just for logs)
//   //   try {
//   //     const parsedData = JSON.parse(data);
//   //     deviceIpFromQr = parsedData.ip;
//   //     console.log("🧩 Parsed QR JSON:", parsedData);
//   //     console.log("🔑 QR Keys:", Object.keys(parsedData));
//   //   } catch {
//   //     console.log("⚠️ QR data is NOT JSON");
//   //   }

//   //   setScanned(true);
//   //   setCameraVisible(false);

//   //   // ================= API CALL =================
//   //   try {
//   //     console.log("🚀 Sending QR data to API...");
//   //     console.log("🌐 API URL:", url);
//   //     console.log("📤 Request Body:", { qr_token: data });
//   //     console.log("🔐 Access Token:", accessToken);

//   //     const response = await axios.post(
//   //       url,
//   //       {
//   //         qr_token: data,
//   //       },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${accessToken}`,
//   //           "Content-Type": "application/json",
//   //         },
//   //       }
//   //     );

//   //     console.log("API SUCCESS");
//   //     console.log("📥 Status:", response.status);
//   //     console.log("📥 Response Data:", response.data);
//   //     console.log("📥 Response Headers:", response.headers);
//   //     console.log(JSON.stringify(response.data.payload))

//   //     Alert.alert(
//   //       "QR Code Scanned!",
//   //       "QR code processed successfully.",
//   //       [{ text: "OK" }]
//   //     );
//   //     // setPortalData(response.data);
//   //     setPortalData({
//   //       ...response.data,
//   //       device_ip: deviceIpFromQr, // pass IP explicitly
//   //     });

//   //     setQrToken(data);
//   //     setPortalVisible(true);

//   //   } catch (error: any) {
//   //     console.log("❌ API ERROR");

//   //     if (error.response) {
//   //       console.log("🔴 Status:", error.response.status);
//   //       console.log("🔴 Data:", error.response.data);
//   //       console.log("🔴 Headers:", error.response.headers);
//   //     } else if (error.request) {
//   //       console.log("🟠 No response received:", error.request);
//   //     } else {
//   //       console.log("🟡 Error message:", error.message);
//   //     }

//   //     Alert.alert(
//   //       "Error",
//   //       "Failed to process QR code. Check logs for details."
//   //     );
//   //   }
//   // };



//   const requestLocationPermission = async () => {
//     if (Platform.OS === "android") {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//         {
//           title: "Location Permission",
//           message: "Required to connect to Wi-Fi networks",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK",
//         }
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   };

//   const pingDevice = async (ip: string) => {
//     try {
//       const res = await axios.get(`http://${ip}:8000/ping`, { timeout: 3000 });
//       console.log("✅ Device ping success:", res.data);
//       return true;
//     } catch (err) {
//       console.log("❌ Device ping failed at", ip);
//       return false;
//     }
//   };

//   const handleBarCodeScanned = async ({ data, type }: { data: string; type: string }) => {
//     if (scanned) return;

//     setScanned(true);
//     setCameraVisible(false);

//     console.log("📸 QR SCAN TRIGGERED:", data);

//     try {
//       const parsedData = JSON.parse(data);
//       const ssid = parsedData.ssid;
//       const password = parsedData.password;
//       const qrTokenValue = parsedData.token;
//       const deviceIp = parsedData.ip;

//       if (!ssid || !password || !qrTokenValue || !deviceIp) {
//         Alert.alert("Invalid QR", "QR code must contain SSID, password, token, and device IP.");
//         return;
//       }

//       console.log("📶 Connecting to Wi-Fi:", ssid);

//       const hasPermission = await requestLocationPermission();
//       if (!hasPermission) {
//         Alert.alert("Permission Required", "Cannot connect to Wi-Fi without location permission.");
//         return;
//       }

//       // Connect phone to Wi-Fi
//       if (Platform.OS === "android") {
//         await WifiManager.connectToProtectedSSID(ssid, password, false);
//       } else if (Platform.OS === "ios") {
//         await WifiManager.connectToSSID(ssid, false);
//       }

//       Alert.alert("Connected!", `Phone connected to Wi-Fi network: ${ssid}`);
//       console.log("✅ Connected to Wi-Fi:", ssid);

//       // Optional: Wait 1-2 seconds for the network to stabilize
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Ping the device
//       const deviceOnline = await pingDevice(deviceIp);
//       if (!deviceOnline) {
//         Alert.alert(
//           "Device Not Reachable",
//           "Make sure your phone is on the same Wi-Fi network as the device."
//         );
//         return;
//       }

//       // Call backend API to configure the device
//       const response = await axios.post(
//         urls.configure_device,
//         { qr_token: qrTokenValue, ip: deviceIp },
//         { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
//       );

//       console.log("🚀 Device configured successfully:", response.data);

//       // Show CaptivePortalScreen
//       setPortalData({ ...response.data, device_ip: deviceIp });
//       setQrToken(qrTokenValue);
//       setPortalVisible(true);

//     } catch (err: any) {
//       console.error("❌ Failed to process QR:", err);
//       Alert.alert("Error", "Failed to scan or connect. Check QR code and try again.");
//     }
//   };



//   return (
//     <CustomerSidebar activeTab="Dashboard" userData={loggedInUser}>
//       <ScrollView style={styles.contentContainer}>
//         {/* Welcome Section */}
//         <View style={styles.welcomeSection}>
//           <Text style={styles.welcomeTitle}>Welcome back, {loggedInUser?.first_name || 'Customer'}! 👋</Text>
//           <Text style={styles.welcomeSubtitle}>Here's what's happening with your account today</Text>
//         </View>

//         {/* Stats Cards */}
//         <View style={styles.statsContainer}>
//           <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
//             <MaterialIcons name="shopping-cart" size={30} color="#fff" />
//             <Text style={styles.statNumber}>3</Text>
//             <Text style={styles.statLabel}>Active Orders</Text>
//           </View>

//           <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
//             <MaterialIcons name="favorite" size={30} color="#fff" />
//             <Text style={styles.statNumber}>12</Text>
//             <Text style={styles.statLabel}>Wishlist Items</Text>
//           </View>

//           <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
//             <MaterialIcons name="account-balance-wallet" size={30} color="#fff" />
//             <Text style={styles.statNumber}>$125.50</Text>
//             <Text style={styles.statLabel}>Wallet Balance</Text>
//           </View>

//           <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
//             <MaterialIcons name="star" size={30} color="#fff" />
//             <Text style={styles.statNumber}>245</Text>
//             <Text style={styles.statLabel}>Reward Points</Text>
//           </View>
//         </View>

//         {/* Scan Device Section */}
//         <View style={styles.scanSection}>
//           <View style={styles.scanSectionHeader}>
//             <MaterialIcons name="qr-code-scanner" size={24} color="#2196F3" />
//             <Text style={styles.scanSectionTitle}>Quick Actions</Text>
//           </View>

//           <TouchableOpacity
//             style={styles.scanButton}
//             onPress={handleScanQRCode}
//             activeOpacity={0.8}
//           >
//             <View style={styles.scanButtonContent}>
//               <View style={styles.scanIconContainer}>
//                 <MaterialIcons name="camera-alt" size={32} color="#fff" />
//                 <View style={styles.qrCodeIcon}>
//                   <MaterialIcons name="qr-code-2" size={16} color="#2196F3" />
//                 </View>
//               </View>
//               <View style={styles.scanButtonTextContainer}>
//                 <Text style={styles.scanButtonTitle}>Scan Device QR Code</Text>
//                 <Text style={styles.scanButtonSubtitle}>
//                   Link new devices to your account instantly
//                 </Text>
//               </View>
//               <MaterialIcons
//                 name="chevron-right"
//                 size={24}
//                 color="#2196F3"
//                 style={styles.chevronIcon}
//               />
//             </View>

//             {/* Decorative background elements */}
//             <View style={styles.scanButtonDecoration}>
//               <View style={[styles.decorationCircle, styles.decorationCircle1]} />
//               <View style={[styles.decorationCircle, styles.decorationCircle2]} />
//             </View>
//           </TouchableOpacity>

//           <View style={styles.scanTipsContainer}>
//             <Text style={styles.scanTipsTitle}>How to scan:</Text>
//             <View style={styles.scanTips}>
//               <View style={styles.tipItem}>
//                 <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
//                 <Text style={styles.tipText}>Ensure good lighting</Text>
//               </View>
//               <View style={styles.tipItem}>
//                 <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
//                 <Text style={styles.tipText}>Hold steady 6-12 inches away</Text>
//               </View>
//               <View style={styles.tipItem}>
//                 <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
//                 <Text style={styles.tipText}>Align QR code within frame</Text>
//               </View>
//             </View>
//           </View>
//         </View>
//       </ScrollView>
//       <Modal visible={cameraVisible} animationType="slide">
//         <CameraView
//           style={{ flex: 1 }}
//           facing="back"
//           barcodeScannerSettings={{
//             barcodeTypes: ['qr'],
//           }}
//           onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
//         />

//         <TouchableOpacity
//           onPress={() => setCameraVisible(false)}
//           style={{
//             position: 'absolute',
//             bottom: 40,
//             alignSelf: 'center',
//             backgroundColor: '#000',
//             paddingHorizontal: 20,
//             paddingVertical: 10,
//             borderRadius: 8,
//           }}
//         >
//           <Text style={{ color: '#fff', fontSize: 16 }}>Close Scanner</Text>
//         </TouchableOpacity>
//       </Modal>
//       <CaptivePortalScreen
//         visible={portalVisible}
//         data={portalData}
//         accessToken={accessToken}
//         qrToken={qrToken}
//         onClose={() => setPortalVisible(false)}
//         onSubmit={(data) => {
//           console.log("✅ Final Captive Portal Data:", data);
//           setPortalVisible(false);
//         }}
//       />


//     </CustomerSidebar>
//   );
// }
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useEffect, useRef, useState } from "react";
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
  // const handleBarCodeScanned = async ({ data, type }: { data: string; type: string }) => {
  //   if (scanned) return;
  //   setScanned(true);
  //   setCameraVisible(false);

  //   console.log("📸 QR SCAN TRIGGERED:", data);

  //   try {
  //     const parsedData = JSON.parse(data);
  //     const ssid = parsedData.ssid;
  //     const password = parsedData.password;
  //     const qrTokenValue = parsedData.token;
  //     const deviceIp = parsedData.ip;

  //     if (!ssid || !password || !qrTokenValue || !deviceIp) {
  //       Alert.alert("Invalid QR", "QR code must contain SSID, password, token, and device IP.");
  //       return;
  //     }

  //     console.log("📶 Connecting to Wi-Fi:", ssid);

  //     const hasPermission = await requestLocationPermission();
  //     if (!hasPermission) {
  //       Alert.alert("Permission Required", "Cannot connect to Wi-Fi without location permission.");
  //       return;
  //     }

  //     // Connect phone to Wi-Fi
  //     if (Platform.OS === "android") {
  //       // SSID, password, isWEP=false, isHidden=false
  //       await WifiManager.connectToProtectedSSID(ssid, password, false, false);
  //     } else if (Platform.OS === "ios") {
  //       // SSID, isWEP=false
  //       await WifiManager.connectToSSID(ssid);
  //     }


  //     Alert.alert("Connected!", `Phone connected to Wi-Fi network: ${ssid}`);
  //     console.log("✅ Connected to Wi-Fi:", ssid);

  //     // Optional: wait a moment for network to stabilize
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     // Ping the device
  //     const deviceOnline = await pingDevice(deviceIp);
  //     if (!deviceOnline) {
  //       Alert.alert(
  //         "Device Not Reachable",
  //         "Make sure your phone is on the same Wi-Fi network as the device."
  //       );
  //       return;
  //     }

  //     // Call backend API to configure the device
  //     const response = await axios.post(
  //       urls.configure_device,
  //       { qr_token: qrTokenValue, ip: deviceIp },
  //       { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
  //     );

  //     console.log("🚀 Device configured successfully:", response.data);

  //     // Show CaptivePortalScreen
  //     setPortalData({ ...response.data, device_ip: deviceIp });
  //     setQrToken(qrTokenValue);
  //     setPortalVisible(true);

  //   } catch (err: any) {
  //     console.error("❌ Failed to process QR:", err);
  //     Alert.alert("Error", "Failed to scan or connect. Check QR code and try again.");
  //   }
  // };

  //////////////////////////// new testing ////////////////////////////
  // const handleBarCodeScanned = async ({ data }: { data: string }) => {
  //   if (scanned) return;
  //   setScanned(true);

  //   console.log("📸 QR SCAN TRIGGERED:", data);

  //   let ssid: string | null = null;
  //   let password: string | null = null;
  //   let deviceIp: string | null = null;
  //   let qrToken: string | null = null;

  //   /* -----------------------------------
  //      1️⃣ PARSE QR (JSON OR PLAIN TEXT)
  //   ----------------------------------- */
  //   try {
  //     // JSON QR
  //     const parsed = JSON.parse(data);
  //     ssid = parsed.ssid;
  //     password = parsed.password;
  //     deviceIp = parsed.ip || null;
  //     qrToken = parsed.token || null;

  //     console.log("🧩 QR JSON Parsed:", parsed);
  //   } catch {
  //     // Plain text QR: "Vivo 11110000"
  //     const parts = data.trim().split(" ");
  //     if (parts.length >= 2) {
  //       ssid = parts[0];
  //       password = parts.slice(1).join(" ");
  //       console.log("⚠️ QR is plain text. SSID:", ssid, "Password:", password);
  //     }
  //   }

  //   if (!ssid || !password) {
  //     Alert.alert("Invalid QR", "SSID or Password missing");
  //     setScanned(false);
  //     return;
  //   }

  //   /* -----------------------------------
  //      2️⃣ ANDROID PERMISSIONS
  //   ----------------------------------- */
  //   if (Platform.OS === "android") {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //       {
  //         title: "Location permission required",
  //         message: "Location is required to connect to Wi-Fi networks",
  //         buttonPositive: "ALLOW",
  //         buttonNegative: "DENY",
  //       }
  //     );

  //     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
  //       Alert.alert("Permission Denied", "Location permission is required");
  //       setScanned(false);
  //       return;
  //     }
  //   }

  //   /* -----------------------------------
  //      3️⃣ CONNECT TO WIFI (AUTOMATIC)
  //   ----------------------------------- */
  //   try {
  //     if (!WifiManager) {
  //       console.log("❌ WifiManager not available");
  //       Alert.alert(
  //         "Not Supported",
  //         "Wi-Fi auto connection requires Dev Client or Release build"
  //       );
  //       setScanned(false);
  //       return;
  //     }

  //     console.log("📡 Connecting to Wi-Fi:", ssid);

  //     await WifiManager.connectToProtectedSSID(
  //       ssid,
  //       password,
  //       false, // isWEP
  //       false  // isHidden
  //     );

  //     console.log("✅ Wi-Fi connected successfully");

  //     // Confirm connection
  //     const connectedSSID = await WifiManager.getCurrentWifiSSID();
  //     console.log("📶 Connected SSID:", connectedSSID);

  //     Alert.alert("Connected", `Connected to ${connectedSSID}`);

  //   } catch (error) {
  //     console.log("❌ Wi-Fi Connection Failed:", error);
  //     Alert.alert("Connection Failed", "Unable to connect to Wi-Fi");
  //     setScanned(false);
  //     return;
  //   }

  //   /* -----------------------------------
  //      4️⃣ CONTINUE YOUR EXISTING FLOW
  //   ----------------------------------- */
  //   setCameraVisible(false);

  //   if (deviceIp || qrToken) {
  //     setPortalData({
  //       device_ip: deviceIp,
  //     });
  //     setQrToken(qrToken);
  //     setPortalVisible(true);
  //   }
  // };
  ////////////////////// NEW TESTING QR ////////////  FINAL WORKING  /////////////////////
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

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
          
      setPortalVisible(true);
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

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#4CAF50' }]}>
            <MaterialIcons name="shopping-cart" size={30} color="#fff" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Active Orders</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#2196F3' }]}>
            <MaterialIcons name="favorite" size={30} color="#fff" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Wishlist Items</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#FF9800' }]}>
            <MaterialIcons name="account-balance-wallet" size={30} color="#fff" />
            <Text style={styles.statNumber}>$125.50</Text>
            <Text style={styles.statLabel}>Wallet Balance</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#9C27B0' }]}>
            <MaterialIcons name="star" size={30} color="#fff" />
            <Text style={styles.statNumber}>245</Text>
            <Text style={styles.statLabel}>Reward Points</Text>
          </View>
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
const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeSection: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
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
    color: '#333',
    marginLeft: 10,
  },
  scanButton: {
    backgroundColor: '#F0F8FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#E3F2FD',
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
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
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
    color: '#2196F3',
    marginBottom: 4,
  },
  scanButtonSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  chevronIcon: {
    opacity: 0.8,
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
    backgroundColor: 'rgba(33, 150, 243, 0.05)',
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
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
  },
  scanTipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
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
    color: '#555',
    marginLeft: 8,
  },
});