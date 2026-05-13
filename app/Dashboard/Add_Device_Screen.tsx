// import { MaterialIcons } from '@expo/vector-icons';
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useCameraPermissions } from 'expo-camera';
// import React, { useEffect, useRef, useState } from "react";
// import {
//     ActivityIndicator,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View
// } from "react-native";

// import { LinearGradient } from "expo-linear-gradient";
// import { Animated } from "react-native";

// export default function CustomerDashboardScreen({ navigation }: any) {
//   const scanLock = useRef<boolean>(false);
//   const [loggedInUser, setLoggedInUser] = useState<any>(null);
//   const [accessToken, setAccessToken] = useState<string | null>(null);
//   const [cameraVisible, setCameraVisible] = useState(false);
//   const [permission, requestPermission] = useCameraPermissions();
//   const [scanned, setScanned] = useState(false);
//   const [portalVisible, setPortalVisible] = useState(false);
//   const [portalData, setPortalData] = useState<any>(null);
//   const [qrToken, setQrToken] = useState<string | null>(null);
//   const [connectingWifi, setConnectingWifi] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   const manualButtonScale = useRef(new Animated.Value(1)).current;
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const scaleAnim = useRef(new Animated.Value(0.95)).current;

//   // ----------------------------
//   // Load auth data with splash screen effect
//   // ----------------------------
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

//         // Simulate loading time for splash screen effect
//         setTimeout(() => {
//           setIsLoading(false);
//           // Animate in the content
//           Animated.parallel([
//             Animated.timing(fadeAnim, {
//               toValue: 1,
//               duration: 800,
//               useNativeDriver: true,
//             }),
//             Animated.spring(scaleAnim, {
//               toValue: 1,
//               friction: 8,
//               tension: 40,
//               useNativeDriver: true,
//             })
//           ]).start();
//         }, 1500);

//       } catch (error) {
//         console.error("Failed to load auth data", error);
//         setIsLoading(false);
//       }
//     };

//     loadAuthData();
//   }, []);

//   // Navigate to Dashboard
//   const navigateToDashboard = () => {
//     navigation.navigate('Dashboard'); // Make sure this matches your navigation route name
//   };

//   // ----------------------------
//   // Loading/Splash Screen
//   // ----------------------------
//   if (isLoading) {
//     return (
//       <View style={styles.splashContainer}>
//         <LinearGradient
//           colors={["#2196F3", "#1976D2"]}
//           style={styles.splashGradient}
//         >
//           <Animated.View style={[styles.splashContent, { transform: [{ scale: scaleAnim }] }]}>
//             <View style={styles.logoContainer}>
//               <MaterialIcons name="devices" size={80} color="#fff" />
//               <View style={styles.logoBadge}>
//                 <MaterialIcons name="qr-code-scanner" size={24} color="#2196F3" />
//               </View>
//             </View>

//             <Text style={styles.splashTitle}>Device Manager</Text>
//             <Text style={styles.splashSubtitle}>
//               Connect and manage your devices seamlessly
//             </Text>

//             <ActivityIndicator size="large" color="#fff" style={styles.splashLoader} />

//             <Text style={styles.loadingText}>Preparing your workspace...</Text>
//           </Animated.View>
//         </LinearGradient>
//       </View>
//     );
//   }

//   // ----------------------------
//   // Main UI with Add Device Button
//   // ----------------------------
//   return (
//     <View style={styles.container}>
//       <Animated.View style={[
//         styles.mainContent,
//         {
//           opacity: fadeAnim,
//           transform: [{ scale: scaleAnim }]
//         }
//       ]}>
//         {/* App Info Section */}
//         <View style={styles.appInfoSection}>
//           <View style={styles.appIconContainer}>
//             <MaterialIcons name="devices" size={50} color="#2196F3" />
//             <View style={styles.appIconBadge}>
//               <MaterialIcons name="qr-code-scanner" size={16} color="#fff" />
//             </View>
//           </View>
//           <Text style={styles.appName}>Device Manager</Text>
//           <Text style={styles.appVersion}>Version 1.0.0</Text>
//         </View>

//         {/* Features Section */}
//         <View style={styles.featuresSection}>
//           <Text style={styles.featuresTitle}>Get Started</Text>

//           <View style={styles.featureItem}>
//             <View style={styles.featureIconContainer}>
//               <MaterialIcons name="qr-code-scanner" size={24} color="#2196F3" />
//             </View>
//             <View style={styles.featureTextContainer}>
//               <Text style={styles.featureTitle}>Scan QR Code</Text>
//               <Text style={styles.featureDescription}>
//                 Quickly connect devices by scanning their QR codes
//               </Text>
//             </View>
//           </View>

//           <View style={styles.featureItem}>
//             <View style={styles.featureIconContainer}>
//               <MaterialIcons name="wifi" size={24} color="#4CAF50" />
//             </View>
//             <View style={styles.featureTextContainer}>
//               <Text style={styles.featureTitle}>WiFi Setup</Text>
//               <Text style={styles.featureDescription}>
//                 Configure device WiFi settings easily
//               </Text>
//             </View>
//           </View>

//           <View style={styles.featureItem}>
//             <View style={styles.featureIconContainer}>
//               <MaterialIcons name="dashboard" size={24} color="#FF9800" />
//             </View>
//             <View style={styles.featureTextContainer}>
//               <Text style={styles.featureTitle}>Device Dashboard</Text>
//               <Text style={styles.featureDescription}>
//                 Monitor and control all your connected devices
//               </Text>
//             </View>
//           </View>
//         </View>

//         {/* Add Device Button */}
//         <View style={styles.buttonContainer}>
//           <Animated.View style={{ transform: [{ scale: manualButtonScale }] }}>
//             <TouchableOpacity
//               activeOpacity={0.9}
//               onPressIn={() => {
//                 Animated.spring(manualButtonScale, {
//                   toValue: 0.96,
//                   useNativeDriver: true,
//                 }).start();
//               }}
//               onPressOut={() => {
//                 Animated.spring(manualButtonScale, {
//                   toValue: 1,
//                   friction: 3,
//                   useNativeDriver: true,
//                 }).start();
//               }}
//               onPress={navigateToDashboard}
//             >
//               <LinearGradient
//                 colors={["#2196F3", "#1976D2"]}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//                 style={styles.addDeviceButton}
//               >
//                 <View style={styles.addDeviceContent}>
//                   <View style={styles.addDeviceIconWrapper}>
//                     <MaterialIcons name="add" size={30} color="#2196F3" />
//                   </View>

//                   <View style={styles.addDeviceTextWrapper}>
//                     <Text style={styles.addDeviceTitle}>
//                       Add New Device
//                     </Text>
//                     <Text style={styles.addDeviceSubtitle}>
//                       Tap to connect a new device to your account
//                     </Text>
//                   </View>

//                   <MaterialIcons name="arrow-forward-ios" size={18} color="#fff" />
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           </Animated.View>

//           <TouchableOpacity style={styles.secondaryButton} onPress={navigateToDashboard}>
//             <Text style={styles.secondaryButtonText}>Go to Dashboard</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Footer */}
//         <View style={styles.footer}>
//           <Text style={styles.footerText}>
//             {loggedInUser ? `Welcome, ${loggedInUser.first_name || 'User'}!` : 'Ready to connect your devices'}
//           </Text>
//         </View>
//       </Animated.View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   mainContent: {
//     flex: 1,
//   },
//   // Splash Screen Styles
//   splashContainer: {
//     flex: 1,
//   },
//   splashGradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   splashContent: {
//     alignItems: 'center',
//     paddingHorizontal: 30,
//   },
//   logoContainer: {
//     position: 'relative',
//     marginBottom: 30,
//   },
//   logoBadge: {
//     position: 'absolute',
//     bottom: -5,
//     right: -10,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     padding: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.3,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   splashTitle: {
//     fontSize: 32,
//     fontWeight: '700',
//     color: '#fff',
//     marginBottom: 10,
//   },
//   splashSubtitle: {
//     fontSize: 16,
//     color: 'rgba(255,255,255,0.9)',
//     textAlign: 'center',
//     marginBottom: 40,
//   },
//   splashLoader: {
//     marginBottom: 20,
//   },
//   loadingText: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.8)',
//   },
//   // App Info Section
//   appInfoSection: {
//     alignItems: 'center',
//     paddingTop: 60,
//     paddingBottom: 30,
//     backgroundColor: '#fff',
//     borderBottomLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   appIconContainer: {
//     position: 'relative',
//     marginBottom: 15,
//   },
//   appIconBadge: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: '#4CAF50',
//     borderRadius: 12,
//     padding: 4,
//     borderWidth: 2,
//     borderColor: '#fff',
//   },
//   appName: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#333',
//     marginBottom: 5,
//   },
//   appVersion: {
//     fontSize: 14,
//     color: '#666',
//   },
//   // Features Section
//   featuresSection: {
//     padding: 25,
//   },
//   featuresTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 20,
//   },
//   featureItem: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   featureIconContainer: {
//     width: 50,
//     height: 50,
//     borderRadius: 12,
//     backgroundColor: '#F5F5F5',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 15,
//   },
//   featureTextContainer: {
//     flex: 1,
//   },
//   featureTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 4,
//   },
//   featureDescription: {
//     fontSize: 14,
//     color: '#666',
//     lineHeight: 20,
//   },
//   // Button Container
//   buttonContainer: {
//     paddingHorizontal: 25,
//     paddingVertical: 20,
//   },
//   addDeviceButton: {
//     borderRadius: 20,
//     paddingVertical: 20,
//     paddingHorizontal: 20,
//     shadowColor: "#1976D2",
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.35,
//     shadowRadius: 12,
//     elevation: 8,
//     marginBottom: 15,
//   },
//   addDeviceContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   addDeviceIconWrapper: {
//     width: 52,
//     height: 52,
//     borderRadius: 16,
//     backgroundColor: "#ffffff",
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 15,
//   },
//   addDeviceTextWrapper: {
//     flex: 1,
//   },
//   addDeviceTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     color: "#ffffff",
//     marginBottom: 4,
//   },
//   addDeviceSubtitle: {
//     fontSize: 13,
//     color: "#E3F2FD",
//   },
//   secondaryButton: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     paddingVertical: 15,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#E0E0E0',
//   },
//   secondaryButtonText: {
//     fontSize: 16,
//     fontWeight: '500',
//     color: '#666',
//   },
//   // Footer
//   footer: {
//     padding: 20,
//     alignItems: 'center',
//   },
//   footerText: {
//     fontSize: 14,
//     color: '#999',
//   },
// });

import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { router } from 'expo-router';
import { Animated } from "react-native";

const { width, height } = Dimensions.get('window');

// Sample slider images/data - Replace with your actual images
const sliderData = [
    {
        id: '1',
        title: 'Smart Device Control',
        description: 'Control all your smart devices from one place',
        icon: 'devices',
        color: '#4A90E2',
        gradientColors: ['#4A90E2', '#357ABD'] as const,
    },
    {
        id: '2',
        title: 'Quick QR Scanning',
        description: 'Scan and connect devices instantly with QR codes',
        icon: 'qr-code-scanner',
        color: '#50C878',
        gradientColors: ['#50C878', '#3DA15D'],
    },
    {
        id: '3',
        title: 'Secure Connection',
        description: 'Enterprise-grade security for your devices',
        icon: 'security',
        color: '#9B59B6',
        gradientColors: ['#9B59B6', '#8E44AD'],
    },
    {
        id: '4',
        title: '24/7 Monitoring',
        description: 'Real-time device monitoring and alerts',
        icon: 'monitor-heart',
        color: '#F39C12',
        gradientColors: ['#F39C12', '#E67E22'],
    },
];

export default function CustomerDashboardScreen({ navigation }: any) {
    const [loggedInUser, setLoggedInUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeSlideIndex, setActiveSlideIndex] = useState(0);

    // Animation refs
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.95)).current;
    const slideAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;
    const flatListRef = useRef<FlatList>(null);

    // Auto slide effect
    useEffect(() => {
        const interval = setInterval(() => {
            if (activeSlideIndex < sliderData.length - 1) {
                setActiveSlideIndex(activeSlideIndex + 1);
                flatListRef.current?.scrollToIndex({
                    index: activeSlideIndex + 1,
                    animated: true,
                });
            } else {
                setActiveSlideIndex(0);
                flatListRef.current?.scrollToIndex({
                    index: 0,
                    animated: true,
                });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeSlideIndex]);

    // ----------------------------
    // Load auth data with splash screen effect
    // ----------------------------
    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const [[, userData]] = await AsyncStorage.multiGet([
                    "userData",
                ]);

                if (userData) {
                    const parsedUser = JSON.parse(userData);
                    setLoggedInUser(parsedUser);
                }

                // Simulate loading time for splash screen effect
                setTimeout(() => {
                    setIsLoading(false);
                    // Animate in the content
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 1,
                            duration: 1000,
                            useNativeDriver: true,
                        }),
                        Animated.spring(scaleAnim, {
                            toValue: 1,
                            friction: 8,
                            tension: 40,
                            useNativeDriver: true,
                        }),
                        Animated.spring(slideAnim, {
                            toValue: 1,
                            friction: 8,
                            tension: 40,
                            useNativeDriver: true,
                        })
                    ]).start();
                }, 2000);

            } catch (error) {
                console.error("Failed to load auth data", error);
                setIsLoading(false);
            }
        };

        loadAuthData();
    }, []);

    // Navigate to Dashboard
    //   const navigateToDashboard = () => {
    //     Animated.sequence([
    //       Animated.spring(buttonScale, {
    //         toValue: 0.9,
    //         useNativeDriver: true,
    //       }),
    //       Animated.spring(buttonScale, {
    //         toValue: 1,
    //         friction: 3,
    //         useNativeDriver: true,
    //       })
    //     ]).start(() => {
    //       navigation.navigate('/Dashboard/Dashboard');
    //     });
    //   };

    const navigateToDashboard = () => {
        Animated.sequence([
            Animated.spring(buttonScale, {
                toValue: 0.9,
                useNativeDriver: true,
            }),
            Animated.spring(buttonScale, {
                toValue: 1,
                friction: 3,
                useNativeDriver: true,
            })
        ]).start(() => {
            router.replace("/Dashboard/Dashboard");
        });
    };
    // Render slider item
    const renderSliderItem = ({ item, index }: { item: typeof sliderData[0], index: number }) => {
        const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
        ];

        const scale = slideAnim.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        const opacity = slideAnim.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View style={[styles.sliderItem, { transform: [{ scale }], opacity }]}>
                <LinearGradient
                    //   colors={item.gradientColors}
                    colors={item.gradientColors as [string, string]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.sliderCard}
                >
                    <View style={styles.sliderIconContainer}>
                        <MaterialIcons name={item.icon as any} size={60} color="#fff" />
                    </View>
                    <Text style={styles.sliderTitle}>{item.title}</Text>
                    <Text style={styles.sliderDescription}>{item.description}</Text>

                    {/* Decorative circles */}
                    <View style={[styles.decorCircle, styles.decorCircle1]} />
                    <View style={[styles.decorCircle, styles.decorCircle2]} />
                    <View style={[styles.decorCircle, styles.decorCircle3]} />
                </LinearGradient>
            </Animated.View>
        );
    };

    // Render pagination dots
    const renderPaginationDots = () => {
        return (
            <View style={styles.paginationContainer}>
                {sliderData.map((_, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            setActiveSlideIndex(index);
                            flatListRef.current?.scrollToIndex({
                                index,
                                animated: true,
                            });
                        }}
                        activeOpacity={0.7}
                    >
                        <Animated.View
                            style={[
                                styles.paginationDot,
                                {
                                    backgroundColor: index === activeSlideIndex ? '#2196F3' : 'rgba(33, 150, 243, 0.3)',
                                    transform: [{
                                        scale: index === activeSlideIndex ? 1.2 : 1
                                    }],
                                    width: index === activeSlideIndex ? 24 : 8,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // ----------------------------
    // Loading/Splash Screen
    // ----------------------------
    if (isLoading) {
        return (
            <View style={styles.splashContainer}>
                <LinearGradient
                    colors={["#667eea", "#764ba2"]}
                    style={styles.splashGradient}
                >
                    <Animated.View style={[styles.splashContent, { transform: [{ scale: scaleAnim }] }]}>
                        <View style={styles.splashLogoContainer}>
                            <LinearGradient
                                colors={['#fff', '#f0f0f0']}
                                style={styles.splashLogoInner}
                            >
                                <MaterialIcons name="devices" size={80} color="#667eea" />
                            </LinearGradient>
                            <View style={styles.splashLogoBadge}>
                                <MaterialIcons name="qr-code-scanner" size={24} color="#fff" />
                            </View>
                        </View>

                        <Text style={styles.splashTitle}>Device Manager</Text>
                        <Text style={styles.splashSubtitle}>
                            Connect. Control. Conquer.
                        </Text>

                        <View style={styles.splashLoaderContainer}>
                            <ActivityIndicator size="large" color="#fff" />
                            <Text style={styles.splashLoadingText}>Preparing your experience...</Text>
                        </View>
                    </Animated.View>

                    {/* Animated waves */}
                    <View style={styles.waveContainer}>
                        <View style={[styles.wave, styles.wave1]} />
                        <View style={[styles.wave, styles.wave2]} />
                        <View style={[styles.wave, styles.wave3]} />
                    </View>
                </LinearGradient>
            </View>
        );
    }

    // ----------------------------
    // Main UI with Slider
    // ----------------------------
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f5" />

            <Animated.View style={[
                styles.mainContent,
                {
                    opacity: fadeAnim,
                    transform: [{ scale: scaleAnim }]
                }
            ]}>
                {/* Header with Greeting */}
                <LinearGradient
                    colors={['#fff', '#f8f9fa']}
                    style={styles.headerGradient}
                >
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.greetingText}>
                                Welcome back,
                            </Text>
                            <Text style={styles.userName}>
                                {loggedInUser?.first_name || 'Guest'}! 👋
                            </Text>
                        </View>
                        {/* <View style={styles.headerIconContainer}>
                            <MaterialIcons name="notifications-none" size={24} color="#666" />
                        </View> */}
                    </View>
                </LinearGradient>

                {/* Main Slider Section */}
                <View style={styles.sliderSection}>
                    <View style={styles.sliderHeader}>
                        <Text style={styles.sliderSectionTitle}>Discover Features</Text>
                        {/* <TouchableOpacity>
                            <Text style={styles.seeAllText}>See All</Text>
                        </TouchableOpacity> */}
                    </View>

                    <Animated.FlatList
                        ref={flatListRef}
                        data={sliderData}
                        renderItem={renderSliderItem}
                        keyExtractor={item => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                            setActiveSlideIndex(newIndex);
                        }}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: slideAnim } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                        decelerationRate="fast"
                    />

                    {renderPaginationDots()}
                </View>

                {/* Quick Stats */}
                {/* <View style={styles.statsSection}>
                    <View style={styles.statItem}>
                        <LinearGradient
                            colors={['#4A90E2', '#357ABD']}
                            style={styles.statIconContainer}
                        >
                            <MaterialIcons name="devices" size={24} color="#fff" />
                        </LinearGradient>
                        <View>
                            <Text style={styles.statNumber}>3</Text>
                            <Text style={styles.statLabel}>Connected</Text>
                        </View>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <LinearGradient
                            colors={['#50C878', '#3DA15D']}
                            style={styles.statIconContainer}
                        >
                            <MaterialIcons name="speed" size={24} color="#fff" />
                        </LinearGradient>
                        <View>
                            <Text style={styles.statNumber}>98%</Text>
                            <Text style={styles.statLabel}>Uptime</Text>
                        </View>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                        <LinearGradient
                            colors={['#F39C12', '#E67E22']}
                            style={styles.statIconContainer}
                        >
                            <MaterialIcons name="security" size={24} color="#fff" />
                        </LinearGradient>
                        <View>
                            <Text style={styles.statNumber}>24/7</Text>
                            <Text style={styles.statLabel}>Protected</Text>
                        </View>
                    </View>
                </View> */}

                {/* Add Device Button */}
                <View style={styles.buttonContainer}>
                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPressIn={() => {
                                Animated.spring(buttonScale, {
                                    toValue: 0.96,
                                    useNativeDriver: true,
                                }).start();
                            }}
                            onPressOut={() => {
                                Animated.spring(buttonScale, {
                                    toValue: 1,
                                    friction: 3,
                                    useNativeDriver: true,
                                }).start();
                            }}
                            onPress={navigateToDashboard}
                        >
                            <LinearGradient
                                colors={["#667eea", "#764ba2"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.addDeviceButton}
                            >
                                <View style={styles.addDeviceContent}>
                                    <View style={styles.addDeviceIconWrapper}>
                                        <MaterialIcons name="add" size={30} color="#667eea" />
                                    </View>

                                    <View style={styles.addDeviceTextWrapper}>
                                        <Text style={styles.addDeviceTitle}>
                                            Add New Device
                                        </Text>
                                        <Text style={styles.addDeviceSubtitle}>
                                            Tap to connect a new device
                                        </Text>
                                    </View>

                                    <MaterialIcons name="arrow-forward-ios" size={18} color="#fff" />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={navigateToDashboard}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.secondaryButtonText}>Go to Dashboard</Text>
                        <MaterialIcons name="arrow-forward" size={18} color="#666" />
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        Ready to manage your smart devices
                    </Text>
                </View>
            </Animated.View>
        </View>
    );
}

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     mainContent: {
//         flex: 1,
//     },
//     // Splash Screen Styles
//     splashContainer: {
//         flex: 1,
//     },
//     splashGradient: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     splashContent: {
//         alignItems: 'center',
//         paddingHorizontal: 30,
//         zIndex: 2,
//     },
//     splashLogoContainer: {
//         position: 'relative',
//         marginBottom: 30,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.3,
//         shadowRadius: 20,
//         elevation: 10,
//     },
//     splashLogoInner: {
//         width: 120,
//         height: 120,
//         borderRadius: 60,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#fff',
//     },
//     splashLogoBadge: {
//         position: 'absolute',
//         bottom: 0,
//         right: 0,
//         backgroundColor: '#50C878',
//         borderRadius: 20,
//         padding: 8,
//         borderWidth: 3,
//         borderColor: '#fff',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     splashTitle: {
//         fontSize: 36,
//         fontWeight: '800',
//         color: '#fff',
//         marginBottom: 10,
//         textShadowColor: 'rgba(0, 0, 0, 0.2)',
//         textShadowOffset: { width: 2, height: 2 },
//         textShadowRadius: 4,
//     },
//     splashSubtitle: {
//         fontSize: 16,
//         color: 'rgba(255,255,255,0.9)',
//         textAlign: 'center',
//         marginBottom: 40,
//         letterSpacing: 1,
//     },
//     splashLoaderContainer: {
//         alignItems: 'center',
//     },
//     splashLoadingText: {
//         fontSize: 14,
//         color: 'rgba(255,255,255,0.8)',
//         marginTop: 15,
//     },
//     waveContainer: {
//         position: 'absolute',
//         bottom: 0,
//         left: 0,
//         right: 0,
//         height: 200,
//         overflow: 'hidden',
//     },
//     wave: {
//         position: 'absolute',
//         width: width * 2,
//         height: 200,
//         backgroundColor: 'rgba(255,255,255,0.1)',
//         borderRadius: 100,
//     },
//     wave1: {
//         bottom: -50,
//         left: -width,
//         transform: [{ rotate: '-5deg' }],
//     },
//     wave2: {
//         bottom: -70,
//         left: -width * 0.5,
//         backgroundColor: 'rgba(255,255,255,0.05)',
//         transform: [{ rotate: '-3deg' }],
//     },
//     wave3: {
//         bottom: -90,
//         left: 0,
//         backgroundColor: 'rgba(255,255,255,0.02)',
//         transform: [{ rotate: '0deg' }],
//     },
//     // Header Styles
//     headerGradient: {
//         paddingTop: 50,
//         paddingBottom: 20,
//         paddingHorizontal: 20,
//         borderBottomLeftRadius: 30,
//         borderBottomRightRadius: 30,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 10,
//         elevation: 5,
//     },
//     headerContent: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     greetingText: {
//         fontSize: 14,
//         color: '#666',
//         marginBottom: 4,
//     },
//     userName: {
//         fontSize: 24,
//         fontWeight: '700',
//         color: '#333',
//     },
//     headerIconContainer: {
//         width: 45,
//         height: 45,
//         borderRadius: 22.5,
//         backgroundColor: '#f5f5f5',
//         justifyContent: 'center',
//         alignItems: 'center',
//         borderWidth: 1,
//         borderColor: '#e0e0e0',
//     },
//     // Slider Section
//     sliderSection: {
//         marginTop: 20,
//     },
//     sliderHeader: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//         marginBottom: 15,
//     },
//     sliderSectionTitle: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#333',
//     },
//     seeAllText: {
//         fontSize: 14,
//         color: '#667eea',
//         fontWeight: '600',
//     },
//     sliderItem: {
//         width: width - 40,
//         marginHorizontal: 20,
//     },
//     sliderCard: {
//         height: 200,
//         borderRadius: 30,
//         padding: 25,
//         justifyContent: 'center',
//         alignItems: 'center',
//         overflow: 'hidden',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.2,
//         shadowRadius: 20,
//         elevation: 10,
//     },
//     sliderIconContainer: {
//         width: 100,
//         height: 100,
//         borderRadius: 50,
//         backgroundColor: 'rgba(255,255,255,0.2)',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginBottom: 15,
//     },
//     sliderTitle: {
//         fontSize: 22,
//         fontWeight: '700',
//         color: '#fff',
//         marginBottom: 8,
//     },
//     sliderDescription: {
//         fontSize: 14,
//         color: 'rgba(255,255,255,0.9)',
//         textAlign: 'center',
//         paddingHorizontal: 20,
//     },
//     decorCircle: {
//         position: 'absolute',
//         borderRadius: 100,
//         backgroundColor: 'rgba(255,255,255,0.1)',
//     },
//     decorCircle1: {
//         width: 150,
//         height: 150,
//         top: -50,
//         right: -50,
//     },
//     decorCircle2: {
//         width: 100,
//         height: 100,
//         bottom: -30,
//         left: -30,
//     },
//     decorCircle3: {
//         width: 70,
//         height: 70,
//         bottom: 20,
//         right: 20,
//     },
//     paginationContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginTop: 20,
//     },
//     paginationDot: {
//         height: 8,
//         borderRadius: 4,
//         marginHorizontal: 4,
//     },
//     // Stats Section
//     statsSection: {
//         flexDirection: 'row',
//         backgroundColor: '#fff',
//         marginHorizontal: 20,
//         marginTop: 25,
//         padding: 20,
//         borderRadius: 25,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 5 },
//         shadowOpacity: 0.1,
//         shadowRadius: 15,
//         elevation: 8,
//     },
//     statItem: {
//         flex: 1,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     statIconContainer: {
//         width: 45,
//         height: 45,
//         borderRadius: 15,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 10,
//     },
//     statDivider: {
//         width: 1,
//         height: 30,
//         backgroundColor: '#e0e0e0',
//         marginHorizontal: 10,
//     },
//     statNumber: {
//         fontSize: 18,
//         fontWeight: '700',
//         color: '#333',
//     },
//     statLabel: {
//         fontSize: 12,
//         color: '#666',
//         marginTop: 2,
//     },
//     // Button Container
//     buttonContainer: {
//         paddingHorizontal: 20,
//         paddingVertical: 20,
//     },
//     addDeviceButton: {
//         borderRadius: 25,
//         paddingVertical: 20,
//         paddingHorizontal: 20,
//         shadowColor: "#667eea",
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.3,
//         shadowRadius: 20,
//         elevation: 10,
//         marginBottom: 15,
//     },
//     addDeviceContent: {
//         flexDirection: "row",
//         alignItems: "center",
//     },
//     addDeviceIconWrapper: {
//         width: 55,
//         height: 55,
//         borderRadius: 18,
//         backgroundColor: "#ffffff",
//         justifyContent: "center",
//         alignItems: "center",
//         marginRight: 15,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 5,
//         elevation: 3,
//     },
//     addDeviceTextWrapper: {
//         flex: 1,
//     },
//     addDeviceTitle: {
//         fontSize: 18,
//         fontWeight: "700",
//         color: "#ffffff",
//         marginBottom: 4,
//     },
//     addDeviceSubtitle: {
//         fontSize: 13,
//         color: "rgba(255,255,255,0.9)",
//     },
//     secondaryButton: {
//         backgroundColor: '#fff',
//         borderRadius: 20,
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         borderWidth: 1,
//         borderColor: '#E0E0E0',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.05,
//         shadowRadius: 5,
//         elevation: 2,
//     },
//     secondaryButtonText: {
//         fontSize: 16,
//         fontWeight: '500',
//         color: '#666',
//         marginRight: 8,
//     },
//     // Footer
//     footer: {
//         padding: 20,
//         alignItems: 'center',
//     },
//     footerText: {
//         fontSize: 13,
//         color: '#999',
//     },
// });


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0e1a', // Dark background
    },
    mainContent: {
        flex: 1,
    },
    // Splash Screen Styles
    splashContainer: {
        flex: 1,
    },
    splashGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    splashContent: {
        alignItems: 'center',
        paddingHorizontal: 30,
        zIndex: 2,
    },
    splashLogoContainer: {
        position: 'relative',
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    splashLogoInner: {
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1f2e', // Dark card background
    },
    splashLogoBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#4CAF50',
        borderRadius: 20,
        padding: 8,
        borderWidth: 3,
        borderColor: '#1a1f2e', // Match logo background
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    splashTitle: {
        fontSize: 36,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    splashSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        marginBottom: 40,
        letterSpacing: 1,
    },
    splashLoaderContainer: {
        alignItems: 'center',
    },
    splashLoadingText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 15,
    },
    waveContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 200,
        overflow: 'hidden',
    },
    wave: {
        position: 'absolute',
        width: width * 2,
        height: 200,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 100,
    },
    wave1: {
        bottom: -50,
        left: -width,
        transform: [{ rotate: '-5deg' }],
    },
    wave2: {
        bottom: -70,
        left: -width * 0.5,
        backgroundColor: 'rgba(255,255,255,0.03)',
        transform: [{ rotate: '-3deg' }],
    },
    wave3: {
        bottom: -90,
        left: 0,
        backgroundColor: 'rgba(255,255,255,0.01)',
        transform: [{ rotate: '0deg' }],
    },
    // Header Styles
    headerGradient: {
        paddingTop: 50,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 14,
        color: '#9ca3af', // Light gray
        marginBottom: 4,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff', // White text
    },
    headerIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#1a1f2e', // Dark background
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2a2f3e', // Dark border
    },
    // Slider Section
    sliderSection: {
        marginTop: 20,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sliderSectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff', // White text
    },
    seeAllText: {
        fontSize: 14,
        color: '#4FC3F7', // Lighter blue
        fontWeight: '600',
    },
    sliderItem: {
        width: width - 40,
        marginHorizontal: 20,
    },
    sliderCard: {
        height: 200,
        borderRadius: 30,
        padding: 25,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    sliderIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    sliderTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    sliderDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    decorCircle1: {
        width: 150,
        height: 150,
        top: -50,
        right: -50,
    },
    decorCircle2: {
        width: 100,
        height: 100,
        bottom: -30,
        left: -30,
    },
    decorCircle3: {
        width: 70,
        height: 70,
        bottom: 20,
        right: 20,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    paginationDot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    // Stats Section
    statsSection: {
        flexDirection: 'row',
        backgroundColor: '#1a1f2e', // Dark card
        marginHorizontal: 20,
        marginTop: 25,
        padding: 20,
        borderRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
        borderWidth: 1,
        borderColor: '#2a2f3e', // Dark border
    },
    statItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statIconContainer: {
        width: 45,
        height: 45,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#2a2f3e', // Dark divider
        marginHorizontal: 10,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ffffff', // White text
    },
    statLabel: {
        fontSize: 12,
        color: '#9ca3af', // Light gray
        marginTop: 2,
    },
    // Button Container
    buttonContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    addDeviceButton: {
        borderRadius: 25,
        paddingVertical: 20,
        paddingHorizontal: 20,
        shadowColor: "#1565C0",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        marginBottom: 15,
    },
    addDeviceContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    addDeviceIconWrapper: {
        width: 55,
        height: 55,
        borderRadius: 18,
        backgroundColor: "#1a1f2e", // Dark background
        justifyContent: "center",
        alignItems: "center",
        marginRight: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    addDeviceTextWrapper: {
        flex: 1,
    },
    addDeviceTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: 4,
    },
    addDeviceSubtitle: {
        fontSize: 13,
        color: "rgba(255,255,255,0.85)",
    },
    secondaryButton: {
        backgroundColor: '#1a1f2e', // Dark background
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2a2f3e', // Dark border
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#9ca3af', // Light gray
        marginRight: 8,
    },
    // Footer
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        fontSize: 13,
        color: '#6b7280', // Medium gray
    },
});
