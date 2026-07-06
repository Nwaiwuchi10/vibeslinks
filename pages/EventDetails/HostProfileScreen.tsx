import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const COVER_H = 180;
const AVATAR_D = 90;

// Tab 0 → Past Events | Tab 1 → Reviews | Tab 2 → About Host
// NOTE: when NOT active, tab 0 shows "Events" (shorter label per screenshot 2/3)
const TAB_LABELS_ACTIVE   = ['Past Events', 'Reviews', 'About Host'];
const TAB_LABELS_INACTIVE = ['Events',      'Reviews', 'About Host'];

const PAST_EVENTS = [
    {
        id: '1',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500',
        category: 'NIGHTLIFE',
        title: 'Afro Summer Festival',
        location: 'Lekki Ikata, Lagos',
        price: '₦80,000',
    },
    {
        id: '2',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500',
        category: 'FESTIVALS',
        title: 'Worship De King',
        location: 'Lekki Ikata, Lagos',
        price: '₦15,000',
    },
];

const REVIEWS = [
    {
        id: '1',
        avatar: 'https://i.pravatar.cc/150?img=20',
        username: 'commys_dairy',
        time: '.1h',
        body: 'Amazing event! Everything was well organized and the atmosphere was great."',
    },
    {
        id: '2',
        avatar: 'https://i.pravatar.cc/150?img=25',
        username: 'commys_dairy',
        time: '.1h',
        body: 'The speakers were engaging and the networking session was worth it.',
    },
];

/* ══════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════ */
export default function HostProfileScreen() {
    const [tab, setTab] = useState(2); // default: About Host

    return (
        <View style={s.root}>

            {/* ── Scrollable content ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                bounces={false}
                // keep header+stats+name as scrollable (not sticky) so cover scrolls too
            >
                {/* 1 ── COVER IMAGE */}
                <View style={s.coverWrap}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800' }}
                        style={s.coverImg}
                        resizeMode="cover"
                    />
                    {/* back button sits inside cover */}
                    <SafeAreaView style={StyleSheet.absoluteFill} edges={['top']} pointerEvents="box-none">
                        <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={18} color="#333" />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>

                {/* 2 ── WHITE PROFILE BLOCK (avatar overlaps cover) */}
                <View style={s.profileBlock}>
                    {/* avatar centred, lifted -AVATAR_D/2 */}
                    <View style={s.avatarShadow}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?img=33' }}
                            style={s.avatarImg}
                        />
                    </View>

                    {/* stats row flanking the avatar space */}
                    <View style={s.statsRow}>
                        <View style={s.statItem}>
                            <Text style={s.statNum}>232k</Text>
                            <Text style={s.statLbl}>Followers</Text>
                        </View>
                        {/* spacer = same width as avatar so numbers spread apart */}
                        <View style={{ width: AVATAR_D + 24 }} />
                        <View style={s.statItem}>
                            <Text style={s.statNum}>502</Text>
                            <Text style={s.statLbl}>Following</Text>
                        </View>
                    </View>

                    {/* name */}
                    <Text style={s.hostName}>Roland Emmanuel</Text>

                    {/* location */}
                    <View style={s.locRow}>
                        <Ionicons name="location" size={14} color="#8E2DE2" />
                        <Text style={s.locText}>Lekki , Lagos Nigeria</Text>
                    </View>
                </View>

                {/* 3 ── TABS */}
                <View style={s.tabBar}>
                    {TAB_LABELS_INACTIVE.map((label, i) => {
                        const isActive = tab === i;
                        const displayLabel = isActive ? TAB_LABELS_ACTIVE[i] : label;
                        return (
                            <TouchableOpacity
                                key={i}
                                style={s.tabBtn}
                                onPress={() => setTab(i)}
                                activeOpacity={0.7}
                            >
                                <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>
                                    {displayLabel}
                                </Text>
                                {isActive && <View style={s.tabLine} />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* 4 ── TAB CONTENT */}
                <View style={s.body}>
                    {tab === 0 && <PastEventsContent />}
                    {tab === 1 && <ReviewsContent />}
                    {tab === 2 && <AboutHostContent />}
                </View>

                {/* bottom spacer so fab doesn't hide content */}
                <View style={{ height: 110 }} />
            </ScrollView>

            {/* ── FLOATING ACTION BUTTON ── */}
            {tab === 0 && (
                <View style={s.fab}>
                    <TouchableOpacity style={s.followBtn} activeOpacity={0.85}>
                        <Ionicons name="person-add-outline" size={20} color="#FFF" />
                        <Text style={s.followTxt}>Follow</Text>
                    </TouchableOpacity>
                </View>
            )}
            {(tab === 1 || tab === 2) && (
                <View style={s.fab}>
                    <TouchableOpacity style={s.reportBtn} activeOpacity={0.85}>
                        <Ionicons name="flag-outline" size={20} color="#FFF" />
                        <Text style={s.reportTxt}>Report</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

/* ══════════════════════════════════════════
   PAST EVENTS CONTENT
═══════════════════════════════════════════ */
function PastEventsContent() {
    return (
        <>
            {PAST_EVENTS.map(ev => (
                <TouchableOpacity
                    key={ev.id}
                    style={s.evCard}
                    activeOpacity={0.88}
                    onPress={() => router.push('/event-details')}
                >
                    <Image source={{ uri: ev.image }} style={s.evThumb} resizeMode="cover" />
                    <View style={s.evInfo}>
                        {/* category badge */}
                        <View style={s.catBadge}>
                            <Text style={s.catTxt}>{ev.category}</Text>
                        </View>
                        <Text style={s.evTitle}>{ev.title}</Text>
                        <View style={s.evLocRow}>
                            <Ionicons name="location" size={12} color="#8E2DE2" />
                            <Text style={s.evLocTxt}>{ev.location}</Text>
                        </View>
                        <Text style={s.evPrice}>
                            {ev.price}
                            <Text style={s.evPriceSub}> /Person</Text>
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    );
}

/* ══════════════════════════════════════════
   REVIEWS CONTENT
═══════════════════════════════════════════ */
function ReviewsContent() {
    return (
        <>
            {REVIEWS.map(r => (
                <View key={r.id} style={s.reviewRow}>
                    <Image source={{ uri: r.avatar }} style={s.rvAvatar} />
                    <View style={{ flex: 1 }}>
                        {/* name + badge + time */}
                        <View style={s.rvTopRow}>
                            <Text style={s.rvUser}>{r.username}</Text>
                            {/* purple verified badge */}
                            <MaterialCommunityIcons
                                name="check-decagram"
                                size={14}
                                color="#8E2DE2"
                                style={{ marginLeft: 4 }}
                            />
                            <Text style={s.rvTime}>{r.time}</Text>
                        </View>
                        <Text style={s.rvBody}>{r.body}</Text>
                        {/* stars */}
                        <View style={s.starsRow}>
                            {[1, 2, 3, 4, 5].map(i => (
                                <FontAwesome key={i} name="star" size={15} color="#FFA800" />
                            ))}
                            <Text style={s.ratingTxt}>5.0</Text>
                        </View>
                    </View>
                </View>
            ))}

            {/* Photo grid: 2 equal images */}
            <View style={s.photoGrid}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400' }}
                    style={s.photoCell}
                    resizeMode="cover"
                />
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400' }}
                    style={s.photoCell}
                    resizeMode="cover"
                />
            </View>
        </>
    );
}

/* ══════════════════════════════════════════
   ABOUT HOST CONTENT
═══════════════════════════════════════════ */
function AboutHostContent() {
    return (
        <>
            {/* About Host */}
            <View style={s.section}>
                <View style={s.sectionHdr}>
                    <Text style={s.sectionTitle}>About Host</Text>
                    <TouchableOpacity style={s.readMoreRow}>
                        <Text style={s.readMoreTxt}>Read more</Text>
                        <Ionicons name="chevron-forward-circle" size={16} color="#888" />
                    </TouchableOpacity>
                </View>
                <Text style={s.aboutTxt}>
                    Experience one of the biggest Afrobeat festivals featuring top DJs, live performances, VIP experiences, and unforgettable nightlife energy.
                </Text>
            </View>

            {/* Manager */}
            <View style={s.section}>
                <Text style={s.sectionTitle}>Manager</Text>
                <View style={s.mgRow}>
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?img=10' }}
                        style={s.mgAvatar}
                    />
                    <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={s.mgName}>Vibez Nation</Text>
                        <Text style={s.mgRole}>Manager</Text>
                    </View>
                    <View style={s.mgIconsRow}>
                        <TouchableOpacity style={s.mgIcon}>
                            <Ionicons name="call-outline" size={18} color="#8E2DE2" />
                        </TouchableOpacity>
                        <TouchableOpacity style={s.mgIcon}>
                            <MaterialCommunityIcons name="message-outline" size={18} color="#8E2DE2" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Directions */}
            <View style={s.section}>
                <View style={s.sectionHdr}>
                    <Text style={s.sectionTitle}>Directions</Text>
                    <TouchableOpacity
                        style={s.readMoreRow}
                        onPress={() => router.push('/get-direction')}
                    >
                        <Text style={[s.readMoreTxt, { color: '#8E2DE2' }]}>View on Map</Text>
                        <Ionicons name="chevron-forward-circle" size={16} color="#8E2DE2" />
                    </TouchableOpacity>
                </View>

                {/* Map preview image */}
                <Image
                    source={{ uri: 'https://staticmap.openstreetmap.de/staticmap.php?center=6.4698,3.5852&zoom=14&size=700x300&markers=6.4698,3.5852,red-pushpin' }}
                    style={s.mapImg}
                    resizeMode="cover"
                />

                {/* Address */}
                <TouchableOpacity onPress={() => router.push('/get-direction')}>
                    <Text style={s.addrTxt}>Jegede Tayo No 4 Ibeju Lekki Lagos Nigeria</Text>
                </TouchableOpacity>
            </View>
        </>
    );
}

/* ══════════════════════════════════════════
   STYLESHEET
═══════════════════════════════════════════ */
const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#FFF',
    },

    /* ── Cover ── */
    coverWrap: {
        height: COVER_H,
        position: 'relative',
    },
    coverImg: {
        width: '100%',
        height: '100%',
    },
    backBtn: {
        marginTop: 52,
        marginLeft: 16,
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
        elevation: 3,
    },

    /* ── Profile block ── */
    profileBlock: {
        backgroundColor: '#FFF',
        alignItems: 'center',
        paddingBottom: 20,
        // pull block up so avatar overlaps cover
        marginTop: -(AVATAR_D / 2),
    },
    avatarShadow: {
        width: AVATAR_D,
        height: AVATAR_D,
        borderRadius: AVATAR_D / 2,
        borderWidth: 4,
        borderColor: '#FFF',
        overflow: 'hidden',
        backgroundColor: '#CCC',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
        marginTop: 14,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNum: {
        fontSize: 19,
        fontWeight: '800',
        color: '#111',
    },
    statLbl: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    hostName: {
        fontSize: 19,
        fontWeight: '800',
        color: '#111',
        marginTop: 12,
    },
    locRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 5,
    },
    locText: {
        fontSize: 13,
        color: '#888',
    },

    /* ── Tabs ── */
    tabBar: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#EBEBEB',
        backgroundColor: '#FFF',
    },
    tabBtn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
        position: 'relative',
    },
    tabTxt: {
        fontSize: 13,
        color: '#AAAAAA',
        fontWeight: '500',
    },
    tabTxtActive: {
        color: '#8E2DE2',
        fontWeight: '700',
    },
    tabLine: {
        position: 'absolute',
        bottom: 0,
        left: 16,
        right: 16,
        height: 2,
        borderRadius: 2,
        backgroundColor: '#8E2DE2',
    },

    /* ── Tab body ── */
    body: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: '#FFF',
    },

    /* ── Event cards ── */
    evCard: {
        flexDirection: 'row',
        marginBottom: 24,
        alignItems: 'flex-start',
    },
    evThumb: {
        width: 115,
        height: 115,
        borderRadius: 14,
        backgroundColor: '#DDD',
    },
    evInfo: {
        flex: 1,
        marginLeft: 14,
        paddingTop: 2,
    },
    catBadge: {
        backgroundColor: '#1A1A1A',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 8,
    },
    catTxt: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    evTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111',
        marginBottom: 6,
    },
    evLocRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 6,
    },
    evLocTxt: {
        fontSize: 13,
        color: '#888',
    },
    evPrice: {
        fontSize: 14,
        fontWeight: '800',
        color: '#8E2DE2',
    },
    evPriceSub: {
        fontSize: 12,
        fontWeight: '400',
        color: '#888',
    },

    /* ── Reviews ── */
    reviewRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 22,
        gap: 10,
    },
    rvAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    rvTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    rvUser: {
        fontSize: 13,
        fontWeight: '700',
        color: '#111',
    },
    rvTime: {
        fontSize: 12,
        color: '#888',
        marginLeft: 6,
    },
    rvBody: {
        fontSize: 13,
        color: '#444',
        lineHeight: 19,
        marginBottom: 6,
    },
    starsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    ratingTxt: {
        fontSize: 13,
        color: '#555',
        fontWeight: '600',
        marginLeft: 5,
    },
    photoGrid: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    photoCell: {
        flex: 1,
        height: 160,
        borderRadius: 14,
        backgroundColor: '#DDD',
    },

    /* ── About Host ── */
    section: {
        marginBottom: 28,
    },
    sectionHdr: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111',
    },
    readMoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    readMoreTxt: {
        fontSize: 13,
        color: '#888',
    },
    aboutTxt: {
        fontSize: 14,
        color: '#666',
        lineHeight: 21,
    },
    mgRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    mgAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
    },
    mgName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
    },
    mgRole: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    mgIconsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    mgIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EDE0FA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapImg: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        backgroundColor: '#E8E8E8',
        marginBottom: 10,
    },
    addrTxt: {
        fontSize: 13,
        color: '#8E2DE2',
        fontWeight: '500',
        textDecorationLine: 'underline',
    },

    /* ── FAB ── */
    fab: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 34,
        paddingTop: 12,
    },
    followBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 36,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#8E2DE2',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    followTxt: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
    reportBtn: {
        backgroundColor: '#FF0F6C',
        borderRadius: 36,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        shadowColor: '#FF0F6C',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
        elevation: 8,
    },
    reportTxt: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
});
