// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import {
//     MediaStream,
//     RTCPeerConnection,
//     RTCView,
// } from "react-native-webrtc";

// export default function LiveViewScreen() {
//     const { cameraId, cameraName } = useLocalSearchParams();

//     const pcRef = useRef<RTCPeerConnection | null>(null);
//     const wsRef = useRef<WebSocket | null>(null);

//     const [stream, setStream] = useState<MediaStream | null>(null);
//     const [loading, setLoading] = useState(true);

//     //   const WS_URL = `ws://192.168.18.28:8000/ws/${cameraId}/`;
//     const ROOM = "room1234";
//     // const WS_URL = "ws://192.168.18.28:8000/ws/room1234/";
//     const WS_URL = (`ws://192.168.18.28:8000/ws/room/${ROOM}/`);

//     useEffect(() => {
//         startViewing();

//         return () => {
//             cleanupConnection();
//         };
//     }, []);

//     const startViewing = async () => {
//         const pc = new RTCPeerConnection({
//             iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//         });

//         pcRef.current = pc;

//         pc.addTransceiver("video", { direction: "recvonly" });
//         pc.addTransceiver("audio", { direction: "recvonly" });

//         (pc as any).ontrack = (event: any) => {
//             const remoteStream: MediaStream = event.streams[0];

//             remoteStream.getTracks().forEach(track => {
//                 track.enabled = true;
//             });

//             setStream(remoteStream);
//             setLoading(false);
//         };

//         (pc as any).onicecandidate = (event: any) => {
//             if (event.candidate && wsRef.current) {
//                 wsRef.current.send(
//                     JSON.stringify({
//                         type: "candidate",
//                         candidate: event.candidate,
//                     })
//                 );
//             }
//         };

//         const ws = new WebSocket(WS_URL);
//         wsRef.current = ws;

//         ws.onmessage = async (message) => {
//             const data = JSON.parse(message.data);

//             if (data.type === "offer") {
//                 await pc.setRemoteDescription(data.offer);

//                 const answer = await pc.createAnswer();
//                 await pc.setLocalDescription(answer);

//                 ws.send(
//                     JSON.stringify({
//                         type: "answer",
//                         answer: pc.localDescription,
//                     })
//                 );
//             }

//             if (data.type === "candidate") {
//                 try {
//                     await pc.addIceCandidate(data.candidate);
//                 } catch (err) {
//                     console.warn("ICE error:", err);
//                 }
//             }
//         };
//     };

//     const cleanupConnection = () => {
//         console.log("🛑 Cleaning up connection...");

//         if (wsRef.current) {
//             wsRef.current.close();
//             wsRef.current = null;
//         }

//         if (pcRef.current) {
//             pcRef.current.close();
//             pcRef.current = null;
//         }

//         setStream(null);
//     };

//     const handleBack = () => {
//         cleanupConnection();
//         router.back();
//     };

//     return (
//         <View style={styles.container}>
//             {/* 🔙 Custom Back Button */}
//             <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//                 <Ionicons name="arrow-back" size={24} color="#fff" />
//             </TouchableOpacity>

//             <Text style={styles.title}>{cameraName}</Text>

//             {loading && (
//                 <View style={styles.loaderContainer}>
//                     <ActivityIndicator size="large" color="#fff" />
//                     <Text style={styles.loadingText}>Connecting to camera...</Text>
//                 </View>
//             )}

//             {stream && (
//                 <RTCView
//                     streamURL={stream.toURL()}
//                     style={styles.video}
//                     objectFit="cover"
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#000" },

//     title: {
//         color: "#fff",
//         marginTop: 50,
//         alignSelf: "center",
//         fontSize: 18,
//     },

//     video: { flex: 1 },

//     loaderContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     loadingText: {
//         color: "#fff",
//         marginTop: 10,
//     },

//     backButton: {
//         position: "absolute",
//         top: 50,
//         left: 20,
//         zIndex: 10,
//     },
// });


//////////////////////////////////////////////////////////////////////////


// import { Ionicons } from "@expo/vector-icons";
// import { router, useLocalSearchParams } from "expo-router";
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import {
//     MediaStream,
//     RTCPeerConnection,
//     RTCView,
// } from "react-native-webrtc";

// export default function LiveViewScreen() {
//     const { cameraId, cameraName } = useLocalSearchParams();
//     const isActiveRef = useRef(true);


//     const pcRef = useRef<RTCPeerConnection | null>(null);
//     const wsRef = useRef<WebSocket | null>(null);
//     const reconnectTimeout = useRef<any>(null);

//     const [stream, setStream] = useState<MediaStream | null>(null);
//     const [loading, setLoading] = useState(true);
//     const [offline, setOffline] = useState(false);

//     const ROOM = "room1234";
//     const WS_URL = `ws://192.168.18.28:8000/ws/room/${ROOM}/`;

//     useEffect(() => {
//         console.log("LiveView mounted");
//         isActiveRef.current = true;

//         startViewing();

//         return () => {
//             console.log("Component unmounting");
//             isActiveRef.current = false; // ⛔ mark as inactive
//             cleanupConnection();
//         };
//     }, []);


//     // useEffect(() => {
//     //     console.log(" LiveView mounted");
//     //     startViewing();

//     //     return () => {
//     //         console.log("Component unmounting");
//     //         cleanupConnection();
//     //     };
//     // }, []);

//     const startViewing = async () => {
//         console.log("🚀 Starting WebRTC connection...");

//         setOffline(false);
//         setLoading(true);

//         const pc = new RTCPeerConnection({
//             iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//         });

//         pcRef.current = pc;

//         pc.addTransceiver("video", { direction: "recvonly" });
//         pc.addTransceiver("audio", { direction: "recvonly" });

//         (pc as any).ontrack = (event: any) => {
//             console.log(" Remote track received");

//             const remoteStream: MediaStream = event.streams[0];
//             remoteStream.getTracks().forEach(track => {
//                 track.enabled = true;
//             });

//             setStream(remoteStream);
//             setLoading(false);
//             setOffline(false);
//         };

//         (pc as any).onicecandidate = (event: any) => {
//             if (event.candidate && wsRef.current) {
//                 console.log(" Sending ICE candidate");
//                 wsRef.current.send(
//                     JSON.stringify({
//                         type: "candidate",
//                         candidate: event.candidate,
//                     })
//                 );
//             }
//         };

//         connectWebSocket();
//     };

//     const connectWebSocket = () => {
//         console.log(" Connecting WebSocket:", WS_URL);

//         const ws = new WebSocket(WS_URL);
//         wsRef.current = ws;

//         ws.onopen = () => {
//             console.log(" WebSocket connected");
//             setOffline(false);
//             ws.send(JSON.stringify({ type: "ready" }));
//         };

//         ws.onmessage = async (message) => {
//             const data = JSON.parse(message.data);
//             console.log(" WS Message:", data.type);

//             // if (data.type === "offer") {
//             //     console.log(" Offer received");

//             //     await pcRef.current?.setRemoteDescription(data.offer);

//             //     const answer = await pcRef.current?.createAnswer();
//             //     await pcRef.current?.setLocalDescription(answer);

//             //     ws.send(
//             //         JSON.stringify({
//             //             type: "answer",
//             //             answer: pcRef.current?.localDescription,
//             //         })
//             //     );

//             //     console.log(" Answer sent");
//             // }
//             if (data.type === "offer") {
//                 console.log("Offer received:", data);

//                 if (!data.sdp || !data.sdpType) {
//                     console.error("Invalid offer format", data);
//                     return;
//                 }

//                 await pcRef.current?.setRemoteDescription({
//                     type: data.sdpType,
//                     sdp: data.sdp,
//                 });

//                 const answer = await pcRef.current?.createAnswer();
//                 await pcRef.current?.setLocalDescription(answer);

//                 ws.send(JSON.stringify({
//                     type: "answer",
//                     sdp: pcRef.current?.localDescription?.sdp,
//                     sdpType: pcRef.current?.localDescription?.type,
//                 }));

//                 console.log("Answer sent");
//             }


//             if (data.type === "ice") {
//                 try {
//                     console.log(" ICE received");
//                     await pcRef.current?.addIceCandidate(data.candidate);
//                 } catch (err) {
//                     console.warn("ICE error:", err);
//                 }
//             }
//         };

//         ws.onerror = (err) => {
//             console.log("❌ WebSocket error:", err);
//         };

//         ws.onclose = () => {
//             console.log("WebSocket disconnected");
//             handleReconnect();
//         };
//     };

//     const handleReconnect = () => {
//         console.log(" Attempting reconnect in 3 seconds...");

//         setOffline(true);
//         setStream(null);

//         reconnectTimeout.current = setTimeout(() => {
//             console.log(" Reconnecting now...");
//             cleanupPeerOnly();
//             startViewing();
//         }, 3000);
//     };

//     const cleanupPeerOnly = () => {
//         if (pcRef.current) {
//             pcRef.current.close();
//             pcRef.current = null;
//         }
//     };

//     const cleanupConnection = () => {
//         console.log(" Cleaning up full connection");

//         if (reconnectTimeout.current) {
//             clearTimeout(reconnectTimeout.current);
//         }

//         if (wsRef.current) {
//             wsRef.current.close();
//             wsRef.current = null;
//         }

//         if (pcRef.current) {
//             pcRef.current.close();
//             pcRef.current = null;
//         }

//         setStream(null);
//     };

//     const handleBack = () => {
//         cleanupConnection();
//         router.back();
//     };

//     return (
//         <View style={styles.container}>
//             <TouchableOpacity style={styles.backButton} onPress={handleBack}>
//                 <Ionicons name="arrow-back" size={24} color="#fff" />
//             </TouchableOpacity>

//             <Text style={styles.title}>{cameraName}</Text>

//             {loading && !offline && (
//                 <View style={styles.loaderContainer}>
//                     <ActivityIndicator size="large" color="#fff" />
//                     <Text style={styles.loadingText}>Connecting to camera...</Text>
//                 </View>
//             )}

//             {offline && (
//                 <View style={styles.loaderContainer}>
//                     <Text style={styles.offlineText}>⚠ Camera Offline</Text>
//                     <Text style={styles.loadingText}>Reconnecting...</Text>
//                 </View>
//             )}

//             {stream && !offline && (
//                 <RTCView
//                     streamURL={stream.toURL()}
//                     style={styles.video}
//                     objectFit="cover"
//                 />
//             )}
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#000" },

//     title: {
//         color: "#fff",
//         marginTop: 50,
//         alignSelf: "center",
//         fontSize: 18,
//     },

//     video: { flex: 1 },

//     loaderContainer: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//     },

//     loadingText: {
//         color: "#fff",
//         marginTop: 10,
//     },

//     offlineText: {
//         color: "#FF4D4D",
//         fontSize: 18,
//         fontWeight: "bold",
//     },

//     backButton: {
//         position: "absolute",
//         top: 50,
//         left: 20,
//         zIndex: 10,
//     },
// });



//////////////////////////////////////////////////////

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
    Alert,
    Dimensions,
    Modal,
    PanResponder,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Svg, { Circle, Polygon } from "react-native-svg";

const FRAME_WIDTH = 640;
const FRAME_HEIGHT = 480;

// Dropdown options
const DETECTION_OPTIONS = [
  { id: 'person', label: 'Person', icon: 'person', color: '#4CAF50' },
  { id: 'weapon', label: 'Weapon', icon: 'warning', color: '#FF5252' },
  { id: 'fire', label: 'Fire', icon: 'flame', color: '#FFA726' },
  { id: 'smoke', label: 'Smoke', icon: 'cloud', color: '#9C27B0' },
] as const;

type DetectionType = typeof DETECTION_OPTIONS[number]['id'] | null;

export default function LiveViewScreen() {
  const { cameraName } = useLocalSearchParams();

  // ==============================
  // Screen Size
  // ==============================
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = (screenWidth * FRAME_HEIGHT) / FRAME_WIDTH;

  // ==============================
  // Polygon State
  // ==============================
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  const [savedPolygons, setSavedPolygons] = useState<
    { points: { x: number; y: number }[]; type: DetectionType }[]
  >([]);
  const [history, setHistory] = useState<{ x: number; y: number }[][]>([]);

  // ==============================
  // Dropdown State
  // ==============================
  const [selectedType, setSelectedType] = useState<DetectionType>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // ==============================
  // Convert Screen → Frame Coords
  // ==============================
  const convertToFrame = (x: number, y: number) => {
    const scaleX = FRAME_WIDTH / screenWidth;
    const scaleY = FRAME_HEIGHT / videoHeight;

    return {
      x: Math.max(0, Math.min(FRAME_WIDTH, x * scaleX)),
      y: Math.max(0, Math.min(FRAME_HEIGHT, y * scaleY)),
    };
  };

  // ==============================
  // Touch Handler
  // ==============================
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const framePoint = convertToFrame(locationX, locationY);

        // Save current state to history before adding new point
        setHistory(prev => [...prev, [...points]]);
        setPoints((prev) => [...prev, framePoint]);
      },
    })
  ).current;

  // ==============================
  // Undo Last Point
  // ==============================
  const handleUndo = () => {
    if (history.length > 0) {
      const lastState = history[history.length - 1];
      setPoints(lastState);
      setHistory(prev => prev.slice(0, -1));
    } else {
      setPoints([]);
    }
  };

  // ==============================
  // Reset Current Drawing
  // ==============================
  const handleReset = () => {
    if (points.length > 0) {
      Alert.alert(
        "Reset Drawing",
        "Are you sure you want to clear the current polygon?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Reset",
            onPress: () => {
              setHistory([]);
              setPoints([]);
              setSelectedType(null); // Also clear selected type
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  // ==============================
  // Select Detection Type
  // ==============================
  const handleSelectType = (type: DetectionType) => {
    setSelectedType(type);
    setDropdownVisible(false);
  };

  // ==============================
  // Save Polygon
  // ==============================
  const handleSavePolygon = () => {
    if (points.length < 3 || !selectedType) return;

    const selectedOption = DETECTION_OPTIONS.find(opt => opt.id === selectedType);

    console.log("Polygon JSON:", JSON.stringify({
      type: selectedType,
      points: points
    }));

    Alert.alert(
      "Polygon Saved",
      `${selectedOption?.label} polygon saved successfully!`,
      [{ text: "OK" }]
    );

    setSavedPolygons((prev) => [...prev, {
      points: [...points],
      type: selectedType
    }]);
    setHistory([]);
    setPoints([]);
    // setSelectedType(null); // Reset selection after save
  };

  // ==============================
  // Clear All Polygons
  // ==============================
  const handleClearAll = () => {
    if (savedPolygons.length > 0) {
      Alert.alert(
        "Clear All Polygons",
        "Are you sure you want to delete all saved polygons?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Clear All",
            onPress: () => {
            setSavedPolygons([]);
            setSelectedType(null);   
          },
            style: "destructive"
          }
        ]
      );
    }
  };

  const handleBack = () => {
    router.back();
  };

  // Get color for polygon based on type
  const getPolygonColor = (type: DetectionType) => {
    switch (type) {
      case 'person': return { fill: 'rgba(76, 175, 80, 0.3)', stroke: '#4CAF50' };
      case 'weapon': return { fill: 'rgba(255, 82, 82, 0.3)', stroke: '#FF5252' };
      case 'fire': return { fill: 'rgba(255, 167, 38, 0.3)', stroke: '#FFA726' };
      case 'smoke': return { fill: 'rgba(156, 39, 176, 0.3)', stroke: '#9C27B0' };
      default: return { fill: 'rgba(255, 255, 255, 0.3)', stroke: '#FFFFFF' };
    }
  };

  // ==============================
  // UI
  // ==============================
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Ionicons name="videocam" size={20} color="#4facfe" />
          <Text style={styles.title}>
            {cameraName || "Camera Preview"}
          </Text>
        </View>

        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle" size={20} color="#4facfe" />
          <Text style={styles.instructions}>
            Tap on the preview to draw Region of interest.
          </Text>
        </View>

        {/* Video Container */}
        <View style={styles.videoWrapper}>
          <View
            style={[
              styles.videoContainer,
              {
                width: screenWidth,
                height: videoHeight,
              }
            ]}
          >
            {/* Camera Preview Placeholder */}
            <LinearGradient
              colors={['#2a2a4a', '#1a1a3a']}
              style={styles.placeholderGradient}
            >
              <View style={styles.placeholderContent}>
                <Ionicons name="camera" size={40} color="#4facfe" />
                <Text style={styles.placeholderText}>
                  Camera Preview
                </Text>
                <Text style={styles.placeholderSubtext}>
                  {cameraName || "Live Feed"}
                </Text>
              </View>
            </LinearGradient>

            {/* SVG Overlay */}
            <View
              style={StyleSheet.absoluteFill}
              {...panResponder.panHandlers}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
              >
                {/* Saved Polygons with type-based colors */}
                {/* {savedPolygons.map((poly, index) => {
                  const colors = getPolygonColor(poly.type);
                  return (
                    <Polygon
                      key={`saved-${index}`}
                      points={poly.points.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth="2"
                      strokeDasharray="6,4"
                    />
                  );
                })} */}
                {savedPolygons.map((poly, index) => {
                  return (
                    <Polygon
                      key={`saved-${index}`}
                      points={poly.points.map((p) => `${p.x},${p.y}`).join(" ")}
                      fill="rgba(202, 0, 0, 0.3)"  // Red with opacity
                      stroke="#ff0000"              // Solid red
                      strokeWidth="2"
                      strokeDasharray="6,4"
                    />
                  );
                })}

                {/* Current Drawing */}
                {points.length >= 2 && (
                  <Polygon
                    points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="rgba(33, 150, 243, 0.2)"
                    stroke="#2196F3"
                    strokeWidth="3"
                  />
                )}

                {/* Points with glow effect */}
                {points.map((p, i) => (
                  <React.Fragment key={i}>
                    <Circle
                      cx={p.x}
                      cy={p.y}
                      r="8"
                      fill="rgba(255, 255, 255, 0.3)"
                    />
                    <Circle
                      cx={p.x}
                      cy={p.y}
                      r="6"
                      fill={i === points.length - 1 ? "#FFD700" : "#FF6B6B"}
                      stroke="#fff"
                      strokeWidth="2"
                    />
                  </React.Fragment>
                ))}
              </Svg>
            </View>
          </View>

          {/* Point Counter */}
          {points.length > 0 && (
            <View style={styles.pointCounter}>
              <Ionicons name="location" size={16} color="#4facfe" />
              <Text style={styles.pointCounterText}>
                {points.length} point{points.length !== 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>

        {/* Detection Type Dropdown */}
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Detection Type:</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(true)}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={selectedType ? ['#4facfe', '#00f2fe'] : ['#4a4a4a', '#3a3a3a']}
              style={styles.dropdownGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {selectedType ? (
                <>
                  <Ionicons
                    name={DETECTION_OPTIONS.find(opt => opt.id === selectedType)?.icon as any}
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.dropdownButtonText}>
                    {DETECTION_OPTIONS.find(opt => opt.id === selectedType)?.label}
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons name="options" size={20} color="#fff" />
                  <Text style={styles.dropdownButtonText}>Select Type</Text>
                </>
              )}
              <Ionicons name="chevron-down" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Drawing Tools */}
        <View style={styles.toolsContainer}>
          <TouchableOpacity
            style={[styles.toolButton, points.length === 0 && styles.disabledButton]}
            onPress={handleUndo}
            disabled={points.length === 0}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={points.length === 0 ? ['#4a4a4a', '#3a3a3a'] : ['#FF6B6B', '#FF5252']}
              style={styles.toolGradient}
            >
              <Ionicons
                name="arrow-undo"
                size={20}
                color={points.length === 0 ? "#888" : "#fff"}
              />
              <Text style={[
                styles.toolButtonText,
                points.length === 0 && styles.disabledText
              ]}>
                Undo
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, points.length === 0 && styles.disabledButton]}
            onPress={handleReset}
            disabled={points.length === 0}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={points.length === 0 ? ['#4a4a4a', '#3a3a3a'] : ['#FFA726', '#F57C00']}
              style={styles.toolGradient}
            >
              <Ionicons
                name="refresh"
                size={20}
                color={points.length === 0 ? "#888" : "#fff"}
              />
              <Text style={[
                styles.toolButtonText,
                points.length === 0 && styles.disabledText
              ]}>
                Reset
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.toolButton, savedPolygons.length === 0 && styles.disabledButton]}
            onPress={handleClearAll}
            disabled={savedPolygons.length === 0}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={savedPolygons.length === 0 ? ['#4a4a4a', '#3a3a3a'] : ['#EF5350', '#E53935']}
              style={styles.toolGradient}
            >
              <Ionicons
                name="trash"
                size={20}
                color={savedPolygons.length === 0 ? "#888" : "#fff"}
              />
              <Text style={[
                styles.toolButtonText,
                savedPolygons.length === 0 && styles.disabledText
              ]}>
                Clear All
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Save Button - Enabled only when polygon has 3+ points AND type is selected */}
        {points.length >= 3 && selectedType && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSavePolygon}
            activeOpacity={0.7}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.saveGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="save" size={24} color="#fff" />
              <Text style={styles.saveButtonText}>
                Save Region
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {/* Message when polygon is ready but type not selected */}
        {points.length >= 3 && !selectedType && (
          <View style={styles.warningContainer}>
            <Ionicons name="alert-circle" size={20} color="#FFA726" />
            <Text style={styles.warningText}>
              Please select a detection type to save
            </Text>
          </View>
        )}

        {/* Saved Polygons Count with type breakdown */}
        {savedPolygons.length > 0 && (
          <View style={styles.savedCountContainer}>
            <Ionicons name="layers" size={16} color="#4facfe" />
            <Text style={styles.savedCountText}>
              {savedPolygons.length} Region{savedPolygons.length !== 1 ? 's' : ''} saved
            </Text>
          </View>
        )}
      </View>

      {/* Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#2a2a4a', '#1a1a3a']}
              style={styles.modalGradient}
            >
              <Text style={styles.modalTitle}>Select Detection Type</Text>

              {DETECTION_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.modalOption,
                    selectedType === option.id && styles.modalOptionSelected
                  ]}
                  onPress={() => handleSelectType(option.id)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={selectedType === option.id ? [option.color, option.color] : ['transparent', 'transparent']}
                    style={StyleSheet.absoluteFill}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  />
                  <Ionicons
                    name={option.icon as any}
                    size={24}
                    color={selectedType === option.id ? '#fff' : option.color}
                  />
                  <Text style={[
                    styles.modalOptionText,
                    selectedType === option.id && styles.modalOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  {selectedType === option.id && (
                    <Ionicons name="checkmark-circle" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  instructionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.3)',
  },
  instructions: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  videoWrapper: {
    position: 'relative',
  },
  videoContainer: {
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  placeholderGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    gap: 8,
  },
  placeholderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholderSubtext: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 14,
  },
  pointCounter: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(79, 172, 254, 0.5)',
  },
  pointCounterText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 10,
    gap: 10,
  },
  dropdownLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  dropdownButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dropdownGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 15,
    gap: 8,
  },
  dropdownButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  toolsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 10,
    marginBottom: 15,
  },
  toolButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  toolGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 6,
  },
  toolButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#888',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '80%',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginTop: 10,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 167, 38, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 167, 38, 0.3)',
    gap: 8,
  },
  warningText: {
    color: '#FFA726',
    fontSize: 14,
  },
  savedCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    backgroundColor: 'rgba(79, 172, 254, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  savedCountText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalGradient: {
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  modalOptionSelected: {
    borderColor: 'transparent',
  },
  modalOptionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 12,
    flex: 1,
  },
  modalOptionTextSelected: {
    fontWeight: 'bold',
  },
});