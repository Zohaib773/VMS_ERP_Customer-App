// logout code to clear async
// const logout = async () => {
//   await AsyncStorage.clear();
//   router.replace("/login");
// };

// LoginScreen.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator, Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import urls from "./urls/urls";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";


//  How notifications behave when received in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});


// 📲 Register & get FCM/APNs token
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log(" Must use a physical device for push notifications");
    return null;
  }

  // Android requires a notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log(" Notification permission not granted");
    return null;
  }

  const tokenData = await Notifications.getDevicePushTokenAsync();
  console.log(" DEVICE PUSH TOKEN:", tokenData.data);

  return tokenData.data;
}


const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setusername] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);

  // Animation values
  const emailAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;

  // const handleLogin = () => {
  //   // if (email && password) {
  //     router.replace("/Dashboard/Dashboard");
  //   // }
  // };

  // const handleLogin = async () => {
  //   const url = urls.login;

  //   if (!username || !password) {
  //     alert("Please enter both email and password");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const response = await axios.post(
  //       url,
  //       { username, password },
  //       {
  //         headers: { "Content-Type": "application/json" },
  //         timeout: 10000,
  //       }
  //     );

  //     const { access, refresh, user } = response.data;

  //     console.log("Login Response:", response.data);

  //     //  Save tokens
  //     await AsyncStorage.setItem("accessToken", access);
  //     await AsyncStorage.setItem("refreshToken", refresh);

  //     //  Save ONLY user object
  //     await AsyncStorage.setItem("userData", JSON.stringify(user));

  //     //  Role-based navigation
  //     if (user.role === "customer") {
  //       router.replace("/Dashboard/Dashboard");
  //     }

  //   } catch (error) {
  //     console.error("Login error:", error);

  //     if (axios.isAxiosError(error)) {
  //       alert(error.response?.data?.message || "Invalid username or password");
  //     } else {
  //       alert("Something went wrong. Please try again.");
  //     }
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleLogin = async () => {
    const url = urls.login;
    const REGISTER_TOKEN_URL = urls.REGISTER_TOKEN_URL

    if (!username || !password) {
      alert("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        url,
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 10000,
        }
      );

      const { access, refresh, user } = response.data;

      console.log("Login Response:", response.data);

      //  Save tokens
      await AsyncStorage.setItem("accessToken", access);
      await AsyncStorage.setItem("refreshToken", refresh);
      await AsyncStorage.setItem("userData", JSON.stringify(user));

      //  STEP 1: Get device push token
      const deviceToken = await registerForPushNotificationsAsync();

      //  STEP 2: Send device token to backend
      if (deviceToken) {
        try {
          await axios.post(
            REGISTER_TOKEN_URL,
            {
              user_id: user.id,
              token: deviceToken,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`, // if your backend requires auth
              },
            }
          );

          console.log(" Firebase token registered successfully");
        } catch (tokenError) {
          console.error("❌ Error registering Firebase token:", tokenError);
        }
      }

      //  Navigate after everything succeeds
      // if (user.role === "customer") {
      //   router.replace("/Dashboard/Add_Device_Screen");
      // }
      if (user.role === "customer") {
        if (user.devices > 0) {
          router.replace("/Dashboard/All_devices");
        } else {
          router.replace("/Dashboard/Add_Device_Screen");
        }
      }

    } catch (error) {
      console.error("Login error:", error);

      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Invalid username or password");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    console.log('Navigate to sign up');
  };

  // const handleTabPress = (tab: 'signin' | 'signup') => {
  //   setActiveTab(tab);
  // };
  const handleTabPress = (tab: 'signin' | 'signup') => {
    if (tab === 'signup') {
      router.push('/registration');
      return;
    }
    setActiveTab('signin');
  };



  const handleEmailFocus = () => {
    setIsFocusedEmail(true);
    Animated.timing(emailAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleEmailBlur = () => {
    setIsFocusedEmail(false);
    if (!username) {
      Animated.timing(emailAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handlePasswordFocus = () => {
    setIsFocusedPassword(true);
    Animated.timing(passwordAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handlePasswordBlur = () => {
    setIsFocusedPassword(false);
    if (!password) {
      Animated.timing(passwordAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  // Animated styles for email placeholder
  const emailLabelStyle = {
    position: 'absolute' as 'absolute',
    left: 16,
    top: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -12]
    }),
    fontSize: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12]
    }),
    color: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#E0E0E0', '#FFFFFF']
    }),
    backgroundColor: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#007CBA']
      // outputRange: ['transparent', ]
    }),
    paddingHorizontal: emailAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4]
    }),
    zIndex: 1,
  };

  // Animated styles for password placeholder
  const passwordLabelStyle = {
    position: 'absolute' as 'absolute',
    left: 16,
    top: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -12]
    }),
    fontSize: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12]
    }),
    color: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['#E0E0E0', '#FFFFFF']
    }),
    backgroundColor: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#007CBA']
    }),
    paddingHorizontal: passwordAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4]
    }),
    zIndex: 1,
  };

  // Initialize animations if there's existing text
  React.useEffect(() => {
    if (username) {
      emailAnim.setValue(1);
    }
    if (password) {
      passwordAnim.setValue(1);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <View style={styles.logoPlaceholder}>
              <Image
                source={require('../assets/images/logooo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  activeTab === 'signin' && styles.toggleButtonActive
                ]}
                onPress={() => handleTabPress('signin')}
              >
                <Text style={[
                  styles.toggleText,
                  activeTab === 'signin' && styles.toggleTextActive
                ]}>
                  Sign In
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  activeTab === 'signup' && styles.toggleButtonActive
                ]}
                onPress={() => handleTabPress('signup')}
              >
                <Text style={[
                  styles.toggleText,
                  activeTab === 'signup' && styles.toggleTextActive
                ]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <Text style={styles.welcomeText}>Welcome Back</Text>

            <View style={styles.formContainer}>
              {/* Email Input with Animated Label */}
              <View style={styles.inputContainer}>
                <Animated.Text style={emailLabelStyle}>
                  Username
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocusedEmail && styles.inputFocused
                  ]}
                  placeholder=""
                  placeholderTextColor="transparent"
                  value={username}
                  onChangeText={setusername}
                  onFocus={handleEmailFocus}
                  onBlur={handleEmailBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input with Animated Label */}
              <View style={styles.inputContainer}>
                <Animated.Text style={passwordLabelStyle}>
                  Password
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocusedPassword && styles.inputFocused
                  ]}
                  placeholder=""
                  placeholderTextColor="transparent"
                  value={password}
                  onChangeText={setPassword}
                  onFocus={handlePasswordFocus}
                  onBlur={handlePasswordBlur}
                  secureTextEntry
                />
              </View>

              {/* <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Sign In</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[
                  styles.loginButton,
                  loading && { opacity: 0.7 }
                ]}
                onPress={handleLogin}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#007CBA" />
                ) : (
                  <Text style={styles.loginButtonText}>Sign In</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <TouchableOpacity onPress={handleSignUp}>
                  <Text style={styles.signUpLink}> Sign up now</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 40 : 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 150,
    height: 120,
  },
  card: {
    backgroundColor: '#007CBA',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginTop: 80,
    elevation: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E8FCC',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  toggleText: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  toggleTextActive: {
    color: '#007CBA',
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E8E8E8',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  input: {
    backgroundColor: '#1E8FCC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    height: 52,
  },
  inputFocused: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  loginButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonText: {
    color: '#007CBA',
    fontSize: 16,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  signUpLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default LoginScreen;