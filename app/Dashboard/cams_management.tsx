
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Modal,
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
  // const cameras = cams ? JSON.parse(cams as string) : [];
  const cameras = (() => {
    try {
      return cams ? JSON.parse(cams as string) : [];
    } catch (e) {
      console.log("Failed to parse cams:", e);
      return [];
    }
  })();
  const [selectedCamera, setSelectedCamera] = useState<any>(null);
  const [cameraStatus, setCameraStatus] = useState<Record<string, boolean>>({});
  const [showModeModal, setShowModeModal] = useState(false);
  const [selectedCameraForMode, setSelectedCameraForMode] = useState<any>(null);


  const handleViewRecordings = (camera: any) => {
    router.push({
      pathname: '/Dashboard/recordings',
      params: {
        cameraId: camera.id,
        cameraName: camera.name,
      },
    });
  };

  const openModeSelector = (camera: any) => {
    setSelectedCameraForMode(camera);
    setShowModeModal(true);
  };

  // const handleModeSelect = (mode: "local" | "global") => {
  //   setShowModeModal(false);

  //   if (!selectedCameraForMode) return;

  //   router.push({
  //     pathname: "/Dashboard/live-view",
  //     params: {
  //       cameraId: selectedCameraForMode.id,
  //       cameraName: selectedCameraForMode.name,
  //       deviceId: deviceId,
  //       mode: mode, // 👈 PASS THIS
  //     },
  //   });
  // };

  const handleModeSelect = (mode: "local" | "global") => {
    setShowModeModal(false);

    if (!selectedCameraForMode) return;

    router.push({
      pathname: "/Dashboard/live-view",
      params: {
        cameraId: selectedCameraForMode?.id || "",
        cameraName:
          selectedCameraForMode?.displayName ||
          selectedCameraForMode?.name ||
          "Unnamed Camera",

        deviceId: String(deviceId || ""),
        mode: mode,

        // optional extra params (very useful later)
        ip_address: selectedCameraForMode?.ip_address || "",
        url: selectedCameraForMode?.url || "",
      },
    });

    console.log("LIVE VIEW PARAMS:", {
      cameraId: selectedCameraForMode?.id,
      cameraName:
        selectedCameraForMode?.displayName ||
        selectedCameraForMode?.name,
      deviceId,
      mode,
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
            {/* <Text style={styles.camName}>{camera.name}</Text> */}
            <Text style={styles.camName}>
              {camera.displayName || camera.name || "Unnamed Camera"}
            </Text>
            <View style={styles.statusContainer}>
              {/* <View style={[styles.statusDot, { backgroundColor: isActive ? '#10B981' : '#6B7280' }]} />
              <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#6B7280' }]}>
                {isActive ? 'Active' : 'Inactive'}
              </Text> */}
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
            {/* <Text style={styles.detailValue}>{camera.ip_adress || 'Not configured'}</Text> */}
            <Text style={styles.detailValue}>
              {camera.ip_address || 'Not configured'}
            </Text>
          </View>

          {/* {camera.configurations && (
            <View style={styles.detailRow}>
              <MaterialIcons name="settings" size={18} color="#6B7280" />
              <Text style={styles.detailLabel}>Configuration:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {camera.configurations}
              </Text>
            </View>
          )} */}
          {camera.configurations && (
            <View style={styles.detailRow}>
              <MaterialIcons name="settings" size={18} color="#6B7280" />
              <Text style={styles.detailLabel}>ROIs:</Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {camera.configurations?.rois?.length || 0} configured
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.liveButton]}
            // onPress={() => handleViewLiveFeed(camera)}
            onPress={() => openModeSelector(camera)}
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
        {/* <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
        </View>
        <Text style={styles.statNumber}>
          {Object.values(cameraStatus).filter(status => status !== false).length}
        </Text>
        <Text style={styles.statLabel}>Active</Text> */}
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
                // keyExtractor={(item) => item.id.toString()}
                keyExtractor={(item, index) => item?.id?.toString() || `camera-${index}`}
                renderItem={({ item, index }) => <CameraCard camera={item} index={index} />}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            </View>
          )}
        </ScrollView>

        {/* Modals */}
        <Modal
          visible={showModeModal}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>

              <Text style={styles.modalTitle}>Select Stream Type</Text>
              <Text style={styles.modalSubtitle}>
                Choose how you want to view the camera feed
              </Text>

              {/* LOCAL BUTTON */}
              <TouchableOpacity
                style={[styles.modeButton, { backgroundColor: "#4F46E5" }]}
                onPress={() => handleModeSelect("local")}
              >
                <MaterialIcons name="router" size={20} color="white" />
                <Text style={styles.modeButtonText}>Local Network</Text>
              </TouchableOpacity>

              {/* GLOBAL BUTTON */}
              <TouchableOpacity
                style={[styles.modeButton, { backgroundColor: "#10B981" }]}
                onPress={() => handleModeSelect("global")}
              >
                <MaterialIcons name="public" size={20} color="white" />
                <Text style={styles.modeButtonText}>Global Access</Text>
              </TouchableOpacity>

              {/* CANCEL */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModeModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </CustomerSidebar>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F9FAFB"
//   },
//   header: {
//     padding: 24,
//     paddingBottom: 16,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderColor: "#E5E7EB",
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#111827"
//   },
//   subtitle: {
//     fontSize: 16,
//     color: "#6B7280",
//     marginTop: 4
//   },
//   deviceNameHighlight: {
//     fontWeight: '600',
//     color: '#4F46E5',
//   },
//   statsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     backgroundColor: '#F9FAFB',
//     borderRadius: 16,
//     padding: 16,
//     marginTop: 8,
//   },
//   statItem: {
//     alignItems: 'center',
//     flex: 1,
//   },
//   statIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   statNumber: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#111827',
//     marginBottom: 2,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//   },
//   camerasList: {
//     marginTop: 8,
//   },
//   listHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 16,
//   },
//   listTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   refreshButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#EEF2FF',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   listContent: {
//     paddingHorizontal: 20,
//     paddingBottom: 20,
//   },
//   camCard: {
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     marginBottom: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.05,
//     shadowRadius: 12,
//     elevation: 5,
//     borderWidth: 1,
//     borderColor: '#F3F4F6',
//   },
//   camHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   camIconContainer: {
//     width: 60,
//     height: 60,
//     borderRadius: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//     position: 'relative',
//   },
//   camBadge: {
//     position: 'absolute',
//     top: -6,
//     right: -6,
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   camBadgeText: {
//     color: 'white',
//     fontSize: 10,
//     fontWeight: 'bold',
//   },
//   camInfo: {
//     flex: 1,
//   },
//   camName: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 4,
//   },
//   statusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   statusDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//   },
//   statusText: {
//     fontSize: 14,
//   },
//   camDetails: {
//     marginBottom: 20,
//     gap: 12,
//   },
//   detailRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   detailLabel: {
//     fontSize: 14,
//     color: '#6B7280',
//     width: 100,
//   },
//   detailValue: {
//     fontSize: 14,
//     color: '#111827',
//     fontWeight: '500',
//     flex: 1,
//   },
//   actionButtons: {
//     flexDirection: 'row',
//     gap: 8,
//   },
//   actionButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     borderRadius: 12,
//     gap: 8,
//     flex: 1,
//   },
//   liveButton: {
//     backgroundColor: '#4F46E5',
//     flex: 2,
//   },
//   liveButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   recordingsButton: {
//     backgroundColor: '#10B981', // nice green
//   },

//   recordingsButtonText: {
//     color: 'white',
//     fontWeight: '600',
//     fontSize: 14,
//   },
//   emptyContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 40,
//     marginTop: 40,
//   },
//   emptyIllustration: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#F3F4F6',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 24,
//   },
//   emptyTitle: {
//     fontSize: 24,
//     fontWeight: "600",
//     color: "#111827",
//     marginBottom: 8
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#6B7280",
//     textAlign: 'center',
//     lineHeight: 24,
//     marginBottom: 24,
//     maxWidth: 300,
//   },
//   // modalOverlay: {
//   //   flex: 1,
//   //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   //   justifyContent: 'flex-end',
//   // },
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: "rgba(0,0,0,0.5)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   modalContainer: {
//     width: "85%",
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 20,
//     alignItems: "center",
//     elevation: 10,
//   },

//   modalTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },

//   modalSubtitle: {
//     fontSize: 14,
//     color: "#6B7280",
//     marginBottom: 20,
//     textAlign: "center",
//   },

//   modeButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     width: "100%",
//     padding: 12,
//     borderRadius: 12,
//     marginBottom: 10,
//     justifyContent: "center",
//     gap: 8,
//   },

//   modeButtonText: {
//     color: "white",
//     fontWeight: "600",
//   },

//   cancelButton: {
//     marginTop: 10,
//   },

//   cancelText: {
//     color: "#EF4444",
//     fontWeight: "600",
//   },
// });



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0e1a" // Dark background
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    backgroundColor: '#131826', // Dark header
    borderBottomWidth: 1,
    borderColor: "#2a2f3e", // Dark border
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
    color: "#ffffff" // White text
  },
  subtitle: {
    fontSize: 16,
    color: "#9ca3af", // Light gray
    marginTop: 4
  },
  deviceNameHighlight: {
    fontWeight: '600',
    color: '#4FC3F7', // Lighter blue for dark mode
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1f2e', // Dark card background
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
    color: '#ffffff', // White text
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af', // Light gray
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
    color: '#ffffff', // White text
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1f2e', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  camCard: {
    backgroundColor: "#1a1f2e", // Dark card background
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#2a2f3e', // Dark border
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
    color: "#ffffff", // White text
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
    color: '#9ca3af', // Light gray
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
    color: '#9ca3af', // Light gray
    width: 100,
  },
  detailValue: {
    fontSize: 14,
    color: '#e5e7eb', // Off-white
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
    backgroundColor: '#1565C0', // Brand blue
    flex: 2,
  },
  liveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  recordingsButton: {
    backgroundColor: '#2E7D32', // Dark green
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
    backgroundColor: '#1a1f2e', // Dark background
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#ffffff", // White text
    marginBottom: 8
  },
  emptyText: {
    fontSize: 16,
    color: "#9ca3af", // Light gray
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 300,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Darker overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#1a1f2e", // Dark modal background
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff", // White text
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#9ca3af", // Light gray
    marginBottom: 20,
    textAlign: "center",
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    justifyContent: "center",
    gap: 8,
  },
  modeButtonText: {
    color: "white",
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 10,
  },
  cancelText: {
    color: "#EF9A9A", // Light red
    fontWeight: "600",
  },
});