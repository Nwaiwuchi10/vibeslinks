import React, { useState, useRef } from 'react';
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
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface ChatMessage {
    id: string;
    avatar: string;
    username: string;
    message: string;
    reaction?: string;
}

export default function LiveDetails() {
    // Flow States: 'TICKET_MODAL' -> 'PAYMENT_SHEET' -> 'LIVE_STREAM'
    const [flowState, setFlowState] = useState<'TICKET_MODAL' | 'PAYMENT_SHEET' | 'LIVE_STREAM'>('TICKET_MODAL');
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
    const [isFollowing, setIsFollowing] = useState(false);
    const [showRequestSentModal, setShowRequestSentModal] = useState(false);
    const [showEndLiveModal, setShowEndLiveModal] = useState(false);
    const [hasGuestStream, setHasGuestStream] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [reactionCounts, setReactionCounts] = useState({
        heart: 12000,
        smile: 37000,
        angry: 15000,
        star: 91000,
        clap: 3000,
    });

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            avatar: 'https://i.pravatar.cc/150?img=47',
            username: '@claudiocardoso',
            message: 'send reaction',
            reaction: '😁',
        },
        {
            id: '2',
            avatar: 'https://i.pravatar.cc/150?img=12',
            username: '@claudiocardoso',
            message: 'Lovely',
        },
        {
            id: '3',
            avatar: 'https://i.pravatar.cc/150?img=47',
            username: '@claudiocardoso',
            message: 'Who else dey vibing tonight',
        },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const chatScrollViewRef = useRef<ScrollView>(null);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const msg: ChatMessage = {
            id: Date.now().toString(),
            avatar: 'https://i.pravatar.cc/150?img=33',
            username: '@you',
            message: newMessage,
        };
        setChatMessages((prev) => [...prev, msg]);
        setNewMessage('');
        setTimeout(() => {
            chatScrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleReaction = (type: keyof typeof reactionCounts) => {
        setReactionCounts((prev) => ({
            ...prev,
            [type]: prev[type] + 1,
        }));
    };

    return (
        <View style={styles.container}>
            {/* Background Stream Image */}
            <ImageBackground
                source={require('../../assets/images/artist_event.png')}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {/* Overlay layer for immersive look */}
                <View style={styles.darkOverlay} />

                <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                    {/* Header bar (always visible at top of live) */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.headerCircleBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={22} color="#FFF" />
                        </TouchableOpacity>

                        <View style={styles.creatorPill}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=43' }}
                                style={styles.creatorAvatar}
                            />
                            <View style={styles.creatorInfo}>
                                <Text style={styles.creatorName}>Olivia</Text>
                                <View style={styles.creatorLikesRow}>
                                    <Ionicons name="heart" size={10} color="#FFF" />
                                    <Text style={styles.creatorLikesText}>1.1k</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                                onPress={() => setIsFollowing(!isFollowing)}
                            >
                                <Text style={styles.followBtnText}>
                                    {isFollowing ? 'Following' : 'Follow'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.headerCircleBtn} onPress={() => router.push('/live-creators')}>
                            <Ionicons name="chevron-down" size={22} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* LIVE STREAM MAIN VIEW */}
                    {flowState === 'LIVE_STREAM' && (
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.liveFlexContainer}
                        >
                            <View style={styles.streamBody}>
                                {/* Left Side - Comments overlay */}
                                <View style={styles.leftChatArea}>
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
                                                    <Text style={styles.chatUser}>{msg.username}</Text>
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
                                <View style={styles.rightPanel}>
                                    {/* Expand Button */}
                                    <TouchableOpacity
                                        style={styles.expandButtonCircle}
                                        onPress={() => setIsFullscreen(true)}
                                    >
                                        <Ionicons name="resize" size={18} color="#FFF" />
                                    </TouchableOpacity>

                                    {/* Request card */}
                                    <TouchableOpacity
                                        style={styles.requestCard}
                                        onPress={() => setShowRequestSentModal(true)}
                                    >
                                        <Text style={styles.requestPlus}>+</Text>
                                        <Text style={styles.requestText}>Request</Text>
                                    </TouchableOpacity>

                                    {/* Guest feed mockup */}
                                    {hasGuestStream && (
                                        <View style={styles.guestCard}>
                                            <ImageBackground
                                                source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' }}
                                                style={styles.guestBg}
                                                imageStyle={{ borderRadius: 16 }}
                                            >
                                                <TouchableOpacity
                                                    style={styles.guestPlusBadge}
                                                    onPress={() => setHasGuestStream(false)}
                                                >
                                                    <Text style={styles.guestNameText}>cardoso +</Text>
                                                </TouchableOpacity>
                                            </ImageBackground>
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Bottom stats and interactive reactions */}
                            <View style={styles.statsAndReactionsRow}>
                                <View style={styles.watchingBadge}>
                                    <Ionicons name="people-outline" size={12} color="#FFF" style={{ marginRight: 4 }} />
                                    <Text style={styles.watchingText}>41.9K Watching</Text>
                                </View>

                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reactionsScrollView}>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('smile')}>
                                        <Text style={styles.reactionText}>😍 37k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('heart')}>
                                        <Text style={styles.reactionText}>❤️ 12k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('angry')}>
                                        <Text style={styles.reactionText}>😡 15k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('star')}>
                                        <Text style={styles.reactionText}>🤩 91k</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.reactionPill} onPress={() => handleReaction('clap')}>
                                        <Text style={styles.reactionText}>👏 3k</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>

                            {/* Bottom Input Area */}
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.messageInput}
                                    placeholder="Send message..."
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    value={newMessage}
                                    onChangeText={setNewMessage}
                                    onSubmitEditing={handleSendMessage}
                                />
                                <TouchableOpacity style={styles.inputPlainButton} onPress={() => handleReaction('heart')}>
                                    <Ionicons name="heart-outline" size={26} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.inputPlainButton} onPress={handleSendMessage}>
                                    <Ionicons name="paper-plane-outline" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </KeyboardAvoidingView>
                    )}
                </SafeAreaView>
            </ImageBackground>

            {/* FULLSCREEN mode overlay */}
            {isFullscreen && (
                <View style={styles.fullscreenOverlay}>
                    <ImageBackground
                        source={require('../../assets/images/artist_event.png')}
                        style={styles.fullscreenImage}
                        resizeMode="cover"
                    >
                        {/* Collapse button — bottom right */}
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

                        {/* Price breakdown */}
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

                        {/* Payment Method Selector */}
                        <View style={styles.paymentHeadingRow}>
                            <Text style={styles.paymentHeading}>Payment Method</Text>
                            <Ionicons name="chevron-forward" size={14} color="#8E2DE2" />
                        </View>

                        <TouchableOpacity
                            style={styles.paymentMethodOption}
                            onPress={() => setPaymentMethod('card')}
                        >
                            <Text style={styles.paymentOptionLabel}>Debit Card</Text>
                            <View style={styles.radioOuter}>
                                {paymentMethod === 'card' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.paymentMethodOption}
                            onPress={() => setPaymentMethod('transfer')}
                        >
                            <Text style={styles.paymentOptionLabel}>Transfer</Text>
                            <View style={styles.radioOuter}>
                                {paymentMethod === 'transfer' && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.payBtn} onPress={() => setFlowState('LIVE_STREAM')}>
                            <Text style={styles.payBtnText}>Pay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Guest Request Pending Modal */}
            {showRequestSentModal && (
                <View style={styles.modalBackdrop}>
                    <View style={styles.guestRequestCard}>
                        {/* Overlapping Avatars - host on left, viewer on right */}
                        <View style={styles.guestAvatarsRow}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/150?img=43' }}
                                style={styles.guestAvatarLeft}
                            />
                            <View style={styles.guestDotContainer}>
                                <View style={styles.guestDotSmall} />
                                <View style={styles.guestDotPurple} />
                            </View>
                            <Image
                                source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }}
                                style={styles.guestAvatarRight}
                            />
                        </View>

                        <Text style={styles.guestRequestTitle}>Guest request Pending</Text>
                        <Text style={styles.guestRequestSubtitle}>1 viewer is requesting</Text>

                        <View style={styles.guestButtonsRow}>
                            <TouchableOpacity
                                style={styles.cancelRequestBtn}
                                onPress={() => setShowRequestSentModal(false)}
                            >
                                <Text style={styles.cancelRequestBtnText}>Cancel request</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.acceptRequestBtn}
                                onPress={() => setShowRequestSentModal(false)}
                            >
                                <Text style={styles.acceptRequestBtnText}>Accept request</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

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
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creatorPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
        marginRight: 12,
    },
    creatorName: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    creatorLikesRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 1,
    },
    creatorLikesText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        marginLeft: 3,
        fontWeight: '600',
    },
    followBtn: {
        backgroundColor: '#8E2DE2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 16,
    },
    followingBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    followBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
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
        marginBottom: 10,
    },
    leftChatArea: {
        flex: 1,
        maxHeight: height * 0.35,
        marginRight: 10,
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
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 30,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 8,
        alignSelf: 'flex-start',
        maxWidth: '95%',
    },
    chatAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
    },
    chatTextContainer: {
        marginLeft: 8,
    },
    chatUser: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 13,
        fontWeight: '700',
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
        fontSize: 14,
        marginLeft: 6,
    },
    rightPanel: {
        width: 100,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    requestCard: {
        width: 90,
        height: 90,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    requestPlus: {
        color: '#FFF',
        fontSize: 26,
        fontWeight: '300',
    },
    requestText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 2,
    },
    guestCard: {
        width: 90,
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
    },
    guestBg: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    guestPlusBadge: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignSelf: 'stretch',
        paddingVertical: 4,
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
        marginBottom: 12,
    },
    watchingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginRight: 8,
    },
    watchingText: {
        color: '#FFF',
        fontSize: 11,
        fontWeight: '600',
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
        fontWeight: '600',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: Platform.OS === 'ios' ? 12 : 16,
    },
    messageInput: {
        flex: 1,
        height: 48,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 24,
        paddingHorizontal: 18,
        color: '#FFF',
        fontSize: 14,
        marginRight: 8,
    },
    inputPlainButton: {
        width: 36,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    expandButtonCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },

    // Modal Background Backdrop
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },

    // Ticket Available Modal
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
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ticketIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 12,
    },
    ticketTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 8,
    },
    ticketSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    buyAccessBtn: {
        backgroundColor: '#1F2937',
        borderRadius: 16,
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
    },
    buyAccessBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },

    // Payment Sheet Modal
    paymentSheet: {
        width: '100%',
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        position: 'absolute',
        bottom: 0,
    },
    paymentAmount: {
        fontSize: 32,
        fontWeight: '800',
        color: '#8E2DE2',
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 24,
    },
    priceBreakdown: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    priceRowTotal: {
        borderTopWidth: 1,
        borderColor: '#E5E7EB',
        paddingTop: 10,
        marginBottom: 0,
    },
    priceLabel: {
        fontSize: 14,
        color: '#6B7280',
    },
    priceValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    priceLabelTotal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },
    priceValueTotal: {
        fontSize: 14,
        fontWeight: '800',
        color: '#111827',
    },
    paymentHeadingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    paymentHeading: {
        fontSize: 14,
        fontWeight: '700',
        color: '#8E2DE2',
        marginRight: 4,
    },
    paymentMethodOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderColor: '#F3F4F6',
    },
    paymentOptionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    radioOuter: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#8E2DE2',
    },
    payBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 24,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 24,
    },
    payBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },

    // Guest Request Pending Card
    guestRequestCard: {
        width: width * 0.88,
        backgroundColor: '#374151',
        borderRadius: 28,
        padding: 24,
        alignItems: 'center',
    },
    guestAvatarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    guestAvatarLeft: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: '#FFF',
        marginRight: -8,
        zIndex: 2,
    },
    guestDotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        zIndex: 3,
        paddingHorizontal: 6,
    },
    guestDotSmall: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: '#9CA3AF',
        marginRight: 3,
    },
    guestDotPurple: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8E2DE2',
    },
    guestAvatarRight: {
        width: 64,
        height: 64,
        borderRadius: 32,
        borderWidth: 3,
        borderColor: '#FFF',
        marginLeft: -8,
        zIndex: 1,
    },
    guestRequestTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 6,
        textAlign: 'center',
    },
    guestRequestSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 24,
        textAlign: 'center',
    },
    guestButtonsRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    cancelRequestBtn: {
        flex: 1,
        backgroundColor: '#E5E7EB',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelRequestBtnText: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '700',
    },
    acceptRequestBtn: {
        flex: 1,
        backgroundColor: '#8E2DE2',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
    },
    acceptRequestBtnText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },

    // End Live Session Modal
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
