import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

const { width } = Dimensions.get('window');

const TICKETS = [
    { id: '1', type: 'General', title: 'Priority entry', price: '₦10,000', image: require('../../assets/images/burna_boy.png') },
    { id: '2', type: 'VIP', title: 'Lounge access\nFree drinks\nPriority entry', price: '₦50,000', soldOut: true, image: require('../../assets/images/burna_boy.png') },
];

const RELATED_EVENTS = [
    { id: '1', title: 'Afro Summer Festival', location: 'Lekki Ikala, Lagos', price: '₦10,000', image: require('../../assets/images/davido_event.png'), badge: 'NIGHTLIFE' },
    { id: '2', title: 'Worship Da King', location: 'Lekki Ikala, Lagos', price: '₦5,000', image: require('../../assets/images/ye.png'), badge: 'FESTIVALS' },
    { id: '3', title: 'Afro Summer Festival', location: 'Lekki Ikala, Lagos', price: '₦10,000', image: require('../../assets/images/davido.png'), badge: 'SPORTS EVENTS' },
    { id: '4', title: 'Paint With Mimi &...', location: 'Lekki Ikala, Lagos', price: '₦5,000', image: require('../../assets/images/modu.png'), badge: 'COMEDY' },
];

const EventDetails = () => {
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header Image Section */}
                <ImageBackground
                    source={require('../../assets/images/burna_boy.png')}
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
                                <TouchableOpacity style={[styles.iconCircle, { marginRight: 10 }]}>
                                    <Ionicons name="heart-outline" size={20} color="#FFF" />
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
                        <Text style={styles.eventTitle}>Deejay Coded Showcase</Text>
                        <View style={styles.nightlifeBadge}>
                            <Text style={styles.nightlifeText}>Nightlife</Text>
                        </View>
                    </View>

                    <View style={styles.infoIconsRow}>
                        <View style={styles.infoIconItem}>
                            <Ionicons name="location" size={16} color={Colors.primary} />
                            <Text style={styles.infoIconText}>Lekki Ikala, Lagos Nigeria</Text>
                            <Ionicons name="information-circle-outline" size={14} color="#888" style={{ marginLeft: 4 }} />
                        </View>
                        <View style={[styles.infoIconItem, { marginLeft: 20 }]}>
                            <MaterialIcons name="access-time" size={16} color={Colors.primary} />
                            <Text style={styles.infoIconText}>May 15 - 9:00 PM</Text>
                        </View>
                    </View>

                    {/* Attending / Invites */}
                    <View style={styles.inviteRow}>
                        <View style={styles.avatarStack}>
                            {[1, 2, 3, 4].map((id) => (
                                <Image
                                    key={id}
                                    source={{ uri: `https://i.pravatar.cc/150?img=${id + 20}` }}
                                    style={[styles.smallAvatar, { marginLeft: id === 1 ? 0 : -8 }]}
                                />
                            ))}
                            <Text style={styles.plusText}>15,340+</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.viewInviteText}>View Invite <Ionicons name="arrow-forward" size={12} color={Colors.primary} /></Text>
                        </TouchableOpacity>
                    </View>

                    {/* About Event */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>About Event</Text>
                            <TouchableOpacity>
                                <Text style={styles.readMoreText}>Read more <Ionicons name="information-circle-outline" size={12} /></Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.description}>
                            Experience one of the biggest Afrobeat festivals featuring top DJs, live performances, VIP experiences, and unforgettable nightlife energy.
                        </Text>
                    </View>

                    {/* Organizer */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Organizer</Text>
                            <TouchableOpacity>
                                <Text style={styles.aboutHostText}>About Host <Ionicons name="arrow-forward" size={12} /></Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.hostCard}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?img=33' }} style={styles.hostAvatar} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                                <Text style={styles.hostLabel}>Hosted by</Text>
                                <Text style={styles.hostName}>Coded Media</Text>
                            </View>
                            <TouchableOpacity style={styles.followButton}>
                                <Text style={styles.followButtonText}>Follow</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Map Placeholder */}
                    <View style={styles.mapContainer}>
                        <Image source={require('../../assets/images/staticMap.png')} style={styles.mapImage} />
                        <View style={styles.mapOverlay}>
                            <View style={styles.mapPin}>
                                <Ionicons name="location" size={24} color="#FFF" />
                            </View>
                        </View>
                        <Text style={styles.mapAddress}>Lekki Ikala, Lagos Nigeria</Text>
                    </View>

                    {/* Featured Artists */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Featured Artists (3)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.artistScroll}>
                            <View style={styles.artistCard}>
                                <Image source={require('../../assets/images/burna_boy.png')} style={styles.artistImage} />
                                <Text style={styles.artistName}>Burna Boy</Text>
                                <View style={styles.popBadge}><Text style={styles.popText}>Pop</Text></View>
                            </View>
                            <View style={styles.artistCard}>
                                <Image source={require('../../assets/images/odumodu.png')} style={styles.artistImage} />
                                <Text style={styles.artistName}>Odumodu Blvck</Text>
                                <View style={styles.popBadge}><Text style={styles.popText}>Afrobeats</Text></View>
                            </View>
                        </ScrollView>
                    </View>

                    {/* Ticket Cards */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Ticket Cards</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ticketScroll}>
                            {TICKETS.map((ticket) => (
                                <View key={ticket.id} style={styles.ticketCard}>
                                    <ImageBackground source={ticket.image} style={styles.ticketImgBg} imageStyle={{ borderRadius: 16 }}>
                                        <View style={[styles.ticketTypeBadge, { backgroundColor: ticket.type === 'VIP' ? '#7B2FFF' : '#A45BFF' }]}>
                                            <Text style={styles.ticketTypeText}>{ticket.type}</Text>
                                        </View>
                                    </ImageBackground>
                                    <View style={styles.ticketInfo}>
                                        <Text style={styles.ticketDetails}>{ticket.title}</Text>
                                        <View style={styles.ticketFooter}>
                                            <Text style={styles.ticketPrice}>{ticket.price}<Text style={styles.priceSub}>/Person</Text></Text>
                                            <TouchableOpacity style={[styles.buySmallButton, ticket.soldOut && styles.soldOutButton]}>
                                                <Text style={styles.buySmallText}>{ticket.soldOut ? 'SOLD OUT' : 'BUY'}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Event Starts In */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Event Start In</Text>
                        <ImageBackground source={require('../../assets/images/burna_boy.png')} style={styles.timerBg} imageStyle={{ borderRadius: 16 }}>
                            <View style={styles.timerOverlay}>
                                <View style={styles.timerRow}>
                                    <View style={styles.timeUnit}>
                                        <Text style={styles.timeValue}>05</Text>
                                        <Text style={styles.timeLabel}>DAYS</Text>
                                    </View>
                                    <View style={styles.timeUnit}>
                                        <Text style={styles.timeValue}>22</Text>
                                        <Text style={styles.timeLabel}>HOURS</Text>
                                    </View>
                                    <View style={styles.timeUnit}>
                                        <Text style={styles.timeValue}>05</Text>
                                        <Text style={styles.timeLabel}>MINUTES</Text>
                                    </View>
                                    <View style={styles.timeUnit}>
                                        <Text style={styles.timeValue}>01</Text>
                                        <Text style={styles.timeLabel}>SECONDS</Text>
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
                    </View>

                    {/* Comments */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>31 Comments</Text>
                            <TouchableOpacity>
                                <Text style={styles.viewAllComments}>See all <Ionicons name="arrow-forward" size={12} /></Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.commentInputRow}>
                            <TextInput placeholder="Leave a comment" style={styles.commentInput} />
                            <TouchableOpacity style={styles.sendButton}>
                                <Ionicons name="send" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.commentItem}>
                            <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.commentAvatar} />
                            <View style={{ flex: 1 }}>
                                <View style={styles.commentHeader}>
                                    <Text style={styles.commentUser}>samrays_dainty <MaterialIcons name="verified" size={10} color={Colors.primary} /> <Text style={styles.commentTime}>. 2h</Text></Text>
                                    <TouchableOpacity><Ionicons name="ellipsis-horizontal" size={16} color="#888" /></TouchableOpacity>
                                </View>
                                <Text style={styles.commentText}>When is coming from down lower</Text>
                                <View style={styles.commentActions}>
                                    <TouchableOpacity style={styles.commentAction}><Ionicons name="heart-outline" size={14} color="#888" /><Text style={styles.actionCount}>441</Text></TouchableOpacity>
                                </View>

                                {/* Reply */}
                                <View style={styles.replyItem}>
                                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=13' }} style={styles.replyAvatar} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.commentUser}>Nicky <Text style={styles.commentTime}> . 1h</Text></Text>
                                        <Text style={styles.commentText}>Me am come from there</Text>
                                        <View style={styles.commentActions}>
                                            <TouchableOpacity style={styles.commentAction}><Ionicons name="heart-outline" size={14} color="#888" /><Text style={styles.actionCount}>441</Text></TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Other Events */}
                    <View style={[styles.section, { marginBottom: 100 }]}>
                        <Text style={styles.sectionTitle}>Other events you may like</Text>
                        <View style={styles.otherEventsList}>
                            {RELATED_EVENTS.map((item) => (
                                <View key={item.id} style={styles.otherEventCard}>
                                    <Image source={item.image} style={styles.otherEventImg} />
                                    <View style={styles.otherEventInfo}>
                                        <View style={styles.otherBadge}><Text style={styles.otherBadgeText}>{item.badge}</Text></View>
                                        <Text style={styles.otherTitle}>{item.title}</Text>
                                        <View style={styles.otherLocRow}>
                                            <Ionicons name="location" size={12} color={Colors.primary} />
                                            <Text style={styles.otherLoc}>{item.location}</Text>
                                        </View>
                                        <Text style={styles.otherPrice}>{item.price} <Text style={{ color: '#888', fontWeight: '400' }}>/Person</Text></Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Purchase Bar */}
            <View style={styles.bottomBar}>
                <View>
                    <Text style={styles.bottomLabel}>From</Text>
                    <Text style={styles.bottomPrice}>₦10,000 <Text style={styles.bottomSub}>/ Person</Text></Text>
                </View>
                <TouchableOpacity style={styles.buyButton}>
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
