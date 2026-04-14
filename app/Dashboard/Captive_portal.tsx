import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { MapPressEvent, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import urls from "../urls/urls";


const EMPTY_PORTAL_DATA = {
    status: "disarm",
    wifi: { ssid: "", password: "" },
    location: { latitude: 0, longitude: 0 },
    phone_number: { max: 5, numbers: [] as string[] },
    sensors: {
        LPG: { id: "", name: "" },
        Smoke: { id: "", name: "" },
        Motion_detection: { id: "", name: "" },
        Human_appearance: { id: "", name: "" },
        Door_window: [{ id: "", name: "" }],
    },
    cams: {
        cam1: { id: "", name: "", ip_adress: "", configurations: "" },
        cam2: { id: "", name: "", ip_adress: "", configurations: "" },
        cam3: { id: "", name: "", ip_adress: "", configurations: "" },
        cam4: { id: "", name: "", ip_adress: "", configurations: "" },
    },
    bugler: { id: "" },
    key_off: { id: "" },
    key_on: { id: "" },
};

interface Props {
    visible: boolean;
    data: any;
    accessToken: string | null;
    qrToken: string | null;
    onClose: () => void;
    onSubmit: (formData: any) => void;
}

const SENSOR_CONFIGS = {
    Smoke: { icon: "smoke-detector", color: "#EF5350", label: "Smoke Sensor" },
    LPG: { icon: "gas-cylinder", color: "#FF9800", label: "Gas Sensor" },
    Motion_detection: { icon: "motion-sensor", color: "#4CAF50", label: "Motion Sensor" },
    Human_appearance: { icon: "account", color: "#9C27B0", label: "Human Detection" },
};

export default function CaptivePortalScreen({
    visible,
    data,
    onClose,
    onSubmit,
    accessToken,
    qrToken,
}: Props) {
    const [formData, setFormData] = useState<any>(EMPTY_PORTAL_DATA);
    const [activeSection, setActiveSection] = useState<string>("wifi");
    const isManualMode = !data;
    const [manualDeviceType, setManualDeviceType] = useState<string | null>(null);
    const [mapVisible, setMapVisible] = useState(false);
    const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number }>({
        latitude: 0,
        longitude: 0,
    });
    const [scannerVisible, setScannerVisible] = useState(false);
    const [scanningFor, setScanningFor] = useState<{ type: string; index?: number } | null>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [loadingText, setLoadingText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!permission) {
            requestPermission();
        }
    }, [permission]);

    const [locationLoading, setLocationLoading] = useState(false); // Add loading state
    /** DEVICE IP (from QR / backend) */
    const deviceIp =
        data?.ip ||
        data?.device_ip ||
        data?.payload?.ip ||
        null;

    const deviceName =
        data?.device_name ||
        data?.payload?.device_name ||
        manualDeviceType ||
        "";

    const normalizedDeviceName = deviceName.toUpperCase();

    const CAMERA_DISABLED_DEVICES = ["MC1", "MC2"];
    const shouldShowCameras = !CAMERA_DISABLED_DEVICES.includes(normalizedDeviceName);

    // Helper function to check if a section is filled
    const isSectionFilled = (sectionKey: string) => {
        switch (sectionKey) {
            case "wifi":
                return !!(formData.wifi.ssid && formData.wifi.password);

            case "location":
                return !!(formData.location.latitude !== 0 && formData.location.longitude !== 0);

            case "phone":
                return formData.phone_number.numbers.length > 0 &&
                    formData.phone_number.numbers.some((contact: any) => contact.number);

            case "sensors":
                // Check if any sensor has ID or any door/window sensor has ID
                const hasMainSensor = Object.keys(SENSOR_CONFIGS).some(key =>
                    formData.sensors[key]?.id
                );
                const hasDoorSensor = formData.sensors.Door_window.some((sensor: any) => sensor.id);
                return hasMainSensor || hasDoorSensor;

            case "cameras":
                if (!shouldShowCameras) return false;
                return Object.values(formData.cams).some((cam: any) => cam.id || cam.ip_adress);

            case "system":
                return !!(formData.bugler.id || formData.key_on.id || formData.key_off.id);

            default:
                return false;
        }
    };

    // Helper function to get tab style based on fill status
    const getTabStyle = (sectionKey: string) => {
        const isFilled = isSectionFilled(sectionKey);
        if (isFilled) {
            return [styles.tab, styles.filledTab];
        }
        return [styles.tab];
    };

    const getTabTextStyle = (sectionKey: string, isActive: boolean) => {
        if (isActive) return [styles.tabText, styles.activeTabText];

        const isFilled = isSectionFilled(sectionKey);
        if (isFilled) {
            return [styles.tabText, styles.filledTabText];
        }
        return [styles.tabText];
    };


    useEffect(() => {
        if (!deviceIp) return;

        console.log("🔄 Waiting for device connectivity:", deviceIp);

        const unsubscribe = NetInfo.addEventListener(async (state) => {
            if (state.isConnected && state.type === "wifi") {
                try {
                    console.log("🔍 Checking device health...");

                    const res = await axios.get(
                        `http://${deviceIp}/health`,
                        { timeout: 2000 }
                    );

                    if (res.data?.status === "online") {
                        console.log("✅ Device reachable BEFORE WiFi submit");
                    }
                } catch {
                    console.log("⏳ Device not reachable yet");
                }
            }
        });

        return () => unsubscribe();
    }, [deviceIp]);


    useEffect(() => {
        if (data) {
            console.log("📥 Captive Portal API Data:", data);
            setFormData({
                ...EMPTY_PORTAL_DATA,
                ...data,
                status: data.status || "disarm",
            });
        }
    }, [data]);

    if (!visible) return null;


    // -------------------
    // Handle QR for Cameras
    // -------------------
    const handleCameraScan = (parsedData: any) => {
        console.log("🔹 handleCameraScan called with:", parsedData);
        if (!scanningFor) {
            console.warn("⚠️ No scanningFor set for camera scan");
            return;
        }

        setFormData({
            ...formData,
            cams: {
                ...formData.cams,
                [scanningFor.type]: {
                    ...formData.cams[scanningFor.type],
                    id: parsedData.camera_id || parsedData.id || parsedData.device_id || "",
                    ip_adress: parsedData.ip || parsedData.ip_address || "",
                },
            },
        });
        console.log(`✅ Camera ${scanningFor.type} updated:`, {
            id: parsedData.camera_id || parsedData.id || parsedData.device_id || "",
            ip_adress: parsedData.ip || parsedData.ip_address || "",
        });
    };
    // -------------------
    // Main QR Handler
    // -------------------
    const handleBarCodeScanned = ({ data }: { data: string }) => {
        console.log("📸 QR Scanned:", data);
        setScannerVisible(false);
        if (!scanningFor) {
            console.warn("⚠️ QR scanned but no scanningFor set");
            return;
        }

        let parsedData: any = {};
        try {
            parsedData = JSON.parse(data);
            if (typeof parsedData !== "object") {
                parsedData = { raw: String(parsedData) };
            }
            console.log("🧩 Parsed QR Data:", parsedData);
        } catch {
            parsedData = { raw: data };
            console.warn("⚠️ QR data is not JSON, using raw:", parsedData);
        }

        // Decide which handler to call
        if (formData.cams[scanningFor.type]) {
            console.log("➡️ Detected camera scan for:", scanningFor.type);
            handleCameraScan(parsedData);
        } else {
            console.log("➡️ Detected sensor scan for:", scanningFor.type);
            handleSensorScan(parsedData);
        }

        setScanningFor(null);
    };

    // -------------------
    // Handle QR for Sensors
    // -------------------
    const handleSensorScan = (parsedData: any) => {
        console.log("🔹 handleSensorScan called with:", parsedData);
        if (!scanningFor) {
            console.warn("⚠️ No scanningFor set for sensor scan");
            return;
        }

        // Door/Window
        if (scanningFor.type === "Door_window" && scanningFor.index !== undefined) {
            const updated = [...formData.sensors.Door_window];
            updated[scanningFor.index].id = parsedData.device_id ?? parsedData.id ?? parsedData.raw;
            setFormData({
                ...formData,
                sensors: { ...formData.sensors, Door_window: updated },
            });
            console.log("✅ Door_window sensors updated:", updated);
        }
        // Normal sensors
        else if (SENSOR_CONFIGS[scanningFor.type as keyof typeof SENSOR_CONFIGS]) {
            const updatedSensorId = parsedData.device_id ?? parsedData.id ?? parsedData.raw;
            console.log(`📥 Updating normal sensor type: ${scanningFor.type} with ID: ${updatedSensorId}`);
            setFormData({
                ...formData,
                sensors: {
                    ...formData.sensors,
                    [scanningFor.type]: {
                        ...formData.sensors[scanningFor.type],
                        id: updatedSensorId,
                    },
                },
            });
            console.log("✅ Normal sensor updated:", {
                ...formData.sensors[scanningFor.type],
                id: updatedSensorId,
            });
        } else {
            console.warn(`⚠️ Sensor type not recognized: ${scanningFor.type}`);
        }
    };







    const openMapPicker = async () => {
        try {
            setLocationLoading(true); // Start loading

            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Location permission is required");
                setLocationLoading(false); // Stop loading
                return;
            }

            // Get device's current location
            const current = await Location.getCurrentPositionAsync({});
            setTempLocation({
                latitude: current.coords.latitude,
                longitude: current.coords.longitude,
            });

            setMapVisible(true);
        } catch (error) {
            console.error("Failed to get current location:", error);
            alert("Unable to get current location.");
        } finally {
            setLocationLoading(false); // Always stop loading
        }
    };

    const onMapPress = (event: MapPressEvent) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;

        console.log("📍 Temp Location Selected:", latitude, longitude);

        setTempLocation({ latitude, longitude });
    };

    const renderSectionHeader = (title: string, icon: string, sectionKey: string) => (
        <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setActiveSection(activeSection === sectionKey ? "" : sectionKey)}
        >
            <MaterialIcons name={icon as any} size={24} color="#2196F3" />
            <Text style={styles.sectionTitle}>{title}</Text>
            <MaterialIcons
                name={activeSection === sectionKey ? "expand-less" : "expand-more"}
                size={24}
                color="#666"
            />
        </TouchableOpacity>
    );

    const renderInputField = (placeholder: string, value: string, onChange: (v: string) => void, options?: any) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{placeholder}</Text>
            <TextInput
                style={styles.input}
                placeholder={`Enter ${placeholder.toLowerCase()}`}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChange}
                {...options}
            />
        </View>
    );

    return (
        <Modal visible={visible} animationType="slide">
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Device Configuration</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <MaterialIcons name="close" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>




                <ScrollView style={styles.container}>
                    {/* Navigation Tabs */}
                    {isManualMode && (
                        <View style={styles.sectionCard}>
                            <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 10 }}>
                                Select Device Type
                            </Text>

                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                {["MC1", "MC2", "MS1", "MS2"].map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        onPress={() => setManualDeviceType(type)}
                                        style={{
                                            paddingVertical: 10,
                                            paddingHorizontal: 16,
                                            borderRadius: 12,
                                            backgroundColor:
                                                manualDeviceType === type ? "#2196F3" : "#eee",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color:
                                                    manualDeviceType === type ? "#fff" : "#333",
                                                fontWeight: "600",
                                            }}
                                        >
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                        {[
                            { key: "wifi", label: "WiFi", icon: "wifi" },
                            { key: "location", label: "Location", icon: "location-on" },
                            { key: "phone", label: "Contacts", icon: "phone" },
                            { key: "sensors", label: "Sensors", icon: "sensors" },
                            ...(shouldShowCameras
                                ? [{ key: "cameras", label: "Cameras", icon: "videocam" }]
                                : []),
                            { key: "system", label: "System", icon: "settings" },
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[
                                    styles.tab,
                                    activeSection.startsWith(tab.key) && styles.activeTab,
                                    !activeSection.startsWith(tab.key) && isSectionFilled(tab.key) && styles.filledTab
                                ]}
                                onPress={() => setActiveSection(tab.key)}
                            >
                                <MaterialIcons
                                    name={tab.icon as any}
                                    size={20}
                                    color={
                                        activeSection.startsWith(tab.key)
                                            ? "#2196F3"
                                            : isSectionFilled(tab.key)
                                                ? "#4CAF50"
                                                : "#666"
                                    }
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeSection.startsWith(tab.key) && styles.activeTabText,
                                        !activeSection.startsWith(tab.key) && isSectionFilled(tab.key) && styles.filledTabText
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                                {isSectionFilled(tab.key) && !activeSection.startsWith(tab.key) && (
                                    <MaterialIcons name="check-circle" size={14} color="#4CAF50" style={{ marginLeft: 4 }} />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* WiFi Section */}
                    {(activeSection === "wifi" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("WiFi Configuration", "wifi", "wifi")}
                            {activeSection === "wifi" && (
                                <View style={styles.sectionContent}>
                                    {renderInputField("SSID", formData.wifi.ssid, (v) =>
                                        setFormData({ ...formData, wifi: { ...formData.wifi, ssid: v } })
                                    )}
                                    {renderInputField("Password", formData.wifi.password, (v) =>
                                        setFormData({ ...formData, wifi: { ...formData.wifi, password: v } })
                                    )}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Location Section */}
                    {/* {(activeSection === "location" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("Location Settings", "location-on", "location")}

                            {activeSection === "location" && (
                                <View style={styles.sectionContent}>
                                    <TouchableOpacity
                                        style={styles.mapBtn}
                                        onPress={openMapPicker}
                                        disabled={locationLoading} // Disable when loading
                                    >
                                        {locationLoading ? (
                                            <ActivityIndicator color="#fff" size="small" />
                                        ) : (
                                            <Text style={styles.mapBtnText}>📍 Select Location from Map</Text>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.row}>
                                        <View style={styles.halfInput}>
                                            {renderInputField(
                                                "Latitude",
                                                String(formData.location.latitude),
                                                () => { }, // read-only
                                                { editable: false }
                                            )}
                                        </View>
                                        <View style={styles.halfInput}>
                                            {renderInputField(
                                                "Longitude",
                                                String(formData.location.longitude),
                                                () => { },
                                                { editable: false }
                                            )}
                                        </View>
                                    </View>
                                </View>
                            )}
                        </View>
                    )} */}
                    {/* Location Section */}
                    {(activeSection === "location" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("Location Settings", "location-on", "location")}

                            {activeSection === "location" && (
                                <View style={styles.sectionContent}>
                                    <TouchableOpacity
                                        style={styles.mapBtn}
                                        onPress={openMapPicker}
                                        disabled={locationLoading} // Disable when loading
                                    >
                                        {locationLoading ? (
                                            <ActivityIndicator color="#fff" size="small" />
                                        ) : (
                                            <Text style={styles.mapBtnText}>📍 Select Location from Map</Text>
                                        )}
                                    </TouchableOpacity>

                                    <View style={styles.row}>
                                        <View style={styles.halfInput}>
                                            {renderInputField(
                                                "Latitude",
                                                String(formData.location.latitude),
                                                () => { }, // read-only
                                                { editable: false }
                                            )}
                                        </View>
                                        <View style={styles.halfInput}>
                                            {renderInputField(
                                                "Longitude",
                                                String(formData.location.longitude),
                                                () => { },
                                                { editable: false }
                                            )}
                                        </View>
                                    </View>

                                    {/* New Address Field */}
                                    {renderInputField("Address", formData.location.address || "", (v) =>
                                        setFormData({
                                            ...formData,
                                            location: {
                                                ...formData.location,
                                                address: v
                                            }
                                        })
                                    )}
                                </View>
                            )}
                        </View>
                    )}

                    {/* Phone Numbers Section */}

                    {/* Phone Numbers Section */}
                    {(activeSection === "phone" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("Emergency Contacts", "contacts", "phone")}
                            {activeSection === "phone" && (
                                <View style={styles.sectionContent}>
                                    <Text style={styles.sectionSubtitle}>
                                        Add emergency phone numbers (Max: {formData.phone_number.max})
                                    </Text>
                                    {formData.phone_number.numbers.map((contact: { number: string; call: boolean; message: boolean }, index: number) => (
                                        <View key={index} style={styles.phoneCard}>
                                            <View style={styles.phoneRow}>
                                                <MaterialIcons name="phone" size={20} color="#2196F3" />
                                                <TextInput
                                                    style={styles.phoneInput}
                                                    placeholder={`Contact ${index + 1}`}
                                                    placeholderTextColor="#999"
                                                    keyboardType="phone-pad"
                                                    value={contact.number}
                                                    onChangeText={(v) => {
                                                        const updated = [...formData.phone_number.numbers];
                                                        updated[index] = { ...updated[index], number: v };
                                                        setFormData({
                                                            ...formData,
                                                            phone_number: { ...formData.phone_number, numbers: updated },
                                                        });
                                                    }}
                                                />
                                                {index > 0 && (
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            const updated = [...formData.phone_number.numbers];
                                                            updated.splice(index, 1);
                                                            setFormData({
                                                                ...formData,
                                                                phone_number: { ...formData.phone_number, numbers: updated },
                                                            });
                                                        }}
                                                    >
                                                        <MaterialIcons name="remove-circle" size={24} color="#FF5252" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>

                                            {/* Call and Message Status */}
                                            <View style={styles.statusRow}>
                                                <TouchableOpacity
                                                    style={[styles.statusButton, contact.call && styles.statusButtonActive]}
                                                    onPress={() => {
                                                        const updated = [...formData.phone_number.numbers];
                                                        updated[index] = { ...updated[index], call: !updated[index].call };
                                                        setFormData({
                                                            ...formData,
                                                            phone_number: { ...formData.phone_number, numbers: updated },
                                                        });
                                                    }}
                                                >
                                                    <MaterialIcons
                                                        name="call"
                                                        size={20}
                                                        color={contact.call ? "#4CAF50" : "#999"}
                                                    />
                                                    <Text style={[styles.statusText, contact.call && styles.statusTextActive]}>
                                                        Call
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={[styles.statusButton, contact.message && styles.statusButtonActive]}
                                                    onPress={() => {
                                                        const updated = [...formData.phone_number.numbers];
                                                        updated[index] = { ...updated[index], message: !updated[index].message };
                                                        setFormData({
                                                            ...formData,
                                                            phone_number: { ...formData.phone_number, numbers: updated },
                                                        });
                                                    }}
                                                >
                                                    <MaterialIcons
                                                        name="message"
                                                        size={20}
                                                        color={contact.message ? "#2196F3" : "#999"}
                                                    />
                                                    <Text style={[styles.statusText, contact.message && styles.statusTextActive]}>
                                                        Message
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))}
                                    {formData.phone_number.numbers.length < formData.phone_number.max && (
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() =>
                                                setFormData({
                                                    ...formData,
                                                    phone_number: {
                                                        ...formData.phone_number,
                                                        numbers: [...formData.phone_number.numbers, { number: "", call: true, message: false }],
                                                    },
                                                })
                                            }
                                        >
                                            <MaterialIcons name="add-circle" size={20} color="#2196F3" />
                                            <Text style={styles.addButtonText}>Add Contact</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    )}


                    {/* Sensors Section - Separated by Type */}

                    {(activeSection === "sensors" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("Security Sensors", "sensors", "sensors")}
                            {activeSection === "sensors" && (
                                <View style={styles.sectionContent}>
                                    {/* Individual Sensor Cards */}
                                    {Object.entries(SENSOR_CONFIGS).map(([key, config]) => (
                                        <View key={key} style={styles.sensorCard}>
                                            <View style={styles.sensorHeader}>
                                                <MaterialCommunityIcons
                                                    name={config.icon as any}
                                                    size={24}
                                                    color={config.color}
                                                />
                                                <Text style={styles.sensorTitle}>{config.label}</Text>
                                            </View>

                                            <View style={styles.sensorInputs}>
                                                {/* Device ID with QR Scan */}
                                                <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                    <View style={{ flex: 1 }}>
                                                        {renderInputField("Device ID", formData.sensors[key]?.id || "", (v) =>
                                                            setFormData({
                                                                ...formData,
                                                                sensors: {
                                                                    ...formData.sensors,
                                                                    [key]: { ...formData.sensors[key], id: v },
                                                                },
                                                            })
                                                        )}
                                                    </View>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            setScanningFor({ type: key });
                                                            setScannerVisible(true);
                                                        }}
                                                        style={{ marginLeft: 8 }}
                                                    >
                                                        <MaterialIcons name="qr-code-scanner" size={24} color="#5C6BC0" />
                                                    </TouchableOpacity>
                                                </View>

                                                {renderInputField("Name/Location", formData.sensors[key]?.name || "", (v) =>
                                                    setFormData({
                                                        ...formData,
                                                        sensors: {
                                                            ...formData.sensors,
                                                            [key]: { ...formData.sensors[key], name: v },
                                                        },
                                                    })
                                                )}

                                                {/* Status Toggle */}
                                                <View style={styles.statusToggleRow}>
                                                    <Text style={styles.statusToggleLabel}>Status:</Text>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.toggleButton,
                                                            formData.sensors[key]?.status && styles.toggleButtonActive
                                                        ]}
                                                        onPress={() => {
                                                            setFormData({
                                                                ...formData,
                                                                sensors: {
                                                                    ...formData.sensors,
                                                                    [key]: {
                                                                        ...formData.sensors[key],
                                                                        status: !formData.sensors[key]?.status
                                                                    },
                                                                },
                                                            });
                                                        }}
                                                    >
                                                        <MaterialIcons
                                                            name={formData.sensors[key]?.status ? "toggle-on" : "toggle-off"}
                                                            size={32}
                                                            color={formData.sensors[key]?.status ? "#4CAF50" : "#999"}
                                                        />
                                                        <Text style={[
                                                            styles.statusValue,
                                                            formData.sensors[key]?.status && styles.statusValueActive
                                                        ]}>
                                                            {formData.sensors[key]?.status ? "ON" : "OFF"}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    ))}

                                    {/* Door/Window Sensors */}
                                    <View style={styles.sensorCard}>
                                        <View style={styles.sensorHeader}>
                                            <FontAwesome5 name="door-closed" size={24} color="#5C6BC0" />
                                            <Text style={styles.sensorTitle}>Door/Window Sensors</Text>
                                        </View>

                                        {formData.sensors.Door_window.map((item: any, index: number) => (
                                            <View key={index} style={styles.doorSensorRow}>
                                                <Text style={styles.doorNumber}>Sensor {index + 1}</Text>
                                                <View style={styles.row}>
                                                    <View style={[styles.halfInput, { flexDirection: "row", alignItems: "center" }]}>
                                                        <View style={{ flex: 1 }}>
                                                            {renderInputField("ID", item.id, (v) => {
                                                                const updated = [...formData.sensors.Door_window];
                                                                updated[index].id = v;
                                                                setFormData({
                                                                    ...formData,
                                                                    sensors: { ...formData.sensors, Door_window: updated },
                                                                });
                                                            })}
                                                        </View>
                                                        <TouchableOpacity
                                                            onPress={() => {
                                                                setScanningFor({ type: "Door_window", index });
                                                                setScannerVisible(true);
                                                            }}
                                                            style={{ marginLeft: 6 }}
                                                        >
                                                            <MaterialIcons name="qr-code-scanner" size={22} color="#5C6BC0" />
                                                        </TouchableOpacity>
                                                    </View>

                                                    <View style={styles.halfInput}>
                                                        {renderInputField("Location", item.name, (v) => {
                                                            const updated = [...formData.sensors.Door_window];
                                                            updated[index].name = v;
                                                            setFormData({
                                                                ...formData,
                                                                sensors: { ...formData.sensors, Door_window: updated },
                                                            });
                                                        })}
                                                    </View>
                                                </View>

                                                {/* Status Toggle for Door/Window Sensors */}
                                                <View style={styles.statusToggleRow}>
                                                    <Text style={styles.statusToggleLabel}>Status:</Text>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.toggleButton,
                                                            item.status && styles.toggleButtonActive
                                                        ]}
                                                        onPress={() => {
                                                            const updated = [...formData.sensors.Door_window];
                                                            updated[index] = { ...updated[index], status: !updated[index].status };
                                                            setFormData({
                                                                ...formData,
                                                                sensors: { ...formData.sensors, Door_window: updated },
                                                            });
                                                        }}
                                                    >
                                                        <MaterialIcons
                                                            name={item.status ? "toggle-on" : "toggle-off"}
                                                            size={32}
                                                            color={item.status ? "#4CAF50" : "#999"}
                                                        />
                                                        <Text style={[
                                                            styles.statusValue,
                                                            item.status && styles.statusValueActive
                                                        ]}>
                                                            {item.status ? "ON" : "OFF"}
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ))}

                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() =>
                                                setFormData({
                                                    ...formData,
                                                    sensors: {
                                                        ...formData.sensors,
                                                        Door_window: [...formData.sensors.Door_window, { id: "", name: "", status: true }],
                                                    },
                                                })
                                            }
                                        >
                                            <MaterialIcons name="add-circle" size={20} color="#5C6BC0" />
                                            <Text style={styles.addButtonText}>Add Door/Window Sensor</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}


                    {/* Cameras Section */}
                    {shouldShowCameras && (activeSection === "cameras" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("Camera Configuration", "videocam", "cameras")}
                            {activeSection === "cameras" && (
                                <View style={styles.sectionContent}>
                                    {Object.entries(formData.cams).map(([camKey, cam]: any) => (
                                        <View key={camKey} style={styles.cameraCard}>
                                            <View style={styles.cameraHeader}>
                                                <MaterialIcons name="videocam" size={20} color="#2196F3" />
                                                <Text style={styles.cameraTitle}>Camera {camKey.slice(3)}</Text>
                                            </View>

                                            {/* Camera ID with QR scanner */}
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <View style={{ flex: 1 }}>
                                                    {renderInputField("Camera ID", cam.id, (v) =>
                                                        setFormData({
                                                            ...formData,
                                                            cams: { ...formData.cams, [camKey]: { ...cam, id: v } },
                                                        })
                                                    )}
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setScanningFor({ type: camKey });
                                                        setScannerVisible(true);
                                                    }}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    <MaterialIcons name="qr-code-scanner" size={22} color="#2196F3" />
                                                </TouchableOpacity>
                                            </View>

                                            {/* Name field */}
                                            {renderInputField("Name", cam.name, (v) =>
                                                setFormData({
                                                    ...formData,
                                                    cams: { ...formData.cams, [camKey]: { ...cam, name: v } },
                                                })
                                            )}

                                            {/* IP Address with QR scanner */}
                                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                                <View style={{ flex: 1 }}>
                                                    {renderInputField("IP Address", cam.ip_adress, (v) =>
                                                        setFormData({
                                                            ...formData,
                                                            cams: { ...formData.cams, [camKey]: { ...cam, ip_adress: v } },
                                                        })
                                                    )}
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setScanningFor({ type: camKey });
                                                        setScannerVisible(true);
                                                    }}
                                                    style={{ marginLeft: 8 }}
                                                >
                                                    <MaterialIcons name="qr-code-scanner" size={22} color="#2196F3" />
                                                </TouchableOpacity>
                                            </View>

                                            {/* Uncomment if you want configurations input */}
                                            {/* {renderInputField("Configurations", cam.configurations, (v) =>
              setFormData({
                ...formData,
                cams: { ...formData.cams, [camKey]: { ...cam, configurations: v } },
              })
            )} */}
                                        </View>
                                    ))}
                                </View>
                            )}
                        </View>
                    )}


                    {/* System Controls Section */}
                    {(activeSection === "system" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("System Controls", "security", "system")}
                            {activeSection === "system" && (
                                <View style={styles.sectionContent}>
                                    {/* Arm/Disarm Status Toggle */}
                                    <View style={styles.armStatusCard}>
                                        <View style={styles.armStatusHeader}>
                                            <MaterialIcons
                                                name={formData.status === "arm" ? "verified-user" : "warning"}
                                                size={28}
                                                color={formData.status === "arm" ? "#4CAF50" : "#FF9800"}
                                            />
                                            <Text style={styles.armStatusTitle}>System Status</Text>
                                        </View>

                                        <View style={styles.armStatusToggle}>
                                            <TouchableOpacity
                                                style={[
                                                    styles.armButton,
                                                    formData.status === "arm" && styles.armButtonActive
                                                ]}
                                                onPress={() => setFormData({ ...formData, status: "arm" })}
                                            >
                                                <MaterialIcons
                                                    name="verified-user"
                                                    size={24}
                                                    color={formData.status === "arm" ? "#4CAF50" : "#999"}
                                                />
                                                <Text style={[
                                                    styles.armButtonText,
                                                    formData.status === "arm" && styles.armButtonTextActive
                                                ]}>
                                                    ARM
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[
                                                    styles.armButton,
                                                    formData.status === "disarm" && styles.disarmButtonActive
                                                ]}
                                                onPress={() => setFormData({ ...formData, status: "disarm" })}
                                            >
                                                <MaterialIcons
                                                    name="warning"
                                                    size={24}
                                                    color={formData.status === "disarm" ? "#FF9800" : "#999"}
                                                />
                                                <Text style={[
                                                    styles.armButtonText,
                                                    formData.status === "disarm" && styles.disarmButtonTextActive
                                                ]}>
                                                    DISARM
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={styles.controlGrid}>
                                        <View style={styles.controlCard}>
                                            <MaterialIcons name="warning" size={24} color="#FF9800" />
                                            {renderInputField("Burglar Alarm ID", formData.bugler.id, (v) =>
                                                setFormData({ ...formData, bugler: { id: v } })
                                            )}
                                        </View>
                                        <View style={styles.controlCard}>
                                            <MaterialIcons name="power-settings-new" size={24} color="#4CAF50" />
                                            {renderInputField("Key ON ID", formData.key_on.id, (v) =>
                                                setFormData({ ...formData, key_on: { id: v } })
                                            )}
                                        </View>
                                        <View style={styles.controlCard}>
                                            <MaterialIcons name="power-off" size={24} color="#F44336" />
                                            {renderInputField("Key OFF ID", formData.key_off.id, (v) =>
                                                setFormData({ ...formData, key_off: { id: v } })
                                            )}
                                        </View>
                                    </View>

                                    {/* Save Configuration Button - ONLY in System section */}


                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={async () => {
                                            try {
                                                console.log("🚀 START CONFIGURATION");

                                                setIsLoading(true); // ✅ ADD
                                                setLoadingText("Connecting to device..."); // ✅ ADD

                                                /** ================= STEP 1: SEND WIFI TO DEVICE ================= */
                                                // if (!deviceIp) {
                                                //     alert("Device IP not found in QR data");
                                                //     return;
                                                // }

                                                // console.log("📡 Sending WiFi to device:", deviceIp);

                                                // await axios.post(
                                                //     `http://${deviceIp}/wifi`,
                                                //     {
                                                //         ssid: formData.wifi.ssid,
                                                //         password: formData.wifi.password,
                                                //     },
                                                //     { timeout: 5000 }
                                                // );

                                                // console.log("✅ Device WiFi configured");
                                                console.log("🟢 CURRENT STATUS:", formData.status);

                                                /** ================= STEP 2: TRANSFORM DATA FOR BACKEND ================= */
                                                const backendPayload = {
                                                    json_id: "CFG_001",
                                                    device_id: "ESP32_01",

                                                    status: formData.status || "arm",

                                                    wifi: {
                                                        ssid: formData.wifi?.ssid || "",
                                                        password: formData.wifi?.password || "",
                                                    },

                                                    location: {
                                                        longitude: String(formData.location.longitude),
                                                        latitude: String(formData.location.latitude),
                                                        address: formData.location.address,
                                                    },

                                                    phones: formData.phone_number.numbers,

                                                    metadata: {
                                                        devices: [
                                                            ...(formData.sensors.Door_window || []).map((d: any, index: number) => ({
                                                                id: d.id || index + 1,
                                                                name: d.name || `Door Sensor ${index + 1}`,
                                                                status: true,
                                                            })),

                                                            formData.sensors.Motion_detection?.id && {
                                                                id: formData.sensors.Motion_detection.id,
                                                                name: formData.sensors.Motion_detection.name || "Motion Detector",
                                                                status: true,
                                                            },
                                                        ].filter(Boolean),

                                                        burglar: {
                                                            rf_id: formData.bugler.id || "",
                                                            status: true,
                                                        },

                                                        lpg: {
                                                            rf_id: formData.sensors.LPG?.id || "",
                                                            status: formData.sensors.LPG?.status || false,
                                                        },

                                                        smoke: {
                                                            id: formData.sensors.Smoke?.id || "",
                                                            status: formData.sensors.Smoke?.status || false,
                                                        },

                                                        motion_detection: {
                                                            id: formData.sensors.Motion_detection?.id || "",
                                                            status: true,
                                                        },

                                                        human_appearance: {
                                                            id: formData.sensors.Human_appearance?.id || "",
                                                            status: true,
                                                        },

                                                        keys: [
                                                            {
                                                                id: formData.key_on?.id || 1,
                                                                name: "Key On",
                                                            },
                                                            {
                                                                id: formData.key_off?.id || 2,
                                                                name: "Key Off",
                                                            },
                                                        ],

                                                        cams: {
                                                            cam1: {
                                                                id: formData.cams.cam1.id,
                                                                name: formData.cams.cam1.name,
                                                                ip_address: formData.cams.cam1.ip_adress,
                                                                configurations: formData.cams.cam1.configurations,
                                                            },
                                                            cam2: {
                                                                id: formData.cams.cam2.id,
                                                                name: formData.cams.cam2.name,
                                                                ip_address: formData.cams.cam2.ip_adress,
                                                                configurations: formData.cams.cam2.configurations,
                                                            },
                                                            cam3: {
                                                                id: formData.cams.cam3.id,
                                                                name: formData.cams.cam3.name,
                                                                ip_address: formData.cams.cam3.ip_adress,
                                                                configurations: formData.cams.cam3.configurations,
                                                            },
                                                            cam4: {
                                                                id: formData.cams.cam4.id,
                                                                name: formData.cams.cam4.name,
                                                                ip_address: formData.cams.cam4.ip_adress,
                                                                configurations: formData.cams.cam4.configurations,
                                                            },
                                                        },
                                                    },
                                                };

                                                const requestBody = backendPayload;

                                                /** ================= DEBUG LOGS ================= */
                                                console.log("📦 ORIGINAL FORM DATA:", JSON.stringify(formData, null, 2));
                                                console.log("🔥 FINAL BACKEND PAYLOAD:", JSON.stringify(backendPayload, null, 2));
                                                console.log("📤 FULL REQUEST BODY:", JSON.stringify(requestBody, null, 2));
                                                console.log("🌐 API URL:", urls.save_captive_portal);

                                                /** ================= STEP 3: SEND TO DEVICE (LOCAL FIRST) ================= */
                                                console.log("📡 Sending to local device...");

                                                await axios.post(
                                                    "http://192.168.4.1/config",
                                                    requestBody,
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${accessToken}`,
                                                            "Content-Type": "application/json",
                                                        },
                                                        timeout: 5000,
                                                    }
                                                );

                                                console.log("✅ Device configured (WiFi may switch)");

                                                /** ================= STEP 4: WAIT FOR INTERNET ================= */
                                                setLoadingText("Waiting for internet connection..."); // ✅ ADD

                                                const waitForInternet = async (retries = 15) => {
                                                    for (let i = 0; i < retries; i++) {
                                                        try {
                                                            await axios.get("https://clients3.google.com/generate_204", {
                                                                timeout: 3000,
                                                            });
                                                            console.log("🌐 Internet connected");
                                                            return true;
                                                        } catch {
                                                            console.log(`🔄 Retry ${i + 1}: still offline`);
                                                            await new Promise(res => setTimeout(res, 2000));
                                                        }
                                                    }
                                                    throw new Error("Internet not available");
                                                };

                                                await waitForInternet();

                                                /** ================= STEP 5: SEND TO CLOUD ================= */
                                                setLoadingText("Uploading to cloud..."); // ✅ ADD

                                                const response = await axios.post(
                                                    urls.save_captive_portal, // ✅ YOUR BACKEND
                                                    requestBody,
                                                    {
                                                        headers: {
                                                            Authorization: `Bearer ${accessToken}`,
                                                            "Content-Type": "application/json",
                                                        },
                                                    }
                                                );

                                                console.log("✅ Backend saved configuration");
                                                onSubmit(response.data);

                                            } catch (error: any) {
                                                console.log("❌ CONFIG ERROR FULL:", error?.response?.data || error);
                                                console.log("❌ CONFIG ERROR MESSAGE:", error?.message);

                                                alert("Failed to configure device");
                                            } finally {
                                                setIsLoading(false); // ✅ ADD
                                                setLoadingText("");  // ✅ ADD
                                            }
                                        }}
                                    >
                                        <MaterialIcons name="save" size={20} color="#fff" />
                                        <Text style={{ color: "#fff", marginLeft: 8 }}>Save Configuration</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
                {scannerVisible && permission?.granted && (
                    <View style={StyleSheet.absoluteFillObject}>
                        <CameraView
                            style={StyleSheet.absoluteFillObject}
                            barcodeScannerSettings={{
                                barcodeTypes: ["qr"],
                            }}
                            onBarcodeScanned={handleBarCodeScanned}
                        />
                        <TouchableOpacity
                            style={{
                                position: "absolute",
                                bottom: 40,
                                alignSelf: "center",
                                backgroundColor: "white",
                                padding: 12,
                                borderRadius: 8,
                            }}
                            onPress={() => setScannerVisible(false)}
                        >
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                )}

            </SafeAreaView>
            {isLoading && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingBox}>
                        <ActivityIndicator size="large" color="#4CAF50" />
                        <Text style={styles.loadingText}>
                            {loadingText || "Processing..."}
                        </Text>
                    </View>
                </View>
            )}

            {/* Map Modal */}
            <Modal visible={mapVisible} animationType="slide">
                {/* <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: tempLocation.latitude,
                        longitude: tempLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    onPress={(event) => {
                        const { latitude, longitude } = event.nativeEvent.coordinate;
                        setTempLocation({ latitude, longitude });
                        console.log("📍 Temp Location:", latitude, longitude);
                    }}
                >
                    <Marker
                        coordinate={tempLocation}
                        draggable
                        onDragEnd={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setTempLocation({ latitude, longitude });
                            console.log("📍 Dragged Location:", latitude, longitude);
                        }}
                    />
                </MapView> */}
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: tempLocation.latitude || 33.6844,
                        longitude: tempLocation.longitude || 73.0479,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    onMapReady={() => console.log("✅ Map Ready")}
                    onRegionChange={(region) => console.log("📍 Region Changing:", region)}
                    onRegionChangeComplete={(region) => console.log("✅ Region Final:", region)}
                    onLayout={() => console.log("📐 Map Layout Rendered")}
                    loadingEnabled={true}
                    loadingIndicatorColor="#000"
                    loadingBackgroundColor="#fff"
                >
                    <Marker
                        coordinate={{
                            latitude: tempLocation.latitude || 33.6844,
                            longitude: tempLocation.longitude || 73.0479,
                        }}
                        draggable
                        onDragEnd={(e) => {
                            const { latitude, longitude } = e.nativeEvent.coordinate;
                            setTempLocation({ latitude, longitude });
                        }}
                    />
                </MapView>

                <View
                    style={{
                        position: "absolute",
                        bottom: 40,
                        left: 0,
                        right: 0,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        paddingHorizontal: 20,
                    }}
                >
                    {/* Cancel Button */}
                    <TouchableOpacity
                        onPress={() => setMapVisible(false)}
                        style={{
                            backgroundColor: "#ccc",
                            paddingVertical: 12,
                            paddingHorizontal: 25,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: "#000", fontWeight: "600" }}>Cancel</Text>
                    </TouchableOpacity>

                    {/* Confirm Button */}
                    <TouchableOpacity
                        onPress={() => {
                            setFormData({
                                ...formData,
                                location: { ...tempLocation },
                            });
                            console.log("Confirmed Location:", tempLocation);
                            setMapVisible(false);
                        }}
                        style={{
                            backgroundColor: "#2196F3",
                            paddingVertical: 12,
                            paddingHorizontal: 25,
                            borderRadius: 8,
                        }}
                    >
                        <Text style={{ color: "#fff", fontWeight: "600" }}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </Modal>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    // header: {
    //     backgroundColor: "#2196F3",
    //     flexDirection: "row",
    //     justifyContent: "space-between",
    //     alignItems: "center",
    //     paddingHorizontal: 20,
    //     paddingVertical: 15,
    //     paddingTop: 45
    // },

    header: {
        backgroundColor: "#2196F3",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center", // keep centered so icon doesn't shift weirdly
        paddingHorizontal: 20,
        paddingVertical: 15,

        paddingTop: Platform.OS === "android"
            ? (StatusBar.currentHeight || 0) + 10
            : 20, // safe spacing for iOS
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#fff",
    },
    closeButton: {
        padding: 5,
    },
    container: {
        flex: 1,
    },
    tabContainer: {
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 8,
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: "#f8f8f8",
    },
    activeTab: {
        backgroundColor: "#2196F3",
    },
    tabText: {
        marginLeft: 5,
        fontSize: 14,
        color: "#666",
    },
    activeTabText: {
        color: "#fff",
        fontWeight: "600",
    },
    sectionCard: {
        backgroundColor: "#fff",
        marginHorizontal: 10,
        marginTop: 10,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    sectionTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
        color: "#333",
    },
    sectionContent: {
        padding: 16,
    },
    sectionSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 15,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#555",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        backgroundColor: "#fafafa",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    halfInput: {
        width: "48%",
    },
    phoneRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#f8f8f8",
        padding: 10,
        borderRadius: 8,
    },
    phoneInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 14,
        padding: 5,
    },
    addButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderWidth: 1,
        borderColor: "#2196F3",
        borderStyle: "dashed",
        borderRadius: 8,
        marginTop: 10,
    },
    addButtonText: {
        marginLeft: 5,
        color: "#2196F3",
        fontWeight: "500",
    },
    sensorCard: {
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    sensorHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    sensorTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
        color: "#333",
    },
    sensorInputs: {
        marginTop: 5,
    },
    doorSensorRow: {
        marginBottom: 15,
    },
    doorNumber: {
        fontSize: 14,
        fontWeight: "500",
        color: "#5C6BC0",
        marginBottom: 5,
    },
    cameraCard: {
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    cameraHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    cameraTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 10,
        color: "#333",
    },
    controlGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    controlCard: {
        width: "48%",
        backgroundColor: "#f8f8f8",
        borderRadius: 8,
        padding: 12,
        alignItems: "center",
        marginBottom: 10,
    },
    saveButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#2196F3",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    saveButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginLeft: 8,
    },
    cancelButton: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
        marginTop: 10,
    },
    cancelButtonText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "500",
    },
    mapBtn: {
        backgroundColor: "#2196F3",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
        marginBottom: 15,
        flexDirection: "row",
        justifyContent: "center",
    },
    mapBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    phoneCard: {
        backgroundColor: "#f5f5f5",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    statusRow: {
        flexDirection: "row",
        marginTop: 10,
        gap: 12,
    },
    statusButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        backgroundColor: "#fff",
        gap: 6,
    },
    statusButtonActive: {
        backgroundColor: "#E3F2FD",
    },
    statusText: {
        fontSize: 14,
        color: "#999",
    },
    statusTextActive: {
        color: "#2196F3",
        fontWeight: "500",
    },
    statusToggleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    statusToggleLabel: {
        fontSize: 14,
        fontWeight: "500",
        color: "#666",
    },
    toggleButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 20,
        gap: 8,
    },
    toggleButtonActive: {
        backgroundColor: "#E8F5E9",
    },
    statusValue: {
        fontSize: 14,
        fontWeight: "600",
        color: "#999",
    },
    statusValueActive: {
        color: "#4CAF50",
    },
    armStatusCard: {
        backgroundColor: "#f5f5f5",
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    armStatusHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        gap: 12,
    },
    armStatusTitle: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    armStatusToggle: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
    },
    armButton: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "#e0e0e0",
        gap: 8,
    },
    armButtonActive: {
        backgroundColor: "#E8F5E9",
        borderColor: "#4CAF50",
    },
    disarmButtonActive: {
        backgroundColor: "#FFF3E0",
        borderColor: "#FF9800",
    },
    armButtonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "#999",
    },
    armButtonTextActive: {
        color: "#4CAF50",
    },
    disarmButtonTextActive: {
        color: "#FF9800",
    },
    // Add to your existing styles object
    filledTab: {
        backgroundColor: "#E8F5E9", // Light green background
        borderWidth: 1,
        borderColor: "#4CAF50",
    },
    filledTabText: {
        color: "#4CAF50",
        fontWeight: "600",
    },
    partialFilledTab: {
        backgroundColor: "#FFF3E0", // Light orange for partially filled
        borderWidth: 1,
        borderColor: "#FF9800",
    },
    partialFilledTabText: {
        color: "#FF9800",
        fontWeight: "500",
    },
    loadingOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

    loadingBox: {
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        alignItems: "center",
        width: "70%",
    },

    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#333",
        textAlign: "center",
    },
});