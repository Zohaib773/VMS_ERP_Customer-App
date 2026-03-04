// import { Ionicons } from "@expo/vector-icons";
// import { useLocalSearchParams } from "expo-router";
// import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import CustomerSidebar from "../component/sidebarlayout";


// export default function CamsManagementScreen() {
//     const { deviceId, deviceName, cams } = useLocalSearchParams();

//     const cameras = cams ? JSON.parse(cams as string) : [];

//     const renderCam = ({ item }: any) => (
//         <View style={styles.camCard}>
//             <View style={styles.camHeader}>
//                 <Ionicons name="videocam" size={22} color="#4F46E5" />
//                 <Text style={styles.camName}>{item.name}</Text>
//             </View>

//             <View style={styles.camDetails}>
//                 <Text style={styles.camText}>Camera ID: {item.id}</Text>
//                 <Text style={styles.camText}>IP Address: {item.ip_adress}</Text>
//             </View>

//             <TouchableOpacity style={styles.viewBtn}>
//                 <Ionicons name="settings-outline" size={18} color="white" />
//                 <Text style={styles.viewBtnText}>Configure</Text>
//             </TouchableOpacity>
//         </View>
//     );


//     // return (
//     //     <SafeAreaView style={styles.container}>
//     //         <View style={styles.header}>
//     //             <Text style={styles.title}>Cameras</Text>
//     //             <Text style={styles.subtitle}>Device: {deviceName}</Text>
//     //         </View>

//     //         {cameras.length === 0 ? (
//     //             <View style={styles.emptyBox}>
//     //                 <Ionicons name="videocam-off" size={60} color="#D1D5DB" />
//     //                 <Text style={styles.emptyText}>No cameras found for this device</Text>
//     //             </View>
//     //         ) : (
//     //             <FlatList
//     //                 data={cameras}
//     //                 keyExtractor={(item) => item.id.toString()}
//     //                 renderItem={renderCam}
//     //                 contentContainerStyle={{ padding: 16 }}
//     //             />
//     //         )}
//     //     </SafeAreaView>
//     // );

//     return (
//         <CustomerSidebar activeTab="My Devices">
//             <SafeAreaView style={styles.container}>
//                 <View style={styles.header}>
//                     <Text style={styles.title}>Cameras</Text>
//                     <Text style={styles.subtitle}>Device: {deviceName}</Text>
//                 </View>

//                 {cameras.length === 0 ? (
//                     <View style={styles.emptyBox}>
//                         <Ionicons name="videocam-off" size={60} color="#D1D5DB" />
//                         <Text style={styles.emptyText}>No cameras found for this device</Text>
//                     </View>
//                 ) : (
//                     <FlatList
//                         data={cameras}
//                         keyExtractor={(item) => item.id.toString()}
//                         renderItem={renderCam}
//                         contentContainerStyle={{ padding: 16 }}
//                     />
//                 )}
//             </SafeAreaView>
//         </CustomerSidebar>
//     );

// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: "#F9FAFB" },
//     header: { padding: 16, borderBottomWidth: 1, borderColor: "#E5E7EB" },
//     title: { fontSize: 22, fontWeight: "bold", color: "#111827" },
//     subtitle: { color: "#6B7280", marginTop: 4 },

//     camCard: {
//         backgroundColor: "white",
//         borderRadius: 12,
//         padding: 14,
//         marginBottom: 14,
//         elevation: 2,
//     },
//     camHeader: {
//         flexDirection: "row",
//         alignItems: "center",
//         gap: 8,
//         marginBottom: 8,
//     },
//     camName: { fontSize: 16, fontWeight: "600", color: "#111827" },

//     camDetails: { marginBottom: 10 },
//     camText: { color: "#4B5563", marginBottom: 2 },

//     viewBtn: {
//         flexDirection: "row",
//         alignItems: "center",
//         justifyContent: "center",
//         backgroundColor: "#4F46E5",
//         padding: 10,
//         borderRadius: 8,
//         gap: 6,
//     },
//     viewBtnText: { color: "white", fontWeight: "600" },

//     emptyBox: {
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         padding: 20,
//     },
//     emptyText: { marginTop: 10, color: "#6B7280" },
// });


import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerSidebar from "../component/sidebarlayout";

export default function CamsManagementScreen() {
  const { deviceId, deviceName, cams } = useLocalSearchParams();
  const cameras = cams ? JSON.parse(cams as string) : [];
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [cameraStatus, setCameraStatus] = useState<Record<string, boolean>>({});

  
  const handleViewRecordings = (camera:any) => {
  router.push({
    pathname: '/Dashboard/recordings',
    params: {
      cameraId: camera.id,
      cameraName: camera.name,
    },
  });
};

  const CameraCard = ({ camera, index }: { camera: any; index: number }) => {
    const isActive = cameraStatus[camera.id] !== false; // Default to true
    const cameraColors = [
      { primary: '#4F46E5', secondary: '#EEF2FF' },
      { primary: '#10B981', secondary: '#D1FAE5' },
      { primary: '#F59E0B', secondary: '#FEF3C7' },
      { primary: '#EF4444', secondary: '#FEE2E2' }
    ];
    const colorSet = cameraColors[index % cameraColors.length];


    const handleViewLiveFeed = (camera: any) => {
      router.push({
        pathname: "/Dashboard/live-view",
        params: {
          cameraId: camera.id,
          cameraName: camera.name,
          deviceId: deviceId
        },
      });
      console.log("DEVICEEEEEE", deviceId)
    };


    return (
      <View style={styles.camCard}>
        {/* Camera Header */}
        <View style={styles.camHeader}>
          <View style={[styles.camIconContainer, { backgroundColor: colorSet.secondary }]}>
            <MaterialIcons name="videocam" size={24} color={colorSet.primary} />
            <View style={[styles.camBadge, { backgroundColor: colorSet.primary }]}>
              <Text style={styles.camBadgeText}>CAM {index + 1}</Text>
            </View>
          </View>

          <View style={styles.camInfo}>
            <Text style={styles.camName}>{camera.name}</Text>
            <View style={styles.statusContainer}>
              <View style={[styles.statusDot, { backgroundColor: isActive ? '#10B981' : '#6B7280' }]} />
              <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#6B7280' }]}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>

        {/* Camera Details */}
        <View style={styles.camDetails}>
          <View style={styles.detailRow}>
            <MaterialIcons name="fingerprint" size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>Camera ID:</Text>
            <Text style={styles.detailValue}>{camera.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="ip-network" size={18} color="#6B7280" />
            <Text style={styles.detailLabel}>IP Address:</Text>
            <Text style={styles.detailValue}>{camera.ip_adress || 'Not configured'}</Text>
          </View>

          {camera.configurations && (
            <View style={styles.detailRow}>
              <MaterialIcons name="settings" size={18} color="#6B7280" />
              <Text style={styles.detailLabel}>Configuration:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {camera.configurations}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.liveButton]}
            onPress={() => handleViewLiveFeed(camera)}
          >
            <Ionicons name="play-circle" size={18} color="white" />
            <Text style={styles.liveButtonText}>Live View</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.recordingsButton]}
            onPress={() => handleViewRecordings(camera)}
          >
            <Ionicons name="videocam" size={18} color="white" />
            <Text style={styles.recordingsButtonText}>Recordings</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };


  const StatsOverview = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: '#EEF2FF' }]}>
          <Ionicons name="videocam" size={20} color="#4F46E5" />
        </View>
        <Text style={styles.statNumber}>{cameras.length}</Text>
        <Text style={styles.statLabel}>Total Cameras</Text>
      </View>

      <View style={styles.statItem}>
        <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>
        <Text style={styles.statNumber}>
          {Object.values(cameraStatus).filter(status => status !== false).length}
        </Text>
        <Text style={styles.statLabel}>Active</Text>
      </View>
    </View>
  );

  return (
    <CustomerSidebar activeTab="My Devices">
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.title}>Camera Management</Text>
                <Text style={styles.subtitle}>
                  Device: <Text style={styles.deviceNameHighlight}>{deviceName}</Text>
                </Text>
              </View>
            </View>

            <StatsOverview />
          </View>

          {cameras.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIllustration}>
                <Ionicons name="videocam-off" size={80} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>No Cameras Found</Text>
              <Text style={styles.emptyText}>
                This device doesn't have any cameras configured yet.
                {/* Add cameras to start monitoring. */}
              </Text>
            </View>
          ) : (
            <View style={styles.camerasList}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Security Cameras</Text>
                <TouchableOpacity style={styles.refreshButton}>
                  <Ionicons name="refresh" size={20} color="#4F46E5" />
                </TouchableOpacity>
              </View>

              <FlatList
                data={cameras}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => <CameraCard camera={item} index={index} />}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            </View>
          )}
        </ScrollView>

        {/* Modals */}

      </SafeAreaView>
    </CustomerSidebar>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB"
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827"
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4
  },
  deviceNameHighlight: {
    fontWeight: '600',
    color: '#4F46E5',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  camerasList: {
    marginTop: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  camCard: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  camHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  camIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  camBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  camBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  camInfo: {
    flex: 1,
  },
  camName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 14,
  },
  camDetails: {
    marginBottom: 20,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    flex: 1,
  },
  liveButton: {
    backgroundColor: '#4F46E5',
    flex: 2,
  },
  liveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  recordingsButton: {
    backgroundColor: '#10B981', // nice green
  },

  recordingsButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 40,
  },
  emptyIllustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 300,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
});