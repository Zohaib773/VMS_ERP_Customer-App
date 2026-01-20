// import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
// import * as Location from "expo-location";
// import React, { useEffect, useState } from "react";
// import {
//     Modal,
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import MapView, { MapPressEvent, Marker } from "react-native-maps";


// const EMPTY_PORTAL_DATA = {
//     wifi: { ssid: "", password: "" },
//     location: { latitude: 0, longitude: 0 },
//     phone_number: { max: 5, numbers: [] as string[] },
//     sensors: {
//         LPG: { id: "", name: "" },
//         Smoke: { id: "", name: "" },
//         Motion_detection: { id: "", name: "" },
//         Human_appearance: { id: "", name: "" },
//         Door_window: [{ id: "", name: "" }],
//     },
//     cams: {
//         cam1: { id: "", name: "", ip_adress: "", configurations: "" },
//         cam2: { id: "", name: "", ip_adress: "", configurations: "" },
//         cam3: { id: "", name: "", ip_adress: "", configurations: "" },
//         cam4: { id: "", name: "", ip_adress: "", configurations: "" },
//     },
//     bugler: { id: "" },
//     key_off: { id: "" },
//     key_on: { id: "" },
// };

// interface Props {
//     visible: boolean;
//     data: any;
//     onClose: () => void;
//     onSubmit: (formData: any) => void;
// }

// const SENSOR_CONFIGS = {
//     Smoke: { icon: "smoke-detector", color: "#EF5350", label: "Smoke Sensor" },
//     LPG: { icon: "gas-cylinder", color: "#FF9800", label: "Gas Sensor" },
//     Motion_detection: { icon: "motion-sensor", color: "#4CAF50", label: "Motion Sensor" },
//     Human_appearance: { icon: "account", color: "#9C27B0", label: "Human Detection" },
// };

// export default function CaptivePortalScreen({
//     visible,
//     data,
//     onClose,
//     onSubmit,
// }: Props) {
//     const [formData, setFormData] = useState<any>(EMPTY_PORTAL_DATA);
//     const [activeSection, setActiveSection] = useState<string>("wifi");
//     // const [mapVisible, setMapVisible] = useState(false);
//     // const [selectedLocation, setSelectedLocation] = useState({
//     //     latitude: formData.location.latitude || 24.8607,
//     //     longitude: formData.location.longitude || 67.0011,
//     // });
//     const [mapVisible, setMapVisible] = useState(false);
//     const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number }>({
//         latitude: 0,
//         longitude: 0,
//     });


//     // const [tempLocation, setTempLocation] = useState({
//     //     latitude: formData.location.latitude || 24.8607,
//     //     longitude: formData.location.longitude || 67.0011,
//     // });



//     useEffect(() => {
//         if (data) {
//             console.log("📥 Captive Portal API Data:", data);
//             setFormData({
//                 ...EMPTY_PORTAL_DATA,
//                 ...data,
//             });
//         }
//     }, [data]);

//     if (!visible) return null;

//     // const openMapPicker = async () => {
//     //     const { status } = await Location.requestForegroundPermissionsAsync();
//     //     if (status !== "granted") {
//     //         alert("Location permission is required");
//     //         return;
//     //     }

//     //     const current = await Location.getCurrentPositionAsync({});
//     //     setSelectedLocation({
//     //         latitude: current.coords.latitude,
//     //         longitude: current.coords.longitude,
//     //     });

//     //     setMapVisible(true);
//     // };

//     // const onMapPress = (event: MapPressEvent) => {
//     //     const { latitude, longitude } = event.nativeEvent.coordinate;

//     //     console.log("📍 Location Selected:", latitude, longitude);

//     //     setSelectedLocation({ latitude, longitude });

//     //     setFormData({
//     //         ...formData,
//     //         location: { latitude, longitude },
//     //     });

//     //     setMapVisible(false);
//     // };

//     const openMapPicker = async () => {
//         try {
//             const { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== "granted") {
//                 alert("Location permission is required");
//                 return;
//             }

//             // Get device’s current location
//             const current = await Location.getCurrentPositionAsync({});
//             setTempLocation({
//                 latitude: current.coords.latitude,
//                 longitude: current.coords.longitude,
//             });

//             setMapVisible(true);
//         } catch (error) {
//             console.error("Failed to get current location:", error);
//             alert("Unable to get current location.");
//         }
//     };

//     const onMapPress = (event: MapPressEvent) => {
//         const { latitude, longitude } = event.nativeEvent.coordinate;

//         console.log("📍 Temp Location Selected:", latitude, longitude);

//         setTempLocation({ latitude, longitude });
//     };



//     const renderSectionHeader = (title: string, icon: string, sectionKey: string) => (
//         <TouchableOpacity
//             style={styles.sectionHeader}
//             onPress={() => setActiveSection(activeSection === sectionKey ? "" : sectionKey)}
//         >
//             <MaterialIcons name={icon as any} size={24} color="#2196F3" />
//             <Text style={styles.sectionTitle}>{title}</Text>
//             <MaterialIcons
//                 name={activeSection === sectionKey ? "expand-less" : "expand-more"}
//                 size={24}
//                 color="#666"
//             />
//         </TouchableOpacity>
//     );

//     const renderInputField = (placeholder: string, value: string, onChange: (v: string) => void, options?: any) => (
//         <View style={styles.inputContainer}>
//             <Text style={styles.inputLabel}>{placeholder}</Text>
//             <TextInput
//                 style={styles.input}
//                 placeholder={`Enter ${placeholder.toLowerCase()}`}
//                 placeholderTextColor="#999"
//                 value={value}
//                 onChangeText={onChange}
//                 {...options}
//             />
//         </View>
//     );

//     return (
//         <Modal visible={visible} animationType="slide">
//             <SafeAreaView style={styles.safeArea}>
//                 <View style={styles.header}>
//                     <Text style={styles.headerTitle}>Device Configuration</Text>
//                     <TouchableOpacity onPress={onClose} style={styles.closeButton}>
//                         <MaterialIcons name="close" size={24} color="#fff" />
//                     </TouchableOpacity>
//                 </View>

//                 <ScrollView style={styles.container}>
//                     {/* Navigation Tabs */}
//                     <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
//                         {[
//                             { key: "wifi", label: "WiFi", icon: "wifi" },
//                             { key: "location", label: "Location", icon: "location-on" },
//                             { key: "phone", label: "Contacts", icon: "phone" },
//                             { key: "sensors", label: "Sensors", icon: "sensors" },
//                             { key: "cameras", label: "Cameras", icon: "videocam" },
//                             { key: "system", label: "System", icon: "settings" },
//                         ].map((tab) => (
//                             <TouchableOpacity
//                                 key={tab.key}
//                                 style={[styles.tab, activeSection.startsWith(tab.key) && styles.activeTab]}
//                                 onPress={() => setActiveSection(tab.key)}
//                             >
//                                 <MaterialIcons
//                                     name={tab.icon as any}
//                                     size={20}
//                                     color={activeSection.startsWith(tab.key) ? "#2196F3" : "#666"}
//                                 />
//                                 <Text
//                                     style={[
//                                         styles.tabText,
//                                         activeSection.startsWith(tab.key) && styles.activeTabText,
//                                     ]}
//                                 >
//                                     {tab.label}
//                                 </Text>
//                             </TouchableOpacity>
//                         ))}
//                     </ScrollView>

//                     {/* WiFi Section */}
//                     {(activeSection === "wifi" || activeSection === "") && (
//                         <View style={styles.sectionCard}>
//                             {renderSectionHeader("WiFi Configuration", "wifi", "wifi")}
//                             {activeSection === "wifi" && (
//                                 <View style={styles.sectionContent}>
//                                     {renderInputField("SSID", formData.wifi.ssid, (v) =>
//                                         setFormData({ ...formData, wifi: { ...formData.wifi, ssid: v } })
//                                     )}
//                                     {renderInputField("Password", formData.wifi.password, (v) =>
//                                         setFormData({ ...formData, wifi: { ...formData.wifi, password: v } })
//                                     )}
//                                 </View>
//                             )}
//                         </View>
//                     )}

//                     {/* Location Section */}
//                     {/* {(activeSection === "location" || activeSection === "") && (
//                         <View style={styles.sectionCard}>
//                             {renderSectionHeader("Location Settings", "location-on", "location")}
//                             {activeSection === "location" && (
//                                 <View style={styles.sectionContent}>
//                                     <View style={styles.row}>
//                                         <View style={styles.halfInput}>
//                                             {renderInputField("Latitude", String(formData.location.latitude), (v) =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     location: { ...formData.location, latitude: Number(v) },
//                                                 }),
//                                                 { keyboardType: "numeric" }
//                                             )}
//                                         </View>
//                                         <View style={styles.halfInput}>
//                                             {renderInputField("Longitude", String(formData.location.longitude), (v) =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     location: { ...formData.location, longitude: Number(v) },
//                                                 }),
//                                                 { keyboardType: "numeric" }
//                                             )}
//                                         </View>
//                                     </View>
//                                 </View>
//                             )}
//                         </View>
//                     )} */}

//                     {/* Location Section */}
//                     {(activeSection === "location" || activeSection === "") && (
//                         <View style={styles.sectionCard}>
//                             {renderSectionHeader("Location Settings", "location-on", "location")}

//                             {activeSection === "location" && (
//                                 <View style={styles.sectionContent}>

//                                     <TouchableOpacity
//                                         style={styles.mapBtn}
//                                         onPress={openMapPicker}
//                                     >
//                                         <Text style={styles.mapBtnText}>📍 Select Location from Map</Text>
//                                     </TouchableOpacity>

//                                     <View style={styles.row}>
//                                         <View style={styles.halfInput}>
//                                             {renderInputField(
//                                                 "Latitude",
//                                                 String(formData.location.latitude),
//                                                 () => { }, // read-only
//                                                 { editable: false }
//                                             )}
//                                         </View>
//                                         <View style={styles.halfInput}>
//                                             {renderInputField(
//                                                 "Longitude",
//                                                 String(formData.location.longitude),
//                                                 () => { },
//                                                 { editable: false }
//                                             )}
//                                         </View>
//                                     </View>

//                                 </View>
//                             )}
//                         </View>
//                     )}

//                     {/* Phone Numbers Section */}
//                     {(activeSection === "phone" || activeSection === "") && (
//                         <View style={styles.sectionCard}>
//                             {renderSectionHeader("Emergency Contacts", "contacts", "phone")}
//                             {activeSection === "phone" && (
//                                 <View style={styles.sectionContent}>
//                                     <Text style={styles.sectionSubtitle}>
//                                         Add emergency phone numbers (Max: {formData.phone_number.max})
//                                     </Text>
//                                     {formData.phone_number.numbers.map((num: string, index: number) => (
//                                         <View key={index} style={styles.phoneRow}>
//                                             <MaterialIcons name="phone" size={20} color="#2196F3" />
//                                             <TextInput
//                                                 style={styles.phoneInput}
//                                                 placeholder={`Contact ${index + 1}`}
//                                                 placeholderTextColor="#999"
//                                                 keyboardType="phone-pad"
//                                                 value={num}
//                                                 onChangeText={(v) => {
//                                                     const updated = [...formData.phone_number.numbers];
//                                                     updated[index] = v;
//                                                     setFormData({
//                                                         ...formData,
//                                                         phone_number: { ...formData.phone_number, numbers: updated },
//                                                     });
//                                                 }}
//                                             />
//                                             {index > 0 && (
//                                                 <TouchableOpacity
//                                                     onPress={() => {
//                                                         const updated = [...formData.phone_number.numbers];
//                                                         updated.splice(index, 1);
//                                                         setFormData({
//                                                             ...formData,
//                                                             phone_number: { ...formData.phone_number, numbers: updated },
//                                                         });
//                                                     }}
//                                                 >
//                                                     <MaterialIcons name="remove-circle" size={24} color="#FF5252" />
//                                                 </TouchableOpacity>
//                                             )}
//                                         </View>
//                                     ))}
//                                     {formData.phone_number.numbers.length < formData.phone_number.max && (
//                                         <TouchableOpacity
//                                             style={styles.addButton}
//                                             onPress={() =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     phone_number: {
//                                                         ...formData.phone_number,
//                                                         numbers: [...formData.phone_number.numbers, ""],
//                                                     },
//                                                 })
//                                             }
//                                         >
//                                             <MaterialIcons name="add-circle" size={20} color="#2196F3" />
//                                             <Text style={styles.addButtonText}>Add Contact</Text>
//                                         </TouchableOpacity>
//                                     )}
//                                 </View>
//                             )}
//                         </View>
//                     )}

//                     {/* Sensors Section - Separated by Type */}
//                     {(activeSection === "sensors" || activeSection === "") && (
//                         <View style={styles.sectionCard}>
//                             {renderSectionHeader("Security Sensors", "sensors", "sensors")}
//                             {activeSection === "sensors" && (
//                                 <View style={styles.sectionContent}>
//                                     {/* Individual Sensor Cards */}
//                                     {Object.entries(SENSOR_CONFIGS).map(([key, config]) => (
//                                         <View key={key} style={styles.sensorCard}>
//                                             <View style={styles.sensorHeader}>
//                                                 <MaterialCommunityIcons
//                                                     name={config.icon as any}
//                                                     size={24}
//                                                     color={config.color}
//                                                 />
//                                                 <Text style={styles.sensorTitle}>{config.label}</Text>
//                                             </View>
//                                             <View style={styles.sensorInputs}>
//                                                 {renderInputField("Device ID", formData.sensors[key]?.id || "", (v) =>
//                                                     setFormData({
//                                                         ...formData,
//                                                         sensors: {
//                                                             ...formData.sensors,
//                                                             [key]: { ...formData.sensors[key], id: v },
//                                                         },
//                                                     })
//                                                 )}
//                                                 {renderInputField("Name/Location", formData.sensors[key]?.name || "", (v) =>
//                                                     setFormData({
//                                                         ...formData,
//                                                         sensors: {
//                                                             ...formData.sensors,
//                                                             [key]: { ...formData.sensors[key], name: v },
//                                                         },
//                                                     })
//                                                 )}
//                                             </View>
//                                         </View>
//                                     ))}

//                                     {/* Door/Window Sensors */}
//                                     <View style={styles.sensorCard}>
//                                         <View style={styles.sensorHeader}>
//                                             <FontAwesome5 name="door-closed" size={24} color="#5C6BC0" />
//                                             <Text style={styles.sensorTitle}>Door/Window Sensors</Text>
//                                         </View>
//                                         {formData.sensors.Door_window.map((item: any, index: number) => (
//                                             <View key={index} style={styles.doorSensorRow}>
//                                                 <Text style={styles.doorNumber}>Sensor {index + 1}</Text>
//                                                 <View style={styles.row}>
//                                                     <View style={styles.halfInput}>
//                                                         {renderInputField("ID", item.id, (v) => {
//                                                             const updated = [...formData.sensors.Door_window];
//                                                             updated[index].id = v;
//                                                             setFormData({
//                                                                 ...formData,
//                                                                 sensors: { ...formData.sensors, Door_window: updated },
//                                                             });
//                                                         })}
//                                                     </View>
//                                                     <View style={styles.halfInput}>
//                                                         {renderInputField("Location", item.name, (v) => {
//                                                             const updated = [...formData.sensors.Door_window];
//                                                             updated[index].name = v;
//                                                             setFormData({
//                                                                 ...formData,
//                                                                 sensors: { ...formData.sensors, Door_window: updated },
//                                                             });
//                                                         })}
//                                                     </View>
//                                                 </View>
//                                             </View>
//                                         ))}
//                                         <TouchableOpacity
//                                             style={styles.addButton}
//                                             onPress={() =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     sensors: {
//                                                         ...formData.sensors,
//                                                         Door_window: [
//                                                             ...formData.sensors.Door_window,
//                                                             { id: "", name: "" },
//                                                         ],
//                                                     },
//                                                 })
//                                             }
//                                         >
//                                             <MaterialIcons name="add-circle" size={20} color="#5C6BC0" />
//                                             <Text style={styles.addButtonText}>Add Door/Window Sensor</Text>
//                                         </TouchableOpacity>
//                                     </View>
//                                 </View>
//                             )}
//                         </View>
//                     )}

//                     {/* Cameras Section */}
//                     {(activeSection === "cameras" || activeSection === "") && (
//                         <View style={styles.sectionCard}>
//                             {renderSectionHeader("Camera Configuration", "videocam", "cameras")}
//                             {activeSection === "cameras" && (
//                                 <View style={styles.sectionContent}>
//                                     {Object.entries(formData.cams).map(([camKey, cam]: any) => (
//                                         <View key={camKey} style={styles.cameraCard}>
//                                             <View style={styles.cameraHeader}>
//                                                 <MaterialIcons name="videocam" size={20} color="#2196F3" />
//                                                 <Text style={styles.cameraTitle}>Camera {camKey.slice(3)}</Text>
//                                             </View>
//                                             {renderInputField("Camera ID", cam.id, (v) =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     cams: { ...formData.cams, [camKey]: { ...cam, id: v } },
//                                                 })
//                                             )}
//                                             {renderInputField("Name", cam.name, (v) =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     cams: { ...formData.cams, [camKey]: { ...cam, name: v } },
//                                                 })
//                                             )}
//                                             {renderInputField("IP Address", cam.ip_adress, (v) =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     cams: { ...formData.cams, [camKey]: { ...cam, ip_adress: v } },
//                                                 })
//                                             )}
//                                             {renderInputField("Configurations", cam.configurations, (v) =>
//                                                 setFormData({
//                                                     ...formData,
//                                                     cams: { ...formData.cams, [camKey]: { ...cam, configurations: v } },
//                                                 })
//                                             )}
//                                         </View>
//                                     ))}
//                                 </View>
//                             )}
//                         </View>
//                     )}

//                     {/* System Controls Section */}
//                     {(activeSection === "system" || activeSection === "") && (
//                         <View style={styles.sectionCard}>
//                             {renderSectionHeader("System Controls", "security", "system")}
//                             {activeSection === "system" && (
//                                 <View style={styles.sectionContent}>
//                                     <View style={styles.controlGrid}>
//                                         <View style={styles.controlCard}>
//                                             <MaterialIcons name="warning" size={24} color="#FF9800" />
//                                             {renderInputField("Burglar Alarm ID", formData.bugler.id, (v) =>
//                                                 setFormData({ ...formData, bugler: { id: v } })
//                                             )}
//                                         </View>
//                                         <View style={styles.controlCard}>
//                                             <MaterialIcons name="power-settings-new" size={24} color="#4CAF50" />
//                                             {renderInputField("System ON ID", formData.key_on.id, (v) =>
//                                                 setFormData({ ...formData, key_on: { id: v } })
//                                             )}
//                                         </View>
//                                         <View style={styles.controlCard}>
//                                             <MaterialIcons name="power-off" size={24} color="#F44336" />
//                                             {renderInputField("System OFF ID", formData.key_off.id, (v) =>
//                                                 setFormData({ ...formData, key_off: { id: v } })
//                                             )}
//                                         </View>
//                                     </View>
//                                 </View>
//                             )}
//                         </View>
//                     )}

//                     {/* Action Buttons */}
//                     <View style={styles.actionButtons}>
//                         <TouchableOpacity
//                             style={styles.saveButton}
//                             onPress={() => {
//                                 console.log("📤 Captive Portal Final Payload:", formData);
//                                 onSubmit(formData);
//                             }}
//                         >
//                             <MaterialIcons name="save" size={20} color="#fff" />
//                             <Text style={styles.saveButtonText}>Save Configuration</Text>
//                         </TouchableOpacity>

//                         <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
//                             <Text style={styles.cancelButtonText}>Cancel</Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ScrollView>
//             </SafeAreaView>
//             {/* <Modal visible={mapVisible} animationType="slide">
//                 <MapView
//                     style={{ flex: 1 }}
//                     initialRegion={{
//                         latitude: selectedLocation.latitude,
//                         longitude: selectedLocation.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     }}
//                     onPress={onMapPress}
//                 >
//                     <Marker coordinate={selectedLocation} />
//                 </MapView>

//                 <TouchableOpacity
//                     onPress={() => setMapVisible(false)}
//                     style={{
//                         position: "absolute",
//                         bottom: 40,
//                         alignSelf: "center",
//                         backgroundColor: "#000",
//                         padding: 12,
//                         borderRadius: 8,
//                     }}
//                 >
//                     <Text style={{ color: "#fff" }}>Cancel</Text>
//                 </TouchableOpacity>
//             </Modal> */}

//             <Modal visible={mapVisible} animationType="slide">
//                 {/* <MapView
//                     style={{ flex: 1 }}
//                     initialRegion={{
//                         latitude: tempLocation.latitude,
//                         longitude: tempLocation.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     }}
//                     onPress={onMapPress}
//                 >
//                     <Marker coordinate={tempLocation} />
//                 </MapView> */}
//                 <MapView
//                     style={{ flex: 1 }}
//                     initialRegion={{
//                         latitude: tempLocation.latitude,
//                         longitude: tempLocation.longitude,
//                         latitudeDelta: 0.01,
//                         longitudeDelta: 0.01,
//                     }}
//                     onPress={(event) => {
//                         const { latitude, longitude } = event.nativeEvent.coordinate;
//                         setTempLocation({ latitude, longitude });
//                         console.log("📍 Temp Location:", latitude, longitude);
//                     }}
//                 >
//                     <Marker
//                         coordinate={tempLocation}
//                         draggable
//                         onDragEnd={(e) => {
//                             const { latitude, longitude } = e.nativeEvent.coordinate;
//                             setTempLocation({ latitude, longitude });
//                             console.log("📍 Dragged Location:", latitude, longitude);
//                         }}
//                     />
//                 </MapView>


//                 <View
//                     style={{
//                         position: "absolute",
//                         bottom: 40,
//                         left: 0,
//                         right: 0,
//                         flexDirection: "row",
//                         justifyContent: "space-evenly",
//                         paddingHorizontal: 20,
//                     }}
//                 >
//                     {/* Cancel Button */}
//                     <TouchableOpacity
//                         onPress={() => setMapVisible(false)}
//                         style={{
//                             backgroundColor: "#ccc",
//                             paddingVertical: 12,
//                             paddingHorizontal: 25,
//                             borderRadius: 8,
//                         }}
//                     >
//                         <Text style={{ color: "#000", fontWeight: "600" }}>Cancel</Text>
//                     </TouchableOpacity>

//                     {/* Confirm Button */}
//                     <TouchableOpacity
//                         onPress={() => {
//                             setFormData({
//                                 ...formData,
//                                 location: { ...tempLocation },
//                             });
//                             console.log("Confirmed Location:", tempLocation);
//                             setMapVisible(false);
//                         }}
//                         style={{
//                             backgroundColor: "#2196F3",
//                             paddingVertical: 12,
//                             paddingHorizontal: 25,
//                             borderRadius: 8,
//                         }}
//                     >
//                         <Text style={{ color: "#fff", fontWeight: "600" }}>Confirm</Text>
//                     </TouchableOpacity>
//                 </View>
//             </Modal>


//         </Modal>
//     );
// }

// const styles = StyleSheet.create({
//     safeArea: {
//         flex: 1,
//         backgroundColor: "#f5f5f5",
//     },
//     header: {
//         backgroundColor: "#2196F3",
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//         paddingHorizontal: 20,
//         paddingVertical: 15,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: "bold",
//         color: "#fff",
//     },
//     closeButton: {
//         padding: 5,
//     },
//     container: {
//         flex: 1,
//     },
//     tabContainer: {
//         backgroundColor: "#fff",
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//         borderBottomWidth: 1,
//         borderBottomColor: "#e0e0e0",
//     },
//     tab: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingHorizontal: 15,
//         paddingVertical: 8,
//         marginHorizontal: 5,
//         borderRadius: 20,
//         backgroundColor: "#f8f8f8",
//     },
//     activeTab: {
//         backgroundColor: "#2196F3",
//     },
//     tabText: {
//         marginLeft: 5,
//         fontSize: 14,
//         color: "#666",
//     },
//     activeTabText: {
//         color: "#fff",
//         fontWeight: "600",
//     },
//     sectionCard: {
//         backgroundColor: "#fff",
//         marginHorizontal: 10,
//         marginTop: 10,
//         borderRadius: 12,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//     },
//     sectionHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         padding: 16,
//         borderBottomWidth: 1,
//         borderBottomColor: "#f0f0f0",
//     },
//     sectionTitle: {
//         flex: 1,
//         fontSize: 16,
//         fontWeight: "600",
//         marginLeft: 10,
//         color: "#333",
//     },
//     sectionContent: {
//         padding: 16,
//     },
//     sectionSubtitle: {
//         fontSize: 14,
//         color: "#666",
//         marginBottom: 15,
//     },
//     inputContainer: {
//         marginBottom: 15,
//     },
//     inputLabel: {
//         fontSize: 14,
//         fontWeight: "500",
//         color: "#555",
//         marginBottom: 5,
//     },
//     input: {
//         borderWidth: 1,
//         borderColor: "#ddd",
//         borderRadius: 8,
//         paddingHorizontal: 12,
//         paddingVertical: 10,
//         fontSize: 14,
//         backgroundColor: "#fafafa",
//     },
//     row: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//     },
//     halfInput: {
//         width: "48%",
//     },
//     phoneRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 10,
//         backgroundColor: "#f8f8f8",
//         padding: 10,
//         borderRadius: 8,
//     },
//     phoneInput: {
//         flex: 1,
//         marginLeft: 10,
//         fontSize: 14,
//         padding: 5,
//     },
//     addButton: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: 10,
//         borderWidth: 1,
//         borderColor: "#2196F3",
//         borderStyle: "dashed",
//         borderRadius: 8,
//         marginTop: 10,
//     },
//     addButtonText: {
//         marginLeft: 5,
//         color: "#2196F3",
//         fontWeight: "500",
//     },
//     sensorCard: {
//         backgroundColor: "#f8f8f8",
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 12,
//     },
//     sensorHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 10,
//     },
//     sensorTitle: {
//         fontSize: 16,
//         fontWeight: "600",
//         marginLeft: 10,
//         color: "#333",
//     },
//     sensorInputs: {
//         marginTop: 5,
//     },
//     doorSensorRow: {
//         marginBottom: 15,
//     },
//     doorNumber: {
//         fontSize: 14,
//         fontWeight: "500",
//         color: "#5C6BC0",
//         marginBottom: 5,
//     },
//     cameraCard: {
//         backgroundColor: "#f8f8f8",
//         borderRadius: 8,
//         padding: 12,
//         marginBottom: 12,
//     },
//     cameraHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginBottom: 10,
//     },
//     cameraTitle: {
//         fontSize: 16,
//         fontWeight: "600",
//         marginLeft: 10,
//         color: "#333",
//     },
//     controlGrid: {
//         flexDirection: "row",
//         flexWrap: "wrap",
//         justifyContent: "space-between",
//     },
//     controlCard: {
//         width: "48%",
//         backgroundColor: "#f8f8f8",
//         borderRadius: 8,
//         padding: 12,
//         alignItems: "center",
//         marginBottom: 10,
//     },
//     actionButtons: {
//         padding: 20,
//         paddingBottom: 30,
//     },
//     saveButton: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#2196F3",
//         padding: 15,
//         borderRadius: 10,
//         marginBottom: 10,
//     },
//     saveButtonText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "600",
//         marginLeft: 8,
//     },
//     cancelButton: {
//         padding: 15,
//         borderRadius: 10,
//         borderWidth: 1,
//         borderColor: "#ddd",
//         alignItems: "center",
//     },
//     cancelButtonText: {
//         color: "#666",
//         fontSize: 16,
//         fontWeight: "500",
//     },
//     mapBtn: {
//         backgroundColor: "#2196F3",
//         paddingVertical: 12,
//         paddingHorizontal: 20,
//         borderRadius: 8,
//         alignItems: "center",
//         marginBottom: 15,
//         flexDirection: "row",
//         justifyContent: "center",
//     },
//     mapBtnText: {
//         color: "#fff",
//         fontSize: 16,
//         fontWeight: "600",
//     },
// });

import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";


const EMPTY_PORTAL_DATA = {
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
}: Props) {
    const [formData, setFormData] = useState<any>(EMPTY_PORTAL_DATA);
    const [activeSection, setActiveSection] = useState<string>("wifi");
    const [mapVisible, setMapVisible] = useState(false);
    const [tempLocation, setTempLocation] = useState<{ latitude: number; longitude: number }>({
        latitude: 0,
        longitude: 0,
    });

    useEffect(() => {
        if (data) {
            console.log("📥 Captive Portal API Data:", data);
            setFormData({
                ...EMPTY_PORTAL_DATA,
                ...data,
            });
        }
    }, [data]);

    if (!visible) return null;

    const openMapPicker = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Location permission is required");
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
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabContainer}>
                        {[
                            { key: "wifi", label: "WiFi", icon: "wifi" },
                            { key: "location", label: "Location", icon: "location-on" },
                            { key: "phone", label: "Contacts", icon: "phone" },
                            { key: "sensors", label: "Sensors", icon: "sensors" },
                            { key: "cameras", label: "Cameras", icon: "videocam" },
                            { key: "system", label: "System", icon: "settings" },
                        ].map((tab) => (
                            <TouchableOpacity
                                key={tab.key}
                                style={[styles.tab, activeSection.startsWith(tab.key) && styles.activeTab]}
                                onPress={() => setActiveSection(tab.key)}
                            >
                                <MaterialIcons
                                    name={tab.icon as any}
                                    size={20}
                                    color={activeSection.startsWith(tab.key) ? "#2196F3" : "#666"}
                                />
                                <Text
                                    style={[
                                        styles.tabText,
                                        activeSection.startsWith(tab.key) && styles.activeTabText,
                                    ]}
                                >
                                    {tab.label}
                                </Text>
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
                    {(activeSection === "location" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("Location Settings", "location-on", "location")}

                            {activeSection === "location" && (
                                <View style={styles.sectionContent}>
                                    <TouchableOpacity
                                        style={styles.mapBtn}
                                        onPress={openMapPicker}
                                    >
                                        <Text style={styles.mapBtnText}>📍 Select Location from Map</Text>
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
                    )}

                    {/* Phone Numbers Section */}
                    {(activeSection === "phone" || activeSection === "") && (
                        <View style={styles.sectionCard}>
                            {renderSectionHeader("Emergency Contacts", "contacts", "phone")}
                            {activeSection === "phone" && (
                                <View style={styles.sectionContent}>
                                    <Text style={styles.sectionSubtitle}>
                                        Add emergency phone numbers (Max: {formData.phone_number.max})
                                    </Text>
                                    {formData.phone_number.numbers.map((num: string, index: number) => (
                                        <View key={index} style={styles.phoneRow}>
                                            <MaterialIcons name="phone" size={20} color="#2196F3" />
                                            <TextInput
                                                style={styles.phoneInput}
                                                placeholder={`Contact ${index + 1}`}
                                                placeholderTextColor="#999"
                                                keyboardType="phone-pad"
                                                value={num}
                                                onChangeText={(v) => {
                                                    const updated = [...formData.phone_number.numbers];
                                                    updated[index] = v;
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
                                    ))}
                                    {formData.phone_number.numbers.length < formData.phone_number.max && (
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() =>
                                                setFormData({
                                                    ...formData,
                                                    phone_number: {
                                                        ...formData.phone_number,
                                                        numbers: [...formData.phone_number.numbers, ""],
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
                                                {renderInputField("Device ID", formData.sensors[key]?.id || "", (v) =>
                                                    setFormData({
                                                        ...formData,
                                                        sensors: {
                                                            ...formData.sensors,
                                                            [key]: { ...formData.sensors[key], id: v },
                                                        },
                                                    })
                                                )}
                                                {renderInputField("Name/Location", formData.sensors[key]?.name || "", (v) =>
                                                    setFormData({
                                                        ...formData,
                                                        sensors: {
                                                            ...formData.sensors,
                                                            [key]: { ...formData.sensors[key], name: v },
                                                        },
                                                    })
                                                )}
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
                                                    <View style={styles.halfInput}>
                                                        {renderInputField("ID", item.id, (v) => {
                                                            const updated = [...formData.sensors.Door_window];
                                                            updated[index].id = v;
                                                            setFormData({
                                                                ...formData,
                                                                sensors: { ...formData.sensors, Door_window: updated },
                                                            });
                                                        })}
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
                                            </View>
                                        ))}
                                        <TouchableOpacity
                                            style={styles.addButton}
                                            onPress={() =>
                                                setFormData({
                                                    ...formData,
                                                    sensors: {
                                                        ...formData.sensors,
                                                        Door_window: [
                                                            ...formData.sensors.Door_window,
                                                            { id: "", name: "" },
                                                        ],
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
                    {(activeSection === "cameras" || activeSection === "") && (
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
                                            {renderInputField("Camera ID", cam.id, (v) =>
                                                setFormData({
                                                    ...formData,
                                                    cams: { ...formData.cams, [camKey]: { ...cam, id: v } },
                                                })
                                            )}
                                            {renderInputField("Name", cam.name, (v) =>
                                                setFormData({
                                                    ...formData,
                                                    cams: { ...formData.cams, [camKey]: { ...cam, name: v } },
                                                })
                                            )}
                                            {renderInputField("IP Address", cam.ip_adress, (v) =>
                                                setFormData({
                                                    ...formData,
                                                    cams: { ...formData.cams, [camKey]: { ...cam, ip_adress: v } },
                                                })
                                            )}
                                            {renderInputField("Configurations", cam.configurations, (v) =>
                                                setFormData({
                                                    ...formData,
                                                    cams: { ...formData.cams, [camKey]: { ...cam, configurations: v } },
                                                })
                                            )}
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
                                    <View style={styles.controlGrid}>
                                        <View style={styles.controlCard}>
                                            <MaterialIcons name="warning" size={24} color="#FF9800" />
                                            {renderInputField("Burglar Alarm ID", formData.bugler.id, (v) =>
                                                setFormData({ ...formData, bugler: { id: v } })
                                            )}
                                        </View>
                                        <View style={styles.controlCard}>
                                            <MaterialIcons name="power-settings-new" size={24} color="#4CAF50" />
                                            {renderInputField("System ON ID", formData.key_on.id, (v) =>
                                                setFormData({ ...formData, key_on: { id: v } })
                                            )}
                                        </View>
                                        <View style={styles.controlCard}>
                                            <MaterialIcons name="power-off" size={24} color="#F44336" />
                                            {renderInputField("System OFF ID", formData.key_off.id, (v) =>
                                                setFormData({ ...formData, key_off: { id: v } })
                                            )}
                                        </View>
                                    </View>
                                    
                                    {/* Save Configuration Button - ONLY in System section */}
                                    <TouchableOpacity
                                        style={styles.saveButton}
                                        onPress={() => {
                                            console.log("📤 Captive Portal Final Payload:", formData);
                                            onSubmit(formData);
                                        }}
                                    >
                                        <MaterialIcons name="save" size={20} color="#fff" />
                                        <Text style={styles.saveButtonText}>Save Configuration</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>

            {/* Map Modal */}
            <Modal visible={mapVisible} animationType="slide">
                <MapView
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
    header: {
        backgroundColor: "#2196F3",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 15,
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
});