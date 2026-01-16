// import mqtt from "mqtt";
// import { useEffect, useRef, useState } from "react";
// import { Animated, Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

// import { Buffer } from "buffer";
// global.Buffer = Buffer;

// import process from "process";
// global.process = process;

// export default function Index() {
//   const clientRef = useRef<any>(null);
//   const [status, setStatus] = useState("Disconnected");
//   const [sensorData, setSensorData] = useState<any>(null); // Changed from gas to sensorData
//   const [topicInfo, setTopicInfo] = useState("");

//   // Animation values
//   const pulseAnim = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;

//   const topic = "house/+/room/+/sensor/+";

//   const startPulseAnimation = () => {
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start();
//   };

//   const stopPulseAnimation = () => {
//     pulseAnim.stopAnimation();
//     Animated.timing(pulseAnim, {
//       toValue: 1,
//       duration: 300,
//       useNativeDriver: true,
//     }).start();
//   };

//   const connectAndSubscribe = () => {
//     const brokerUrl = "ws://192.168.18.28:9001";

//     console.log(" Connecting to MQTT broker:", brokerUrl);
//     console.log(" Subscribing topic pattern:", topic);

//     const client = mqtt.connect(brokerUrl, {
//       clientId: "expo_" + Math.random().toString(16).slice(2),
//       clean: true,
//       reconnectPeriod: 10000,
//       connectTimeout: 50000,
//     });

//     clientRef.current = client;

//     client.on("connect", (connack) => {
//       console.log(" MQTT CONNECTED");
//       console.log(" Connack:", connack);

//       setStatus("Connected");
//       startPulseAnimation();
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 500,
//         useNativeDriver: true,
//       }).start();

//       client.subscribe(topic, (err, granted) => {
//         if (err) {
//           console.log(" SUBSCRIBE ERROR:", err);
//         } else {
//           console.log(" SUBSCRIBED:", granted);
//         }
//       });
//     });

//     client.on("message", (topic, payload, packet) => {
//       console.log(" MQTT MESSAGE RECEIVED");
//       console.log(" Topic:", topic);
//       console.log(" Payload (string):", payload.toString());

//       try {
//         // Parse the payload
//         const payloadStr = payload.toString();
        
//         // Try to parse as JSON first
//         let data;
//         try {
//           data = JSON.parse(payloadStr);
//         } catch (e) {
//           // If not JSON, treat as raw value
//           data = payloadStr;
//         }
        
//         console.log(" Parsed data:", data);
        
//         // Extract sensor type from topic (last part after '/')
//         const topicParts = topic.split('/');
//         const sensorType = topicParts[topicParts.length - 1];
        
//         setSensorData({
//           value: data,
//           sensorType: sensorType,
//           rawTopic: topic,
//           timestamp: new Date().toISOString()
//         });
//         setTopicInfo(topic);
        
//       } catch (error) {
//         console.error("Error processing message:", error);
//       }
//     });

//     client.on("reconnect", () => {
//       console.log(" MQTT RECONNECTING...");
//       setStatus("Reconnecting");
//     });

//     client.on("offline", () => {
//       console.log(" MQTT OFFLINE");
//       setStatus("Offline");
//       stopPulseAnimation();
//     });

//     client.on("close", () => {
//       console.log(" MQTT CONNECTION CLOSED");
//       setStatus("Closed");
//       stopPulseAnimation();
//       Animated.timing(fadeAnim, {
//         toValue: 0,
//         duration: 300,
//         useNativeDriver: true,
//       }).start();
//     });

//     client.on("error", (err) => {
//       console.log(" MQTT ERROR:", err);
//       setStatus("Error");
//       stopPulseAnimation();
//       //  DO NOT end the client here
//     });
//   };

//   /* ---------------- UNSUBSCRIBE (NEW) ---------------- */
//   const unsubscribe = () => {
//     const client = clientRef.current;
//     if (!client) return;

//     console.log(" Unsubscribing from topic:", topic);

//     client.unsubscribe(topic, (err: any) => {
//       if (err) {
//         console.log(" UNSUBSCRIBE ERROR:", err);
//       } else {
//         console.log(" UNSUBSCRIBED");
//         setStatus("Unsubscribed");
//         setSensorData(null); // Changed from setGas(null)
//         setTopicInfo("");
//         stopPulseAnimation();
//         Animated.timing(fadeAnim, {
//           toValue: 0,
//           duration: 300,
//           useNativeDriver: true,
//         }).start();
//       }
//     });
//   };

//   useEffect(() => {
//     return () => {
//       console.log(" Cleaning up MQTT connection");
//       clientRef.current?.end(true);
//     };
//   }, []);

//   const getStatusColor = () => {
//     switch (status) {
//       case "Connected":
//         return "#10B981";
//       case "Disconnected":
//         return "#6B7280";
//       case "Reconnecting":
//         return "#F59E0B";
//       case "Error":
//         return "#EF4444";
//       case "Offline":
//       case "Closed":
//         return "#6B7280";
//       default:
//         return "#6B7280";
//     }
//   };

//   const getStatusEmoji = () => {
//     switch (status) {
//       case "Connected":
//         return "✅";
//       case "Disconnected":
//         return "🔌";
//       case "Reconnecting":
//         return "🔄";
//       case "Error":
//         return "❌";
//       case "Offline":
//         return "📴";
//       case "Closed":
//         return "🔒";
//       default:
//         return "⚡";
//     }
//   };

//   // Helper function to get sensor display info
//   const getSensorInfo = () => {
//     if (!sensorData) return null;
    
//     // const sensorType = sensorData.sensorType?.toLowerCase() || '';
//     const sensorType = (sensorData.sensorType?.toLowerCase() || '') as keyof typeof sensorConfigs;
//     const value = sensorData.value;
    
//     // Common sensor types and their configurations
//     const sensorConfigs = {
//       gas: {
//         label: "Gas Level",
//         unit: "ppm",
//         safeThreshold: 400,
//         warningThreshold: 300,
//         color: "#10B981",
//         alertColor: "#EF4444",
//         warningColor: "#F59E0B",
//         emoji: "💨"
//       },
//       humidity: {
//         label: "Humidity",
//         unit: "%",
//         safeThreshold: 80,
//         warningThreshold: 70,
//         color: "#3B82F6",
//         alertColor: "#EF4444",
//         warningColor: "#F59E0B",
//         emoji: "💧"
//       },
//       temperature: {
//         label: "Temperature",
//         unit: "°C",
//         safeThreshold: 35,
//         warningThreshold: 30,
//         color: "#EF4444",
//         alertColor: "#DC2626",
//         warningColor: "#F59E0B",
//         emoji: "🌡️"
//       },
//       smoke: {
//         label: "Smoke Level",
//         unit: "ppm",
//         safeThreshold: 100,
//         warningThreshold: 50,
//         color: "#6B7280",
//         alertColor: "#DC2626",
//         warningColor: "#F59E0B",
//         emoji: "🔥"
//       },
//       motion: {
//         label: "Motion",
//         unit: "",
//         safeThreshold: 1,
//         warningThreshold: 0.5,
//         color: "#8B5CF6",
//         alertColor: "#DC2626",
//         warningColor: "#F59E0B",
//         emoji: "🚶"
//       },
//       pressure: {
//         label: "Pressure",
//         unit: "hPa",
//         safeThreshold: 1100,
//         warningThreshold: 1050,
//         color: "#10B981",
//         alertColor: "#DC2626",
//         warningColor: "#F59E0B",
//         emoji: "📊"
//       },
//       // Add more sensor types as needed
//     };

//     // Find matching config or use default
//     const config = sensorConfigs[sensorType] || {
//       label: sensorType.charAt(0).toUpperCase() + sensorType.slice(1),
//       unit: "",
//       safeThreshold: Infinity,
//       warningThreshold: Infinity,
//       color: "#6B7280",
//       alertColor: "#EF4444",
//       warningColor: "#F59E0B",
//       emoji: "📡"
//     };

//     // Convert value to number if possible
//     const numericValue = typeof value === 'number' ? value : 
//                         !isNaN(Number(value)) ? Number(value) : value;

//     // Determine status
//     let status = "safe";
//     let statusColor = config.color;
    
//     if (typeof numericValue === 'number') {
//       if (numericValue > config.safeThreshold) {
//         status = "alert";
//         statusColor = config.alertColor;
//       } else if (numericValue > config.warningThreshold) {
//         status = "warning";
//         statusColor = config.warningColor;
//       }
//     }

//     return {
//       label: config.label,
//       value: numericValue,
//       unit: config.unit,
//       type: sensorType,
//       emoji: config.emoji,
//       status,
//       statusColor,
//       config
//     };
//   };

//   const sensorInfo = getSensorInfo();

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContent}>
//         <View style={styles.header}>
//           <Text style={styles.title}>MQTT Sensor Monitor</Text>
//           <Text style={styles.subtitle}>Real-time Multi-Sensor Dashboard</Text>
//         </View>

//         <View style={styles.statusCard}>
//           <View style={styles.statusHeader}>
//             <Text style={styles.statusTitle}>Connection Status</Text>
//             <View style={[styles.statusIndicator, { backgroundColor: getStatusColor() }]} />
//           </View>
//           <View style={styles.statusContent}>
//             <Text style={styles.statusText}>
//               {getStatusEmoji()} {status}
//             </Text>
//             <Animated.View
//               style={[
//                 styles.pulseCircle,
//                 {
//                   backgroundColor: getStatusColor(),
//                   opacity: fadeAnim,
//                   transform: [{ scale: pulseAnim }],
//                 },
//               ]}
//             />
//           </View>
//         </View>

//         <View style={styles.controlCard}>
//           <Text style={styles.cardTitle}>Connection Controls</Text>
//           <View style={styles.buttonContainer}>
//             <Button
//               title="Subscribe to Sensors"
//               onPress={connectAndSubscribe}
//               color="#3B82F6"
//             />
//             <View style={styles.buttonSpacer} />
//             <Button
//               title="Unsubscribe"
//               onPress={unsubscribe}
//               color="#F59E0B"
//             />
//           </View>
//           <Text style={styles.topicText}>Topic Pattern: {topic}</Text>
//         </View>

//         <Animated.View
//           style={[
//             styles.dataCard,
//             {
//               opacity: fadeAnim,
//               transform: [{
//                 translateY: fadeAnim.interpolate({
//                   inputRange: [0, 1],
//                   outputRange: [20, 0]
//                 })
//               }],
//             },
//           ]}
//         >
//           <Text style={styles.cardTitle}>Sensor Data</Text>
          
//           {sensorData ? (
//             <>
//               <View style={styles.dataRow}>
//                 <Text style={styles.dataLabel}>Sensor Type:</Text>
//                 <Text style={styles.dataValue}>
//                   {sensorInfo?.emoji} {sensorInfo?.label}
//                 </Text>
//               </View>

//               <View style={styles.dataRow}>
//                 <Text style={styles.dataLabel}>Topic:</Text>
//                 <Text style={styles.dataValue} numberOfLines={1} ellipsizeMode="middle">
//                   {topicInfo}
//                 </Text>
//               </View>
              
//               <View style={styles.gasValueContainer}>
//                 <Text style={styles.gasLabel}>Current Value:</Text>
//                 <View style={[styles.gasValueBox, { backgroundColor: sensorInfo?.statusColor + '20' }]}>
//                   <Text style={[
//                     styles.gasValue,
//                     { color: sensorInfo?.statusColor }
//                   ]}>
//                     {typeof sensorInfo?.value === 'number' 
//                       ? `${sensorInfo.value} ${sensorInfo.unit}` 
//                       : String(sensorInfo?.value)}
//                   </Text>
//                 </View>
//               </View>

//               {sensorInfo?.status === "alert" && (
//                 <View style={styles.alertContainer}>
//                   <Text style={styles.alertText}>
//                     🚨 {sensorInfo.label} ALERT!
//                   </Text>
//                   <Text style={styles.alertSubtext}>
//                     Value exceeds safe threshold ({sensorInfo.config.safeThreshold} {sensorInfo.unit})
//                   </Text>
//                 </View>
//               )}

//               {sensorInfo?.status === "warning" && (
//                 <View style={styles.warningContainer}>
//                   <Text style={styles.warningText}>
//                     ⚠️ Elevated {sensorInfo.label}
//                   </Text>
//                   <Text style={styles.warningSubtext}>
//                     Monitor closely - approaching threshold
//                   </Text>
//                 </View>
//               )}

//               {sensorInfo?.status === "safe" && (
//                 <View style={styles.safeContainer}>
//                   <Text style={styles.safeText}>
//                     ✅ {sensorInfo.label} Normal
//                   </Text>
//                   <Text style={styles.safeSubtext}>
//                     Within safe operating range
//                   </Text>
//                 </View>
//               )}

//               <View style={styles.timestampContainer}>
//                 <Text style={styles.timestampText}>
//                   Last updated: {new Date(sensorData.timestamp).toLocaleTimeString()}
//                 </Text>
//               </View>
//             </>
//           ) : (
//             <View style={styles.noDataContainer}>
//               <Text style={styles.noDataText}>No sensor data available</Text>
//               <Text style={styles.noDataSubtext}>Subscribe to start receiving data</Text>
//               <Text style={styles.sensorListText}>
//                 Supported sensors: Gas, Humidity, Temperature, Smoke, Motion, Pressure
//               </Text>
//             </View>
//           )}
//         </Animated.View>

//         <View style={styles.footer}>
//           <Text style={styles.footerText}>MQTT Broker: 192.168.18.28:9001</Text>
//           <Text style={styles.footerText}>Topic Pattern: house/+/room/+/sensor/+</Text>
//           <Text style={styles.footerText}>Client ID: expo_****</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// // Styles remain exactly the same as previous version
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB",
//   },
//   scrollContent: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   header: {
//     alignItems: "center",
//     marginBottom: 30,
//     marginTop: 10,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#1F2937",
//     marginBottom: 5,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#6B7280",
//   },
//   statusCard: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   statusHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   statusTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#374151",
//   },
//   statusIndicator: {
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//   },
//   statusContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   statusText: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#1F2937",
//   },
//   pulseCircle: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//   },
//   controlCard: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#374151",
//     marginBottom: 15,
//   },
//   buttonContainer: {
//     marginBottom: 15,
//   },
//   buttonSpacer: {
//     height: 10,
//   },
//   topicText: {
//     fontSize: 14,
//     color: "#6B7280",
//     fontFamily: "monospace",
//     backgroundColor: "#F3F4F6",
//     padding: 10,
//     borderRadius: 8,
//     marginTop: 10,
//   },
//   dataCard: {
//     backgroundColor: "white",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   dataRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F3F4F6",
//   },
//   dataLabel: {
//     fontSize: 16,
//     color: "#6B7280",
//     fontWeight: "500",
//   },
//   dataValue: {
//     fontSize: 14,
//     color: "#374151",
//     fontFamily: "monospace",
//     flex: 1,
//     marginLeft: 10,
//     textAlign: "right",
//   },
//   gasValueContainer: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//     marginTop: 10,
//   },
//   gasLabel: {
//     fontSize: 18,
//     color: "#374151",
//     fontWeight: "600",
//   },
//   gasValueBox: {
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 12,
//     minWidth: 120,
//     alignItems: "center",
//   },
//   gasValue: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   alertContainer: {
//     backgroundColor: "#FEE2E2",
//     padding: 15,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "#EF4444",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   alertText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#DC2626",
//     marginBottom: 5,
//   },
//   alertSubtext: {
//     fontSize: 14,
//     color: "#DC2626",
//     opacity: 0.8,
//     textAlign: "center",
//   },
//   warningContainer: {
//     backgroundColor: "#FEF3C7",
//     padding: 15,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "#F59E0B",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   warningText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#D97706",
//     marginBottom: 5,
//   },
//   warningSubtext: {
//     fontSize: 14,
//     color: "#D97706",
//     opacity: 0.8,
//     textAlign: "center",
//   },
//   safeContainer: {
//     backgroundColor: "#D1FAE5",
//     padding: 15,
//     borderRadius: 12,
//     borderWidth: 2,
//     borderColor: "#10B981",
//     alignItems: "center",
//     marginTop: 10,
//   },
//   safeText: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#059669",
//     marginBottom: 5,
//   },
//   safeSubtext: {
//     fontSize: 14,
//     color: "#059669",
//     opacity: 0.8,
//     textAlign: "center",
//   },
//   noDataContainer: {
//     padding: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   noDataText: {
//     fontSize: 18,
//     color: "#6B7280",
//     marginBottom: 8,
//     fontWeight: "500",
//   },
//   noDataSubtext: {
//     fontSize: 14,
//     color: "#9CA3AF",
//     marginBottom: 15,
//   },
//   sensorListText: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
//   timestampContainer: {
//     marginTop: 15,
//     paddingTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: "#F3F4F6",
//     alignItems: "center",
//   },
//   timestampText: {
//     fontSize: 12,
//     color: "#9CA3AF",
//     fontStyle: "italic",
//   },
//   footer: {
//     marginTop: 10,
//     padding: 15,
//     backgroundColor: "#F3F4F6",
//     borderRadius: 12,
//   },
//   footerText: {
//     fontSize: 12,
//     color: "#6B7280",
//     fontFamily: "monospace",
//     marginBottom: 4,
//   },
// });


/////////////////// NEW IMPLEMENTATION //////////////////////////////////
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CustomerSidebar from '../component/sidebarlayout';

export default function CustomerDashboardScreen() {
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

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

  // Mock data for customer dashboard
  const recentOrders = [
    { id: 1, orderNo: 'ORD-001', date: '2024-01-15', amount: '$49.99', status: 'Delivered' },
    { id: 2, orderNo: 'ORD-002', date: '2024-01-10', amount: '$89.99', status: 'Processing' },
    { id: 3, orderNo: 'ORD-003', date: '2024-01-05', amount: '$29.99', status: 'Shipped' },
  ];

  const recommendedProducts = [
    { id: 1, name: 'Wireless Headphones', price: '$99.99', rating: 4.5 },
    { id: 2, name: 'Smart Watch', price: '$199.99', rating: 4.7 },
    { id: 3, name: 'Laptop Stand', price: '$39.99', rating: 4.3 },
    { id: 4, name: 'Phone Case', price: '$24.99', rating: 4.2 },
  ];

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

        {/* Recent Orders Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentOrders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderNumber}>{order.orderNo}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.orderAmount}>{order.amount}</Text>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: order.status === 'Delivered' ? '#4CAF50' : 
                    order.status === 'Processing' ? '#FF9800' : '#2196F3' }
                ]}>
                  <Text style={styles.statusText}>{order.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recommended Products */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recommendedProducts.map((product) => (
              <View key={product.id} style={styles.productCard}>
                <View style={styles.productImage}>
                  <MaterialIcons name="shopping-bag" size={40} color="#666" />
                </View>
                <Text style={styles.productName} numberOfLines={1}>{product.name}</Text>
                <View style={styles.productRating}>
                  <MaterialIcons name="star" size={16} color="#FF9800" />
                  <Text style={styles.ratingText}>{product.rating}</Text>
                </View>
                <Text style={styles.productPrice}>{product.price}</Text>
                <TouchableOpacity style={styles.addToCartButton}>
                  <Text style={styles.addToCartText}>Add to Cart</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity style={styles.quickActionButton}>
              <MaterialIcons name="support-agent" size={24} color="#4CAF50" />
              <Text style={styles.quickActionText}>Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <MaterialIcons name="history" size={24} color="#2196F3" />
              <Text style={styles.quickActionText}>Order History</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <MaterialIcons name="local-offer" size={24} color="#FF9800" />
              <Text style={styles.quickActionText}>Offers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <MaterialIcons name="location-on" size={24} color="#9C27B0" />
              <Text style={styles.quickActionText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  sectionContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  orderCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  orderInfo: {
    flex: 1,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderDetails: {
    alignItems: 'flex-end',
  },
  orderAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginTop: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '500',
  },
  productCard: {
    width: 140,
    marginRight: 15,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4CAF50',
    marginBottom: 8,
  },
  addToCartButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    width: '100%',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    width: '23%',
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    marginTop: 8,
    textAlign: 'center',
  },
});