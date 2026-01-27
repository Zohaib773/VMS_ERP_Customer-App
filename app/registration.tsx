// // SignUpScreen.tsx
// import axios from "axios";
// import { router } from "expo-router";
// import React, { useRef, useState } from 'react';
// import urls from "./urls/urls";

// import {
//   Animated,
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

// const SignUpScreen: React.FC = () => {
//   const [firstName, setFirstName] = useState('');
//   const [lastName, setLastName] = useState('');
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [address, setAddress] = useState('');
//   const [clientCode, setClientCode] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [agreeToTerms, setAgreeToTerms] = useState(false);
//   const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');

//   // Animation values for all fields
//   const firstNameAnim = useRef(new Animated.Value(0)).current;
//   const lastNameAnim = useRef(new Animated.Value(0)).current;
//   const usernameAnim = useRef(new Animated.Value(0)).current;
//   const emailAnim = useRef(new Animated.Value(0)).current;
//   const phoneNumberAnim = useRef(new Animated.Value(0)).current;
//   const addressAnim = useRef(new Animated.Value(0)).current;
//   const clientCodeAnim = useRef(new Animated.Value(0)).current;
//   const passwordAnim = useRef(new Animated.Value(0)).current;
//   const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

//   // Focus states for all fields
//   const [isFocusedFirstName, setIsFocusedFirstName] = useState(false);
//   const [isFocusedLastName, setIsFocusedLastName] = useState(false);
//   const [isFocusedUsername, setIsFocusedUsername] = useState(false);
//   const [isFocusedEmail, setIsFocusedEmail] = useState(false);
//   const [isFocusedPhoneNumber, setIsFocusedPhoneNumber] = useState(false);
//   const [isFocusedAddress, setIsFocusedAddress] = useState(false);
//   const [isFocusedClientCode, setIsFocusedClientCode] = useState(false);
//   const [isFocusedPassword, setIsFocusedPassword] = useState(false);
//   const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false);

//   // const handleSignUp = () => {
//   //   // Basic validation
//   //   if (!firstName || !lastName || !username || !email || !phoneNumber || !address || !clientCode || !password || !confirmPassword) {
//   //     console.log('Please fill all fields');
//   //     return;
//   //   }

//   //   if (password !== confirmPassword) {
//   //     console.log('Passwords do not match');
//   //     return;
//   //   }

//   //   if (!agreeToTerms) {
//   //     console.log('Please agree to terms and conditions');
//   //     return;
//   //   }

//   //   // Here you would typically make an API call to register the user
//   //   console.log('Registration data:', { 
//   //     firstName, 
//   //     lastName, 
//   //     username, 
//   //     email, 
//   //     phoneNumber, 
//   //     address, 
//   //     clientCode, 
//   //     password 
//   //   });

//   //   // After successful registration, navigate to dashboard
//   //   router.replace("/Dashboard/Dashboard");
//   // };
//   const handleSignUp = async () => {
//     const url = urls.customer_register;
//     // Basic validation
//     if (
//       !firstName ||
//       !lastName ||
//       !username ||
//       !email ||
//       !phoneNumber ||
//       !address ||
//       !clientCode ||
//       !password ||
//       !confirmPassword
//     ) {
//       console.log("Please fill all fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       console.log("Passwords do not match");
//       return;
//     }

//     if (!agreeToTerms) {
//       console.log("Please agree to terms and conditions");
//       return;
//     }

//     try {
//       const payload = {
//         first_name: firstName,
//         last_name: lastName,
//         username,
//         email,
//         phone_number: phoneNumber,
//         address,
//         client_code: clientCode,
//         password,
//         image:null,
//       };

//       const response = await axios.post(url, payload, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       console.log("Registration success:", response.data);

//       // Navigate after success
//       router.replace("/Dashboard/Dashboard");

//     } catch (error: any) {
//       if (error.response) {
//         console.log("API Error:", error.response.data);
//       } else {
//         console.log("Network Error:", error.message);
//       }
//     }
//   };


//   const handleLogin = () => {
//     router.back(); // Or router.replace("/Login");
//   };

//   const handleTabPress = (tab: 'signin' | 'signup') => {
//     if (tab === 'signin') {
//       router.back();
//     } else {
//       setActiveTab(tab);
//     }
//   };

//   // Helper function for animated labels
//   const createLabelAnimation = (animValue: Animated.Value, isFocused: boolean) => ({
//     position: 'absolute' as 'absolute',
//     left: 16,
//     top: animValue.interpolate({
//       inputRange: [0, 1],
//       outputRange: [14, -12]
//     }),
//     fontSize: animValue.interpolate({
//       inputRange: [0, 1],
//       outputRange: [16, 12]
//     }),
//     color: animValue.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['#E0E0E0', '#FFFFFF']
//     }),
//     backgroundColor: animValue.interpolate({
//       inputRange: [0, 1],
//       outputRange: ['transparent', '#007CBA']
//     }),
//     paddingHorizontal: animValue.interpolate({
//       inputRange: [0, 1],
//       outputRange: [0, 4]
//     }),
//     zIndex: 1,
//   });

//   // Focus handlers for each field
//   const createFocusHandlers = (
//     animValue: Animated.Value,
//     setIsFocused: (value: boolean) => void,
//     value: string
//   ) => ({
//     onFocus: () => {
//       setIsFocused(true);
//       Animated.timing(animValue, {
//         toValue: 1,
//         duration: 200,
//         useNativeDriver: false,
//       }).start();
//     },
//     onBlur: () => {
//       setIsFocused(false);
//       if (!value) {
//         Animated.timing(animValue, {
//           toValue: 0,
//           duration: 200,
//           useNativeDriver: false,
//         }).start();
//       }
//     },
//   });

//   // Initialize animations if there's existing text
//   React.useEffect(() => {
//     const fields = [
//       { value: firstName, anim: firstNameAnim },
//       { value: lastName, anim: lastNameAnim },
//       { value: username, anim: usernameAnim },
//       { value: email, anim: emailAnim },
//       { value: phoneNumber, anim: phoneNumberAnim },
//       { value: address, anim: addressAnim },
//       { value: clientCode, anim: clientCodeAnim },
//       { value: password, anim: passwordAnim },
//       { value: confirmPassword, anim: confirmPasswordAnim },
//     ];

//     fields.forEach(({ value, anim }) => {
//       if (value) {
//         anim.setValue(1);
//       }
//     });
//   }, []);

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
//           <View style={styles.logoContainer}>
//             <View style={styles.logoPlaceholder}>
//               <Image
//                 source={require('../assets/images/logooo.png')}
//                 style={styles.logoImage}
//                 resizeMode="contain"
//               />
//             </View>
//           </View>

//           <View style={styles.card}>
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

//             <Text style={styles.welcomeText}>Create Account</Text>
//             <Text style={styles.subtitle}>Join us today</Text>

//             <View style={styles.formContainer}>
//               {/* Two-column layout for first and last name */}
//               <View style={styles.row}>
//                 <View style={[styles.inputContainer, styles.halfWidth, { marginRight: 8 }]}>
//                   <Animated.Text style={createLabelAnimation(firstNameAnim, isFocusedFirstName)}>
//                     First Name
//                   </Animated.Text>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       isFocusedFirstName && styles.inputFocused
//                     ]}
//                     placeholder=""
//                     placeholderTextColor="transparent"
//                     value={firstName}
//                     onChangeText={setFirstName}
//                     {...createFocusHandlers(firstNameAnim, setIsFocusedFirstName, firstName)}
//                     autoCapitalize="words"
//                   />
//                 </View>

//                 <View style={[styles.inputContainer, styles.halfWidth, { marginLeft: 8 }]}>
//                   <Animated.Text style={createLabelAnimation(lastNameAnim, isFocusedLastName)}>
//                     Last Name
//                   </Animated.Text>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       isFocusedLastName && styles.inputFocused
//                     ]}
//                     placeholder=""
//                     placeholderTextColor="transparent"
//                     value={lastName}
//                     onChangeText={setLastName}
//                     {...createFocusHandlers(lastNameAnim, setIsFocusedLastName, lastName)}
//                     autoCapitalize="words"
//                   />
//                 </View>
//               </View>

//               {/* Two-column layout for Username and Client Code */}
//               <View style={styles.row}>
//                 <View style={[styles.inputContainer, styles.halfWidth, { marginRight: 8 }]}>
//                   <Animated.Text style={createLabelAnimation(usernameAnim, isFocusedUsername)}>
//                     Username
//                   </Animated.Text>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       isFocusedUsername && styles.inputFocused
//                     ]}
//                     placeholder=""
//                     placeholderTextColor="transparent"
//                     value={username}
//                     onChangeText={setUsername}
//                     {...createFocusHandlers(usernameAnim, setIsFocusedUsername, username)}
//                     autoCapitalize="none"
//                     autoCorrect={false}
//                   />
//                 </View>

//                 <View style={[styles.inputContainer, styles.halfWidth, { marginLeft: 8 }]}>
//                   <Animated.Text style={createLabelAnimation(clientCodeAnim, isFocusedClientCode)}>
//                     Client Code
//                   </Animated.Text>
//                   <TextInput
//                     style={[
//                       styles.input,
//                       isFocusedClientCode && styles.inputFocused
//                     ]}
//                     placeholder=""
//                     placeholderTextColor="transparent"
//                     value={clientCode}
//                     onChangeText={setClientCode}
//                     {...createFocusHandlers(clientCodeAnim, setIsFocusedClientCode, clientCode)}
//                     autoCapitalize="characters"
//                   />
//                 </View>
//               </View>

//               {/* Email Input */}
//               <View style={styles.inputContainer}>
//                 <Animated.Text style={createLabelAnimation(emailAnim, isFocusedEmail)}>
//                   Email
//                 </Animated.Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     isFocusedEmail && styles.inputFocused
//                   ]}
//                   placeholder=""
//                   placeholderTextColor="transparent"
//                   value={email}
//                   onChangeText={setEmail}
//                   {...createFocusHandlers(emailAnim, setIsFocusedEmail, email)}
//                   keyboardType="email-address"
//                   autoCapitalize="none"
//                 />
//               </View>

//               {/* Phone Number Input */}
//               <View style={styles.inputContainer}>
//                 <Animated.Text style={createLabelAnimation(phoneNumberAnim, isFocusedPhoneNumber)}>
//                   Phone Number
//                 </Animated.Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     isFocusedPhoneNumber && styles.inputFocused
//                   ]}
//                   placeholder=""
//                   placeholderTextColor="transparent"
//                   value={phoneNumber}
//                   onChangeText={setPhoneNumber}
//                   {...createFocusHandlers(phoneNumberAnim, setIsFocusedPhoneNumber, phoneNumber)}
//                   keyboardType="phone-pad"
//                 />
//               </View>

//               {/* Address Input */}
//               <View style={styles.inputContainer}>
//                 <Animated.Text style={createLabelAnimation(addressAnim, isFocusedAddress)}>
//                   Address
//                 </Animated.Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     styles.addressInput,
//                     isFocusedAddress && styles.inputFocused
//                   ]}
//                   placeholder=""
//                   placeholderTextColor="transparent"
//                   value={address}
//                   onChangeText={setAddress}
//                   {...createFocusHandlers(addressAnim, setIsFocusedAddress, address)}
//                   multiline
//                   numberOfLines={3}
//                   textAlignVertical="top"
//                 />
//               </View>

//               {/* Password Input */}
//               <View style={styles.inputContainer}>
//                 <Animated.Text style={createLabelAnimation(passwordAnim, isFocusedPassword)}>
//                   Password
//                 </Animated.Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     isFocusedPassword && styles.inputFocused
//                   ]}
//                   placeholder=""
//                   placeholderTextColor="transparent"
//                   value={password}
//                   onChangeText={setPassword}
//                   {...createFocusHandlers(passwordAnim, setIsFocusedPassword, password)}
//                   secureTextEntry
//                 />
//                 <Text style={styles.hintText}>At least 8 characters</Text>
//               </View>

//               {/* Confirm Password Input */}
//               <View style={styles.inputContainer}>
//                 <Animated.Text style={createLabelAnimation(confirmPasswordAnim, isFocusedConfirmPassword)}>
//                   Confirm Password
//                 </Animated.Text>
//                 <TextInput
//                   style={[
//                     styles.input,
//                     isFocusedConfirmPassword && styles.inputFocused
//                   ]}
//                   placeholder=""
//                   placeholderTextColor="transparent"
//                   value={confirmPassword}
//                   onChangeText={setConfirmPassword}
//                   {...createFocusHandlers(confirmPasswordAnim, setIsFocusedConfirmPassword, confirmPassword)}
//                   secureTextEntry
//                 />
//               </View>

//               {/* Terms and Conditions */}
//               <View style={styles.termsContainer}>
//                 <TouchableOpacity
//                   style={styles.checkbox}
//                   onPress={() => setAgreeToTerms(!agreeToTerms)}
//                 >
//                   <View style={[
//                     styles.checkboxBox,
//                     agreeToTerms && styles.checkboxBoxChecked
//                   ]}>
//                     {agreeToTerms && (
//                       <Text style={styles.checkmark}>✓</Text>
//                     )}
//                   </View>
//                   <Text style={styles.termsText}>
//                     I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Sign Up Button */}
//               <TouchableOpacity
//                 style={[
//                   styles.signUpButton,
//                   (!agreeToTerms || !firstName || !lastName || !username || !email || !phoneNumber || !address || !clientCode || !password || !confirmPassword) && styles.signUpButtonDisabled
//                 ]}
//                 onPress={handleSignUp}
//                 disabled={!agreeToTerms || !firstName || !lastName || !username || !email || !phoneNumber || !address || !clientCode || !password || !confirmPassword}
//               >
//                 <Text style={styles.signUpButtonText}>Create Account</Text>
//               </TouchableOpacity>

//               {/* Already have account */}
//               <View style={styles.loginContainer}>
//                 <Text style={styles.loginText}>Already have an account?</Text>
//                 <TouchableOpacity onPress={handleLogin}>
//                   <Text style={styles.loginLink}> Sign in</Text>
//                 </TouchableOpacity>
//               </View>

//               {/* Social Sign Up (Commented out) */}
//               {/* <View style={styles.orContainer}>
//                 <View style={styles.orLine} />
//                 <Text style={styles.orText}>OR</Text>
//                 <View style={styles.orLine} />
//               </View>

//               <View style={styles.socialContainer}>
//                 <TouchableOpacity style={styles.socialButton}>
//                   <Image
//                     source={require('../assets/images/google-icon.png')}
//                     style={styles.socialIcon}
//                   />
//                   <Text style={styles.socialButtonText}>Continue with Google</Text>
//                 </TouchableOpacity>
//               </View> */}
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
//   logoPlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logoImage: {
//     width: 150,
//     height: 120,
//   },
//   card: {
//     backgroundColor: '#007CBA',
//     borderTopLeftRadius: 32,
//     borderTopRightRadius: 32,
//     borderBottomLeftRadius: 20,
//     borderBottomRightRadius: 20,
//     paddingHorizontal: 24,
//     paddingVertical: 32,
//     marginTop: -10,
//     elevation: 8,
//   },
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
//   toggleButtonActive: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//   },
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
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#FFFFFF',
//     textAlign: 'center',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#E0E0E0',
//     textAlign: 'center',
//     marginBottom: 32,
//   },
//   formContainer: {
//     width: '100%',
//   },
//   row: {
//     flexDirection: 'row',
//     marginBottom: 24,
//   },
//   inputContainer: {
//     marginBottom: 24,
//     position: 'relative',
//   },
//   halfWidth: {
//     flex: 1,
//   },
//   input: {
//     backgroundColor: '#1E8FCC',
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontSize: 16,
//     color: '#000000',
//     borderWidth: 1,
//     borderColor: '#FFFFFF',
//     height: 52,
//   },
//   addressInput: {
//     height: 80,
//     paddingTop: 14,
//     textAlignVertical: 'top',
//   },
//   inputFocused: {
//     borderColor: '#FFFFFF',
//     borderWidth: 2,
//   },
//   hintText: {
//     fontSize: 12,
//     color: '#E0E0E0',
//     marginTop: 4,
//     marginLeft: 16,
//   },
//   termsContainer: {
//     marginBottom: 24,
//   },
//   checkbox: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//   },
//   checkboxBox: {
//     width: 20,
//     height: 20,
//     borderWidth: 1,
//     borderColor: '#FFFFFF',
//     borderRadius: 4,
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxBoxChecked: {
//     backgroundColor: '#FFFFFF',
//   },
//   checkmark: {
//     color: '#007CBA',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   termsText: {
//     flex: 1,
//     fontSize: 14,
//     color: '#E0E0E0',
//     lineHeight: 20,
//   },
//   termsLink: {
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   signUpButton: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingVertical: 16,
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   signUpButtonDisabled: {
//     backgroundColor: '#CCCCCC',
//     opacity: 0.7,
//   },
//   signUpButtonText: {
//     color: '#007CBA',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   loginContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   loginText: {
//     fontSize: 14,
//     color: '#E0E0E0',
//   },
//   loginLink: {
//     fontSize: 14,
//     color: '#FFFFFF',
//     fontWeight: '600',
//   },
//   orContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   orLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: '#E8E8E8',
//   },
//   orText: {
//     marginHorizontal: 16,
//     color: '#E0E0E0',
//     fontSize: 14,
//   },
//   socialContainer: {
//     marginBottom: 24,
//   },
//   socialButton: {
//     flexDirection: 'row',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#E8E8E8',
//   },
//   appleButton: {
//     backgroundColor: '#000000',
//     borderColor: '#000000',
//   },
//   socialIcon: {
//     width: 20,
//     height: 20,
//     marginRight: 12,
//   },
//   socialButtonText: {
//     color: '#007CBA',
//     fontSize: 16,
//     fontWeight: '500',
//   },
//   appleButtonText: {
//     color: '#FFFFFF',
//   },
// });

// export default SignUpScreen;

import axios from "axios";
import { router } from "expo-router";
import React, { useRef, useState } from 'react';
import urls from "./urls/urls";

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

const SignUpScreen: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [clientCode, setClientCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [activeInputIndex, setActiveInputIndex] = useState<number>(0);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signup');

  // Animation values for all fields
  const firstNameAnim = useRef(new Animated.Value(0)).current;
  const lastNameAnim = useRef(new Animated.Value(0)).current;
  const usernameAnim = useRef(new Animated.Value(0)).current;
  const emailAnim = useRef(new Animated.Value(0)).current;
  const phoneNumberAnim = useRef(new Animated.Value(0)).current;
  const addressAnim = useRef(new Animated.Value(0)).current;
  const passwordAnim = useRef(new Animated.Value(0)).current;
  const confirmPasswordAnim = useRef(new Animated.Value(0)).current;

  // Focus states for all fields
  const [isFocusedFirstName, setIsFocusedFirstName] = useState(false);
  const [isFocusedLastName, setIsFocusedLastName] = useState(false);
  const [isFocusedUsername, setIsFocusedUsername] = useState(false);
  const [isFocusedEmail, setIsFocusedEmail] = useState(false);
  const [isFocusedPhoneNumber, setIsFocusedPhoneNumber] = useState(false);
  const [isFocusedAddress, setIsFocusedAddress] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  const [isFocusedConfirmPassword, setIsFocusedConfirmPassword] = useState(false);

  // Refs for OTP inputs
  const inputRefs = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleSignUp = async () => {
    const url = urls.customer_register;
    
    // Combine OTP digits
    const clientCodeString = clientCode.join('');
    
    // Basic validation
    if (
      !firstName ||
      !lastName ||
      !username ||
      !email ||
      !phoneNumber ||
      !address ||
      !clientCodeString ||
      !password ||
      !confirmPassword
    ) {
      console.log("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords do not match");
      return;
    }

    if (!agreeToTerms) {
      console.log("Please agree to terms and conditions");
      return;
    }

    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        phone_number: phoneNumber,
        address,
        client_code: clientCodeString,
        password,
        image: null,
      };

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration success:", response.data);

      // Navigate after success
      router.replace("/Dashboard/Dashboard");

    } catch (error: any) {
      if (error.response) {
        console.log("API Error:", error.response.data);
      } else {
        console.log("Network Error:", error.message);
      }
    }
  };

  const handleLogin = () => {
    router.back(); // Or router.replace("/Login");
  };

  const handleTabPress = (tab: 'signin' | 'signup') => {
    if (tab === 'signin') {
      router.back();
    } else {
      setActiveTab(tab);
    }
  };

  // Handle OTP input change
  const handleClientCodeChange = (text: string, index: number) => {
    // Only allow single digit
    const digit = text.slice(0, 1);
    
    // Update the array
    const newCode = [...clientCode];
    newCode[index] = digit;
    setClientCode(newCode);

    // Auto-focus next input if a digit was entered
    if (digit && index < 5) {
      inputRefs[index + 1].current?.focus();
      setActiveInputIndex(index + 1);
    }
  };

  // Handle backspace
  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newCode = [...clientCode];
      
      // If current field is empty, go to previous field
      if (!clientCode[index] && index > 0) {
        inputRefs[index - 1].current?.focus();
        setActiveInputIndex(index - 1);
      } else {
        // Clear current field
        newCode[index] = "";
        setClientCode(newCode);
      }
    }
  };

  // Focus handlers for each field
  const createFocusHandlers = (
    animValue: Animated.Value,
    setIsFocused: (value: boolean) => void,
    value: string
  ) => ({
    onFocus: () => {
      setIsFocused(true);
      Animated.timing(animValue, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    },
    onBlur: () => {
      setIsFocused(false);
      if (!value) {
        Animated.timing(animValue, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  // Initialize animations if there's existing text
  React.useEffect(() => {
    const fields = [
      { value: firstName, anim: firstNameAnim },
      { value: lastName, anim: lastNameAnim },
      { value: username, anim: usernameAnim },
      { value: email, anim: emailAnim },
      { value: phoneNumber, anim: phoneNumberAnim },
      { value: address, anim: addressAnim },
      { value: password, anim: passwordAnim },
      { value: confirmPassword, anim: confirmPasswordAnim },
    ];

    fields.forEach(({ value, anim }) => {
      if (value) {
        anim.setValue(1);
      }
    });
  }, []);

  // Helper function for animated labels
  const createLabelAnimation = (animValue: Animated.Value, isFocused: boolean) => ({
    position: 'absolute' as 'absolute',
    left: 16,
    top: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -12]
    }),
    fontSize: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12]
    }),
    color: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['#E0E0E0', '#FFFFFF']
    }),
    backgroundColor: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', '#007CBA']
    }),
    paddingHorizontal: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 4]
    }),
    zIndex: 1,
  });

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

            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitle}>Join us today</Text>

            <View style={styles.formContainer}>
              {/* Two-column layout for first and last name */}
              <View style={styles.row}>
                <View style={[styles.inputContainer, styles.halfWidth, { marginRight: 8 }]}>
                  <Animated.Text style={createLabelAnimation(firstNameAnim, isFocusedFirstName)}>
                    First Name
                  </Animated.Text>
                  <TextInput
                    style={[
                      styles.input,
                      isFocusedFirstName && styles.inputFocused
                    ]}
                    placeholder=""
                    placeholderTextColor="transparent"
                    value={firstName}
                    onChangeText={setFirstName}
                    {...createFocusHandlers(firstNameAnim, setIsFocusedFirstName, firstName)}
                    autoCapitalize="words"
                  />
                </View>

                <View style={[styles.inputContainer, styles.halfWidth, { marginLeft: 8 }]}>
                  <Animated.Text style={createLabelAnimation(lastNameAnim, isFocusedLastName)}>
                    Last Name
                  </Animated.Text>
                  <TextInput
                    style={[
                      styles.input,
                      isFocusedLastName && styles.inputFocused
                    ]}
                    placeholder=""
                    placeholderTextColor="transparent"
                    value={lastName}
                    onChangeText={setLastName}
                    {...createFocusHandlers(lastNameAnim, setIsFocusedLastName, lastName)}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Username Input */}
              <View style={styles.inputContainer}>
                <Animated.Text style={createLabelAnimation(usernameAnim, isFocusedUsername)}>
                  Username
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocusedUsername && styles.inputFocused
                  ]}
                  placeholder=""
                  placeholderTextColor="transparent"
                  value={username}
                  onChangeText={setUsername}
                  {...createFocusHandlers(usernameAnim, setIsFocusedUsername, username)}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <Animated.Text style={createLabelAnimation(emailAnim, isFocusedEmail)}>
                  Email
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocusedEmail && styles.inputFocused
                  ]}
                  placeholder=""
                  placeholderTextColor="transparent"
                  value={email}
                  onChangeText={setEmail}
                  {...createFocusHandlers(emailAnim, setIsFocusedEmail, email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Phone Number Input */}
              <View style={styles.inputContainer}>
                <Animated.Text style={createLabelAnimation(phoneNumberAnim, isFocusedPhoneNumber)}>
                  Phone Number
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocusedPhoneNumber && styles.inputFocused
                  ]}
                  placeholder=""
                  placeholderTextColor="transparent"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  {...createFocusHandlers(phoneNumberAnim, setIsFocusedPhoneNumber, phoneNumber)}
                  keyboardType="phone-pad"
                />
              </View>

              {/* Address Input */}
              <View style={styles.inputContainer}>
                <Animated.Text style={createLabelAnimation(addressAnim, isFocusedAddress)}>
                  Address
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    styles.addressInput,
                    isFocusedAddress && styles.inputFocused
                  ]}
                  placeholder=""
                  placeholderTextColor="transparent"
                  value={address}
                  onChangeText={setAddress}
                  {...createFocusHandlers(addressAnim, setIsFocusedAddress, address)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <Animated.Text style={createLabelAnimation(passwordAnim, isFocusedPassword)}>
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
                  {...createFocusHandlers(passwordAnim, setIsFocusedPassword, password)}
                  secureTextEntry
                />
                <Text style={styles.hintText}>At least 8 characters</Text>
              </View>

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <Animated.Text style={createLabelAnimation(confirmPasswordAnim, isFocusedConfirmPassword)}>
                  Confirm Password
                </Animated.Text>
                <TextInput
                  style={[
                    styles.input,
                    isFocusedConfirmPassword && styles.inputFocused
                  ]}
                  placeholder=""
                  placeholderTextColor="transparent"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  {...createFocusHandlers(confirmPasswordAnim, setIsFocusedConfirmPassword, confirmPassword)}
                  secureTextEntry
                />
              </View>

              {/* Client Code OTP Input - MOVED HERE */}
              <View style={styles.clientCodeContainer}>
                <Text style={styles.clientCodeLabel}>Client Code</Text>
                <Text style={styles.clientCodeHint}>Enter 6-digit client code</Text>
                
                <View style={styles.otpContainer}>
                  {clientCode.map((digit, index) => (
                    <View 
                      key={index} 
                      style={[
                        styles.otpBox,
                        index === activeInputIndex && styles.otpBoxActive,
                        digit && styles.otpBoxFilled
                      ]}
                    >
                      <TextInput
                        ref={inputRefs[index]}
                        style={styles.otpInput}
                        value={digit}
                        onChangeText={(text) => handleClientCodeChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        onFocus={() => setActiveInputIndex(index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        selectTextOnFocus
                      />
                      {digit ? (
                        <Text style={styles.otpText}>{digit}</Text>
                      ) : (
                        <View style={styles.otpPlaceholder} />
                      )}
                    </View>
                  ))}
                </View>
              </View>

              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAgreeToTerms(!agreeToTerms)}
                >
                  <View style={[
                    styles.checkboxBox,
                    agreeToTerms && styles.checkboxBoxChecked
                  ]}>
                    {agreeToTerms && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Sign Up Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  (!agreeToTerms || !firstName || !lastName || !username || !email || !phoneNumber || !address || !clientCode.join('') || !password || !confirmPassword) && styles.signUpButtonDisabled
                ]}
                onPress={handleSignUp}
                disabled={!agreeToTerms || !firstName || !lastName || !username || !email || !phoneNumber || !address || !clientCode.join('') || !password || !confirmPassword}
              >
                <Text style={styles.signUpButtonText}>Create Account</Text>
              </TouchableOpacity>

              {/* Already have account */}
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account?</Text>
                <TouchableOpacity onPress={handleLogin}>
                  <Text style={styles.loginLink}> Sign in</Text>
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
    paddingHorizontal: 24,
    paddingVertical: 32,
    marginTop: -10,
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
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: 32,
  },
  formContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 24,
    position: 'relative',
  },
  halfWidth: {
    flex: 1,
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
  addressInput: {
    height: 80,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  inputFocused: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
  },
  hintText: {
    fontSize: 12,
    color: '#E0E0E0',
    marginTop: 4,
    marginLeft: 16,
  },
  clientCodeContainer: {
    marginBottom: 24,
  },
  clientCodeLabel: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 8,
    fontWeight: '500',
  },
  clientCodeHint: {
    fontSize: 12,
    color: '#B0B0B0',
    marginBottom: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpBox: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#1E8FCC',
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  otpBoxActive: {
    borderColor: '#FFFFFF',
    borderWidth: 2,
    backgroundColor: '#2A9BD6',
  },
  otpBoxFilled: {
    backgroundColor: '#2A9BD6',
  },
  otpInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    fontSize: 1, //if want to Hide the actual text font size 0
    color: 'transparent',
  },
  otpText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  otpPlaceholder: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
  },
  termsContainer: {
    marginBottom: 24,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    color: '#007CBA',
    fontSize: 14,
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#E0E0E0',
    lineHeight: 20,
  },
  termsLink: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  signUpButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#007CBA',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  loginText: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  loginLink: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default SignUpScreen;