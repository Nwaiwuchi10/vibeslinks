import React, { useState, useEffect, useRef } from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { liveStreamService } from '@/services/liveStreamService';
import { socketService } from '@/services/socketService';
import { useAppSelector } from '@/store/hooks';
import { FloatingHeartsOverlay, FloatingHeartRef } from '@/components/stream/FloatingHeartsOverlay';
import { FullscreenGiftAnimation, FullscreenGiftRef } from '@/components/stream/FullscreenGiftAnimation';
import { GiftDrawerModal, VirtualGift } from '@/components/stream/GiftDrawerModal';
import { PkBattleOverlay } from '@/components/stream/PkBattleOverlay';
import { HostToolkitDrawer } from '@/components/stream/HostToolkitDrawer';

const { width, height } = Dimensions.get('window');

interface TopGifter {
    id: string;
    name: string;
    avatarUrl: string;
    totalCoins: number;
    badge: string;
}

export default function LiveDashboardScreen() {
    const { id: streamId } = useLocalSearchParams<{ id?: string }>();
    const authUser = useAppSelector((state) => state.auth.user);
    const [permission, requestPermission] = useCameraPermissions();
    
    // Camera & Controls
    const [facing, setFacing] = useState<'front' | 'back'>('front');
    const [isMuted, setIsMuted] = useState(false);
    const [isMirrored, setIsMirrored] = useState(true);
    const [torchActive, setTorchActive] = useState(false);

    // Modals & Drawers
    const [showEndModal, setShowEndModal] = useState(false);
    const [showGuestRequest, setShowGuestRequest] = useState(false);
    const [showGiftDrawer, setShowGiftDrawer] = useState(false);
    const [showToolkit, setShowToolkit] = useState(false);

    // Guests & Stream Info
    const [pendingGuest, setPendingGuest] = useState<{ id: string; name: string; avatar: string } | null>(null);
    const [activeGuest, setActiveGuest] = useState<{ id: string; name: string; avatar: string } | null>({
        id: 'guest_1',
        name: 'cardoso',
        avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150',
    });
    const [streamDetails, setStreamDetails] = useState<any>(null);
    const [viewerCount, setViewerCount] = useState(42);
    const [totalLikes, setTotalLikes] = useState(1280);

    // Chat
    const [chatMessages, setChatMessages] = useState<Array<{ id: string; username: string; message: string; avatar: string; badge?: string }>>([
        {
            id: '1',
            username: '@claudiocardoso',
            message: 'Who else dey vibing tonight 🔥',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            badge: '👑',
        },
    ]);

    // Top Gifters Leaderboard
    const [topGifters, setTopGifters] = useState<TopGifter[]>([
        { id: '1', name: 'Alex', avatarUrl: 'https://i.pravatar.cc/150?img=11', totalCoins: 500, badge: '🥇' },
        { id: '2', name: 'Sarah', avatarUrl: 'https://i.pravatar.cc/150?img=32', totalCoins: 250, badge: '🥈' },
        { id: '3', name: 'Mike', avatarUrl: 'https://i.pravatar.cc/150?img=53', totalCoins: 100, badge: '🥉' },
    ]);

    // PK Battle State
    const [isPkActive, setIsPkActive] = useState(false);
    const [pkScores, setPkScores] = useState({ host1: 1420, host2: 890 });

    // Reaction Counts
    const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
        love: 12,
        heart: 48,
        angry: 0,
        smile: 91,
        clap: 35,
    });

    // Refs
    const heartsRef = useRef<FloatingHeartRef>(null);
    const fullscreenGiftRef = useRef<FullscreenGiftRef>(null);

    useEffect(() => {
        if (!permission?.granted) {
            requestPermission();
        }
    }, [permission]);

    useEffect(() => {
        if (!streamId) return;

        // Fetch stream details & top gifters
        liveStreamService.getStreamDetails(streamId)
            .then((data: any) => {
                setStreamDetails(data);
                if (data?.viewerCount !== undefined) setViewerCount(data.viewerCount);
            })
            .catch(() => {});

        liveStreamService.getTopGifters(streamId)
            .then((gifters: any) => {
                if (Array.isArray(gifters) && gifters.length > 0) {
                    setTopGifters(gifters);
                }
            })
            .catch(() => {});

        // Connect and join rooms
        socketService.connect();
        socketService.joinRoom(`livestream:${streamId}`);
        if (authUser?.id) {
            socketService.joinRoom(`host:${authUser.id}`);
            socketService.joinRoom(`user:${authUser.id}`);
        }

        // Realtime tap-to-like burst
        socketService.onLikeBurst((data: any) => {
            heartsRef.current?.addBurst(data?.count || 4);
            setTotalLikes((prev) => prev + (data?.count || 1));
        });

        // Realtime gift sent
        socketService.onGiftSent((data: any) => {
            fullscreenGiftRef.current?.triggerGift({
                id: data.id,
                senderName: data.sender?.name || data.sender?.username || 'Viewer',
                senderAvatar: data.sender?.avatarUrl,
                giftName: data.gift?.name || 'Rose',
                giftIcon: data.gift?.icon || '🌹',
                coinAmount: data.gift?.coinAmount || 1,
                count: data.count || 1,
                animationType: data.gift?.animationType || 'float',
            });
            // Also append system message in chat
            setChatMessages((prev) => [
                ...prev.slice(-15),
                {
                    id: `${Date.now()}_gift`,
                    username: `@${data.sender?.username || data.sender?.name || 'Viewer'}`,
                    message: `sent ${data.gift?.name} ${data.gift?.icon} (x${data.count || 1})`,
                    avatar: data.sender?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    badge: '🎁',
                },
            ]);
        });

        // Top gifters update
        socketService.onTopGiftersUpdated((data: any) => {
            if (Array.isArray(data?.topGifters)) {
                setTopGifters(data.topGifters);
            }
        });

        // PK Battle start & score updates
        socketService.onPkBattleStart((data: any) => {
            setIsPkActive(true);
            setPkScores({ host1: data.host1Score || 0, host2: data.host2Score || 0 });
        });

        socketService.onPkBattleScore((data: any) => {
            setPkScores({ host1: data.host1Score, host2: data.host2Score });
        });

        socketService.onPkBattleEnd(() => {
            setIsPkActive(false);
        });

        // Listen for live reactions
        socketService.onLivestreamReaction((data: any) => {
            const emojiType = data?.emoji || data?.type || 'love';
            setReactionCounts((prev) => ({
                ...prev,
                [emojiType]: (prev[emojiType] || 0) + 1,
            }));
            heartsRef.current?.addHeart();
        });

        // Listen for viewer joined
        socketService.onLivestreamViewerJoined((data: any) => {
            setViewerCount((prev) => prev + 1);
            setChatMessages((prev) => [
                ...prev.slice(-15),
                {
                    id: `${Date.now()}_join`,
                    username: `@${data.user?.username || data.user?.name || 'New Viewer'}`,
                    message: 'joined the live stream 👋',
                    avatar: data.user?.profilePictureUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                },
            ]);
        });

        // Listen for chat messages
        socketService.on('chat:message.created', (msg: any) => {
            if (msg?.message) {
                setChatMessages((prev) => [
                    ...prev.slice(-15),
                    {
                        id: `${Date.now()}_${Math.random()}`,
                        username: msg.senderName ? `@${msg.senderName}` : '@viewer',
                        message: msg.message,
                        avatar: msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    },
                ]);
            }
        });

        // Listen for guest requests
        socketService.on('host:dashboard.updated', (data: any) => {
            if (data?.reason === 'live-stream-request' || data?.guest) {
                setPendingGuest({
                    id: data?.guest?.id || 'viewer_req',
                    name: data?.guest?.name || 'Viewer',
                    avatar: data?.guest?.avatar || 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150',
                });
                setShowGuestRequest(true);
            }
        });

        return () => {
            socketService.leaveRoom(`livestream:${streamId}`);
            if (authUser?.id) {
                socketService.leaveRoom(`host:${authUser.id}`);
                socketService.leaveRoom(`user:${authUser.id}`);
            }
            socketService.offLivestreamEvents();
        };
    }, [streamId, authUser]);

    const handleTapScreen = (e: any) => {
        const { locationX, locationY } = e.nativeEvent;
        heartsRef.current?.addHeart(locationX, locationY);
        setTotalLikes((prev) => prev + 1);

        if (streamId) {
            liveStreamService.sendLikeBurst(streamId, 1).catch(() => {});
        }
    };

    const handleHostReact = async (type: 'love' | 'heart' | 'angry' | 'smile' | 'clap') => {
        if (!streamId) return;
        try {
            await liveStreamService.reactToStream(streamId, type as any);
            setReactionCounts((prev) => ({ ...prev, [type]: (prev[type] || 0) + 1 }));
            heartsRef.current?.addHeart();
        } catch {}
    };

    const handleSendGift = async (gift: VirtualGift, count: number) => {
        setShowGiftDrawer(false);
        if (!streamId) return;
        try {
            await liveStreamService.sendGift(streamId, gift.id, count);
        } catch {}
    };

    const handleStartPkBattle = async () => {
        if (!streamId) return;
        try {
            // Initiate PK battle with opponent or bot demo
            await liveStreamService.startPkBattle(streamId, 'opponent_host_1', 180);
            setIsPkActive(true);
        } catch {
            setIsPkActive(true);
        }
    };

    const creatorName = streamDetails?.creator?.name || streamDetails?.creatorName || authUser?.fullName || 'Olivia';
    const creatorAvatar = streamDetails?.creator?.profilePictureUrl || authUser?.profilePictureUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    return (
        <View style={styles.container}>
            {/* Live Camera Video Feed */}
            {permission?.granted ? (
                <CameraView
                    style={StyleSheet.absoluteFillObject}
                    facing={facing}
                    mirror={facing === 'front' && isMirrored}
                    enableTorch={torchActive}
                />
            ) : (
                <Image
                    source={require('../../../assets/images/preview_selfie.jpg')}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                />
            )}

            {/* Tap-to-like screen listener */}
            <TouchableWithoutFeedback onPress={handleTapScreen}>
                <View style={StyleSheet.absoluteFillObject} />
            </TouchableWithoutFeedback>

            {/* Subtle dark gradient overlay */}
            <View style={styles.screenOverlay} pointerEvents="none" />

            {/* Floating Particles Overlay */}
            <FloatingHeartsOverlay ref={heartsRef} />

            {/* Fullscreen Big Gift Animations */}
            <FullscreenGiftAnimation ref={fullscreenGiftRef} />

            {/* Live PK Battle Overlay */}
            <PkBattleOverlay
                visible={isPkActive}
                host1Name={creatorName}
                host1Avatar={creatorAvatar}
                host1Score={pkScores.host1}
                host2Name="cardoso"
                host2Avatar="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150"
                host2Score={pkScores.host2}
                isHost={true}
                onEndBattle={() => setIsPkActive(false)}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} pointerEvents="box-none">
                {/* Top Bar (TikTok Creator Pill + Top 3 Contributors Leaderboard + Power Button) */}
                <View style={styles.topBar}>
                    {/* Creator pill */}
                    <View style={styles.creatorPill}>
                        <Image source={{ uri: creatorAvatar }} style={styles.creatorAvatar} />
                        <View style={styles.creatorMetaCol}>
                            <Text style={styles.creatorName} numberOfLines={1}>{creatorName}</Text>
                            <View style={styles.likesRow}>
                                <Ionicons name="heart" size={11} color="#FF2E93" />
                                <Text style={styles.heartCount}>{totalLikes}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Top 3 Gifters Badges (TikTok Feature) */}
                    <View style={styles.topGiftersRow}>
                        {topGifters.map((gifter) => (
                            <View key={gifter.id} style={styles.gifterBadgeContainer}>
                                <Image source={{ uri: gifter.avatarUrl }} style={styles.gifterAvatar} />
                                <Text style={styles.gifterRankIcon}>{gifter.badge}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Power / End button */}
                    <TouchableOpacity
                        style={styles.powerBtn}
                        activeOpacity={0.8}
                        onPress={() => setShowEndModal(true)}
                    >
                        <Ionicons name="power" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>

                {/* Main Interactive Middle Body */}
                <View style={styles.mainMiddleBody} pointerEvents="box-none">
                    {/* Right Floating Panel (Screenshot 1: Add Guest & Active Guest) */}
                    <View style={styles.rightFloatingPanel}>
                        {/* Add guest button */}
                        <TouchableOpacity
                            style={styles.addGuestCard}
                            activeOpacity={0.85}
                            onPress={() => setShowGuestRequest(true)}
                        >
                            <Ionicons name="add" size={24} color="#FFF" />
                            <Text style={styles.addGuestText}>Add guest</Text>
                        </TouchableOpacity>

                        {/* Active guest video tile */}
                        {activeGuest && (
                            <View style={styles.guestTileCard}>
                                <Image
                                    source={{ uri: activeGuest.avatar }}
                                    style={styles.guestTileImage}
                                />
                                <TouchableOpacity
                                    style={styles.guestTileBadge}
                                    activeOpacity={0.8}
                                    onPress={() => setActiveGuest(null)}
                                >
                                    <Text style={styles.guestTileName}>{activeGuest.name} +</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection} pointerEvents="box-none">
                    {/* Stacked Live Chat Scroll View */}
                    <View style={styles.chatStreamContainer}>
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.chatScrollContent}
                        >
                            {chatMessages.map((msg) => (
                                <View key={msg.id} style={styles.chatBubble}>
                                    <Image source={{ uri: msg.avatar }} style={styles.chatAvatar} />
                                    <View style={styles.chatBody}>
                                        <View style={styles.chatUserRow}>
                                            <Text style={styles.chatUser}>{msg.username}</Text>
                                            {msg.badge && <Text style={styles.chatBadge}>{msg.badge}</Text>}
                                        </View>
                                        <Text style={styles.chatMsg}>{msg.message}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Watching + Reactions row */}
                    <View style={styles.statsRow}>
                        <View style={styles.watchingPill}>
                            <MaterialCommunityIcons name="account-group-outline" size={15} color="#FFF" />
                            <Text style={styles.watchingText}> {viewerCount} Watching</Text>
                        </View>
                        <TouchableOpacity style={styles.reactionItem} onPress={() => handleHostReact('love')}>
                            <Text style={styles.reactionEmoji}>😍</Text>
                            <Text style={styles.reactionCount}>{reactionCounts['love'] || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.reactionItem} onPress={() => handleHostReact('heart')}>
                            <Text style={styles.reactionEmoji}>❤️</Text>
                            <Text style={styles.reactionCount}>{reactionCounts['heart'] || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.reactionItem} onPress={() => handleHostReact('angry')}>
                            <Text style={styles.reactionEmoji}>😤</Text>
                            <Text style={styles.reactionCount}>{reactionCounts['angry'] || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.reactionItem} onPress={() => handleHostReact('smile')}>
                            <Text style={styles.reactionEmoji}>😁</Text>
                            <Text style={styles.reactionCount}>{reactionCounts['smile'] || 0}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.reactionItem} onPress={() => handleHostReact('clap')}>
                            <Text style={styles.reactionEmoji}>👏</Text>
                            <Text style={styles.reactionCount}>{reactionCounts['clap'] || 0}</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bottom Actions Row */}
                    <View style={styles.bottomActions}>
                        {/* Virtual Gift Button */}
                        <TouchableOpacity
                            style={styles.giftIconCircle}
                            activeOpacity={0.8}
                            onPress={() => setShowGiftDrawer(true)}
                        >
                            <Ionicons name="gift" size={20} color="#FFD700" />
                        </TouchableOpacity>

                        {/* Share Button */}
                        <TouchableOpacity style={styles.iconCircle} activeOpacity={0.8}>
                            <Ionicons name="paper-plane-outline" size={20} color="#FFF" />
                        </TouchableOpacity>

                        {/* Host Toolkit Drawer (Settings / Flip / Mic / PK) */}
                        <TouchableOpacity
                            style={styles.iconCircle}
                            activeOpacity={0.8}
                            onPress={() => setShowToolkit(true)}
                        >
                            <MaterialCommunityIcons name="dots-grid" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>

            {/* Host Toolkit Drawer */}
            <HostToolkitDrawer
                visible={showToolkit}
                onClose={() => setShowToolkit(false)}
                onFlipCamera={() => setFacing((prev) => (prev === 'front' ? 'back' : 'front'))}
                onToggleTorch={() => setTorchActive((prev) => !prev)}
                torchActive={torchActive}
                onToggleMic={() => setIsMuted((prev) => !prev)}
                isMuted={isMuted}
                onToggleMirror={() => setIsMirrored((prev) => !prev)}
                isMirrored={isMirrored}
                onStartPkBattle={handleStartPkBattle}
                onOpenGuestManagement={() => setShowGuestRequest(true)}
            />

            {/* Gift Drawer Modal */}
            <GiftDrawerModal
                visible={showGiftDrawer}
                onClose={() => setShowGiftDrawer(false)}
                onSendGift={handleSendGift}
            />

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

            {/* Guest Request Pending Modal (Screenshot 4) */}
            {showGuestRequest && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.guestRequestCard}>
                        {/* Two Avatars with dots */}
                        <View style={styles.guestRequestAvatarsRow}>
                            <Image
                                source={{ uri: creatorAvatar }}
                                style={styles.guestRequestAvatarLeft}
                            />
                            <View style={styles.guestRequestDots}>
                                <View style={styles.dotWhite} />
                                <View style={styles.dotPurple} />
                            </View>
                            <Image
                                source={{ uri: pendingGuest?.avatar || 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' }}
                                style={styles.guestRequestAvatarRight}
                            />
                        </View>

                        {/* Title & Subtitle */}
                        <Text style={styles.guestRequestTitle}>Guest request Pending</Text>
                        <Text style={styles.guestRequestSubtitle}>1 viewer is requesting</Text>

                        {/* Actions */}
                        <View style={styles.guestRequestBtnsRow}>
                            <TouchableOpacity
                                style={styles.guestRequestCancelBtn}
                                activeOpacity={0.8}
                                onPress={() => setShowGuestRequest(false)}
                            >
                                <Text style={styles.guestRequestCancelBtnText}>Cancel request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.guestRequestAcceptBtn}
                                activeOpacity={0.8}
                                onPress={() => {
                                    if (pendingGuest) setActiveGuest(pendingGuest);
                                    setShowGuestRequest(false);
                                }}
                            >
                                <Text style={styles.guestRequestAcceptBtnText}>Accept request</Text>
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
        backgroundColor: '#000',
    },
    screenOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.22)',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 12 : 6,
    },
    creatorPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        borderRadius: 24,
        paddingLeft: 4,
        paddingRight: 12,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    creatorAvatar: {
        width: 34,
        height: 34,
        borderRadius: 17,
    },
    creatorMetaCol: {
        marginLeft: 8,
    },
    creatorName: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    likesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
    },
    heartCount: {
        color: '#FF2E93',
        fontSize: 10,
        fontWeight: '800',
        marginLeft: 2,
    },
    topGiftersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    gifterBadgeContainer: {
        position: 'relative',
    },
    gifterAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#FFD700',
    },
    gifterRankIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        fontSize: 10,
    },
    powerBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    mainMiddleBody: {
        flex: 1,
        justifyContent: 'center',
    },
    rightFloatingPanel: {
        position: 'absolute',
        right: 16,
        top: '25%',
        alignItems: 'center',
        gap: 12,
    },
    addGuestCard: {
        width: 82,
        height: 82,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addGuestText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    guestTileCard: {
        width: 82,
        height: 110,
        borderRadius: 18,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        position: 'relative',
    },
    guestTileImage: {
        width: '100%',
        height: '100%',
    },
    guestTileBadge: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 3,
        alignItems: 'center',
    },
    guestTileName: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    bottomSection: {
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 10 : 16,
    },
    chatStreamContainer: {
        maxHeight: height * 0.24,
        marginBottom: 10,
    },
    chatScrollContent: {
        justifyContent: 'flex-end',
    },
    chatBubble: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 18,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 6,
        alignSelf: 'flex-start',
        maxWidth: '85%',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    chatAvatar: {
        width: 26,
        height: 26,
        borderRadius: 13,
        marginTop: 1,
    },
    chatBody: {
        marginLeft: 8,
    },
    chatUserRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chatUser: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 12,
        fontWeight: '700',
    },
    chatBadge: {
        fontSize: 11,
        marginLeft: 4,
    },
    chatMsg: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
        marginTop: 1,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        gap: 6,
    },
    watchingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderRadius: 14,
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    watchingText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    reactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderRadius: 14,
        paddingHorizontal: 7,
        paddingVertical: 5,
    },
    reactionEmoji: {
        fontSize: 12,
        marginRight: 2,
    },
    reactionCount: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    bottomActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    giftIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 46, 147, 0.35)',
        borderWidth: 1.5,
        borderColor: '#FF2E93',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    endLiveCard: {
        width: width * 0.86,
        backgroundColor: '#1E2026',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    endLiveTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 8,
    },
    endLiveSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    endLiveButtonsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    endLiveBtn: {
        flex: 1,
        backgroundColor: '#EF4444',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    endLiveBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    endLiveCancelBtn: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    endLiveCancelBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    guestRequestCard: {
        width: width * 0.88,
        backgroundColor: '#1E2026',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    guestRequestAvatarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    guestRequestAvatarLeft: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2.5,
        borderColor: '#FFF',
        marginRight: -6,
        zIndex: 2,
    },
    guestRequestDots: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 3,
        paddingHorizontal: 4,
    },
    dotWhite: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFF',
        marginRight: 4,
    },
    dotPurple: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8E2DE2',
    },
    guestRequestAvatarRight: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2.5,
        borderColor: '#FFF',
        marginLeft: -6,
        zIndex: 1,
    },
    guestRequestTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 4,
    },
    guestRequestSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
        marginBottom: 22,
    },
    guestRequestBtnsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    guestRequestCancelBtn: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    guestRequestCancelBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    guestRequestAcceptBtn: {
        flex: 1,
        backgroundColor: '#7C3AED',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    guestRequestAcceptBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
