import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { liveStreamService } from '@/services/liveStreamService';
import { socketService } from '@/services/socketService';

const { width, height } = Dimensions.get('window');

export default function GoLivePreviewScreen() {
    const { id: streamId } = useLocalSearchParams<{ id?: string }>();
    const [audioMode, setAudioMode] = useState<'voice' | 'camera'>('camera');
    const [facing, setFacing] = useState<CameraType>('front');
    const [permission, requestPermission] = useCameraPermissions();
    const [countdown, setCountdown] = useState<number | null>(null);
    const [starting, setStarting] = useState(false);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    useEffect(() => {
        if (countdown === null) return;

        if (countdown > 1) {
            const timer = setTimeout(() => {
                setCountdown((prev) => (prev !== null ? prev - 1 : null));
            }, 1000);
            return () => clearTimeout(timer);
        }

        if (countdown === 1) {
            const timer = setTimeout(() => {
                setCountdown(null);
                startStreamAndNavigate();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [countdown]);

    const startStreamAndNavigate = async () => {
        try {
            setStarting(true);
            let activeStreamId = streamId;
            if (!activeStreamId) {
                try {
                    const result = await liveStreamService.createStream({
                        title: 'Live Stream',
                        category: 'Music',
                        privacy: 'Public',
                    });
                    activeStreamId =
                        result?.liveStream?.id ||
                        result?.id ||
                        result?.stream?.id ||
                        result?.data?.liveStream?.id;
                } catch {
                    /* fallback proceed */
                }
            }

            // Connect socket and join stream room
            socketService.connect();
            if (activeStreamId) {
                socketService.joinRoom(`livestream:${activeStreamId}`);
                await liveStreamService.startStream(activeStreamId).catch((err) => {
                    console.warn('[GoLivePreviewScreen] startStream warning:', err);
                });
            }
            router.replace({ pathname: '/live-dashboard', params: activeStreamId ? { id: activeStreamId } : undefined });
        } catch (e) {
            console.error('Failed to start stream:', e);
            router.replace('/live-dashboard');
        } finally {
            setStarting(false);
        }
    };

    const handleGoLivePress = () => {
        if (starting || countdown !== null) return;
        setCountdown(3);
    };

    const toggleCameraFlip = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    return (
        <View style={styles.container}>
            {/* Live Camera Video Feed */}
            {permission?.granted ? (
                <CameraView
                    style={styles.cameraBackground}
                    facing={facing}
                    mirror={facing === 'front'}
                />
            ) : (
                <Image
                    source={require('../../../assets/images/preview_selfie.jpg')}
                    style={[styles.cameraBackground, facing === 'back' && { transform: [{ scaleX: -1 }] }]}
                    resizeMode="cover"
                />
            )}

            {/* Subtle dark gradient overlay at bottom */}
            <View style={styles.bottomGradient} pointerEvents="none" />

            {/* Countdown Overlay (Matching Screenshots 3, 4, 5) */}
            {countdown !== null && (
                <View style={styles.countdownOverlay} pointerEvents="none">
                    <View style={styles.countdownCircle}>
                        <Text style={styles.countdownText}>{countdown}</Text>
                    </View>
                </View>
            )}

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Back button */}
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                    disabled={countdown !== null}
                >
                    <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>

                {/* Bottom Controls (Hidden during countdown just like screenshots 3, 4, 5) */}
                {countdown === null && (
                    <View style={styles.bottomControls}>
                        {/* Go LIVE + Flip row */}
                        <View style={styles.actionRow}>
                            <TouchableOpacity
                                style={styles.goLiveBtn}
                                activeOpacity={0.88}
                                onPress={handleGoLivePress}
                                disabled={starting}
                            >
                                {starting ? (
                                    <ActivityIndicator size="small" color="#FFF" />
                                ) : (
                                    <Text style={styles.goLiveBtnText}>Go LIVE</Text>
                                )}
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.flipBtn}
                                activeOpacity={0.8}
                                onPress={toggleCameraFlip}
                            >
                                <Ionicons name="sync" size={22} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Toggle bar */}
                        <View style={styles.toggleBar}>
                            <TouchableOpacity
                                style={styles.toggleItem}
                                activeOpacity={0.8}
                                onPress={() => {
                                    setAudioMode('voice');
                                    router.push({ pathname: '/go-live', params: { mode: 'voice' } });
                                }}
                            >
                                <MaterialCommunityIcons
                                    name="phone-in-talk"
                                    size={16}
                                    color={audioMode === 'voice' ? '#FFF' : 'rgba(255,255,255,0.6)'}
                                />
                                <Text style={[styles.toggleText, audioMode === 'voice' && styles.toggleTextActive]}>
                                    Voice Chart
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.toggleItem}
                                activeOpacity={0.8}
                                onPress={() => setAudioMode('camera')}
                            >
                                <MaterialCommunityIcons
                                    name="camera"
                                    size={16}
                                    color={audioMode === 'camera' ? '#FFF' : 'rgba(255,255,255,0.6)'}
                                />
                                <Text style={[styles.toggleText, audioMode === 'camera' && styles.toggleTextActive]}>
                                    Device Camera
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    cameraBackground: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    bottomGradient: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: height * 0.28,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    countdownOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 50,
    },
    countdownCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    countdownText: {
        color: '#FFF',
        fontSize: 48,
        fontWeight: '800',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    backBtn: {
        marginLeft: 20,
        marginTop: 8,
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 16 : 24,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 12,
    },
    goLiveBtn: {
        flex: 1,
        backgroundColor: '#7C3AED',
        borderRadius: 28,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goLiveBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
    flipBtn: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: 'rgba(255,255,255,0.22)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        gap: 6,
    },
    toggleText: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 13,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#FFF',
    },
});
