import React, { useState, useRef, useEffect } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { liveStreamService } from '@/services/liveStreamService';
import { socketService } from '@/services/socketService';
import { useAppSelector } from '@/store/hooks';
import { FloatingHeartsOverlay, FloatingHeartRef } from '@/components/stream/FloatingHeartsOverlay';
import { FullscreenGiftAnimation, FullscreenGiftRef } from '@/components/stream/FullscreenGiftAnimation';
import { GiftDrawerModal, VirtualGift } from '@/components/stream/GiftDrawerModal';
import { PkBattleOverlay } from '@/components/stream/PkBattleOverlay';

const { width, height } = Dimensions.get('window');

interface ChatMessage {
    id: string;
    avatar: string;
    username: string;
    message: string;
    reaction?: string;
    badge?: string;
}

interface TopGifter {
    id: string;
    name: string;
    avatarUrl: string;
    totalCoins: number;
    badge: string;
}

export default function LiveDetails() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const authUser = useAppSelector((state) => state.auth.user);
    
    // Flow States: 'TICKET_MODAL' -> 'PAYMENT_SHEET' -> 'LIVE_STREAM'
    const [flowState, setFlowState] = useState<'TICKET_MODAL' | 'PAYMENT_SHEET' | 'LIVE_STREAM'>('LIVE_STREAM');
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'wallet'>('wallet');
    const [isFollowing, setIsFollowing] = useState(false);
    const [showRequestSentModal, setShowRequestSentModal] = useState(false);
    const [showGiftDrawer, setShowGiftDrawer] = useState(false);
    const [hasGuestStream, setHasGuestStream] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [streamDetails, setStreamDetails] = useState<any>(null);
    const [viewerCount, setViewerCount] = useState(41900);
    const [totalLikes, setTotalLikes] = useState(12400);
    const [userCoins, setUserCoins] = useState(1450);

    // Pinned Message
    const [pinnedMessage, setPinnedMessage] = useState<string | null>('🔥 Welcome to the live stream! Tap to like & support!');

    // Top Gifters Leaderboard
    const [topGifters, setTopGifters] = useState<TopGifter[]>([
        { id: '1', name: 'Roland', avatarUrl: 'https://i.pravatar.cc/150?img=11', totalCoins: 1200, badge: '🥇' },
        { id: '2', name: 'Elena', avatarUrl: 'https://i.pravatar.cc/150?img=32', totalCoins: 850, badge: '🥈' },
        { id: '3', name: 'David', avatarUrl: 'https://i.pravatar.cc/150?img=53', totalCoins: 400, badge: '🥉' },
    ]);

    // PK Battle State
    const [isPkActive, setIsPkActive] = useState(false);
    const [pkScores, setPkScores] = useState({ host1: 1420, host2: 890 });

    const [reactionCounts, setReactionCounts] = useState<Record<string, number>>({
        heart: 12000,
        smile: 91000,
        angry: 15000,
        star: 37000,
        clap: 3000,
    });

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            username: '@claudiocardoso',
            message: 'send reaction',
            reaction: '😁',
        },
        {
            id: '2',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            username: '@claudiocardoso',
            message: 'Lovely',
        },
        {
            id: '3',
            avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
            username: '@claudiocardoso',
            message: 'Who else dey vibing tonight',
        },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const chatScrollViewRef = useRef<ScrollView>(null);

    // Animation Refs
    const heartsRef = useRef<FloatingHeartRef>(null);
    const fullscreenGiftRef = useRef<FullscreenGiftRef>(null);

    useEffect(() => {
        if (!id) return;
        
        // Step 1: Load stream details & top contributors
        liveStreamService.getStreamDetails(id)
            .then((data: any) => {
                setStreamDetails(data);
                if (data?.viewerCount !== undefined) setViewerCount(data.viewerCount);
                if (data?.ticketPrice > 0 && !data.hasAccess) {
                    setFlowState('TICKET_MODAL');
                } else {
                    setFlowState('LIVE_STREAM');
                }
            })
            .catch(() => {})
            .finally(() => setLoadingDetails(false));

        liveStreamService.getTopGifters(id)
            .then((gifters: any) => {
                if (Array.isArray(gifters) && gifters.length > 0) {
                    setTopGifters(gifters);
                }
            })
            .catch(() => {});

        // Step 2: Connect socket and join rooms
        socketService.connect();
        socketService.joinRoom(`livestream:${id}`);

        // Step 3: Realtime Listeners
        socketService.onLikeBurst((data: any) => {
            heartsRef.current?.addBurst(data?.count || 4);
            setTotalLikes((prev) => prev + (data?.count || 1));
        });

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
            // Append to chat
            setChatMessages((prev) => [
                ...prev.slice(-20),
                {
                    id: `${Date.now()}_gift`,
                    avatar: data.sender?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    username: `@${data.sender?.username || data.sender?.name || 'Viewer'}`,
                    message: `sent ${data.gift?.name} ${data.gift?.icon} (x${data.count || 1})`,
                    badge: '🎁',
                },
            ]);
        });

        socketService.onTopGiftersUpdated((data: any) => {
            if (Array.isArray(data?.topGifters)) {
                setTopGifters(data.topGifters);
            }
        });

        socketService.onChatPin((data: any) => {
            if (data?.message) setPinnedMessage(data.message);
        });

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

        socketService.onLivestreamViewerJoined((data: any) => {
            setViewerCount((prev) => prev + 1);
            setChatMessages((prev) => [
                ...prev.slice(-20),
                {
                    id: `${Date.now()}_join`,
                    avatar: data.user?.profilePictureUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                    username: `@${data.user?.username || data.user?.name || 'Viewer'}`,
                    message: 'joined the live stream 👋',
                },
            ]);
        });

        socketService.onLiveStreamMessage((msg: any) => {
            const parsedMsg: ChatMessage = {
                id: msg.id || String(Math.random()),
                avatar: msg.senderAvatar || msg.avatar || `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 50)}`,
                username: msg.senderName || msg.username || 'Viewer',
                message: msg.message,
            };
            setChatMessages((prev) => [...prev.slice(-20), parsedMsg]);
            setTimeout(() => chatScrollViewRef.current?.scrollToEnd({ animated: true }), 100);
        });

        return () => {
            socketService.leaveRoom(`livestream:${id}`);
            socketService.offLivestreamEvents();
        };
    }, [id]);

    const handleTapScreen = (e: any) => {
        const { locationX, locationY } = e.nativeEvent;
        heartsRef.current?.addHeart(locationX, locationY);
        setTotalLikes((prev) => prev + 1);

        if (id) {
            liveStreamService.sendLikeBurst(id, 1).catch(() => {});
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !id) return;
        socketService.sendLiveStreamMessage(id, newMessage);

        const localMsg: ChatMessage = {
            id: Date.now().toString(),
            avatar: authUser?.profilePictureUrl || 'https://i.pravatar.cc/150?img=33',
            username: authUser?.fullName ? `@${authUser.fullName}` : '@you',
            message: newMessage,
        };
        setChatMessages((prev) => [...prev.slice(-20), localMsg]);
        setNewMessage('');
        setTimeout(() => {
            chatScrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleReaction = (emoji: 'love' | 'clap' | 'like' | 'fire') => {
        if (!id) return;
        socketService.sendLiveStreamReaction(id, emoji);

        const mappedKey = emoji === 'love' ? 'heart' : emoji === 'like' ? 'smile' : emoji;
        setReactionCounts((prev) => ({
            ...prev,
            [mappedKey]: (prev[mappedKey] || 0) + 1,
        }));
        heartsRef.current?.addHeart();
    };

    const handleSendGift = async (gift: VirtualGift, count: number) => {
        setShowGiftDrawer(false);
        if (!id) return;
        try {
            setUserCoins((prev) => Math.max(0, prev - gift.coinAmount * count));
            await liveStreamService.sendGift(id, gift.id, count);
        } catch {}
    };

    const handleBuyAccess = async () => {
        if (!id) return;
        setLoadingDetails(true);
        try {
            await liveStreamService.checkAccess(id, paymentMethod);
            setFlowState('LIVE_STREAM');
            Alert.alert('Access Granted', 'You now have access to this stream.');
        } catch (err: any) {
            Alert.alert('Payment Failed', err.response?.data?.message || 'Failed to complete transaction.');
        } finally {
            setLoadingDetails(false);
        }
    };

    const hostName = streamDetails?.creator?.name || streamDetails?.creatorName || 'Olivia';
    const hostAvatar = streamDetails?.creator?.profilePictureUrl || streamDetails?.creatorAvatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

    return (
        <View style={styles.container}>
            {/* Background Stream Image */}
            <ImageBackground
                source={require('../../assets/images/artist_event.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Tap anywhere on stream for floating hearts */}
                <TouchableWithoutFeedback onPress={handleTapScreen}>
                    <View style={StyleSheet.absoluteFillObject} />
                </TouchableWithoutFeedback>

                {/* Overlay layer for immersive look */}
                <View style={styles.darkOverlay} pointerEvents="none" />

                {/* Floating Hearts Particle Overlay */}
                <FloatingHeartsOverlay ref={heartsRef} />

                {/* Fullscreen Gift Splash Animation */}
                <FullscreenGiftAnimation ref={fullscreenGiftRef} />

                {/* Live PK Battle Overlay */}
                <PkBattleOverlay
                    visible={isPkActive}
                    host1Name={hostName}
                    host1Avatar={hostAvatar}
                    host1Score={pkScores.host1}
                    host2Name="cardoso"
                    host2Avatar="https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150"
                    host2Score={pkScores.host2}
                    isHost={false}
                    onSendBoost={() => setShowGiftDrawer(true)}
                />

                <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} pointerEvents="box-none">
                    {/* Header Bar */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.headerCircleBtn} onPress={() => router.back()} activeOpacity={0.8}>
                            <Ionicons name="arrow-back" size={20} color="#FFF" />
                        </TouchableOpacity>

                        {/* Creator Pill */}
                        <View style={styles.creatorPill}>
                            <Image source={{ uri: hostAvatar }} style={styles.creatorAvatar} />
                            <View style={styles.creatorInfo}>
                                <Text style={styles.creatorName} numberOfLines={1}>{hostName}</Text>
                                <View style={styles.creatorLikesRow}>
                                    <Ionicons name="heart" size={11} color="#FF2E93" />
                                    <Text style={styles.creatorLikesText}> {totalLikes}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                                activeOpacity={0.8}
                                onPress={() => setIsFollowing(!isFollowing)}
                            >
                                <Text style={styles.followBtnText}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Top 3 Gifters Leaderboard */}
                        <View style={styles.topGiftersRow}>
                            {topGifters.map((gifter) => (
                                <View key={gifter.id} style={styles.gifterBadgeContainer}>
                                    <Image source={{ uri: gifter.avatarUrl }} style={styles.gifterAvatar} />
                                    <Text style={styles.gifterRankIcon}>{gifter.badge}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Right header actions */}
                        <View style={styles.headerRightGroup}>
                            <TouchableOpacity style={styles.headerCircleBtn} onPress={() => router.push('/live-creators' as any)} activeOpacity={0.8}>
                                <MaterialCommunityIcons name="dots-grid" size={20} color="#FFF" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.headerCircleBtn} onPress={() => router.back()} activeOpacity={0.8}>
                                <Ionicons name="chevron-down" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* LIVE STREAM MAIN VIEW */}
                    {flowState === 'LIVE_STREAM' && (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.liveFlexContainer}
                            pointerEvents="box-none"
                        >
                            <View style={styles.streamBody} pointerEvents="box-none">
                                {/* Left Side - Comments overlay */}
                                <View style={styles.leftChatArea} pointerEvents="box-none">
                                    {/* Pinned Message */}
                                    {pinnedMessage && (
                                        <View style={styles.pinnedBanner}>
                                            <Ionicons name="pin" size={12} color="#FFD700" style={{ marginRight: 4 }} />
                                            <Text style={styles.pinnedText} numberOfLines={2}>{pinnedMessage}</Text>
                                        </View>
                                    )}

                                    <ScrollView
                                        ref={chatScrollViewRef}
                                        showsVerticalScrollIndicator={false}
                                        style={styles.chatScrollView}
                                        contentContainerStyle={styles.chatScrollContent}
                                    >
                                        {chatMessages.map((msg) => (
                                            <View key={msg.id} style={styles.chatBubble}>
                                                <Image source={{ uri: msg.avatar }} style={styles.chatAvatar} />
                                                <View style={styles.chatTextContainer}>
                                                    <View style={styles.chatUserRow}>
                                                        <Text style={styles.chatUser}>{msg.username}</Text>
                                                        {msg.badge && <Text style={styles.chatBadge}>{msg.badge}</Text>}
                                                    </View>
                                                    <View style={styles.chatMessageRow}>
                                                        <Text style={styles.chatMessageText}>{msg.message}</Text>
                                                        {msg.reaction && (
                                                            <Text style={styles.chatReactionText}>{msg.reaction}</Text>
                                                        )}
                                                    </View>
                                                </View>
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>

                                {/* Right Panel - Request & Guest Streams */}
                                <View style={styles.rightPanel} pointerEvents="box-none">
                                    {/* Expand Button */}
                                    <TouchableOpacity
                                        style={styles.expandButtonCircle}
                                        activeOpacity={0.8}
                                        onPress={() => setIsFullscreen(true)}
                                    >
                                        <Ionicons name="expand-outline" size={20} color="#FFF" />
                                    </TouchableOpacity>

                                    {/* Request card */}
                                    <TouchableOpacity
                                        style={styles.requestCard}
                                        activeOpacity={0.85}
                                        onPress={() => {
                                            if (id) {
                                                liveStreamService.requestWatchAccess(id, 'I want to join as co-host').catch(() => {});
                                            }
                                            setShowRequestSentModal(true);
                                        }}
                                    >
                                        <Ionicons name="add" size={24} color="#FFF" />
                                        <Text style={styles.requestText}>Request</Text>
                                    </TouchableOpacity>

                                    {/* Guest video tile */}
                                    {hasGuestStream && (
                                        <View style={styles.guestCard}>
                                            <Image
                                                source={{ uri: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' }}
                                                style={styles.guestBg}
                                            />
                                            <View style={styles.guestPlusBadge}>
                                                <Text style={styles.guestNameText}>cardoso +</Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Bottom stats and interactive reactions */}
                            <View style={styles.statsAndReactionsRow} pointerEvents="box-none">
                                <View style={styles.watchingBadge}>
                                    <MaterialCommunityIcons name="account-group-outline" size={14} color="#FFF" style={{ marginRight: 4 }} />
                                    <Text style={styles.watchingText}>{(viewerCount / 1000).toFixed(1)}K Watching</Text>
                                </View>
 
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reactionsScrollView}>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('like')}>
                                        <Text style={styles.reactionText}>😍 37k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('love')}>
                                        <Text style={styles.reactionText}>❤️ 12k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('angry' as any)}>
                                        <Text style={styles.reactionText}>😤 15k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('fire')}>
                                        <Text style={styles.reactionText}>😁 91k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('clap')}>
                                        <Text style={styles.reactionText}>👏 3k</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>

                            {/* Bottom Input & Gift Launcher Bar */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.messageInput}
                                    placeholder="Send message..."
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    onSubmitEditing={handleSendMessage}
                                />
                                {/* Gift Drawer Launcher */}
                                <TouchableOpacity
                                    style={styles.giftIconBtn}
                                    activeOpacity={0.8}
                                    onPress={() => setShowGiftDrawer(true)}
                                >
                                    <Ionicons name="gift" size={24} color="#FFD700" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.inputPlainButton} onPress={() => handleReaction('love')} activeOpacity={0.8}>
                                    <Ionicons name="heart-outline" size={24} color="#FFF" />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.inputPlainButton} onPress={handleSendMessage} activeOpacity={0.8}>
                                    <Ionicons name="paper-plane-outline" size={22} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                </SafeAreaView>
            </ImageBackground>

            {/* Gift Drawer Modal */}
            <GiftDrawerModal
                visible={showGiftDrawer}
                userCoins={userCoins}
                onClose={() => setShowGiftDrawer(false)}
                onSendGift={handleSendGift}
            />

            {/* FULLSCREEN mode overlay */}
            {isFullscreen && (
                <View style={styles.fullscreenOverlay}>
                    <ImageBackground
                        source={require('../../assets/images/artist_event.png')}
                        style={styles.fullscreenImage}
                        resizeMode="cover"
                    >
                        <SafeAreaView style={styles.fullscreenSafeArea} edges={['top', 'bottom']}>
                            <TouchableOpacity
                                style={styles.collapseBtn}
                                onPress={() => setIsFullscreen(false)}
                            >
                                <Ionicons name="contract" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </SafeAreaView>
                    </ImageBackground>
                </View>
            )}

            {/* FLOW STATE 1: Ticket Available Modal */}
            {flowState === 'TICKET_MODAL' && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.ticketCard}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setFlowState('LIVE_STREAM')}>
                            <Ionicons name="close" size={20} color="#333" />
                        </TouchableOpacity>

                        <View style={styles.ticketIconContainer}>
                            <MaterialCommunityIcons name="ticket-confirmation" size={32} color="#8E2DE2" />
                        </View>

                        <Text style={styles.ticketTitle}>Ticket Available</Text>
                        <Text style={styles.ticketSubtitle}>
                            You need to buy access to this event before you can watch live
                        </Text>

                        <TouchableOpacity style={styles.buyAccessBtn} onPress={() => setFlowState('PAYMENT_SHEET')}>
                            <Text style={styles.buyAccessBtnText}>Buy Access (₦180,000)</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* FLOW STATE 2: Payment Sheet Modal */}
            {flowState === 'PAYMENT_SHEET' && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.paymentSheet}>
                        <TouchableOpacity style={styles.closeModalBtn} onPress={() => setFlowState('TICKET_MODAL')}>
                            <Ionicons name="close" size={20} color="#333" />
                        </TouchableOpacity>

                        <Text style={styles.paymentAmount}>₦186,000</Text>

                        <View style={styles.priceBreakdown}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Access</Text>
                                <Text style={styles.priceValue}>₦180,000</Text>
                            </View>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Fees</Text>
                                <Text style={styles.priceValue}>$3.5</Text>
                            </View>
                            <View style={[styles.priceRow, styles.priceRowTotal]}>
                                <Text style={styles.priceLabelTotal}>Total</Text>
                                <Text style={styles.priceValueTotal}>₦186,000</Text>
                            </View>
                        </View>

                        <View style={styles.paymentHeadingRow}>
                            <Text style={styles.paymentHeading}>Payment Method</Text>
                            <Ionicons name="chevron-forward" size={14} color="#8E2DE2" />
                        </View>
                        <TouchableOpacity
                            style={styles.paymentMethodOption}
                            onPress={() => setPaymentMethod('stripe')}
                        >
                            <Text style={styles.paymentOptionLabel}>Debit Card (Stripe)</Text>
                            <View style={styles.radioOuter}>
                                {paymentMethod === 'stripe' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.paymentMethodOption}
                            onPress={() => setPaymentMethod('wallet')}
                        >
                            <Text style={styles.paymentOptionLabel}>VibezLink Wallet</Text>
                            <View style={styles.radioOuter}>
                                {paymentMethod === 'wallet' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.payBtn} onPress={handleBuyAccess}>
                            <Text style={styles.payBtnText}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Guest Request Sent Modal (Screenshot 5) */}
            {showRequestSentModal && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.guestRequestCard}>
                        {/* Two Avatars with dots */}
                        <View style={styles.guestAvatarsRow}>
                            <Image
                                source={{ uri: authUser?.profilePictureUrl || 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' }}
                                style={styles.guestAvatarLeft}
                            />
                            <View style={styles.guestDotContainer}>
                                <View style={styles.guestDotSmall} />
                                <View style={styles.guestDotPurple} />
                            </View>
                            <Image
                                source={{ uri: hostAvatar }}
                                style={styles.guestAvatarRight}
                            />
                        </View>

                        <Text style={styles.guestRequestTitle}>Guest request sent</Text>
                        <Text style={styles.guestRequestSubtitle}>1 viewer is requesting</Text>

                        <TouchableOpacity
                            style={styles.cancelRequestBtnFull}
                            activeOpacity={0.85}
                            onPress={() => {
                                if (id) {
                                    liveStreamService.cancelWatchRequest(id).catch(() => {});
                                }
                                setShowRequestSentModal(false);
                            }}
                        >
                            <Text style={styles.cancelRequestBtnText}>Cancel request</Text>
                        </TouchableOpacity>
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
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fullscreenOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 500,
        backgroundColor: '#000',
    },
    fullscreenImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    fullscreenSafeArea: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        padding: 20,
    },
    collapseBtn: {
        width: 42,
        height: 42,
        borderRadius: 8,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.18)',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    headerCircleBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creatorPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        paddingLeft: 4,
        paddingRight: 6,
        paddingVertical: 4,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    creatorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    creatorInfo: {
        marginLeft: 8,
        marginRight: 10,
    },
    creatorName: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    creatorLikesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
    },
    creatorLikesText: {
        color: '#FF2E93',
        fontSize: 10,
        marginLeft: 2,
        fontWeight: '800',
    },
    followBtn: {
        backgroundColor: '#8E2DE2',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    followingBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    followBtnText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    topGiftersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    gifterBadgeContainer: {
        position: 'relative',
    },
    gifterAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#FFD700',
    },
    gifterRankIcon: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        fontSize: 9,
    },
    headerRightGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveFlexContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    streamBody: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    leftChatArea: {
        flex: 1,
        maxHeight: height * 0.35,
        marginRight: 10,
    },
    pinnedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#FFD700',
    },
    pinnedText: {
        color: '#FFD700',
        fontSize: 11,
        fontWeight: '700',
        flex: 1,
    },
    chatScrollView: {
        flex: 1,
    },
    chatScrollContent: {
        justifyContent: 'flex-end',
    },
    chatBubble: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 24,
        paddingVertical: 6,
        paddingHorizontal: 10,
        marginBottom: 6,
        alignSelf: 'flex-start',
        maxWidth: '95%',
    },
    chatAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    chatTextContainer: {
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
    chatMessageRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
    },
    chatMessageText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '500',
    },
    chatReactionText: {
        fontSize: 13,
        marginLeft: 4,
    },
    rightPanel: {
        width: 90,
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 10,
    },
    expandButtonCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    requestCard: {
        width: 82,
        height: 82,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    requestText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
        marginTop: 2,
    },
    guestCard: {
        width: 82,
        height: 110,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    guestBg: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    guestPlusBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignSelf: 'stretch',
        paddingVertical: 3,
        alignItems: 'center',
    },
    guestNameText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    statsAndReactionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    watchingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginRight: 6,
    },
    watchingText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    reactionsScrollView: {
        flex: 1,
    },
    reactionPill: {
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginRight: 6,
    },
    reactionText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '700',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    },
    messageInput: {
        flex: 1,
        height: 46,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 23,
        paddingHorizontal: 16,
        color: '#FFF',
        fontSize: 13,
        marginRight: 8,
    },
    giftIconBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255, 215, 0, 0.2)',
        borderWidth: 1.5,
        borderColor: '#FFD700',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    inputPlainButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.65)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    ticketCard: {
        width: width * 0.86,
        backgroundColor: '#FFF',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
        position: 'relative',
    },
    closeModalBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 32,
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ticketIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    ticketTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 8,
    },
    ticketSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 20,
    },
    buyAccessBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 20,
        paddingVertical: 14,
        paddingHorizontal: 28,
        width: '100%',
        alignItems: 'center',
    },
    buyAccessBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
    paymentSheet: {
        width: width * 0.9,
        backgroundColor: '#FFF',
        borderRadius: 28,
        padding: 24,
    },
    paymentAmount: {
        fontSize: 28,
        fontWeight: '900',
        color: '#111827',
        textAlign: 'center',
        marginVertical: 12,
    },
    priceBreakdown: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 14,
        marginBottom: 16,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    priceRowTotal: {
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        paddingTop: 8,
        marginBottom: 0,
    },
    priceLabel: {
        color: '#6B7280',
        fontSize: 13,
    },
    priceValue: {
        color: '#111827',
        fontWeight: '700',
        fontSize: 13,
    },
    priceLabelTotal: {
        color: '#111827',
        fontWeight: '800',
        fontSize: 14,
    },
    priceValueTotal: {
        color: '#8E2DE2',
        fontWeight: '900',
        fontSize: 14,
    },
    paymentHeadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    paymentHeading: {
        fontSize: 13,
        fontWeight: '700',
        color: '#374151',
        marginRight: 4,
    },
    paymentMethodOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    paymentOptionLabel: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8E2DE2',
    },
    payBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 16,
    },
    payBtnText: {
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
    guestAvatarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    guestAvatarLeft: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2.5,
        borderColor: '#FFF',
        marginRight: -6,
        zIndex: 2,
    },
    guestDotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 3,
        paddingHorizontal: 4,
    },
    guestDotSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#FFF',
        marginRight: 4,
    },
    guestDotPurple: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8E2DE2',
    },
    guestAvatarRight: {
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
    cancelRequestBtnFull: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
    },
    cancelRequestBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
});
