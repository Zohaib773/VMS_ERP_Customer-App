import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  PanResponder,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import {
  MediaStream,
  RTCPeerConnection
} from "react-native-webrtc";
import { WebView } from "react-native-webview";
import urls from "../urls/urls";

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
  // const { cameraName } = useLocalSearchParams();
  // const { cameraName, cameraId, deviceId } = useLocalSearchParams();
  const { cameraId, cameraName, deviceId, mode } = useLocalSearchParams();

  console.log("MODE:", mode);
  const [ResponseUrl, setUrl] = useState<string | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const pc = useRef(null);
  // const [remoteStream, setRemoteStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [finalStreamUrl, setFinalStreamUrl] = useState<string | null>(null);


  console.log("Device ID:", deviceId);
  console.log("Camera ID:", cameraId);
  console.log("Camera Name:", cameraName);
  // ==============================
  // Screen Size
  // ==============================
  const screenWidth = Dimensions.get("window").width;
  const videoHeight = (screenWidth * FRAME_HEIGHT) / FRAME_WIDTH;

  // ==============================
  // Polygon State
  // ==============================
  const [points, setPoints] = useState<{ x: number; y: number }[]>([]);
  // const [savedPolygons, setSavedPolygons] = useState<
  //   { points: { x: number; y: number }[]; type: DetectionType }[]
  // >([]);
  const [savedPolygons, setSavedPolygons] = useState<
    { id: number; points: { x: number; y: number }[]; type: DetectionType }[]
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
  // Delete ROI
  // ==============================
  const handleDeletePolygon = async (regionId: number) => {
    console.log("🗑 Deleting region ID:", regionId);

    try {
      if (!accessToken) {
        console.log(" No access token found");
        return;
      }

      const response = await fetch(
        `${urls.delete_roi}/${regionId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      console.log(" Delete Status:", response.status);

      if (!response.ok) {
        console.log(" Failed to delete region");
        Alert.alert("Error", "Failed to delete region");
        return;
      }

      console.log("Region deleted successfully");

      // Remove from local state
      setSavedPolygons(prev =>
        prev.filter(polygon => polygon.id !== regionId)
      );

      Alert.alert("Success", "Region deleted");

    } catch (error) {
      console.log("Delete error:", error);
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
  // Load Save Polygon
  // ==============================
  const loadSavedPolygons = async () => {
    console.log("📥 Loading saved polygons...");

    try {
      if (!accessToken) {
        console.log("❌ No access token found");
        return;
      }

      const response = await fetch(
        `${urls.get_roi}?device_id=${deviceId}&cam=cam0`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`,
          },
        }
      );

      console.log("📡 Load Status:", response.status);

      const result = await response.json();
      console.log("📦 Full Response:", result);

      if (!response.ok) {
        console.log("❌ Failed to load polygons");
        return;
      }

      // Extract actual array
      const regions = result.data;

      if (!Array.isArray(regions)) {
        console.log("❌ Regions is not an array:", regions);
        return;
      }

      console.log("📍 Regions Array:", regions);

      // Convert [[x,y]] → {x,y}
      const formattedPolygons = regions.map((region: any) => ({
        id: region.id,
        type: region.label,
        camera: region.camera,
        points: region.points.map((p: number[]) => ({
          x: p[0],
          y: p[1],
        })),
      }));

      console.log("✅ Formatted Polygons:", formattedPolygons);

      setSavedPolygons(formattedPolygons);

      console.log("🎉 Polygons loaded into state");

    } catch (error) {
      console.log("🔥 Load polygon error:", error);
    }
  };

  // ==============================
  // Save Polygon
  // ==============================
  const handleSavePolygon = async () => {

    try {
      console.log(" Original Points:", points);
      console.log(" Selected Type:", selectedType);
      console.log(" Camera ID:", cameraId);
      console.log(" Device ID:", deviceId);

      // Convert {x,y} → [x,y]
      const formattedPoints = points.map((p, index) => {
        const rounded = [Math.round(p.x), Math.round(p.y)];
        console.log(` Point ${index}:`, rounded);
        return rounded;
      });

      const payload = {
        points: formattedPoints,
        label: selectedType,
        camera: Number(0),
        device: deviceId
      };

      console.log(" Final Payload:", JSON.stringify(payload, null, 2));

      if (!accessToken) {
        console.log(" Access token missing!");
        Alert.alert("Error", "Authentication token missing");
        return;
      }

      const response = await fetch(urls.save_roi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      console.log(" Response Status:", response.status);

      const responseText = await response.text();
      console.log(" Raw Response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
      } catch {
        result = responseText;
      }

      if (!response.ok) {
        console.log(" API Error Response:", result);
        Alert.alert("Error", "Failed to save region");
        return;
      }


      Alert.alert("Success", "Region saved successfully!");
      loadSavedPolygons();
      setSelectedType(null);

      setPoints([]);
      setHistory([]);

    } catch (error) {
      console.error(" Save polygon exception:", error);
      Alert.alert("Error", "Something went wrong");
    }
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


  useEffect(() => {
    const fetchAccessToken = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          console.log("✅ Access token retrieved:", token);
          setAccessToken(token);
        } else {
          console.log("❌ No access token found!");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, []); // run once on mount

  // GET THE URLS///

  // useEffect(() => {
  //   console.log("useEffect triggered");

  //   const fetchStreamUrl = async () => {
  //     try {
  //       // const accessToken = "YOUR_ACCESS_TOKEN";

  //        const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzc2NDU2MDM2LCJpYXQiOjE3NzY0MjAwMzYsImp0aSI6IjM3NGMzMzZkZjVmNTQwN2U5MTA3OWVmMDBhNDg2ZWMwIiwidXNlcl9pZCI6MX0.fCc63SBER17MS_GsZTrtwmjnWHzXNF6mDRNb3BM_0ag";



  //       const response = await axios.get("http://192.168.18.28:8001/get_streams", 

  //         {
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });

  //       console.log(" API Response:", response.data);

  //       const streamUrlFromApi = response.data?.streams?.[0]?.url;

  //       if (!streamUrlFromApi) {
  //         throw new Error("Stream URL not found in response");
  //       }

  //       console.log(" Final Stream URL:", streamUrlFromApi);

  //       setFinalStreamUrl(streamUrlFromApi);

  //     } catch (error) {
  //       console.log(" Error fetching stream URL:", error);
  //     }
  //   };

  //   fetchStreamUrl();
  // }, []);


  useEffect(() => {
    const streamUrl = "http://streamer:stream123@192.168.18.139:8889/cam1";

    console.log("=================================");
    console.log("📡 STREAM DEBUG START");
    console.log("Mode:", mode);
    console.log("Device ID:", deviceId);
    console.log("Camera ID:", cameraId);
    console.log("Camera Name:", cameraName);
    console.log("🌐 Stream URL:", streamUrl);
    console.log("=================================");

    setFinalStreamUrl(streamUrl);
  }, []);

  // SHOW THE STREAM/////
  const startWebRTC = async (streamUrl: string) => {
    console.log("🚀 Starting WebRTC Viewer...");
    if (!streamUrl) {
      console.log("❌ Stream URL not ready yet!");
      return;
    }
    console.log("🚀 Starting WebRTC Viewer with URL:", streamUrl);

    try {
      const peerConnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      (pc as any).current = peerConnection;

      console.log("✅ PeerConnection created");

      //  VERY IMPORTANT — request to RECEIVE video
      peerConnection.addTransceiver("video", { direction: "recvonly" });

      (peerConnection as any).ontrack = (event: any) => {
        console.log("📺 Track received!");

        const stream = event.streams[0];
        setRemoteStream(stream);
      };

      (peerConnection as any).onconnectionstatechange = () => {
        console.log("Connection State:", peerConnection.connectionState);
      };

      (peerConnection as any).onicecandidate = (event: any) => {
        if (event.candidate) {
          console.log("ICE candidate gathered");
        } else {
          console.log("ICE gathering complete");
        }
      };

      console.log("📝 Creating offer...");
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      console.log("⏳ Waiting 2 seconds for ICE...");
      await new Promise(resolve => setTimeout(resolve, 2000));

      const finalOffer = peerConnection.localDescription;

      if (!finalOffer?.sdp) {
        console.log("❌ SDP missing!");
        return;
      }

      console.log("SDP Length:", finalOffer.sdp.length);

      //  SEND TO WHEP (NOT WHIP)
      // const response = await fetch(
      //   "http://192.168.18.28:8889/cam1/whep",
      //   {
      const response = await fetch(streamUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp",
        },
        body: finalOffer.sdp,
      }
      );

      console.log(" Server status:", response.status);

      const answerSDP = await response.text();

      if (response.status !== 201) {
        console.log(" Server error:", answerSDP);
        return;
      }

      console.log(" Setting remote description...");

      await peerConnection.setRemoteDescription({
        type: "answer",
        sdp: answerSDP,
      });

      console.log(" WebRTC CONNECTED!");

    } catch (err) {
      console.log(" WebRTC ERROR:", err);
    }
  };

  // useEffect(() => {
  //   // getUrl();
  //   startWebRTC(streamUrl);
  // }, []);

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
        {/* <View style={styles.instructionsContainer}>
          <Ionicons name="information-circle" size={20} color="#4facfe" />
          <Text style={styles.instructions}>
            Tap on the preview to draw Region of interest.
          </Text>
        </View> */}

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
            {/* {remoteStream ? (
              <RTCView
                streamURL={remoteStream.toURL()}
                style={{ flex: 1 }}
                objectFit="cover"
              />
            ) : ( */}
            {finalStreamUrl ? (
              // <WebView
              //   source={{ uri: finalStreamUrl }}
              //   style={{ flex: 1 }}

              //   javaScriptEnabled={true}
              //   domStorageEnabled={true}
              //   allowsInlineMediaPlayback={true}
              //   mediaPlaybackRequiresUserAction={false}

              //   originWhitelist={["*"]}

              //   mixedContentMode="always"

              //   onLoadStart={() => {
              //     console.log("📡 WebView load started");
              //   }}

              //   onLoad={() => {
              //     console.log("✅ WebView loaded");
              //   }}

              //   onError={(e) => {
              //     console.log("❌ WebView error:", e.nativeEvent);
              //   }}

              //   onHttpError={(e) => {
              //     console.log("❌ HTTP error:", e.nativeEvent);
              //   }}
              // />\
              <WebView
                source={{
                  uri: finalStreamUrl,
                }}
                style={{ flex: 1 }}

                javaScriptEnabled={true}
                domStorageEnabled={true}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
                originWhitelist={["*"]}
                mixedContentMode="always"

                // 🔥 DEBUG LOGS
                onLoadStart={(e) => {
                  console.log("📡 onLoadStart");
                  console.log("➡️ URL:", e.nativeEvent.url);
                }}

                onLoadProgress={(e) => {
                  console.log("⏳ Loading progress:", e.nativeEvent.progress);
                }}

                onLoad={(e) => {
                  console.log("✅ onLoad SUCCESS");
                  console.log("➡️ URL:", e.nativeEvent.url);
                }}

                onLoadEnd={(e) => {
                  console.log("🏁 onLoadEnd");
                  console.log("➡️ URL:", e.nativeEvent.url);
                }}

                onError={(e) => {
                  console.log("❌ onError TRIGGERED");
                  console.log("Code:", e.nativeEvent.code);
                  console.log("Description:", e.nativeEvent.description);
                  console.log("URL:", e.nativeEvent.url);
                }}

                onHttpError={(e) => {
                  console.log("❌ HTTP ERROR");
                  console.log("Status Code:", e.nativeEvent.statusCode);
                  console.log("Description:", e.nativeEvent.description);
                  console.log("URL:", e.nativeEvent.url);
                }}

                onNavigationStateChange={(navState) => {
                  console.log("🔁 Navigation Change:");
                  console.log("➡️ URL:", navState.url);
                  console.log("➡️ Loading:", navState.loading);
                  console.log("➡️ CanGoBack:", navState.canGoBack);
                  console.log("➡️ CanGoForward:", navState.canGoForward);
                }}

                startInLoadingState={true}
                renderLoading={() => (
                  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <Text>Loading stream...</Text>
                  </View>
                )}
              />
            ) : (
              <LinearGradient
                colors={['#2a2a4a', '#1a1a3a']}
                style={styles.placeholderGradient}
              >
                <View style={styles.placeholderContent}>
                  <Ionicons name="camera" size={40} color="#4facfe" />
                  <Text style={styles.placeholderText}>
                    Connecting to Stream...
                  </Text>
                </View>
              </LinearGradient>
            )}

            {/* SVG Overlay */}
            {/* <View
              style={StyleSheet.absoluteFill}
              {...panResponder.panHandlers}
            >
              <Svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${FRAME_WIDTH} ${FRAME_HEIGHT}`}
              >
                {savedPolygons.map((poly) => {
                  // Calculate center of polygon for label placement
                  const centerX = poly.points.reduce((sum, p) => sum + p.x, 0) / poly.points.length;
                  const centerY = poly.points.reduce((sum, p) => sum + p.y, 0) / poly.points.length;

                  // Get colors and icon based on detection type
                  const getTypeStyles = (type: string) => {
                    switch (type?.toLowerCase()) {
                      case 'fire':
                        return {
                          bg: 'rgba(255, 69, 0, 0.9)',
                          border: '#ff4500',
                          text: '#ffffff',
                          icon: '🔥',
                          gradient: 'linear-gradient(135deg, #ff4500, #ff8c00)'
                        };
                      case 'smoke':
                        return {
                          bg: 'rgba(105, 105, 105, 0.9)',
                          border: '#696969',
                          text: '#ffffff',
                          icon: '💨',
                          gradient: 'linear-gradient(135deg, #696969, #a9a9a9)'
                        };
                      case 'person':
                        return {
                          bg: 'rgba(30, 144, 255, 0.9)',
                          border: '#1e90ff',
                          text: '#ffffff',
                          icon: '👤',
                          gradient: 'linear-gradient(135deg, #1e90ff, #00bfff)'
                        };
                      case 'weapon':
                        return {
                          bg: 'rgba(220, 20, 60, 0.9)',
                          border: '#dc143c',
                          text: '#ffffff',
                          icon: '⚔️',
                          gradient: 'linear-gradient(135deg, #dc143c, #8b0000)'
                        };
                      default:
                        return {
                          bg: 'rgba(128, 128, 128, 0.9)',
                          border: '#808080',
                          text: '#ffffff',
                          icon: '📌',
                          gradient: 'linear-gradient(135deg, #808080, #c0c0c0)'
                        };
                    }
                  };

                  const styles = getTypeStyles(poly.type ? poly.type.toUpperCase() : "");

                  return (
                    <React.Fragment key={poly.id}>
                    
                      <Polygon
                        points={poly.points.map((p) => `${p.x},${p.y}`).join(" ")}
                        fill={`${styles.bg.replace('0.9', '0.25')}`} // More transparent fill
                        stroke={styles.border}
                        strokeWidth="2.5"
                        strokeDasharray={poly.type?.toLowerCase() === 'smoke' ? "5,3" : "none"} // Dashed for smoke
                        onPress={() =>
                          Alert.alert(
                            "Delete Detection Region",
                            `Do you want to delete this ${poly.type} detection region?`,
                            [
                              { text: "Cancel", style: "cancel" },
                              {
                                text: "Delete",
                                style: "destructive",
                                onPress: () => handleDeletePolygon(poly.id),
                              },
                            ]
                          )
                        }
                      />
                      <G>
                       
                        <Rect
                          x={centerX - 45}
                          y={centerY - 16}
                          width={90}
                          height={32}
                          fill={styles.bg}
                          rx="16"
                          ry="16"
                        />

                        
                        <Rect
                          x={centerX - 45}
                          y={centerY - 16}
                          width={8}
                          height={32}
                          fill="white"
                          rx="16"
                          ry="16"
                          opacity="0.3"
                        />

                       
                        <SvgText
                          x={centerX - 25}
                          y={centerY + 6}
                          fill={styles.text}
                          fontSize="16"
                          textAnchor="middle"
                        >
                          {styles.icon}
                        </SvgText>

                        
                        <SvgText
                          x={centerX + 10}
                          y={centerY + 6}
                          fill={styles.text}
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {poly.type?.toUpperCase()}
                        </SvgText>
                      </G>
                    </React.Fragment>
                  );
                })}

               
                {points.length >= 2 && (
                  <Polygon
                    points={points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="rgba(33, 150, 243, 0.2)"
                    stroke="#2196F3"
                    strokeWidth="3"
                  />
                )}

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
            </View> */}
          </View>

         
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
        {/* <View style={styles.dropdownContainer}>
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
        </View> */}

        {/* Drawing Tools */}
        {/* <View style={styles.toolsContainer}>
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
        </View> */}

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
      {/* <Modal
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
      </Modal> */}
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
    paddingTop: 50,
    paddingBottom: 30,
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