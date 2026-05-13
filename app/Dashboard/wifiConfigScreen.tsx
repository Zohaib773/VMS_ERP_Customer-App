import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    PermissionsAndroid,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WifiManager from "react-native-wifi-reborn";

export default function wifiConfigScreen() {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ ssid: '', password: '' });
    const [showDeviceModal, setShowDeviceModal] = useState(false);
    const [deviceName, setDeviceName] = useState('');
    const [deviceId, setDeviceId] = useState('');
    const [Mac, setMac] = useState('');

    const validateForm = () => {
        const newErrors = { ssid: '', password: '' };
        let isValid = true;

        if (!ssid.trim()) {
            newErrors.ssid = 'SSID is required';
            isValid = false;
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    //   const handleSubmit = () => {
    //     if (!validateForm()) {
    //       return;
    //     }

    //     setIsLoading(true);

    //     // Simulate processing (you can add actual WiFi connection logic here)
    //     setTimeout(() => {
    //       setIsLoading(false);

    //       // Navigate to Captive Portal with the credentials
    //       router.push({
    //         pathname: '/Dashboard/Captive_portal',
    //         params: {
    //           ssid: ssid,
    //           password: password,
    //           manual: 'true'
    //         }
    //       });
    //     }, 1000);
    //   };


    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            console.log("Step 1: Android permission check");

            if (Platform.OS === "android") {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                );

                if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                    Alert.alert("Permission Denied", "Location must be ON");
                    setIsLoading(false);
                    return;
                }
            }

            console.log("Step 2: Connecting to WiFi");
            console.log(` SSID: ${ssid}`);

            await WifiManager.connectToProtectedSSID(ssid, password, false, false);

            if (Platform.OS === "android") {
                await WifiManager.forceWifiUsage(true);
            }

            // Wait for connection stabilization
            await new Promise(resolve => setTimeout(resolve, 2000));

            let currentSSID = null;
            try {
                currentSSID = await WifiManager.getCurrentWifiSSID();
            } catch (err) {
                console.log(" SSID fetch failed:", err);
            }

            console.log("Connected to:", currentSSID);

            Alert.alert(
                "Connected",
                `Connected to ${currentSSID || ssid}`
            );
            // router.push({
            //     pathname: "/Dashboard/Dashboard",
            //     params: {
            //         ssid,
            //         password,
            //         manual: "true",
            //     },
            // });
            setShowDeviceModal(true);

        } catch (error) {
            console.log("❌ WiFi Connection Failed:", error);
            Alert.alert("Connection Failed", "Could not connect to WiFi");
        } finally {
            setIsLoading(false);
        }
    };
    const handleScanQRInstead = () => {
        router.back();
    };
    const handleDeviceSubmit = () => {
        if (!deviceName.trim() || !Mac.trim()) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        setShowDeviceModal(false);

        router.push({
            pathname: "/Dashboard/Dashboard",
            params: {
                ssid,
                password,
                deviceName,
                Mac,
                manual: "true",
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <MaterialIcons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Manual Configuration</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Illustration/Icon */}
                    <View style={styles.iconContainer}>
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            style={styles.iconGradient}
                        >
                            <MaterialIcons name="wifi" size={48} color="#fff" />
                        </LinearGradient>
                    </View>

                    {/* Description */}
                    <Text style={styles.description}>
                        Enter your device's WiFi credentials to configure it manually
                    </Text>

                    {/* Form */}
                    <View style={styles.form}>
                        {/* SSID Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>WiFi Network Name (SSID)</Text>
                            <View style={[
                                styles.inputWrapper,
                                errors.ssid && styles.inputError
                            ]}>
                                <MaterialIcons
                                    name="wifi"
                                    size={20}
                                    color={errors.ssid ? '#f44336' : '#666'}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter SSID"
                                    placeholderTextColor="#999"
                                    value={ssid}
                                    onChangeText={(text) => {
                                        setSsid(text);
                                        setErrors(prev => ({ ...prev, ssid: '' }));
                                    }}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {errors.ssid ? (
                                <Text style={styles.errorText}>{errors.ssid}</Text>
                            ) : null}
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>WiFi Password</Text>
                            <View style={[
                                styles.inputWrapper,
                                errors.password && styles.inputError
                            ]}>
                                <MaterialIcons
                                    name="lock"
                                    size={20}
                                    color={errors.password ? '#f44336' : '#666'}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={[styles.input, { flex: 1 }]}
                                    placeholder="Enter password"
                                    placeholderTextColor="#999"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        setErrors(prev => ({ ...prev, password: '' }));
                                    }}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    style={styles.eyeButton}
                                >
                                    <MaterialIcons
                                        name={showPassword ? 'visibility-off' : 'visibility'}
                                        size={20}
                                        color="#666"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password ? (
                                <Text style={styles.errorText}>{errors.password}</Text>
                            ) : null}
                        </View>

                        {/* Info Box */}
                        <View style={styles.infoBox}>
                            <MaterialIcons name="info-outline" size={20} color="#2196F3" />
                            <Text style={styles.infoText}>
                                Make sure your device is powered on and in configuration mode
                            </Text>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.submitGradient}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <>
                                    <Text style={styles.submitButtonText}>Continue to Captive Portal</Text>
                                    <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Alternative Option */}
                    {/* <TouchableOpacity
            style={styles.scanInsteadButton}
            onPress={handleScanQRInstead}
          >
            <MaterialIcons name="qr-code-scanner" size={18} color="#2196F3" />
            <Text style={styles.scanInsteadText}>Scan QR Code Instead</Text>
          </TouchableOpacity> */}
                    {showDeviceModal && (
                        <View style={styles.modalOverlay}>
                            <View style={styles.modalContainer}>
                                <LinearGradient
                                    colors={['#4CAF50', '#2E7D32']}
                                    style={styles.modalHeader}
                                >
                                    <MaterialIcons name="devices" size={28} color="#fff" />
                                    <Text style={styles.modalTitle}>Add Device</Text>
                                </LinearGradient>

                                <View style={styles.modalContent}>
                                   
                                    <View style={styles.modalInputContainer}>
                                        <Text style={styles.modalLabel}>Device Name</Text>

                                        <View style={styles.modalInputWrapper}>
                                            <MaterialIcons name="drive-file-rename-outline" size={20} color="#4CAF50" />

                                            <TextInput
                                                placeholder="Enter device name"
                                                placeholderTextColor="#999"
                                                value={deviceName}
                                                onChangeText={setDeviceName}
                                                style={styles.modalInput}
                                            />
                                        </View>
                                    </View>

                                    <View style={styles.modalInputContainer}>
                                        <Text style={styles.modalLabel}>Mac Address</Text>

                                        <View style={styles.modalInputWrapper}>
                                            <MaterialIcons name="qr-code" size={20} color="#4CAF50" />

                                            <TextInput
                                                placeholder="Enter Mac Address"
                                                placeholderTextColor="#999"
                                                value={Mac}
                                                onChangeText={setMac}
                                                style={styles.modalInput}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.modalButtons}>
                                        <TouchableOpacity
                                            style={styles.cancelBtn}
                                            onPress={() => setShowDeviceModal(false)}
                                        >
                                            <Text style={styles.cancelText}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.saveBtn}
                                            onPress={handleDeviceSubmit}
                                        >
                                            <LinearGradient
                                                colors={['#4CAF50', '#2E7D32']}
                                                style={styles.saveGradient}
                                            >
                                                <Text style={styles.saveText}>Save & Continue</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                </ScrollView>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconGradient: {
        width: 100,
        height: 100,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 24,
    },
    form: {
        marginBottom: 32,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        paddingHorizontal: 16,
        height: 56,
    },
    inputError: {
        borderColor: '#f44336',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
    },
    eyeButton: {
        padding: 8,
    },
    errorText: {
        fontSize: 12,
        color: '#f44336',
        marginTop: 4,
        marginLeft: 4,
    },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 16,
        marginTop: 8,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1565C0',
        marginLeft: 12,
        lineHeight: 18,
    },
    submitButton: {
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#4CAF50',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    submitGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        gap: 8,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    scanInsteadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    scanInsteadText: {
        fontSize: 15,
        color: '#2196F3',
        fontWeight: '500',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContainer: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
    },

    modalHeader: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },

    modalContent: {
        padding: 20,
    },

    // modalInputWrapper: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     borderWidth: 1,
    //     borderColor: '#ddd',
    //     borderRadius: 12,
    //     paddingHorizontal: 12,
    //     marginBottom: 15,
    //     height: 50,
    // },

    // modalInput: {
    //     flex: 1,
    //     marginLeft: 10,
    // },

    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    cancelBtn: {
        padding: 12,
    },

    cancelText: {
        color: '#888',
        fontWeight: '600',
    },

    saveBtn: {
        flex: 1,
        marginLeft: 10,
        borderRadius: 12,
        overflow: 'hidden',
    },

    saveGradient: {
        padding: 14,
        alignItems: 'center',
        borderRadius: 12,
    },

    saveText: {
        color: '#fff',
        fontWeight: '700',
    },
    modalInputContainer: {
        marginBottom: 16,
    },

    modalLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
        marginLeft: 4,
    },

    modalInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 50,
        backgroundColor: '#f9f9f9', // 👈 important
    },

    modalInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },
});