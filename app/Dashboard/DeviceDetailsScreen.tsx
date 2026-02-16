import {
    Feather,
    FontAwesome6,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons
} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import mqtt from "mqtt";
import React, { JSX, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import CustomerSidebar from "../component/sidebarlayout";

import { Buffer } from "buffer";
global.Buffer = Buffer;

import process from "process";
global.process = process;

const MQTT_TOPIC = "client/+/hub/+/sensor/+/+";
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Outside the component (global for this file)
let mqttClient: mqtt.MqttClient | null = null;

export default function DeviceDetailsScreen() {
    const navigation = useNavigation();
    const router = useRouter(); // Add this line
    // const params = useLocalSearchParams();
    // const device = JSON.parse(params.device as string);
    const params = useLocalSearchParams();

    const device = React.useMemo(() => {
        if (!params.device) return null;
        try {
            return JSON.parse(params.device as string);
        } catch (e) {
            console.error("Failed to parse device param:", e);
            return null;
        }
    }, [params.device]);


    // MQTT
    // const clientRef = useRef<any>(null);
    const [mqttStatus, setMqttStatus] = useState("Disconnected");
    const [sensorDataMap, setSensorDataMap] = useState<Record<string, any>>({});
    const [connectionStatus, setConnectionStatus] = useState({
        isConnected: false,
        lastUpdate: null as string | null
    });
    const clientRef = useRef<mqtt.MqttClient | null>(mqttClient);

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;

    // const navigateToSensorGraph = (sensor: any, sensorType: string, title: string, liveData: any) => {
    //     router.push({
    //         pathname: '/component/sensorGraph',
    //         params: {
    //             sensor: JSON.stringify(sensor),
    //             sensorType,
    //             device: JSON.stringify(device),
    //             liveData: liveData ? JSON.stringify(liveData) : '',
    //         },
    //     });
    // };


    const navigateToSensorGraph = (
        sensor: any,
        sensorType: string,
        liveData: any
    ) => {
        router.push({
            pathname: "/component/sensorGraph",
            params: {
                sensorId: String(sensor.id),   // ✅ pass ID
                sensorType,                    // ✅ pass type
                deviceId: String(device?.id),  // optional but recommended
                liveData: liveData ? JSON.stringify(liveData) : ""
            }
        });
    };


    useEffect(() => {
        if (device) {
            console.log(" Device received in DeviceDetailsScreen:", device);
        }
    }, [device]);


    useEffect(() => {
        if (mqttClient && mqttClient.connected) {
            console.log("[MQTT] Existing client detected, already connected");

            clientRef.current = mqttClient;

            setMqttStatus("Connected");
            setConnectionStatus({ isConnected: true, lastUpdate: new Date().toLocaleTimeString() });

            // Start pulse animation if needed
            startPulseAnimation();

            // Optionally, make sure we are subscribed (won't re-subscribe if already)
            mqttClient.subscribe(MQTT_TOPIC, { qos: 0 }, (err, granted) => {
                if (err) console.log("[MQTT] Subscribe error:", err);
                else console.log("[MQTT] Existing subscriptions confirmed:", granted);
            });

            // Attach message handler again if needed
            mqttClient.on("message", (topic, payload) => {
                try {
                    const payloadStr = payload.toString();
                    let data;
                    try { data = JSON.parse(payloadStr); }
                    catch { data = payloadStr; }

                    const topicParts = topic.split("/");
                    const sensorKey = topicParts.slice(3).join("/");

                    setSensorDataMap(prev => ({
                        ...prev,
                        [sensorKey]: {
                            value: data,
                            topic,
                            timestamp: new Date().toISOString(),
                            receivedAt: new Date().toLocaleTimeString()
                        }
                    }));

                    setConnectionStatus(prev => ({
                        ...prev,
                        lastUpdate: new Date().toLocaleTimeString()
                    }));
                } catch (err) {
                    console.log("[MQTT] Error processing message:", err);
                }
            });
        }
    }, []);

    // const connectAndSubscribe = () => {
    //     const brokerUrl = "ws://192.168.18.28:9001";
    //     console.log("[MQTT] Attempting to connect to broker:", brokerUrl);

    //     const client = mqtt.connect(brokerUrl, {
    //         clientId: "expo_" + Math.random().toString(16).slice(2),
    //         clean: true,
    //         reconnectPeriod: 10000,
    //         connectTimeout: 50000,
    //     });

    //     clientRef.current = client;

    //     client.on("connect", () => {
    //         console.log("[MQTT] Connected to broker");
    //         setMqttStatus("Connected");
    //         setConnectionStatus({
    //             isConnected: true,
    //             lastUpdate: new Date().toLocaleTimeString()
    //         });
    //         startPulseAnimation();
    //         Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();

    //         client.subscribe(MQTT_TOPIC, (err, granted) => {
    //             if (err) {
    //                 console.log("[MQTT] Subscribe error:", err);
    //             } else {
    //                 console.log("[MQTT] Subscribed to topic pattern:", MQTT_TOPIC);
    //                 console.log("[MQTT] Granted subscriptions:", granted);
    //             }
    //         });
    //     });
    const connectAndSubscribe = () => {
        if (mqttClient && mqttClient.connected) {
            console.log("[MQTT] Already connected, skipping reconnect");
            setMqttStatus("Connected");
            setConnectionStatus(prev => ({ ...prev, isConnected: true }));
            return;
        }

        const brokerUrl = "ws://192.168.18.28:9001";
        console.log("[MQTT] Attempting to connect to broker:", brokerUrl);

        const client = mqtt.connect(brokerUrl, {
            clientId: "expo_" + Math.random().toString(16).slice(2),
            clean: false, // keep session
            reconnectPeriod: 10000,
            connectTimeout: 50000,
        });

        mqttClient = client; // persist globally
        clientRef.current = client;

        client.on("connect", () => {
            console.log("[MQTT] Connected to broker");
            setMqttStatus("Connected");
            setConnectionStatus({ isConnected: true, lastUpdate: new Date().toLocaleTimeString() });

            // Subscribe to topics if not already subscribed
            client.subscribe(MQTT_TOPIC, { qos: 0 }, (err, granted) => {
                if (err) console.log("[MQTT] Subscribe error:", err);
                else console.log("[MQTT] Subscribed:", granted);
            });
        });

        client.on("message", (topic, payload) => {
            try {
                const payloadStr = payload.toString();
                console.log("[MQTT] Message received on topic:", topic);
                console.log("[MQTT] Raw payload:", payloadStr);

                let data;
                try {
                    data = JSON.parse(payloadStr);
                    console.log("[MQTT] Parsed JSON payload:", data);
                } catch (e) {
                    data = payloadStr;
                    console.log("[MQTT] Payload is not JSON, using raw string:", data);
                }

                // Generate a sensor key based on topic
                const topicParts = topic.split("/");
                const sensorKey = topicParts.slice(3).join("/");
                console.log("[MQTT] Sensor key generated:", sensorKey);

                setSensorDataMap(prev => {
                    const updated = {
                        ...prev,
                        [sensorKey]: {
                            value: data,
                            topic,
                            timestamp: new Date().toISOString(),
                            receivedAt: new Date().toLocaleTimeString()
                        }
                    };
                    console.log("[MQTT] Updated sensorDataMap:", updated);
                    return updated;
                });

                setConnectionStatus(prev => ({
                    ...prev,
                    lastUpdate: new Date().toLocaleTimeString()
                }));

                // Trigger animation
                Animated.sequence([
                    Animated.timing(slideAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
                    Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
                ]).start();

            } catch (err) {
                console.log("[MQTT] Error processing message:", err);
            }
        });

        client.on("reconnect", () => {
            console.log("[MQTT] Reconnecting...");
            setMqttStatus("Reconnecting");
            setConnectionStatus(prev => ({ ...prev, isConnected: false }));
        });

        client.on("offline", () => {
            console.log("[MQTT] Client offline");
            setMqttStatus("Offline");
            setConnectionStatus(prev => ({ ...prev, isConnected: false }));
            stopPulseAnimation();
        });

        client.on("close", () => {
            console.log("[MQTT] Connection closed");
            setMqttStatus("Closed");
            setConnectionStatus(prev => ({ ...prev, isConnected: false }));
            stopPulseAnimation();
        });

        client.on("error", (err) => {
            console.log("[MQTT] Error occurred:", err);
            setMqttStatus("Error");
            setConnectionStatus(prev => ({ ...prev, isConnected: false }));
            stopPulseAnimation();
        });
    };

    // Cleanup on unmount
    // useEffect(() => {
    //     return () => clientRef.current?.end(true);
    // }, []);

    // Animation helpers
    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    };

    const stopPulseAnimation = () => {
        pulseAnim.stopAnimation();
        Animated.timing(pulseAnim, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    };

    const getStatusColor = () => {
        switch (mqttStatus) {
            case "Connected": return "#10B981";
            case "Disconnected": return "#6B7280";
            case "Reconnecting": return "#F59E0B";
            case "Error": return "#EF4444";
            case "Offline":
            case "Closed": return "#6B7280";
            default: return "#6B7280";
        }
    };

    const getSensorStatusColor = (sensorType: string, value: any) => {
        const numValue = typeof value === 'object' ? value?.value : value;

        switch (sensorType) {
            case "LPG":
                return numValue > 300 ? "#EF4444" : numValue > 200 ? "#F59E0B" : "#10B981";
            case "Smoke":
                return numValue > 400 ? "#EF4444" : numValue > 300 ? "#F59E0B" : "#10B981";
            case "Motion_detection":
                return numValue > 500 ? "#3B82F6" : "#6B7280";
            case "Human_appearance":
                return numValue > 300 ? "#8B5CF6" : "#6B7280";
            case "Door_window":
                return numValue > 50 ? "#EF4444" : "#10B981";
            default:
                return "#6B7280";
        }
    };

    const getSensorStatusText = (sensorType: string, value: any) => {
        const numValue = typeof value === 'object' ? value?.value : value;

        switch (sensorType) {
            case "LPG":
                if (numValue > 300) return "DANGER";
                if (numValue > 200) return "WARNING";
                return "SAFE";
            case "Smoke":
                if (numValue > 400) return "DETECTED";
                if (numValue > 300) return "WARNING";
                return "CLEAR";
            case "Motion_detection":
                return numValue > 500 ? "ACTIVE" : "INACTIVE";
            case "Human_appearance":
                return numValue > 300 ? "DETECTED" : "CLEAR";
            case "Door_window":
                return numValue > 50 ? "OPEN" : "CLOSED";
            default:
                return "NORMAL";
        }
    };

    const getSensorUnit = (sensorType: string) => {
        switch (sensorType) {
            case "LPG":
            case "Smoke":
                return "PPM";
            case "Motion_detection":
            case "Human_appearance":
                return "units";
            case "Door_window":
                return "% open";
            default:
                return "units";
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Not claimed";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const getDeviceStatusColor = (device: any) => !device.is_claimed ? "#FFA500" : device.armed ? "#22C55E" : "#EF4444";
    const getDeviceStatusText = (device: any) => !device.is_claimed ? "Unclaimed" : device.armed ? "Armed" : "Disarmed";

    // Render sensor value with gauge
    const renderValueGauge = (value: number, max: number, color: string) => {
        const percentage = Math.min((value / max) * 100, 100);

        return (
            <View style={styles.gaugeContainer}>
                <View style={styles.gaugeBackground}>
                    <View
                        style={[
                            styles.gaugeFill,
                            {
                                width: `${percentage}%`,
                                backgroundColor: color
                            }
                        ]}
                    />
                </View>
                <Text style={styles.gaugeValue}>{value.toFixed(0)}</Text>
            </View>
        );
    };

    // Render sensor card with live data
    // const renderSensorCard = (sensor: any, sensorType: string, title: string, icon: JSX.Element, color: string) => {
    //     const sensorKey = `3/sensor/${sensorType}/${sensor.id}`;
    //     const liveData = sensorDataMap[sensorKey];
    //     const sensorValue = liveData?.value;
    //     const value = sensorValue?.value ?? 0;
    //     const statusColor = getSensorStatusColor(sensorType, value);
    //     const statusText = getSensorStatusText(sensorType, value);
    //     const unit = getSensorUnit(sensorType);
    //     const lastUpdated = liveData?.receivedAt || "No data";

    //     return (
    //         <Animated.View
    //             key={sensorKey}
    //             style={[
    //                 styles.sensorCard,
    //                 {
    //                     borderLeftColor: color,
    //                     transform: [{
    //                         translateX: slideAnim.interpolate({
    //                             inputRange: [0, 1],
    //                             outputRange: [0, 10]
    //                         })
    //                     }]
    //                 }
    //             ]}
    //         >
    //             <View style={styles.sensorHeader}>
    //                 <View style={[styles.sensorIconContainer, { backgroundColor: color + '20' }]}>
    //                     {icon}
    //                 </View>
    //                 <View style={styles.sensorTitleContainer}>
    //                     <Text style={styles.sensorTitle}>{title}</Text>
    //                     <Text style={styles.sensorName}>{sensor.name}</Text>
    //                 </View>
    //                 <View style={[styles.sensorStatusBadge, { backgroundColor: statusColor + '20' }]}>
    //                     <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
    //                     <Text style={[styles.sensorStatusText, { color: statusColor }]}>
    //                         {statusText}
    //                     </Text>
    //                 </View>
    //             </View>

    //             <View style={styles.sensorDataContainer}>
    //                 <View style={styles.valueContainer}>
    //                     <Text style={styles.valueLabel}>Current Value</Text>
    //                     <View style={styles.valueDisplay}>
    //                         <Text style={[styles.value, { color: statusColor }]}>
    //                             {value.toFixed(0)}
    //                         </Text>
    //                         <Text style={styles.unit}>{unit}</Text>
    //                     </View>
    //                 </View>

    //                 {renderValueGauge(value, getMaxValue(sensorType), statusColor)}
    //             </View>

    //             <View style={styles.sensorMeta}>
    //                 <View style={styles.metaItem}>
    //                     <Feather name="cpu" size={14} color="#6B7280" />
    //                     <Text style={styles.metaText}>ID: {sensor.id}</Text>
    //                 </View>
    //                 <View style={styles.metaItem}>
    //                     <Feather name="clock" size={14} color="#6B7280" />
    //                     <Text style={styles.metaText}>{lastUpdated}</Text>
    //                 </View>
    //             </View>
    //         </Animated.View>
    //     );
    // };
    const renderSensorCard = (sensor: any, sensorType: string, title: string, icon: JSX.Element, color: string) => {
        const sensorKey = `3/sensor/${sensorType}/${sensor.id}`;
        const liveData = sensorDataMap[sensorKey];
        const sensorValue = liveData?.value;
        const value = sensorValue?.value ?? 0;
        const statusColor = getSensorStatusColor(sensorType, value);
        const statusText = getSensorStatusText(sensorType, value);
        const unit = getSensorUnit(sensorType);
        const lastUpdated = liveData?.receivedAt || "No data";

        return (
            <TouchableOpacity
                activeOpacity={0.7}
                // onPress={() => navigateToSensorGraph(sensor, sensorType, title, liveData)}
                onPress={() =>
                    navigateToSensorGraph(sensor, sensorType, liveData)
                }
            >
                <Animated.View
                    key={sensorKey}
                    style={[
                        styles.sensorCard,
                        {
                            borderLeftColor: color,
                            transform: [{
                                translateX: slideAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, 10]
                                })
                            }]
                        }
                    ]}
                >
                    {/* Add a subtle indicator that it's clickable */}
                    <View style={styles.clickableIndicator}>
                        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                    </View>

                    {/* Rest of your existing card content */}
                    <View style={styles.sensorHeader}>
                        <View style={[styles.sensorIconContainer, { backgroundColor: color + '20' }]}>
                            {icon}
                        </View>
                        <View style={styles.sensorTitleContainer}>
                            <Text style={styles.sensorTitle}>{title}</Text>
                            <Text style={styles.sensorName}>{sensor.name}</Text>
                        </View>
                        <View style={[styles.sensorStatusBadge, { backgroundColor: statusColor + '20' }]}>
                            <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
                            <Text style={[styles.sensorStatusText, { color: statusColor }]}>
                                {statusText}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sensorDataContainer}>
                        <View style={styles.valueContainer}>
                            <Text style={styles.valueLabel}>Current Value</Text>
                            <View style={styles.valueDisplay}>
                                <Text style={[styles.value, { color: statusColor }]}>
                                    {value.toFixed(0)}
                                </Text>
                                <Text style={styles.unit}>{unit}</Text>
                            </View>
                        </View>

                        {renderValueGauge(value, getMaxValue(sensorType), statusColor)}
                    </View>

                    <View style={styles.sensorMeta}>
                        <View style={styles.metaItem}>
                            <Feather name="cpu" size={14} color="#6B7280" />
                            <Text style={styles.metaText}>ID: {sensor.id}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Feather name="clock" size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{lastUpdated}</Text>
                        </View>
                    </View>
                </Animated.View>
            </TouchableOpacity>
        );
    };

    const getMaxValue = (sensorType: string) => {
        switch (sensorType) {
            case "LPG": return 500;
            case "Smoke": return 600;
            case "Motion_detection": return 1000;
            case "Human_appearance": return 500;
            case "Door_window": return 100;
            default: return 1000;
        }
    };

    // Render door/window sensor
    const renderDoorWindowSensor = (sensor: any) => {
        const sensorKey = `3/sensor/Door_window/${sensor.id}`;
        const liveData = sensorDataMap[sensorKey];
        const sensorValue = liveData?.value;
        const value = sensorValue?.value ?? 0;
        const status = value > 50 ? "OPEN" : "CLOSED";
        const statusColor = getSensorStatusColor("Door_window", value);
        const lastUpdated = liveData?.receivedAt || "No data";

        return (
            <View key={sensor.id} style={[styles.doorWindowCard, { borderLeftColor: "#8B5CF6" }]}>
                <View style={styles.doorWindowHeader}>
                    <View style={[styles.doorWindowIconContainer, { backgroundColor: '#8B5CF620' }]}>
                        <FontAwesome6
                            name={sensor.name === "Window" ? "window-maximize" : "door-closed"}
                            size={24}
                            color="#8B5CF6"
                        />
                    </View>
                    <View style={styles.doorWindowInfo}>
                        <Text style={styles.doorWindowTitle}>{sensor.name}</Text>
                        <Text style={styles.doorWindowType}>
                            {sensor.name === "Window" ? "Window Sensor" : "Door Sensor"}
                        </Text>
                    </View>
                    <View style={[styles.doorWindowStatus, { backgroundColor: statusColor + '20' }]}>
                        <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
                        <Text style={[styles.doorWindowStatusText, { color: statusColor }]}>
                            {status}
                        </Text>
                    </View>
                </View>

                <View style={styles.doorWindowData}>
                    <View style={styles.openingIndicator}>
                        <View style={styles.openingBar}>
                            <View
                                style={[
                                    styles.openingFill,
                                    {
                                        width: `${Math.min(value, 100)}%`,
                                        backgroundColor: statusColor
                                    }
                                ]}
                            />
                        </View>
                        <Text style={styles.openingPercentage}>{value}% open</Text>
                    </View>

                    <View style={styles.doorWindowMeta}>
                        <View style={styles.metaItem}>
                            <Feather name="cpu" size={14} color="#6B7280" />
                            <Text style={styles.metaText}>ID: {sensor.id}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Feather name="clock" size={14} color="#6B7280" />
                            <Text style={styles.metaText}>{lastUpdated}</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    // Statistics card
    const renderStatistics = () => {
        const activeSensors = Object.keys(sensorDataMap).length;
        const lastUpdate = connectionStatus.lastUpdate || "Never";
        const connected = connectionStatus.isConnected;

        return (
            <View style={styles.statsCard}>
                <View style={styles.statsHeader}>
                    <MaterialIcons name="analytics" size={24} color="#4F46E5" />
                    <Text style={styles.statsTitle}>Live Statistics</Text>
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#4F46E520' }]}>
                            <Feather name="activity" size={20} color="#4F46E5" />
                        </View>
                        <Text style={styles.statValue}>{activeSensors}</Text>
                        <Text style={styles.statLabel}>Active Sensors</Text>
                    </View>

                    <View style={styles.statItem}>
                        <View style={[styles.statIconContainer, { backgroundColor: connectionStatus.isConnected ? '#10B98120' : '#EF444420' }]}>
                            <MaterialIcons
                                name="wifi"
                                size={20}
                                color={connectionStatus.isConnected ? '#10B981' : '#EF4444'}
                            />
                        </View>
                        <Text style={[styles.statValue, { color: connectionStatus.isConnected ? '#10B981' : '#EF4444' }]}>
                            {connectionStatus.isConnected ? 'ONLINE' : 'OFFLINE'}
                        </Text>
                        <Text style={styles.statLabel}>Connection</Text>
                    </View>

                    <View style={styles.statItem}>
                        <View style={[styles.statIconContainer, { backgroundColor: '#F59E0B20' }]}>
                            <Feather name="clock" size={20} color="#F59E0B" />
                        </View>
                        <Text style={styles.statValue}>{lastUpdate}</Text>
                        <Text style={styles.statLabel}>Last Update</Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <CustomerSidebar activeTab="My Devices" userData={null}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
                <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Live Sensor Data</Text>
                        <View style={styles.statusBadge}>
                            <View style={[styles.statusDot, { backgroundColor: getDeviceStatusColor(device) }]} />
                            <Text style={[styles.statusText, { color: getDeviceStatusColor(device) }]}>
                                {getDeviceStatusText(device)}
                            </Text>
                        </View>
                    </View>

                    {/* Device Overview */}
                    <View style={styles.overviewCard}>
                        <View style={styles.overviewIcon}>
                            <MaterialIcons name="sensors" size={32} color="#4F46E5" />
                        </View>
                        <View style={styles.overviewInfo}>
                            <Text style={styles.deviceName}>{device.name}</Text>
                            <Text style={styles.deviceMac}>{device.mac_adress}</Text>
                            <Text style={styles.deviceStatus}>
                                {device.is_claimed ? '✓ Claimed' : '⚠ Unclaimed'} • Created {formatDate(device.created_at)}
                            </Text>
                        </View>
                    </View>

                    {/* Connection Card */}
                    <View style={styles.connectionCard}>
                        <View style={styles.connectionHeader}>
                            <MaterialIcons name="wifi" size={24} color={getStatusColor()} />
                            <Text style={styles.connectionTitle}>MQTT Connection</Text>
                            <Animated.View
                                style={[
                                    styles.connectionIndicator,
                                    {
                                        backgroundColor: getStatusColor(),
                                        transform: [{ scale: pulseAnim }],
                                        opacity: fadeAnim
                                    }
                                ]}
                            />
                        </View>

                        <View style={styles.connectionDetails}>
                            <Text style={styles.connectionStatus}>
                                Status: <Text style={{ color: getStatusColor(), fontWeight: '600' }}>{mqttStatus}</Text>
                            </Text>
                            <Text style={styles.connectionTopic}>Topic: {MQTT_TOPIC}</Text>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.connectButton,
                                {
                                    backgroundColor: connectionStatus.isConnected ? '#10B981' : '#4F46E5',
                                    opacity: connectionStatus.isConnected ? 0.7 : 1
                                }
                            ]}
                            onPress={connectAndSubscribe}
                            disabled={connectionStatus.isConnected}
                        >
                            <MaterialIcons
                                name={connectionStatus.isConnected ? "check-circle" : "wifi"}
                                size={20}
                                color="white"
                            />
                            <Text style={styles.connectButtonText}>
                                {connectionStatus.isConnected ? 'Connected' : 'Connect to MQTT'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Statistics */}
                    {renderStatistics()}

                    {/* Sensors Section */}
                    {device.captive_data?.sensors && (
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <MaterialIcons name="sensors" size={24} color="#4F46E5" />
                                <Text style={styles.sectionTitle}>Live Sensor Readings</Text>
                                <View style={styles.sensorCountBadge}>
                                    <Text style={styles.sensorCountText}>
                                        {Object.keys(sensorDataMap).length} active
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.sensorsGrid}>
                                {device.captive_data.sensors.LPG && renderSensorCard(
                                    device.captive_data.sensors.LPG,
                                    "LPG",
                                    "LPG Gas Sensor",
                                    <MaterialCommunityIcons name="gas-cylinder" size={24} color="#F59E0B" />,
                                    "#F59E0B"
                                )}

                                {device.captive_data.sensors.Smoke && renderSensorCard(
                                    device.captive_data.sensors.Smoke,
                                    "Smoke",
                                    "Smoke Detector",
                                    <MaterialCommunityIcons name="smoke-detector" size={24} color="#EF4444" />,
                                    "#EF4444"
                                )}

                                {device.captive_data.sensors.Motion_detection && renderSensorCard(
                                    device.captive_data.sensors.Motion_detection,
                                    "Motion_detection",
                                    "Motion Sensor",
                                    <MaterialCommunityIcons name="motion-sensor" size={24} color="#8B5CF6" />,
                                    "#8B5CF6"
                                )}

                                {device.captive_data.sensors.Human_appearance && renderSensorCard(
                                    device.captive_data.sensors.Human_appearance,
                                    "Human_appearance",
                                    "Human Detection",
                                    <MaterialCommunityIcons name="human" size={24} color="#3B82F6" />,
                                    "#3B82F6"
                                )}
                            </View>

                            {/* Door/Window Sensors */}
                            {device.captive_data.sensors.Door_window &&
                                device.captive_data.sensors.Door_window.length > 0 && (
                                    <View style={styles.doorWindowSection}>
                                        <View style={styles.sectionHeader}>
                                            <FontAwesome6 name="door-closed" size={24} color="#8B5CF6" />
                                            <Text style={styles.sectionTitle}>Door & Window Sensors</Text>
                                        </View>
                                        <View style={styles.doorWindowGrid}>
                                            {device.captive_data.sensors.Door_window.map(renderDoorWindowSensor)}
                                        </View>
                                    </View>
                                )}
                        </View>
                    )}

                    {/* Empty State */}
                    {!device.captive_data && (
                        <View style={styles.emptyState}>
                            <MaterialIcons name="sensors-off" size={80} color="#D1D5DB" />
                            <Text style={styles.emptyStateTitle}>No Sensors Configured</Text>
                            <Text style={styles.emptyStateText}>
                                This device doesn't have any sensors configured yet.
                                {device.is_claimed ? '' : ' Claim the device first to add sensors.'}
                            </Text>
                        </View>
                    )}

                    <View style={styles.bottomSpace} />
                </ScrollView>
            </SafeAreaView>
        </CustomerSidebar>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        gap: 6,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    overviewCard: {
        backgroundColor: 'white',
        margin: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    overviewIcon: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    overviewInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    deviceMac: {
        fontSize: 14,
        color: '#6B7280',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    deviceStatus: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    connectionCard: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    connectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 12,
    },
    connectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    connectionIndicator: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
    connectionDetails: {
        marginBottom: 16,
    },
    connectionStatus: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    connectionTopic: {
        fontSize: 12,
        color: '#9CA3AF',
        fontFamily: 'monospace',
    },
    connectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        borderRadius: 12,
        gap: 8,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    statsCard: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    statsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
    },
    section: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F9FAFB',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        flex: 1,
    },
    sensorCountBadge: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    sensorCountText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4F46E5',
    },
    sensorsGrid: {
        padding: 16,
        gap: 12,
    },
    clickableIndicator: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    sensorCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
        position: 'relative',
    },
    sensorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sensorIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sensorTitleContainer: {
        flex: 1,
    },
    sensorTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    sensorName: {
        fontSize: 14,
        color: '#6B7280',
    },
    sensorStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    statusDotSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    sensorStatusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    sensorDataContainer: {
        marginBottom: 12,
    },
    valueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    valueLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    valueDisplay: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 4,
    },
    value: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    unit: {
        fontSize: 14,
        color: '#6B7280',
    },
    gaugeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    gaugeBackground: {
        flex: 1,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    gaugeFill: {
        height: '100%',
        borderRadius: 4,
    },
    gaugeValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
        minWidth: 40,
    },
    sensorMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    doorWindowSection: {
        marginTop: 8,
    },
    doorWindowGrid: {
        padding: 16,
        gap: 12,
    },
    doorWindowCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 16,
        borderLeftWidth: 4,
    },
    doorWindowHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    doorWindowIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    doorWindowInfo: {
        flex: 1,
    },
    doorWindowTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    doorWindowType: {
        fontSize: 14,
        color: '#6B7280',
    },
    doorWindowStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    doorWindowStatusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    doorWindowData: {},
    openingIndicator: {
        marginBottom: 12,
    },
    openingBar: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 4,
    },
    openingFill: {
        height: '100%',
        borderRadius: 4,
    },
    openingPercentage: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    doorWindowMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginHorizontal: 20,
        marginVertical: 20,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    bottomSpace: {
        height: 40,
    },
});