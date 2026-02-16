// import { Ionicons } from '@expo/vector-icons';
// import axios from "axios";
// import { useLocalSearchParams, useNavigation } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//     ActivityIndicator,
//     Dimensions,
//     SafeAreaView,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from 'react-native';
// import { LineChart } from 'react-native-chart-kit';
// import urls from '../urls/urls';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');

// // Mock API function - replace with your actual API call
// const fetchSensorHistoricalData = async (sensorId: string, sensorType: string, duration: string = '24h') => {
//     // This is a mock function. Replace with your actual API call
//     console.log(`Fetching data for ${sensorType} sensor ${sensorId} for ${duration}`);

//     // Simulate API delay
//     await new Promise(resolve => setTimeout(resolve, 1000));

//     // Generate mock data based on sensor type
//     const baseValue = sensorType === 'LPG' ? 100 :
//         sensorType === 'Smoke' ? 150 :
//             sensorType === 'Motion_detection' ? 300 : 50;

//     const data = Array.from({ length: 24 }, (_, i) => ({
//         timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
//         value: baseValue + Math.random() * 200 - 100,
//     }));

//     return {
//         sensorId,
//         sensorType,
//         data,
//         unit: sensorType === 'LPG' || sensorType === 'Smoke' ? 'PPM' : 'units',
//         min: Math.min(...data.map(d => d.value)),
//         max: Math.max(...data.map(d => d.value)),
//         avg: data.reduce((sum, d) => sum + d.value, 0) / data.length,
//     };
// };

// export default function SensorGraphScreen() {
//     const navigation = useNavigation();

//     const params = useLocalSearchParams();
//     const sensorId = params.sensorId as string;
//     const sensorType = params.sensorType as string;
//     const deviceId = params.deviceId as string;


//     // const sensorId = params.sensorId as string;
//     // const sensorType = params.sensorType as string;
//     // const deviceId = params.deviceId as string;
//     // const params = useLocalSearchParams();

//     // const sensor = JSON.parse(params.sensor as string);
//     // const sensorType = params.sensorType as string;
//     // const device = JSON.parse(params.device as string);
//     // const liveData = params.liveData ? JSON.parse(params.liveData as string) : null;

//     // const sensorId = params.sensorId as string;
//     // const sensorType = params.sensorType as string;
//     // const deviceId = params.deviceId as string;

//     const [historicalData, setHistoricalData] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d
//     const [error, setError] = useState<string | null>(null);


//     const liveData =
//         typeof params.liveData === "string" && params.liveData.length > 0
//             ? JSON.parse(params.liveData)
//             : null;

//     useEffect(() => {
//         console.log("📈 Sensor Graph Params:");
//         console.log("Sensor ID:", sensorId);
//         console.log("Sensor Type:", sensorType);
//         console.log("Device ID:", deviceId);
//         console.log("Live Data:", liveData);
//     }, []);

//     useEffect(() => {
//         const loadData = async () => {
//             try {
//                 if (!deviceId || !sensorType) {
//                     console.log("⚠️ Missing sensorId or sensorType");
//                     return;
//                 }

//                 console.log("📡 Loading sensor data...");
//                 console.log("device ID:", deviceId);
//                 console.log("Sensor Type:", sensorType);

//                 setLoading(true);

//                 const data = await fetchSensorData(deviceId, sensorType);

//                 console.log("📦 Data received from API:", data);

//                 setHistoricalData(data);

//             } catch (err) {
//                 console.log("❌ Failed to fetch sensor data in useEffect");
//                 setError("Failed to fetch sensor data");
//             } finally {
//                 setLoading(false);
//                 console.log("🏁 Loading finished");
//             }
//         };

//         loadData();
//     }, [deviceId, sensorType]);

//     // const fetchSensorData = async (
//     //     deviceId: string,
//     //     // sensorId: string,
//     //     sensorType: string
//     // ) => {
//     //     try {
//     //         const response = await axios.get(
//     //             `${urls.get_sensor_data}/${deviceId}/?type=${sensorType}`,

//     //         );

//     //         console.log("✅ Raw API Response:", response.data);

//     //         const apiData = response.data;

//     //         const formatted = {

//     //             deviceId,
//     //             sensorType,
//     //             data: (apiData.reading || []).map((item: any) => ({
//     //                 timestamp: item.timestamp,
//     //                 value: item.value
//     //             })),
//     //             unit: sensorType === 'LPG' || sensorType === 'Smoke' ? 'PPM' : 'units',
//     //         };

//     //         return formatted;

//     //     } catch (error: any) {
//     //         console.log("❌ API Error:", error?.response?.data || error.message);
//     //         throw error;
//     //     }
//     // };

//     const fetchSensorData = async (
//         deviceId: string,
//         sensorType: string
//     ) => {
//         try {
//             const response = await axios.get(
//                 `${urls.get_sensor_data}/${deviceId}/?type=${sensorType}`,
//             );

//             console.log("✅ Raw API Response:", response.data);

//             const apiData = response.data;

//             // Convert values to numbers
//             const readings: { timestamp: string; value: number }[] =
//                 (apiData.reading || []).map((item: any) => ({
//                     timestamp: item.timestamp,
//                     value: Number(item.value),
//                 }));

//             const values: number[] = readings.map((r) => r.value);

//             const formatted = {
//                 deviceId,
//                 sensorType,
//                 data: readings,
//                 unit: sensorType === 'LPG' || sensorType === 'Smoke' ? 'PPM' : 'units',
//                 min: values.length ? Math.min(...values) : 0,
//                 max: values.length ? Math.max(...values) : 0,
//                 avg: values.length
//                     ? values.reduce((sum: number, v: number) => sum + v, 0) / values.length
//                     : 0,
//             };

//             console.log("✅ Formatted Data:", formatted);

//             return formatted;

//         } catch (error: any) {
//             console.log("❌ API Error:", error?.response?.data || error.message);
//             throw error;
//         }
//     };



//     useEffect(() => {
//         loadHistoricalData();
//     }, [timeRange]);

//     const loadHistoricalData = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const data = await fetchSensorHistoricalData(sensorId, sensorType, timeRange);
//             setHistoricalData(data);
//         } catch (err) {
//             console.error('Failed to load historical data:', err);
//             setError('Failed to load historical data. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const getSensorTitle = () => {
//         switch (sensorType) {
//             case 'LPG': return 'LPG Gas Sensor';
//             case 'Smoke': return 'Smoke Detector';
//             case 'Motion_detection': return 'Motion Sensor';
//             case 'Human_appearance': return 'Human Detection';
//             // case 'Door_window': return sensor.name === 'Window' ? 'Window Sensor' : 'Door Sensor';
//             default: return 'Sensor';
//         }
//     };

//     const getChartData = () => {
//         if (!historicalData) return null;

//         const labels = historicalData.data.map((d: any, index: number) => {
//             const date = new Date(d.timestamp);
//             if (timeRange === '24h') {
//                 return date.getHours().toString().padStart(2, '0');
//             }
//             return `${date.getDate()}/${date.getMonth() + 1}`;
//         });

//         const values = historicalData.data.map((d: any) => d.value);

//         return {
//             labels: labels.length > 10 ? labels.filter((_: any, i: number) => i % Math.ceil(labels.length / 10) === 0) : labels,
//             datasets: [{
//                 data: values,
//                 color: (opacity = 1) => getSensorColor(sensorType),
//                 strokeWidth: 2,
//             }],
//         };
//     };

//     const getSensorColor = (type: string) => {
//         switch (type) {
//             case 'LPG': return '#F59E0B';
//             case 'Smoke': return '#EF4444';
//             case 'Motion_detection': return '#8B5CF6';
//             case 'Human_appearance': return '#3B82F6';
//             case 'Door_window': return '#8B5CF6';
//             default: return '#4F46E5';
//         }
//     };

//     const chartConfig = {
//         backgroundColor: '#FFFFFF',
//         backgroundGradientFrom: '#FFFFFF',
//         backgroundGradientTo: '#FFFFFF',
//         decimalPlaces: 0,
//         color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
//         labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
//         style: {
//             borderRadius: 16,
//         },
//         propsForDots: {
//             r: '4',
//             strokeWidth: '2',
//             stroke: '#FFFFFF',
//         },
//     };

//     const formatValue = (value?: number) => {
//         if (typeof value !== "number") return `0 ${historicalData?.unit || ''}`;
//         return `${value.toFixed(0)} ${historicalData?.unit || ''}`;
//     };


//     return (
//         <SafeAreaView style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
//                     <Ionicons name="arrow-back" size={24} color="#4F46E5" />
//                 </TouchableOpacity>
//                 <View style={styles.headerTitleContainer}>
//                     <Text style={styles.headerTitle}>{getSensorTitle()}</Text>
//                     <Text style={styles.headerSubtitle}>{sensorType} • {deviceId}</Text>
//                 </View>
//             </View>

//             <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
//                 {/* Current Value Card */}
//                 {/* {liveData && (
//                     <View style={styles.currentValueCard}>
//                         <Text style={styles.currentValueLabel}>Current Value</Text>
//                         <Text style={styles.currentValue}>
//                             {formatValue(liveData.value?.value || 0)}
//                         </Text>
//                         <Text style={styles.lastUpdated}>
//                             Last updated: {liveData.receivedAt || 'N/A'}
//                         </Text>
//                     </View>
//                 )} */}

//                 {/* Time Range Selector */}
//                 <View style={styles.timeRangeContainer}>
//                     {['24h', '7d', '30d'].map((range) => (
//                         <TouchableOpacity
//                             key={range}
//                             style={[
//                                 styles.timeRangeButton,
//                                 timeRange === range && styles.timeRangeButtonActive,
//                             ]}
//                             onPress={() => setTimeRange(range)}
//                         >
//                             <Text
//                                 style={[
//                                     styles.timeRangeText,
//                                     timeRange === range && styles.timeRangeTextActive,
//                                 ]}
//                             >
//                                 {range}
//                             </Text>
//                         </TouchableOpacity>
//                     ))}
//                 </View>

//                 {/* Chart */}
//                 {loading ? (
//                     <View style={styles.loadingContainer}>
//                         <ActivityIndicator size="large" color="#4F46E5" />
//                         <Text style={styles.loadingText}>Loading historical data...</Text>
//                     </View>
//                 ) : error ? (
//                     <View style={styles.errorContainer}>
//                         <Ionicons name="alert-circle" size={48} color="#EF4444" />
//                         <Text style={styles.errorText}>{error}</Text>
//                         <TouchableOpacity style={styles.retryButton} onPress={loadHistoricalData}>
//                             <Text style={styles.retryButtonText}>Retry</Text>
//                         </TouchableOpacity>
//                     </View>
//                 ) : historicalData && getChartData() ? (
//                     <View style={styles.chartContainer}>
//                         <View style={styles.chartHeader}>
//                             <Text style={styles.chartTitle}>Historical Data</Text>
//                             <Text style={styles.chartSubtitle}>
//                                 {timeRange === '24h' ? 'Last 24 Hours' :
//                                     timeRange === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
//                             </Text>
//                         </View>

//                         <LineChart
//                             data={getChartData()!}
//                             width={SCREEN_WIDTH - 40}
//                             height={220}
//                             chartConfig={chartConfig}
//                             bezier
//                             style={styles.chart}
//                             withVerticalLabels={true}
//                             withHorizontalLabels={true}
//                             withInnerLines={true}
//                             withOuterLines={true}
//                             withVerticalLines={false}
//                             withHorizontalLines={true}
//                             fromZero={false}
//                         />

//                         {/* Statistics */}
//                         <View style={styles.statsContainer}>
//                             <View style={styles.statItem}>
//                                 <Text style={styles.statLabel}>Min</Text>
//                                 <Text style={styles.statValue}>{formatValue(historicalData.min)}</Text>
//                             </View>
//                             <View style={styles.statItem}>
//                                 <Text style={styles.statLabel}>Avg</Text>
//                                 <Text style={styles.statValue}>{formatValue(historicalData.avg)}</Text>
//                             </View>
//                             <View style={styles.statItem}>
//                                 <Text style={styles.statLabel}>Max</Text>
//                                 <Text style={styles.statValue}>{formatValue(historicalData.max)}</Text>
//                             </View>
//                         </View>
//                     </View>
//                 ) : null}

//                 {/* Sensor Details */}
//                 <View style={styles.detailsCard}>
//                     <Text style={styles.detailsTitle}>Sensor Details</Text>
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailLabel}>Sensor ID</Text>
//                         {/* <Text style={styles.detailValue}>{sensor.id}</Text> */}
//                     </View>
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailLabel}>Sensor Type</Text>
//                         <Text style={styles.detailValue}>{sensorType}</Text>
//                     </View>
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailLabel}>Device</Text>
//                         {/* <Text style={styles.detailValue}>{device.name}</Text> */}
//                     </View>
//                     <View style={styles.detailItem}>
//                         <Text style={styles.detailLabel}>MAC Address</Text>
//                         {/* <Text style={styles.detailValue}>{device.mac_adress}</Text> */}
//                     </View>
//                 </View>
//             </ScrollView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#F9FAFB',
//     },
//     header: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         padding: 16,
//         backgroundColor: '#FFFFFF',
//         borderBottomWidth: 1,
//         borderBottomColor: '#E5E7EB',
//     },
//     backButton: {
//         marginRight: 16,
//     },
//     headerTitleContainer: {
//         flex: 1,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: '600',
//         color: '#111827',
//     },
//     headerSubtitle: {
//         fontSize: 14,
//         color: '#6B7280',
//         marginTop: 2,
//     },
//     content: {
//         flex: 1,
//         padding: 20,
//     },
//     currentValueCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         padding: 20,
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//         alignItems: 'center',
//     },
//     currentValueLabel: {
//         fontSize: 14,
//         color: '#6B7280',
//         marginBottom: 8,
//     },
//     currentValue: {
//         fontSize: 36,
//         fontWeight: '700',
//         color: '#111827',
//         marginBottom: 8,
//     },
//     lastUpdated: {
//         fontSize: 12,
//         color: '#9CA3AF',
//     },
//     timeRangeContainer: {
//         flexDirection: 'row',
//         backgroundColor: '#F3F4F6',
//         borderRadius: 8,
//         padding: 4,
//         marginBottom: 20,
//     },
//     timeRangeButton: {
//         flex: 1,
//         paddingVertical: 8,
//         alignItems: 'center',
//         borderRadius: 6,
//     },
//     timeRangeButtonActive: {
//         backgroundColor: '#FFFFFF',
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.05,
//         shadowRadius: 2,
//         elevation: 2,
//     },
//     timeRangeText: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#6B7280',
//     },
//     timeRangeTextActive: {
//         color: '#4F46E5',
//     },
//     loadingContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 40,
//     },
//     loadingText: {
//         marginTop: 12,
//         color: '#6B7280',
//     },
//     errorContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         padding: 40,
//     },
//     errorText: {
//         marginTop: 12,
//         marginBottom: 20,
//         color: '#EF4444',
//         textAlign: 'center',
//     },
//     retryButton: {
//         backgroundColor: '#4F46E5',
//         paddingHorizontal: 24,
//         paddingVertical: 10,
//         borderRadius: 8,
//     },
//     retryButtonText: {
//         color: '#FFFFFF',
//         fontWeight: '600',
//     },
//     chartContainer: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         padding: 20,
//         marginBottom: 20,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//     },
//     chartHeader: {
//         marginBottom: 20,
//     },
//     chartTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#111827',
//     },
//     chartSubtitle: {
//         fontSize: 14,
//         color: '#6B7280',
//         marginTop: 4,
//     },
//     chart: {
//         marginVertical: 8,
//         borderRadius: 16,
//     },
//     statsContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 20,
//         paddingTop: 20,
//         borderTopWidth: 1,
//         borderTopColor: '#E5E7EB',
//     },
//     statItem: {
//         alignItems: 'center',
//     },
//     statLabel: {
//         fontSize: 12,
//         color: '#6B7280',
//         marginBottom: 4,
//     },
//     statValue: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: '#111827',
//     },
//     detailsCard: {
//         backgroundColor: '#FFFFFF',
//         borderRadius: 12,
//         padding: 20,
//         borderWidth: 1,
//         borderColor: '#E5E7EB',
//     },
//     detailsTitle: {
//         fontSize: 18,
//         fontWeight: '600',
//         color: '#111827',
//         marginBottom: 16,
//     },
//     detailItem: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingVertical: 12,
//         borderBottomWidth: 1,
//         borderBottomColor: '#F3F4F6',
//     },
//     detailLabel: {
//         fontSize: 14,
//         color: '#6B7280',
//     },
//     detailValue: {
//         fontSize: 14,
//         fontWeight: '500',
//         color: '#111827',
//     },
// });



import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import urls from '../urls/urls';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SensorGraphScreen() {
    const navigation = useNavigation();
    const params = useLocalSearchParams();

    const sensorId = params.sensorId as string;
    const sensorType = params.sensorType as string;
    const deviceId = params.deviceId as string;

    const [historicalData, setHistoricalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('24h');
    const [error, setError] = useState<string | null>(null);

    const liveData =
        typeof params.liveData === "string" && params.liveData.length > 0
            ? JSON.parse(params.liveData)
            : null;

    useEffect(() => {
        console.log("📈 Sensor Graph Params:");
        console.log("Sensor ID:", sensorId);
        console.log("Sensor Type:", sensorType);
        console.log("Device ID:", deviceId);
        console.log("Live Data:", liveData);
    }, []);

    // Fetch data when component mounts OR when timeRange changes
    useEffect(() => {
        fetchSensorData();
    }, [deviceId, sensorType, timeRange]);

    const fetchSensorData = async () => {
        try {
            if (!deviceId || !sensorType) {
                console.log("⚠️ Missing deviceId or sensorType");
                setError("Missing device or sensor information");
                setLoading(false);
                return;
            }

            console.log(`📡 Fetching ${sensorType} data for device ${deviceId} (${timeRange})`);
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `${urls.get_sensor_data}/${deviceId}/?type=${sensorType}`,
            );

            console.log("✅ Raw API Response:", response.data);

            const apiData = response.data;

            // Convert values to numbers and filter based on timeRange if needed
            let readings: { timestamp: string; value: number }[] =
                (apiData.reading || []).map((item: any) => ({
                    timestamp: item.timestamp,
                    value: Number(item.value),
                }));

            // Sort by timestamp (oldest first)
            readings = readings.sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            // Apply time range filtering
            const now = new Date();
            if (timeRange === '24h') {
                const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                readings = readings.filter(r => new Date(r.timestamp) >= cutoff);
            } else if (timeRange === '7d') {
                const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                readings = readings.filter(r => new Date(r.timestamp) >= cutoff);
            } else if (timeRange === '30d') {
                const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                readings = readings.filter(r => new Date(r.timestamp) >= cutoff);
            }

            const values: number[] = readings.map((r) => r.value);

            const formatted = {
                deviceId,
                sensorType,
                data: readings,
                unit: getSensorUnit(sensorType),
                min: values.length ? Math.min(...values) : 0,
                max: values.length ? Math.max(...values) : 0,
                avg: values.length
                    ? values.reduce((sum: number, v: number) => sum + v, 0) / values.length
                    : 0,
            };

            console.log(`✅ Formatted Data: ${readings.length} readings`);
            setHistoricalData(formatted);

        } catch (error: any) {
            console.log("❌ API Error:", error?.response?.data || error.message);
            setError("Failed to load sensor data. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getSensorUnit = (type: string) => {
        switch (type) {
            case 'LPG':
            case 'Smoke':
                return 'PPM';
            case 'Motion_detection':
            case 'Human_appearance':
                return 'units';
            case 'Door_window':
                return '% open';
            default:
                return 'units';
        }
    };

    const getSensorTitle = () => {
        switch (sensorType) {
            case 'LPG': return 'LPG Gas Sensor';
            case 'Smoke': return 'Smoke Detector';
            case 'Motion_detection': return 'Motion Sensor';
            case 'Human_appearance': return 'Human Detection';
            case 'Door_window': return 'Door/Window Sensor';
            default: return 'Sensor';
        }
    };

    const getChartData = () => {
        if (!historicalData || !historicalData.data || historicalData.data.length === 0) {
            return null;
        }

        // Take at most 24 points for better visualization
        const dataPoints = historicalData.data;
        const step = Math.max(1, Math.floor(dataPoints.length / 12));
        const sampledData = dataPoints.filter((_: any, i: number) => i % step === 0);

        const labels = sampledData.map((d: any) => {
            const date = new Date(d.timestamp);
            if (timeRange === '24h') {
                return date.getHours().toString().padStart(2, '0');
            } else if (timeRange === '7d') {
                return `${date.getDate()}/${date.getMonth() + 1}`;
            } else {
                return `${date.getDate()}/${date.getMonth() + 1}`;
            }
        });

        const values = sampledData.map((d: any) => d.value);

        return {
            labels: labels.length > 8 ? labels.filter((_: any, i: number) => i % 2 === 0) : labels,
            datasets: [{
                data: values,
                color: (opacity = 1) => getSensorColor(sensorType),
                strokeWidth: 2,
            }],
        };
    };

    const getSensorColor = (type: string) => {
        switch (type) {
            case 'LPG': return '#F59E0B';
            case 'Smoke': return '#EF4444';
            case 'Motion_detection': return '#8B5CF6';
            case 'Human_appearance': return '#3B82F6';
            case 'Door_window': return '#8B5CF6';
            default: return '#4F46E5';
        }
    };

    const chartConfig = {
        backgroundColor: '#FFFFFF',
        backgroundGradientFrom: '#FFFFFF',
        backgroundGradientTo: '#FFFFFF',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#FFFFFF',
        },
        formatYLabel: (value: string) => {
            const num = parseInt(value);
            return isNaN(num) ? '0' : num.toString();
        },
    };

    const formatValue = (value?: number) => {
        if (typeof value !== "number" || isNaN(value)) return `0 ${historicalData?.unit || ''}`;
        return `${value.toFixed(0)} ${historicalData?.unit || ''}`;
    };

    const hasData = historicalData?.data?.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#4F46E5" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>{getSensorTitle()}</Text>
                    <Text style={styles.headerSubtitle}>
                        {sensorType} • {deviceId?.slice(0, 8)}...
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Current Value Card - Show live data if available */}
                {/* {liveData && (
                    <View style={styles.currentValueCard}>
                        <Text style={styles.currentValueLabel}>Current Value</Text>
                        <Text style={styles.currentValue}>
                            {formatValue(liveData.value?.value)}
                        </Text>
                        <Text style={styles.lastUpdated}>
                            Last updated: {liveData.receivedAt || 'N/A'}
                        </Text>
                    </View>
                )} */}

                {/* Time Range Selector */}
                <View style={styles.timeRangeContainer}>
                    {['24h', '7d', '30d'].map((range) => (
                        <TouchableOpacity
                            key={range}
                            style={[
                                styles.timeRangeButton,
                                timeRange === range && styles.timeRangeButtonActive,
                            ]}
                            onPress={() => setTimeRange(range)}
                        >
                            <Text
                                style={[
                                    styles.timeRangeText,
                                    timeRange === range && styles.timeRangeTextActive,
                                ]}
                            >
                                {range}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Chart */}
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#4F46E5" />
                        <Text style={styles.loadingText}>Loading historical data...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Ionicons name="alert-circle" size={48} color="#EF4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={fetchSensorData}>
                            <Text style={styles.retryButtonText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : !hasData ? (
                    <View style={styles.noDataContainer}>
                        <Ionicons name="analytics-outline" size={48} color="#9CA3AF" />
                        <Text style={styles.noDataText}>No data available for this time range</Text>
                    </View>
                ) : (
                    <View style={styles.chartContainer}>
                        <View style={styles.chartHeader}>
                            <Text style={styles.chartTitle}>Historical Data</Text>
                            <Text style={styles.chartSubtitle}>
                                {historicalData.data.length} readings •
                                {timeRange === '24h' ? ' Last 24 Hours' :
                                    timeRange === '7d' ? ' Last 7 Days' : ' Last 30 Days'}
                            </Text>
                        </View>

                        {getChartData() && (
                            <LineChart
                                data={getChartData()!}
                                width={SCREEN_WIDTH - 40}
                                height={220}
                                chartConfig={chartConfig}
                                bezier
                                style={styles.chart}
                                withVerticalLabels={true}
                                withHorizontalLabels={true}
                                withInnerLines={true}
                                withOuterLines={true}
                                withVerticalLines={false}
                                withHorizontalLines={true}
                                fromZero={false}
                                segments={4}
                            />
                        )}

                        {/* Statistics */}
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Min</Text>
                                <Text style={styles.statValue}>{formatValue(historicalData.min)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Avg</Text>
                                <Text style={styles.statValue}>{formatValue(historicalData.avg)}</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statLabel}>Max</Text>
                                <Text style={styles.statValue}>{formatValue(historicalData.max)}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Sensor Details */}
                <View style={styles.detailsCard}>
                    <Text style={styles.detailsTitle}>Sensor Details</Text>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Sensor ID</Text>
                        <Text style={styles.detailValue}>{sensorId || 'N/A'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Sensor Type</Text>
                        <Text style={styles.detailValue}>{sensorType}</Text>
                    </View>
                    <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>Device ID</Text>
                        <Text style={styles.detailValue}>{deviceId || 'N/A'}</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    // header: {
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //     padding: 16,
    //     backgroundColor: '#FFFFFF',
    //     borderBottomWidth: 1,
    //     borderBottomColor: '#E5E7EB',
    // },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: 60, 
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 2,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    currentValueCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
    },
    currentValueLabel: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    currentValue: {
        fontSize: 36,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    lastUpdated: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    timeRangeContainer: {
        flexDirection: 'row',
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        padding: 4,
        marginBottom: 20,
    },
    timeRangeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    timeRangeButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    timeRangeText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    timeRangeTextActive: {
        color: '#4F46E5',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 12,
        color: '#6B7280',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    errorText: {
        marginTop: 12,
        marginBottom: 20,
        color: '#EF4444',
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#4F46E5',
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    noDataContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    noDataText: {
        marginTop: 12,
        color: '#6B7280',
        textAlign: 'center',
    },
    chartContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    chartHeader: {
        marginBottom: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    chartSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    detailsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    detailsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#111827',
    },
});