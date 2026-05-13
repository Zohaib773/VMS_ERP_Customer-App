import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { format } from 'date-fns';
// import { format } from date-fns;
import { ResizeMode, Video } from 'expo-av';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import urls from '../urls/urls';

interface Recording {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  duration: number;
  createdAt: string;
}
const { width, height } = Dimensions.get('window');

export default function RecordingsScreen() {
  const { cameraId, cameraName } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  const [fullscreenVideo, setFullscreenVideo] = useState<string | null>(null);

  const fetchRecordings = async (date: Date) => {
    console.log("🚀 fetchRecordings called");

    setLoading(true);
    setVideoError(null);

    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      console.log(" Formatted Date:", formattedDate);

      const url = `${urls.get_videos}?cam=cam0&from=${formattedDate}&to=${formattedDate}`;
      console.log(" Fetch URL:", url);

      const response = await axios.get(url);

      console.log(" Raw Response:", response);
      console.log(" Response Data:", response.data);

      if (!response.data?.videos) {
        console.warn(" No videos key found in response");
      }

      const videoList = response.data.videos || [];

      console.log(" Video List Array:", videoList);
      console.log(" Video Count:", videoList.length);

      const formattedRecordings: Recording[] = videoList.map(
        (fileName: string, index: number) => ({
          id: index.toString(),
          fileName,
          filePath: "",
          fileSize: 0,
          duration: 0,
          createdAt: formattedDate,
        })
      );
      console.log(" Final Formatted Recordings:", formattedRecordings);

      setRecordings(formattedRecordings);

    } catch (error: any) {
      console.error(" Fetch Error:", error);
      console.error(" Error Response:", error?.response);
      console.error(" Error Message:", error?.message);

      Alert.alert('Error', 'Failed to fetch recordings.');
    } finally {
      setLoading(false);
      console.log(" fetchRecordings finished");
    }
  };

  useEffect(() => {
    fetchRecordings(selectedDate);
  }, [selectedDate]);

  // const handlePlayVideo = async (fileName: string) => {
  //   try {
  //     const PlayVideo = urls.play_video

  //     const playUrl = `${PlayVideo}?cam=cam0&file=${fileName}`;

  //     console.log(" Calling play_video endpoint:", playUrl);

  //     const response = await axios.get(playUrl);

  //     console.log(" play_video response:", response.data);

  //     const streamPath = response.data.stream_url;

  //     if (!streamPath) {
  //       console.warn(" stream_url missing in response");
  //       return;
  //     }

  //     const finalVideoUrl = `${urls.Base}${streamPath}`;

  //     console.log("Final video URL:", finalVideoUrl);

  //     setSelectedVideo(finalVideoUrl);

  //   } catch (error) {
  //     console.error(" Error getting playable video URL:", error);
  //   }
  // };

  const handlePlayVideo = async (fileName: string) => {
    try {
      const PlayVideo = urls.play_video
      const playUrl = `${PlayVideo}?cam=cam0&file=${fileName}`;
      console.log(" Calling play_video endpoint:", playUrl);
      const response = await axios.get(playUrl);
      console.log(" play_video response:", response.data);
      const streamPath = response.data.stream_url;

      if (!streamPath) {
        console.warn(" stream_url missing in response");
        return;
      }

      const finalVideoUrl = `${urls.Base}${streamPath}`;
      console.log("Final video URL:", finalVideoUrl);

      // Set the video in the inline player instead of fullscreen modal
      setSelectedVideo(finalVideoUrl);
    } catch (error) {
      console.error(" Error getting playable video URL:", error);
    }
  };

  const toggleFullscreen = () => {
    if (selectedVideo) {
      setFullscreenVideo(selectedVideo);
    }
  };
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderRecordingItem = ({ item }: { item: Recording }) => (
    <TouchableOpacity
      style={styles.recordingItem}
      // onPress={() => setSelectedVideo(item.filePath)}
      onPress={() => handlePlayVideo(item.fileName)}
      activeOpacity={0.7}
    >
      <View style={styles.recordingIconContainer}>
        <Ionicons name="videocam" size={24} color="#4CAF50" />
      </View>

      <View style={styles.recordingInfo}>
        <Text style={styles.recordingName} numberOfLines={1}>
          {item.fileName}
        </Text>
        <View style={styles.recordingMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={14} color="#666" />
            <Text style={styles.metaText}>
              {format(new Date(item.createdAt), 'MMM dd, yyyy')}
            </Text>
          </View>
          {/* <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color="#666" />
            <Text style={styles.metaText}>
              {format(new Date(item.createdAt), 'hh:mm a')}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="hourglass-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{formatDuration(item.duration)}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="document-outline" size={14} color="#666" />
            <Text style={styles.metaText}>{formatFileSize(item.fileSize)}</Text>
          </View> */}
        </View>
      </View>

      <View style={styles.playButtonContainer}>
        <Ionicons name="play-circle" size={32} color="#4CAF50" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.cameraName}>{cameraName}</Text>
          <Text style={styles.cameraId}>ID: {cameraId}</Text>
        </View>
      </View>

      {/* Date Selector */}
      <TouchableOpacity
        style={styles.dateSelector}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <Ionicons name="calendar" size={20} color="#4CAF50" />
        <Text style={styles.dateText}>
          {format(selectedDate, 'EEEE, MMMM dd, yyyy')}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#666" />
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      {/* Video Player Section */}
      {selectedVideo && (
        <View style={styles.videoPlayerContainer}>
          <View style={styles.videoHeader}>
            <Text style={styles.videoTitle}>Now Playing</Text>
            <View style={styles.videoHeaderButtons}>
              <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenButton}>
                <Ionicons name="expand" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedVideo(null)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          <Video
            source={{ uri: selectedVideo }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            onError={(error: any) => {
              console.error('Video error:', error);
              setVideoError('Failed to load video. Please try again.');
            }}
          />
          {videoError && (
            <Text style={styles.errorText}>{videoError}</Text>
          )}
        </View>
      )}

      {/* Fullscreen Video Modal - NEW */}
      <Modal
        visible={fullscreenVideo !== null}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={() => setFullscreenVideo(null)}
      >
        <View style={styles.fullscreenContainer}>
          <View style={styles.fullscreenHeader}>
            <Text style={styles.fullscreenTitle}>Now Playing</Text>
            <TouchableOpacity
              onPress={() => setFullscreenVideo(null)}
              hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.fullscreenVideoWrapper}>
            <Video
              source={{ uri: fullscreenVideo || '' }}
              style={styles.fullscreenVideo}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              onError={(error: any) => {
                console.error('Fullscreen video error:', error);
                setVideoError('Failed to load video in fullscreen.');
              }}
            />
          </View>
        </View>
      </Modal>

      {/* Recordings List */}
      <View style={styles.content}>
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>
            {recordings.length} {recordings.length === 1 ? 'Recording' : 'Recordings'} Found
          </Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading recordings...</Text>
          </View>
        ) : recordings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam-off" size={64} color="#ccc" />
            <Text style={styles.emptyTitle}>No Recordings Found</Text>
            <Text style={styles.emptyText}>
              There are no recordings available for {format(selectedDate, 'MMMM dd, yyyy')}
            </Text>
          </View>
        ) : (
          <FlatList
            data={recordings}
            renderItem={renderRecordingItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#fff',
//     padding: 20,
//     paddingTop: 60,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   cameraName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   cameraId: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 4,
//   },
//   dateSelector: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff',
//     margin: 16,
//     padding: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   dateText: {
//     flex: 1,
//     fontSize: 16,
//     color: '#333',
//     marginLeft: 12,
//   },
//   videoPlayerContainer: {
//     backgroundColor: '#000',
//     margin: 16,
//     marginTop: 0,
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   videoHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 12,
//     backgroundColor: '#111',
//   },
//   videoTitle: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   video: {
//     width: '100%',
//     height: 200,
//     backgroundColor: '#000',
//   },
//   content: {
//     flex: 1,
//     paddingHorizontal: 16,
//   },
//   listHeader: {
//     marginBottom: 12,
//   },
//   listTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 16,
//     color: '#666',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingHorizontal: 32,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#333',
//     marginTop: 16,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: '#666',
//     textAlign: 'center',
//     marginTop: 8,
//   },
//   recordingItem: {
//     flexDirection: 'row',
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   recordingIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: '#E8F5E9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12,
//   },
//   recordingInfo: {
//     flex: 1,
//   },
//   recordingName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 8,
//   },
//   recordingMeta: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 12,
//   },
//   metaItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   metaText: {
//     fontSize: 12,
//     color: '#666',
//   },
//   playButtonContainer: {
//     justifyContent: 'center',
//     marginLeft: 8,
//   },
//   errorText: {
//     color: '#ff6b6b',
//     textAlign: 'center',
//     padding: 12,
//     fontSize: 14,
//   },
//   /////////////////////////
//   videoHeaderButtons: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 16,
//   },
//   fullscreenButton: {
//     marginRight: 8,
//   },
//   fullscreenContainer: {
//     flex: 1,
//     backgroundColor: '#000',
//   },
//   fullscreenHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingTop: 60, 
//     paddingBottom: 20,
//     backgroundColor: 'rgba(0,0,0,0.9)', // Semi-transparent background
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     zIndex: 10, // Ensure header stays above video
//   },
//   fullscreenTitle: {
//     color: '#fff',
//     fontSize: 20,
//     fontWeight: '600',
//   },
//   fullscreenVideoWrapper: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#000',
//   },
//   fullscreenVideo: {
//     width: width,
//     height: height,
//   },
// });


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0e1a', // Dark background
  },
  header: {
    backgroundColor: '#131826', // Dark header
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2f3e', // Dark border
  },
  cameraName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // White text
  },
  cameraId: {
    fontSize: 14,
    color: '#9ca3af', // Light gray
    marginTop: 4,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1f2e', // Dark card
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#e5e7eb', // Off-white
    marginLeft: 12,
  },
  videoPlayerContainer: {
    backgroundColor: '#000',
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  videoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#111',
  },
  videoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  video: {
    width: '100%',
    height: 200,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listHeader: {
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff', // White text
  },
  listContent: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#9ca3af', // Light gray
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff', // White text
    marginTop: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9ca3af', // Light gray
    textAlign: 'center',
    marginTop: 8,
  },
  recordingItem: {
    flexDirection: 'row',
    backgroundColor: '#1a1f2e', // Dark card
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#2a2f3e', // Dark border
  },
  recordingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#132a1a', // Dark green tint
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recordingInfo: {
    flex: 1,
  },
  recordingName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff', // White text
    marginBottom: 8,
  },
  recordingMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9ca3af', // Light gray
  },
  playButtonContainer: {
    justifyContent: 'center',
    marginLeft: 8,
  },
  errorText: {
    color: '#EF9A9A', // Light red
    textAlign: 'center',
    padding: 12,
    fontSize: 14,
  },
  /////////////////////////
  videoHeaderButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  fullscreenButton: {
    marginRight: 8,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60, 
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.9)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  fullscreenTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  fullscreenVideoWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  fullscreenVideo: {
    width: width,
    height: height,
  },
});

