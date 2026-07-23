import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
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
import { liveStreamService } from '@/services/liveStreamService';

const { width, height } = Dimensions.get('window');

export default function GoLivePreviewScreen() {
    const { id: streamId } = useLocalSearchParams<{ id?: string }>();
    const [showEndLiveModal, setShowEndLiveModal] = useState(false);
    const [audioMode, setAudioMode] = useState<'voice' | 'camera'>('camera');
    const [starting, setStarting] = useState(false);

    const handleStartLive = async () => {
        if (!streamId) return;
        try {
            setStarting(true);
            await liveStreamService.startStream(streamId);
            router.replace({ pathname: '/live-dashboard', params: { id: streamId } });
        } catch (e) {
            console.error('Failed to start stream:', e);
        } finally {
            setStarting(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Simulated Camera Preview Background */}
            <Image
                source={require('../../../assets/images/preview_selfie.jpg')}
                style={styles.cameraBackground}
                resizeMode="cover"
            />

            {/* Dark overlay at bottom */}
            <View style={styles.bottomGradient} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Back button */}
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#FFF" />
                </TouchableOpacity>

                {/* Bottom Controls */}
                <View style={styles.bottomControls}>
                    {/* Go LIVE + Flip row */}
                    <View style={styles.actionRow}>
                        <TouchableOpacity
                            style={styles.goLiveBtn}
                            activeOpacity={0.85}
                            onPress={handleStartLive}
                            disabled={starting}
                        >
                            {starting ? (
                                <ActivityIndicator size="small" color="#FFF" />
                            ) : (
                                <Text style={styles.goLiveBtnText}>Go LIVE</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.flipBtn}>
                            <Ionicons name="sync" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Toggle bar */}
                    <View style={styles.toggleBar}>
                        <TouchableOpacity
                            style={styles.toggleItem}
                            onPress={() => {
                                setAudioMode('voice');
                                router.push({ pathname: '/go-live', params: { mode: 'voice' } });
                            }}
                        >
                            <MaterialCommunityIcons
                                name="phone-in-talk"
                                size={16}
                                color={audioMode === 'voice' ? '#FFF' : 'rgba(255,255,255,0.5)'}
                            />
                            <Text style={[styles.toggleText, audioMode === 'voice' && styles.toggleTextActive]}>
                                Voice Chart
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.toggleItem}
                            onPress={() => setAudioMode('camera')}
                        >
                            <MaterialCommunityIcons
                                name="camera"
                                size={16}
                                color={audioMode === 'camera' ? '#FFF' : 'rgba(255,255,255,0.5)'}
                            />
                            <Text style={[styles.toggleText, audioMode === 'camera' && styles.toggleTextActive]}>
                                Device Camera
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* End Live Session Modal */}
            {showEndLiveModal && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.endLiveCard}>
                        <Text style={styles.endLiveTitle}>End Live Session?</Text>
                        <Text style={styles.endLiveSubtitle}>
                            Once ended, viewers will no longer be able to join this session.
                        </Text>
                        <View style={styles.endLiveButtonsRow}>
                            <TouchableOpacity
                                style={styles.endLiveBtn}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.endLiveBtnText}>End Live</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.endLiveCancelBtn}
                                onPress={() => setShowEndLiveModal(false)}
                            >
                                <Text style={styles.endLiveCancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#111',
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
        height: height * 0.25,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    backBtn: {
        marginLeft: 20,
        marginTop: 12,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 16 : 20,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        gap: 16,
    },
    goLiveBtn: {
        flex: 1,
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#8E2DE2',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.5,
                shadowRadius: 14,
            },
            android: { elevation: 10 },
        }),
    },
    goLiveBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    flipBtn: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    toggleItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 8,
        gap: 6,
    },
    toggleDivider: {
        width: 1,
        height: 16,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    toggleText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 13,
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#FFF',
    },

    // End Live Modal
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    endLiveCard: {
        width: width * 0.88,
        backgroundColor: '#374151',
        borderRadius: 28,
        padding: 28,
        alignItems: 'center',
    },
    endLiveTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 12,
        textAlign: 'center',
    },
    endLiveSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 28,
        paddingHorizontal: 8,
    },
    endLiveButtonsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    endLiveBtn: {
        flex: 1,
        backgroundColor: '#E9174B',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
    },
    endLiveBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    endLiveCancelBtn: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 20,
        paddingVertical: 18,
        alignItems: 'center',
    },
    endLiveCancelBtnText: {
        color: '#111827',
        fontSize: 16,
        fontWeight: '700',
    },
});
