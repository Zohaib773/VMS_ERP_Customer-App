import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";

import { Feather, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerSidebar from "../component/sidebarlayout";
import urls from "../urls/urls";

export default function MyDevicesScreen() {
    // const navigation = useNavigation();
    // const scanLock = useRef<boolean>(false);
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [devices, setDevices] = useState<any[]>([]);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

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
                }
                setAccessToken(access);
            } catch (error) {
                console.error("Failed to load auth data", error);
            }
        };

        loadAuthData();
    }, []);

    useEffect(() => {
        if (loggedInUser?.id) {
            fetchDevices(loggedInUser.id);
        }
    }, [loggedInUser]);

    const fetchDevices = async (userId: number) => {
        const url = urls.get_customer_devices;
        try {
            setLoadingDevices(true);
            const response = await axios.get(`${url}/${userId}`);
            // console.log("DEVICES RESPONSE ", response.data)
            console.log("DEVICES RESPONSE FULL:", JSON.stringify(response.data, null, 2));
            setDevices(response.data.devices || []);
        } catch (error: any) {
            console.log("❌ Device fetch error:", error?.response?.data || error.message);
        } finally {
            setLoadingDevices(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (loggedInUser?.id) {
            fetchDevices(loggedInUser.id);
        }
    };

    const getDeviceStatusColor = (device: any) => {
        if (!device.is_claimed) return "#FFA500";
        return device.armed ? "#22C55E" : "#EF4444";
    };

    const getDeviceStatusText = (device: any) => {
        if (!device.is_claimed) return "Unclaimed";
        return device.armed ? "Armed" : "Disarmed";
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return "Not claimed";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    const handleShowDetails = (device: any) => {
        router.push({
            pathname: "/Dashboard/DeviceDetailsScreen",
            params: { device: JSON.stringify(device) }
        });
    };

    const handleShowCams = (device: any) => {
        const camsObject = device?.captive_data?.cams || {};

        // Convert object → array
        const camsArray = Object.values(camsObject);

        router.push({
            pathname: "/Dashboard/cams_management",
            params: {
                deviceId: device.id,
                deviceName: device.name,
                cams: JSON.stringify(camsArray)
            }
        });
    };




    const DeviceCard = ({ device }: { device: any }) => (
        <View style={styles.deviceCard}>
            <View style={styles.deviceHeader}>
                <View style={styles.deviceIconContainer}>
                    <MaterialIcons name="devices" size={28} color="#4F46E5" />
                </View>
                <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{device.name}</Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, { backgroundColor: getDeviceStatusColor(device) }]} />
                        <Text style={styles.statusText}>{getDeviceStatusText(device)}</Text>
                    </View>
                </View>
                <View style={styles.claimedBadge}>
                    <Text style={[styles.claimedText, {
                        color: device.is_claimed ? '#10B981' : '#F59E0B',
                        backgroundColor: device.is_claimed ? '#D1FAE5' : '#FEF3C7'
                    }]}>
                        {device.is_claimed ? '✓ Claimed' : '⚠ Unclaimed'}
                    </Text>
                </View>
            </View>

            <View style={styles.deviceDetails}>
                <View style={styles.detailRow}>
                    <Feather name="cpu" size={18} color="#6B7280" />
                    <Text style={styles.detailLabel}>Device ID:</Text>
                    <Text style={styles.detailValue}>{device.id}</Text>
                </View>

                <View style={styles.detailRow}>
                    <MaterialIcons name="wifi" size={18} color="#6B7280" />
                    <Text style={styles.detailLabel}>MAC Address:</Text>
                    <Text style={styles.detailValue}>{device.mac_adress}</Text>
                </View>

                {device.ap_ssid && (
                    <View style={styles.detailRow}>
                        <Ionicons name="wifi-outline" size={18} color="#6B7280" />
                        <Text style={styles.detailLabel}>WiFi SSID:</Text>
                        <Text style={styles.detailValue}>{device.ap_ssid}</Text>
                    </View>
                )}

                <View style={styles.detailRow}>
                    <FontAwesome5 name="calendar-alt" size={16} color="#6B7280" />
                    <Text style={styles.detailLabel}>Created:</Text>
                    <Text style={styles.detailValue}>
                        {new Date(device.created_at).toLocaleDateString()}
                    </Text>
                </View>
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                    <Ionicons name="settings-outline" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Manage</Text>
                </TouchableOpacity>

                {!device.is_claimed && (
                    <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                        <MaterialIcons name="qr-code-scanner" size={18} color="#4F46E5" />
                        <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Claim</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={[styles.actionButton, styles.tertiaryButton]}
                    onPress={() => handleShowDetails(device)}
                >
                    <Feather name="info" size={18} color="#6B7280" />
                    <Text style={[styles.actionButtonText, styles.tertiaryButtonText]}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.cameraButton]}
                    // onPress={() => handleShowCams(device)}
                    onPress={() => handleShowCams(device)}
                    disabled={!device?.captive_data?.cams}

                >
                    <Ionicons name="videocam-outline" size={18} color="white" />
                    <Text style={styles.actionButtonText}>Cams</Text>
                </TouchableOpacity>

            </View>
        </View>
    );

    return (
        <CustomerSidebar activeTab="My Devices" userData={loggedInUser}>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
                <ScrollView
                    style={styles.container}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>My Devices</Text>
                            <Text style={styles.subtitle}>
                                Welcome back, {loggedInUser?.first_name}!
                            </Text>
                        </View>
                        <View style={styles.headerStats}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>{devices.length}</Text>
                                <Text style={styles.statLabel}>Total</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {devices.filter(d => d.is_claimed).length}
                                </Text>
                                <Text style={styles.statLabel}>Claimed</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>
                                    {devices.filter(d => d.armed).length}
                                </Text>
                                <Text style={styles.statLabel}>Armed</Text>
                            </View>
                        </View>
                    </View>

                    {loadingDevices && !refreshing ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4F46E5" />
                            <Text style={styles.loadingText}>Loading your devices...</Text>
                        </View>
                    ) : devices.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <MaterialIcons name="devices-other" size={80} color="#D1D5DB" />
                            <Text style={styles.emptyTitle}>No devices found</Text>
                            <Text style={styles.emptyText}>
                                You haven't added any devices yet. Start by adding your first device.
                            </Text>
                            <TouchableOpacity style={styles.addDeviceButton}>
                                <Ionicons name="add-circle-outline" size={20} color="white" />
                                <Text style={styles.addDeviceButtonText}>Add New Device</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            <View style={styles.devicesHeader}>
                                <Text style={styles.sectionTitle}>Your Devices</Text>
                                <Text style={styles.deviceCount}>
                                    {devices.length} device{devices.length !== 1 ? 's' : ''}
                                </Text>
                            </View>

                            {devices.map((device) => (
                                <DeviceCard key={device.id} device={device} />
                            ))}
                        </>
                    )}

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Need help with your devices? Contact support
                        </Text>
                    </View>
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
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 24,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    cameraButton: {
        backgroundColor: "#6366F1", // Indigo
    },

    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 16,
    },
    headerStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4F46E5',
    },
    statLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    devicesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        marginTop: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    deviceCount: {
        fontSize: 14,
        color: '#6B7280',
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    deviceCard: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginVertical: 8,
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
    deviceHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    deviceIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 12,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    deviceInfo: {
        flex: 1,
    },
    deviceName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    claimedBadge: {
        position: 'absolute',
        top: 0,
        right: 0,
    },
    claimedText: {
        fontSize: 12,
        fontWeight: '600',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    deviceDetails: {
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        paddingVertical: 16,
        marginBottom: 16,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginLeft: 10,
        marginRight: 8,
        width: 90,
    },
    detailValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
        flex: 1,
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 8,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        gap: 8,
    },
    primaryButton: {
        backgroundColor: '#4F46E5',
    },
    secondaryButton: {
        backgroundColor: '#EEF2FF',
    },
    tertiaryButton: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#4F46E5',
    },
    tertiaryButtonText: {
        color: '#6B7280',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 80,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        fontSize: 24,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 24,
    },
    addDeviceButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4F46E5',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    addDeviceButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    footer: {
        padding: 20,
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
    },
});