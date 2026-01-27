// ////////////////////////////NEW DESIGN IMPLEMENTATION///////////////////////////////////////////////

// // LoginScreen.tsx
// import { router } from "expo-router";
// import React, { useState } from 'react';
// import {
//   Image,
//   KeyboardAvoidingView,
//   Platform,
//   SafeAreaView,
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// const LoginScreen: React.FC = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [rememberMe, setRememberMe] = useState(false);
//   const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

//   const handleLogin = () => {
//     // Handle login logic here
//     console.log('Login attempted with:', { email, password, rememberMe });
//     // Dummy login check (replace with API later)
//     if (email && password) {
//     router.replace("/Dashboard/Dashboard");
//     // router.replace("/Superadmin_dash/Dashboard"); 
//     }
//   };

//   const handleSignUp = () => {
//     // Navigate to sign up screen
//     console.log('Navigate to sign up');
//   };

//   const handleTabPress = (tab: 'signin' | 'signup') => {
//     setActiveTab(tab);
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardAvoidingView}
//       >
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Logo Section - Replace with your actual logo */}
//           {/* <View style={styles.logoContainer}>
//             <View style={styles.logoPlaceholder}> 
//                <Image
//                 source={require('../assets/images/mexemai.svg')} 
//                 style={styles.logoImage}
//                 resizeMode="contain"
//               />
//               {/* <MexemaiLogo width={120} height={120} /> */}
//           {/* </View>
//           </View>  */}
//           <View style={styles.logoContainer}>
//             <View style={styles.logoPlaceholder}>
//               <Image
//                 source={require('../assets/images/logooo.png')}
//                 style={styles.logoImage}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           {/* Card Container */}
//           <View style={styles.card}>
//             {/* Sign In/Up Toggle inside card */}
//             <View style={styles.toggleContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.toggleButton,
//                   activeTab === 'signin' && styles.toggleButtonActive
//                 ]}
//                 onPress={() => handleTabPress('signin')}
//               >
//                 <Text style={[
//                   styles.toggleText,
//                   activeTab === 'signin' && styles.toggleTextActive
//                 ]}>
//                   Sign In
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.toggleButton,
//                   activeTab === 'signup' && styles.toggleButtonActive
//                 ]}
//                 onPress={() => handleTabPress('signup')}
//               >
//                 <Text style={[
//                   styles.toggleText,
//                   activeTab === 'signup' && styles.toggleTextActive
//                 ]}>
//                   Sign Up
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             <View style={styles.divider} />

//             {/* Welcome Text */}
//             <Text style={styles.welcomeText}>Welcome Back</Text>

//             {/* Form Section */}
//             <View style={styles.formContainer}>
//               {/* Email Input */}
//               <View style={styles.inputContainer}>
//                 {/* <Text style={styles.inputLabel}>Email Address</Text> */}
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your email"
//                   placeholderTextColor="#E0E0E0"
//                   value={email}
//                   onChangeText={setEmail}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>

//               {/* Password Input */}
//               <View style={styles.inputContainer}>
//                 {/* <Text style={styles.inputLabel}>Password</Text> */}
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Enter your password"
//                   placeholderTextColor="#E0E0E0"
//                   value={password}
//                   onChangeText={setPassword}
//                   secureTextEntry
//                 />
//               </View>

//               {/* Remember Me & Forgot Password */}
//               {/* <View style={styles.rememberContainer}>
//                 <View style={styles.checkboxContainer}>
//                   <Checkbox.Android
//                     status={rememberMe ? 'checked' : 'unchecked'}
//                     onPress={() => setRememberMe(!rememberMe)}
//                     color="#007CBA"
//                   />
//                   <Text style={styles.rememberText}>Remember me</Text>
//                 </View>
//                 <TouchableOpacity>
//                   <Text style={styles.forgotPassword}>Forget password?</Text>
//                 </TouchableOpacity>
//               </View> */}

//               {/* Login Button */}
//               <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//                 <Text style={styles.loginButtonText}>Sign In</Text>
//               </TouchableOpacity>

//               {/* Sign Up Link */}
//               <View style={styles.signUpContainer}>
//                 <Text style={styles.signUpText}>Don't have an account?</Text>
//                 <TouchableOpacity onPress={handleSignUp}>
//                   <Text style={styles.signUpLink}> Sign up now</Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F0F0F0',
//   },
//   keyboardAvoidingView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 20,
//     paddingTop: Platform.OS === 'ios' ? 40 : 60,
//     paddingBottom: 40,
//   },
//   logoContainer: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   // logoPlaceholder: {
//   //   width: 120,
//   //   height: 120,
//   //   // backgroundColor: '#FFFFFF',
//   //   borderRadius: 60,
//   //   justifyContent: 'center',
//   //   alignItems: 'center',
//   //   elevation: 4,
//   //   shadowColor: '#000',
//   //   shadowOffset: { width: 0, height: 2 },
//   //   shadowOpacity: 0.1,
//   //   // shadowRadius: 8,
//   // },
//   logoPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   logoImage: {
//     width: 150,
//     height: 120,
//     // borderRadius: 50,
//   },
//   logoFallback: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#007CBA',
//     letterSpacing: 1,
//   },
//   // card: {
//   //   backgroundColor: '#007CBA',
//   //   borderRadius: 20,
//   //   paddingHorizontal: 24,
//   //   paddingVertical: 32,
//   //   elevation: 8,
//   //   shadowColor: '#000',
//   //   shadowOffset: { width: 0, height: 4 },
//   //   shadowOpacity: 0.1,
//   //   shadowRadius: 16,
//   // },
//   card: {
//     backgroundColor: '#007CBA',
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     paddingHorizontal: 24,
//     paddingVertical: 32,
//     marginTop: -10, // 👈 gives that connected feel
//     elevation: 8,
//   },

//   // toggleContainer: {
//   //   flexDirection: 'row',
//   //   justifyContent: 'center',
//   //   marginBottom: 20,
//   //   backgroundColor: '#F8F9FA',
//   //   borderRadius: 12,
//   //   padding: 4,
//   // },
//   toggleContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#1E8FCC',
//     borderRadius: 14,
//     padding: 4,
//     marginBottom: 24,
//   },

//   toggleButton: {
//     flex: 1,
//     paddingVertical: 12,
//     alignItems: 'center',
//     borderRadius: 8,
//   },
//   // toggleButtonActive: {
//   //   backgroundColor: '#FFFFFF',
//   //   elevation: 2,
//   //   shadowColor: '#000',
//   //   shadowOffset: { width: 0, height: 1 },
//   //   shadowOpacity: 0.1,
//   //   shadowRadius: 2,
//   // },
//   toggleButtonActive: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//   },

//   // toggleText: {
//   //   fontSize: 16,
//   //   fontWeight: '500',
//   //   color: '#666',
//   // },
//   toggleText: {
//     fontSize: 16,
//     color: '#E0E0E0',
//   },

//   toggleTextActive: {
//     color: '#007CBA',
//     fontWeight: '600',
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#E8E8E8',
//     marginBottom: 24,
//   },
//   welcomeText: {
//     fontSize: 22,
//     fontWeight: '600',
//     color: '#ffffffff',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   formContainer: {
//     width: '100%',
//   },
//   inputContainer: {
//     marginBottom: 20,
//   },
//   // inputLabel: {
//   //   fontSize: 14,
//   //   fontWeight: '500',
//   //   color: '#1A1A1A',
//   //   marginBottom: 8,
//   // },
//   // input: {
//   //   backgroundColor: '#F8F9FA',
//   //   borderRadius: 12,
//   //   paddingHorizontal: 16,
//   //   paddingVertical: 14,
//   //   fontSize: 16,
//   //   color: '#1A1A1A',
//   //   borderWidth: 1,
//   //   borderColor: '#E8E8E8',
//   // },
//   inputLabel: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     marginBottom: 6,
//   },
//   input: {
//     backgroundColor: '#1E8FCC', // blue input like screenshot
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: '#000000',           // black typed text
//     borderWidth: 1,
//     borderColor: '#FFFFFF',     // white border
//   },


//   rememberContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 28,
//     marginTop: 8,
//   },
//   checkboxContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   rememberText: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     marginLeft: 8,
//   },
//   forgotPassword: {
//     fontSize: 14,
//     color: '#007CBA',
//     fontWeight: '500',
//   },
//   // loginButton: {
//   //   backgroundColor: '#007CBA',
//   //   borderRadius: 12,
//   //   paddingVertical: 16,
//   //   alignItems: 'center',
//   //   marginBottom: 24,
//   //   elevation: 4,
//   //   shadowColor: '#007CBA',
//   //   shadowOffset: { width: 0, height: 4 },
//   //   shadowOpacity: 0.2,
//   //   shadowRadius: 8,
//   // },
//   loginButton: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 24,
//   },

//   // loginButtonText: {
//   //   color: '#FFFFFF',
//   //   fontSize: 16,
//   //   fontWeight: '600',
//   // },
//   loginButtonText: {
//     color: '#007CBA',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   signUpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   // signUpText: {
//   //   fontSize: 14,
//   //   color: '#666',
//   // },
//   signUpText: {
//     fontSize: 14,
//     color: '#E0E0E0',
//   },

//   // signUpLink: {
//   //   fontSize: 14,
//   //   color: '#007CBA',
//   //   fontWeight: '600',
//   // },
//   signUpLink: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },

// });

// export default LoginScreen;



// LoginScreen.tsx
import { router } from "expo-router";
import React, { useRef, useState } from 'react';
import {
  Animated,
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
  View,
} from 'react-native';

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

  const handleLogin = () => {
    // if (email && password) {
      router.replace("/Dashboard/Dashboard");
    // }
  };

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

              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Sign In</Text>
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