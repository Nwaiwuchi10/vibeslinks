import React, { useState, useEffect } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { liveStreamService } from '@/services/liveStreamService';
import { socketService } from '@/services/socketService';
import { useAppSelector } from '@/store/hooks';

const { width, height } = Dimensions.get('window');

const CELL_SIZE = (width - 48 - 28) / 3;

const INITIAL_SLOTS = [
    { id: '1', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', filled: true },
    { id: '2', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150', filled: true },
    { id: '3', avatar: null, filled: false },
    { id: '4', avatar: null, filled: false },
    { id: '5', avatar: null, filled: false },
    { id: '6', avatar: null, filled: false },
    { id: '7', avatar: null, filled: false },
    { id: '8', avatar: null, filled: false },
    { id: '9', avatar: null, filled: false },
];

const REACTIONS = [
    { emoji: '😍', label: '0', type: 'love' as const },
    { emoji: '❤️', label: '0', type: 'love' as const },
    { emoji: '😡', label: '0', type: 'like' as const },
    { emoji: '😂', label: '0', type: 'like' as const },
    { emoji: '👏', label: '0', type: 'clap' as const },
];

export default function LiveDashboardScreen() {
    const { id: streamId } = useLocalSearchParams<{ id?: string }>();
    const authUser = useAppSelector((state) => state.auth.user);
    const [showEndModal, setShowEndModal] = useState(false);
    const [showGuestRequest, setShowGuestRequest] = useState(true);
    const [message, setMessage] = useState('');
    const [streamDetails, setStreamDetails] = useState<any>(null);
    const [viewerCount, setViewerCount] = useState(0);
    const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        if (!streamId) return;
        liveStreamService.getStreamDetails(streamId)
            .then((data: any) => {
                setStreamDetails(data);
                setViewerCount(data?.viewerCount || 0);
            })
            .catch(() => {});

        // Join live stream room
        socketService.joinRoom(`livestream:${streamId}`);
        if (authUser?.id) {
            socketService.joinRoom(`host:${authUser.id}`);
        }

        // Listen for reactions
        socketService.onLivestreamReaction((data: any) => {
            console.log('[LiveDashboard] Reaction received:', data);
            const type = data.emoji || data.type;
            if (type) {
                setReactionCounts(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
            }
        });

        // Listen for viewer joined
        socketService.onLivestreamViewerJoined((data: any) => {
            console.log('[LiveDashboard] Viewer joined:', data);
            setViewerCount(prev => prev + 1);
        });

        // Listen for live stream updates
        socketService.onLivestreamUpdated((data: any) => {
            console.log('[LiveDashboard] Stream updated:', data);
            if (data?.viewerCount !== undefined) {
                setViewerCount(data.viewerCount);
            }
        });

        return () => {
            socketService.leaveRoom(`livestream:${streamId}`);
            if (authUser?.id) {
                socketService.leaveRoom(`host:${authUser.id}`);
            }
            socketService.offLivestreamEvents();
        };
    }, [streamId, authUser]);

    const handleReact = async (type: 'love' | 'clap' | 'like' | 'fire') => {
        if (!streamId) return;
        try {
            await liveStreamService.reactToStream(streamId, type);
            setReactionCounts(prev => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
        } catch {}
    };

    const creatorName = streamDetails?.creator?.name || streamDetails?.creatorName || authUser?.fullName || 'You';
    const creatorAvatar = streamDetails?.creator?.profilePictureUrl || authUser?.profilePictureUrl || 'https://i.pravatar.cc/150?img=20';


    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Top Bar */}
                <View style={styles.topBar}>
                    {/* Creator pill */}
                    <View style={styles.creatorPill}>
                        <Image
                            source={{ uri: creatorAvatar }}
                            style={styles.creatorAvatar}
                        />
                        <Text style={styles.creatorName}>{creatorName}</Text>
                        <Ionicons name="heart" size={14} color="#FFF" style={{ marginLeft: 6 }} />
                        <Text style={styles.heartCount}> {reactionCounts['love'] || 0}</Text>
                    </View>

                    {/* Power / End button */}
                    <TouchableOpacity
                        style={styles.powerBtn}
                        onPress={() => setShowEndModal(true)}
                    >
                        <Ionicons name="power" size={22} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Guest Grid */}
                <View style={styles.grid}>
                    {INITIAL_SLOTS.map((slot) => (
                        <TouchableOpacity
                            key={slot.id}
                            style={[styles.gridCell, slot.filled && styles.gridCellFilled]}
                            onPress={() => router.push('/add-guest')}
                            activeOpacity={0.8}
                        >
                            {slot.filled && slot.avatar ? (
                                <Image source={{ uri: slot.avatar }} style={styles.slotAvatar} />
                            ) : (
                                <View style={styles.plusCircle}>
                                    <Ionicons name="add" size={26} color="#888" />
                                </View>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Latest chat bubble */}
                    <View style={styles.chatBubble}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=47' }}
                            style={styles.chatAvatar}
                        />
                        <View style={styles.chatBody}>
                            <Text style={styles.chatUser}>@claudiocardoso</Text>
                            <Text style={styles.chatMsg}>Lovely</Text>
                        </View>
                    </View>

                    {/* Watching + Reactions row */}
                    <View style={styles.statsRow}>
                        <View style={styles.watchingPill}>
                            <MaterialCommunityIcons name="account-group-outline" size={14} color="#FFF" />
                            <Text style={styles.watchingText}> {viewerCount} Watching</Text>
                        </View>
                        {REACTIONS.map((r, i) => (
                            <TouchableOpacity key={i} style={styles.reactionItem} onPress={() => handleReact(r.type)}>
                                <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                                <Text style={styles.reactionCount}>{reactionCounts[r.type] || 0}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Bottom Actions */}
                    <View style={styles.bottomActions}>
                        <TouchableOpacity style={styles.iconCircle}>
                            <Ionicons name="paper-plane-outline" size={22} color="#FFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconCircle} onPress={() => router.push('/block-users')}>
                            <MaterialCommunityIcons name="dots-grid" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* End Live Session Modal */}
            {showEndModal && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.endLiveCard}>
                        <Text style={styles.endLiveTitle}>End Live Session?</Text>
                        <Text style={styles.endLiveSubtitle}>
                            Once ended, viewers will no longer be able to join this session.
                        </Text>
                        <View style={styles.endLiveButtonsRow}>
                            <TouchableOpacity
                                style={styles.endLiveBtn}
                                onPress={() => router.replace({ pathname: '/live-summary', params: streamId ? { id: streamId } : undefined } as any)}
                            >
                                <Text style={styles.endLiveBtnText}>End Live</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.endLiveCancelBtn}
                                onPress={() => setShowEndModal(false)}
                            >
                                <Text style={styles.endLiveCancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* Guest Request Pending Modal */}
            {showGuestRequest && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.guestRequestCard}>
                        {/* Avatars */}
                        <View style={styles.guestRequestAvatarsRow}>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150' }}
                                style={styles.guestRequestAvatarLeft}
                            />
                            <View style={styles.guestRequestDots}>
                                <View style={styles.dotWhite} />
                                <View style={styles.dotPurple} />
                            </View>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' }}
                                style={styles.guestRequestAvatarRight}
                            />
                        </View>

                        {/* Text */}
                        <Text style={styles.guestRequestTitle}>Guest request Pending</Text>
                        <Text style={styles.guestRequestSubtitle}>1 viewer is requesting</Text>

                        {/* Buttons */}
                        <View style={styles.guestRequestButtonsRow}>
                            <TouchableOpacity
                                style={styles.guestRequestCancelBtn}
                                onPress={() => setShowGuestRequest(false)}
                            >
                                <Text style={styles.guestRequestCancelText}>Cancel request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.guestRequestAcceptBtn}
                                onPress={() => setShowGuestRequest(false)}
                            >
                                <Text style={styles.guestRequestAcceptText}>Accept request</Text>
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
        backgroundColor: '#2A2A2A',
    },
    safeArea: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    creatorPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3D3D3D',
        paddingLeft: 6,
        paddingRight: 12,
        paddingVertical: 6,
        borderRadius: 24,
    },
    creatorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    creatorName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    heartCount: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    powerBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#3D3D3D',
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 20,
        gap: 14,
        marginTop: 8,
        flex: 1,
        alignContent: 'flex-start',
    },
    gridCell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        borderRadius: CELL_SIZE / 2,
        backgroundColor: '#3D3D3D',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    gridCellFilled: {
        borderWidth: 3,
        borderColor: '#FFF',
    },
    slotAvatar: {
        width: '100%',
        height: '100%',
    },
    plusCircle: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomSection: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 16 : 20,
        gap: 12,
    },
    chatBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3D3D3D',
        borderRadius: 24,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignSelf: 'flex-start',
        maxWidth: '80%',
        gap: 10,
    },
    chatAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
    },
    chatBody: {},
    chatUser: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    chatMsg: {
        color: '#D1D5DB',
        fontSize: 12,
        fontWeight: '400',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        flexWrap: 'wrap',
    },
    watchingPill: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    watchingText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    reactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    reactionEmoji: {
        fontSize: 14,
    },
    reactionCount: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    bottomActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 4,
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#3D3D3D',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // End Live Modal
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.65)',
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

    // Guest Request Modal
    guestRequestCard: {
        width: width * 0.85,
        backgroundColor: '#555555',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
    },
    guestRequestAvatarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    guestRequestAvatarLeft: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    guestRequestAvatarRight: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    guestRequestDots: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
        gap: 4,
    },
    dotWhite: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFF',
    },
    dotPurple: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8E2DE2',
    },
    guestRequestTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 6,
    },
    guestRequestSubtitle: {
        fontSize: 14,
        color: '#E0E0E0',
        marginBottom: 24,
    },
    guestRequestButtonsRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    guestRequestCancelBtn: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    guestRequestCancelText: {
        color: '#333',
        fontSize: 14,
        fontWeight: '700',
    },
    guestRequestAcceptBtn: {
        flex: 1,
        backgroundColor: '#8E2DE2',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    guestRequestAcceptText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
