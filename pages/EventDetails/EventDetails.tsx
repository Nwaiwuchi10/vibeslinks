import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { eventService } from '@/services/eventService';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';

const { width } = Dimensions.get('window');

const EventDetails = () => {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);

    const event = useSelector((state: RootState) => state.event.currentEvent);
    const commentsList = useSelector((state: RootState) => state.event.comments);
    const authUser = useSelector((state: RootState) => state.auth.user);

    const [friendsAttending, setFriendsAttending] = useState<any[]>([]);
    const [userReaction, setUserReaction] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;
        async function fetchDetails() {
            try {
                setLoading(true);
                const res = await eventService.getEventDetailsScreen(id!);
                
                // Set initial reaction if returned in details
                const detailEvent = res?.event || res;
                if (detailEvent?.userReaction) {
                    setUserReaction(detailEvent.userReaction);
                }

                await eventService.getEventComments(id!);

                try {
                    const friends = await eventService.getEventFriendsAttending(id!);
                    setFriendsAttending(friends || []);
                } catch {}
            } catch (err) {
                console.warn('[EventDetails] Fetch failed:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchDetails();
    }, [id]);

    const handleReactionPress = async (type = 'love') => {
        if (!id) return;
        try {
            if (userReaction === type) {
                await eventService.deleteEventReaction(id);
                setUserReaction(null);
            } else {
                await eventService.postEventReaction(id, type);
                setUserReaction(type);
            }
        } catch (err) {
            console.warn('[EventDetails] Reaction failed:', err);
        }
    };

    const handleAddComment = async () => {
        if (!id || !commentText.trim() || submittingComment) return;
        try {
            setSubmittingComment(true);
            await eventService.createEventComment(id, commentText.trim());
            setCommentText('');
        } catch (err) {
            console.warn('[EventDetails] Comment failed:', err);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (!event) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <Text style={{ fontSize: 16, color: '#666' }}>Event not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 15, padding: 10, backgroundColor: Colors.primary, borderRadius: 8 }}>
                    <Text style={{ color: '#FFF' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const heroImage = event.hero?.imageUrl || event.imageUrl || '';
    const title = event.summary?.title || event.title || 'Untitled Event';
    const category = event.summary?.categoryLabel || event.category || 'Event';
    const location = event.summary?.locationText || event.location || 'TBD';
    const dateText = event.summary?.dateTimeText || (event.startsAt ? new Date(event.startsAt).toLocaleString() : 'TBD');
    const attendeeCount = event.summary?.attendeeCountLabel || '0+';
    const attendeeList = event.summary?.attendees || [];
    const description = event.about?.description || event.description || 'No description provided.';
    const host = event.organizer?.host || event.organizer || event.host || event.creator || event.user || { name: 'Organizer', username: 'host', avatarUrl: null };
    const artists = event.featuredArtists?.artists || [];
    const tickets = event.ticketCards?.tickets || [];
    const countdown = event.countdown || { days: '00', hours: '00', minutes: '00', seconds: '00' };

    const isHost = authUser?.id && (host.id || host._id)
      ? (authUser.id === host.id || authUser.id === host._id)
      : (authUser?.username && host.username ? authUser.username === host.username : false);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header Image Section */}
                <ImageBackground
                    source={heroImage ? { uri: heroImage } : require('../../assets/images/burna_boy.png')}
                    style={styles.headerImage}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(0,0,0,0.6)']}
                        style={styles.gradient}
                    >
                        <SafeAreaView edges={['top']} style={styles.headerButtons}>
                            <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={20} color="#FFF" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: 'row' }}>
                                {isHost && (
                                    <TouchableOpacity 
                                        style={[styles.iconCircle, { marginRight: 10 }]}
                                        onPress={async () => {
                                            try {
                                                if (id) {
                                                    await eventService.duplicateEvent(id);
                                                }
                                            } catch (e) {
                                                console.error('Failed to duplicate:', e);
                                            }
                                        }}
                                    >
                                        <Ionicons name="copy-outline" size={20} color="#FFF" />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity 
                                    style={[styles.iconCircle, { marginRight: 10 }]}
                                    onPress={() => handleReactionPress('love')}
                                >
                                    <Ionicons 
                                        name={userReaction ? "heart" : "heart-outline"} 
                                        size={20} 
                                        color={userReaction ? "#FF4B4B" : "#FFF"} 
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconCircle}>
                                    <Ionicons name="share-social-outline" size={20} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                </ImageBackground>

                {/* Event Main Info */}
                <View style={styles.mainContent}>
                    <View style={styles.titleRow}>
                        <Text style={styles.eventTitle}>{title}</Text>
                        <View style={styles.nightlifeBadge}>
                            <Text style={styles.nightlifeText}>{category.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.infoIconsRow}>
                        <View style={styles.infoIconItem}>
                            <Ionicons name="location" size={16} color={Colors.primary} />
                            <Text style={styles.infoIconText}>{location}</Text>
                        </View>
                        <View style={[styles.infoIconItem, { marginLeft: 20 }]}>
                            <MaterialIcons name="access-time" size={16} color={Colors.primary} />
                            <Text style={styles.infoIconText}>{dateText}</Text>
                        </View>
                    </View>

                    {/* Attending / Invites */}
                    <View style={styles.inviteRow}>
                        <View style={styles.avatarStack}>
                            {attendeeList.slice(0, 4).map((att: any, idx: number) => (
                                <Image
                                    key={idx}
                                    source={{ uri: att.avatarUrl || `https://i.pravatar.cc/150?img=${idx + 20}` }}
                                    style={[styles.smallAvatar, { marginLeft: idx === 0 ? 0 : -8 }]}
                                />
                            ))}
                            <Text style={styles.plusText}>{attendeeCount}</Text>
                        </View>
                    </View>

                    {friendsAttending.length > 0 && (
                        <View style={styles.friendsRow}>
                            <Ionicons name="people-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                            <Text style={styles.friendsText} numberOfLines={1}>
                                {friendsAttending.slice(0, 2).map((f: any) => f.fullName || f.username || 'Friend').join(', ')}
                                {friendsAttending.length > 2 ? ` and ${friendsAttending.length - 2} other friends` : ''} attending
                            </Text>
                        </View>
                    )}

                    {/* About Event */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>About Event</Text>
                        </View>
                        <Text style={styles.description}>{description}</Text>
                    </View>

                    {/* Organizer */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Organizer</Text>
                        </View>
                        <View style={styles.hostCard}>
                            <Image 
                                source={host.avatarUrl ? { uri: host.avatarUrl } : { uri: `https://i.pravatar.cc/150?username=${host.username}` }} 
                                style={styles.hostAvatar} 
                            />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.hostLabel}>Hosted by</Text>
                                <Text style={styles.hostName}>{host.name}</Text>
                            </View>
                            <TouchableOpacity style={styles.followButton}>
                                <Text style={styles.followButtonText}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Map Placement */}
                    {event.directions?.map && (
                        <View style={styles.mapContainer}>
                            <Image source={require('../../assets/images/staticMap.png')} style={styles.mapImage} />
                            <View style={styles.mapOverlay}>
                                <View style={styles.mapPin}>
                                    <Ionicons name="location" size={24} color="#FFF" />
                                </View>
                            </View>
                            <Text style={styles.mapAddress}>{event.directions.addressLabel || location}</Text>
                        </View>
                    )}

                    {/* Featured Artists */}
                    {artists.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Featured Artists ({artists.length})</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistScroll}>
                                {artists.map((artist: any, idx: number) => (
                                    <View key={idx} style={styles.artistCard}>
                                        <Image 
                                            source={artist.avatarUrl ? { uri: artist.avatarUrl } : require('../../assets/images/burna_boy.png')} 
                                            style={styles.artistImage} 
                                        />
                                        <Text style={styles.artistName}>{artist.name || artist.fullName}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Ticket Cards */}
                    {tickets.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Ticket Cards</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ticketScroll}>
                                {tickets.map((t: any) => (
                                    <View key={t.id} style={styles.ticketCard}>
                                        <ImageBackground 
                                            source={heroImage ? { uri: heroImage } : require('../../assets/images/burna_boy.png')} 
                                            style={styles.ticketImgBg} 
                                            imageStyle={{ borderRadius: 16 }}
                                        >
                                            <View style={[styles.ticketTypeBadge, { backgroundColor: '#7B2FFF' }]}>
                                                <Text style={styles.ticketTypeText}>{t.label}</Text>
                                            </View>
                                        </ImageBackground>
                                        <View style={styles.ticketInfo}>
                                            <Text style={styles.ticketDetails}>{t.description || 'Priority Entry'}</Text>
                                            <View style={styles.ticketFooter}>
                                                <Text style={styles.ticketPrice}>{t.priceText}<Text style={styles.priceSub}>/Person</Text></Text>
                                                <TouchableOpacity 
                                                    style={[styles.buySmallButton, t.soldOut && styles.soldOutButton]}
                                                    onPress={() => !t.soldOut && router.push({ pathname: '/select-ticket', params: { id } })}
                                                >
                                                    <Text style={styles.buySmallText}>{t.soldOut ? 'SOLD OUT' : 'BUY'}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Event Starts In */}
                    {countdown && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Event Start In</Text>
                            <ImageBackground 
                                source={heroImage ? { uri: heroImage } : require('../../assets/images/burna_boy.png')} 
                                style={styles.timerBg} 
                                imageStyle={{ borderRadius: 16 }}
                            >
                                <View style={styles.timerOverlay}>
                                    <View style={styles.timerRow}>
                                        <View style={styles.timeUnit}>
                                            <Text style={styles.timeValue}>{countdown.days || '00'}</Text>
                                            <Text style={styles.timeLabel}>DAYS</Text>
                                        </View>
                                        <View style={styles.timeUnit}>
                                            <Text style={styles.timeValue}>{countdown.hours || '00'}</Text>
                                            <Text style={styles.timeLabel}>HOURS</Text>
                                        </View>
                                        <View style={styles.timeUnit}>
                                            <Text style={styles.timeValue}>{countdown.minutes || '00'}</Text>
                                            <Text style={styles.timeLabel}>MINUTES</Text>
                                        </View>
                                        <View style={styles.timeUnit}>
                                            <Text style={styles.timeValue}>{countdown.seconds || '00'}</Text>
                                            <Text style={styles.timeLabel}>SECONDS</Text>
                                        </View>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    )}

                    {/* Comments */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{commentsList.length} Comments</Text>
                        </View>
                        <View style={styles.commentInputRow}>
                            <TextInput 
                                placeholder="Leave a comment" 
                                style={styles.commentInput} 
                                value={commentText}
                                onChangeText={setCommentText}
                            />
                            <TouchableOpacity style={styles.sendButton} onPress={handleAddComment} disabled={submittingComment}>
                                {submittingComment ? <ActivityIndicator size="small" color="#FFF" /> : <Ionicons name="send" size={16} color="#FFF" />}
                            </TouchableOpacity>
                        </View>

                        {commentsList.slice(0, 3).map((item: any, idx: number) => {
                            const author = item.user || { name: 'User', username: 'user', avatarUrl: null };
                            return (
                                <View key={idx} style={styles.commentItem}>
                                    <Image 
                                        source={author.avatarUrl ? { uri: author.avatarUrl } : { uri: `https://i.pravatar.cc/150?username=${author.username}` }} 
                                        style={styles.commentAvatar} 
                                    />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.commentHeader}>
                                            <Text style={styles.commentUser}>
                                                {author.name} <Text style={styles.commentTime}>. {new Date(item.createdAt).toLocaleDateString()}</Text>
                                            </Text>
                                        </View>
                                        <Text style={styles.commentText}>{item.message}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Purchase Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.bottomLabel}>Price</Text>
                    <Text style={styles.bottomPrice}>{event.stickyPurchase?.priceText || '₦'}</Text>
                </View>
                <TouchableOpacity 
                    style={styles.buyButton} 
                    onPress={() => router.push({ pathname: '/select-ticket', params: { id } })}
                >
                    <Text style={styles.buyButtonText}>Buy Tickets</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EventDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    headerImage: {
        width: '100%',
        height: 400,
    },
    gradient: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    mainContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        paddingTop: 24,
    },
    titleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    eventTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#1A1A2E',
    },
    nightlifeBadge: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    nightlifeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    infoIconsRow: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    infoIconItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIconText: {
        fontSize: 13,
        color: '#6B6B80',
        marginLeft: 6,
        fontWeight: '500',
    },
    inviteRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    friendsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    friendsText: {
        fontSize: 13,
        color: '#6B6B80',
        fontWeight: '500',
    },
    avatarStack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    smallAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    plusText: {
        marginLeft: 8,
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    viewInviteText: {
        fontSize: 13,
        color: Colors.primary,
        fontWeight: '700',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    readMoreText: {
        fontSize: 12,
        color: '#888',
        fontWeight: '600',
    },
    description: {
        fontSize: 14,
        color: '#6B6B80',
        lineHeight: 22,
    },
    aboutHostText: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
    },
    hostCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 20,
    },
    hostAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    hostLabel: {
        fontSize: 12,
        color: '#888',
    },
    hostName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    followButton: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EFEFEF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    followButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
    },
    mapContainer: {
        marginHorizontal: 20,
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    mapPin: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
    },
    mapAddress: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        fontSize: 11,
        color: Colors.primary,
        fontWeight: '600',
    },
    artistScroll: {
        marginTop: 12,
    },
    artistCard: {
        width: 140,
        marginRight: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 12,
    },
    artistImage: {
        width: '100%',
        height: 120,
        borderRadius: 16,
        marginBottom: 8,
    },
    artistName: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1A1A2E',
    },
    popBadge: {
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    popText: {
        fontSize: 11,
        color: '#888',
    },
    ticketScroll: {
        marginTop: 12,
    },
    ticketCard: {
        width: 180,
        marginRight: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    ticketImgBg: {
        width: '100%',
        height: 100,
    },
    ticketTypeBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    ticketTypeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
    },
    ticketInfo: {
        padding: 12,
    },
    ticketDetails: {
        fontSize: 12,
        color: '#6B6B80',
        marginBottom: 12,
        height: 40,
    },
    ticketFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ticketPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.primary,
    },
    priceSub: {
        fontSize: 10,
        color: '#888',
        fontWeight: '400',
    },
    buySmallButton: {
        backgroundColor: '#000',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    buySmallText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
    },
    soldOutButton: {
        backgroundColor: '#CCC',
    },
    timerBg: {
        width: '100%',
        height: 120,
        marginTop: 12,
    },
    timerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    timerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeUnit: {
        alignItems: 'center',
        marginHorizontal: 12,
    },
    timeValue: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFF',
    },
    timeLabel: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 4,
        fontWeight: '700',
    },
    viewAllComments: {
        fontSize: 12,
        color: Colors.primary,
        fontWeight: '600',
    },
    commentInputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    commentInput: {
        flex: 1,
        height: 44,
        fontSize: 13,
    },
    sendButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentItem: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },
    commentHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    commentUser: {
        fontSize: 13,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    commentTime: {
        fontSize: 12,
        fontWeight: '400',
        color: '#888',
    },
    commentText: {
        fontSize: 13,
        color: '#6B6B80',
        lineHeight: 18,
    },
    commentActions: {
        flexDirection: 'row',
        marginTop: 8,
    },
    commentAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    actionCount: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
    },
    replyItem: {
        flexDirection: 'row',
        marginTop: 16,
        paddingLeft: 12,
        borderLeftWidth: 1,
        borderLeftColor: '#EFEFEF',
    },
    replyAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 8,
    },
    otherEventsList: {
        marginTop: 12,
    },
    otherEventCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 20,
        marginBottom: 16,
        padding: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    otherEventImg: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },
    otherEventInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    otherBadge: {
        backgroundColor: '#111',
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginBottom: 6,
    },
    otherBadgeText: {
        color: '#FFF',
        fontSize: 9,
        fontWeight: '800',
    },
    otherTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1A1A2E',
        marginBottom: 4,
    },
    otherLocRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    otherLoc: {
        fontSize: 12,
        color: '#888',
        marginLeft: 4,
    },
    otherPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: Colors.primary,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    bottomLabel: {
        fontSize: 12,
        color: '#888',
    },
    bottomPrice: {
        fontSize: 18,
        fontWeight: '900',
        color: Colors.primary,
    },
    bottomSub: {
        fontSize: 12,
        color: '#888',
        fontWeight: '400',
    },
    buyButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 40,
        paddingVertical: 16,
        borderRadius: 30,
    },
    buyButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
