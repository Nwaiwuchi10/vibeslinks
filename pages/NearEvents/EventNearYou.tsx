import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { eventService } from '@/services/eventService';

const { width } = Dimensions.get('window');

type SortBy = 'distance' | 'date' | 'price';
type SortOrder = 'asc' | 'desc';

const SORT_OPTIONS: { label: string; value: SortBy }[] = [
    { label: 'Distance', value: 'distance' },
    { label: 'Date', value: 'date' },
    { label: 'Price', value: 'price' },
];

const normalizeEvent = (evt: any) => ({
    id: evt.id,
    title: evt.title,
    imageUrl: evt.imageUrl || evt.coverImageUrl || evt.eventPosterUrl || null,
    location: evt.locationText || evt.location || evt.venue || 'Lagos, Nigeria',
    dateTimeText: evt.dateTimeText || (evt.startsAt || evt.startDateTime || evt.date
        ? new Date(evt.startsAt || evt.startDateTime || evt.date).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }) : 'Upcoming'),
    priceText: evt.priceText || (evt.price !== undefined
        ? (evt.price > 0 ? `₦${Number(evt.price).toLocaleString()}` : 'Free')
        : (evt.ticketTiers?.[0]?.price
            ? `₦${Number(evt.ticketTiers[0].price).toLocaleString()}`
            : 'Free')),
    attendees: Array.isArray(evt.attendees)
        ? evt.attendees
        : (evt.attendees?.avatars || evt.peopleIFollowAttending || evt.followersAttending || []),
    distanceKm: evt.distanceKm as number | undefined,
    category: evt.category,
});

const EventNearYouScreen = () => {
    const [events, setEvents] = useState<ReturnType<typeof normalizeEvent>[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const LIMIT = 15;

    // Filters & sort
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortBy>('distance');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [showSort, setShowSort] = useState(false);

    const fetchEvents = useCallback(async (pageNum: number, replace = false) => {
        if (pageNum === 1) setLoading(true); else setLoadingMore(true);
        try {
            const result = await eventService.getEventsNearYou({
                radiusKm: '20',
                search: search || undefined,
                sortBy,
                sortOrder,
                page: pageNum,
                limit: LIMIT,
            });
            const normalized = (result.items ?? []).map(normalizeEvent);
            setEvents(prev => replace ? normalized : [...prev, ...normalized]);
            setTotal(result.total ?? normalized.length);
            setPage(pageNum);
        } catch (err) {
            console.log('[EventNearYouScreen] fetch error:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [search, sortBy, sortOrder]);

    useEffect(() => {
        fetchEvents(1, true);
    }, [fetchEvents]);

    const handleLoadMore = () => {
        if (!loadingMore && events.length < total) {
            fetchEvents(page + 1);
        }
    };

    const hasMore = events.length < total;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.headerIconButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Events Near You</Text>
                <TouchableOpacity
                    style={styles.headerIconButton}
                    onPress={() => setShowSort(s => !s)}
                >
                    <MaterialCommunityIcons name="sort" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchRow}>
                <View style={styles.searchBox}>
                    <Ionicons name="search-outline" size={16} color="#999" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search by event or venue..."
                        placeholderTextColor="#BBB"
                        value={search}
                        onChangeText={setSearch}
                        returnKeyType="search"
                        onSubmitEditing={() => fetchEvents(1, true)}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={16} color="#BBB" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Sort Panel */}
            {showSort && (
                <View style={styles.sortPanel}>
                    <Text style={styles.sortLabel}>Sort by</Text>
                    <View style={styles.sortRow}>
                        {SORT_OPTIONS.map(opt => (
                            <TouchableOpacity
                                key={opt.value}
                                style={[styles.sortChip, sortBy === opt.value && styles.sortChipActive]}
                                onPress={() => { setSortBy(opt.value); setShowSort(false); }}
                            >
                                <Text style={[styles.sortChipText, sortBy === opt.value && styles.sortChipTextActive]}>
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View style={styles.sortRow}>
                        {(['asc', 'desc'] as SortOrder[]).map(o => (
                            <TouchableOpacity
                                key={o}
                                style={[styles.sortChip, sortOrder === o && styles.sortChipActive]}
                                onPress={() => { setSortOrder(o); setShowSort(false); }}
                            >
                                <Text style={[styles.sortChipText, sortOrder === o && styles.sortChipTextActive]}>
                                    {o === 'asc' ? '↑ Ascending' : '↓ Descending'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            )}

            {/* Stats bar */}
            {!loading && (
                <View style={styles.statsBar}>
                    <Text style={styles.statsText}>{total} event{total !== 1 ? 's' : ''} found</Text>
                    <Text style={styles.statsText}>
                        Sorted by {sortBy} {sortOrder === 'asc' ? '↑' : '↓'}
                    </Text>
                </View>
            )}

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : events.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                    <Ionicons name="location-outline" size={48} color="#CCC" />
                    <Text style={{ color: '#999', marginTop: 12, fontSize: 14, textAlign: 'center' }}>
                        No events found near you
                    </Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {events.map((event) => (
                        <TouchableOpacity
                            key={event.id}
                            style={styles.card}
                            onPress={() => router.push({ pathname: '/event-details', params: { id: event.id } })}
                            activeOpacity={0.9}
                        >
                            {/* Image */}
                            {event.imageUrl ? (
                                <Image source={{ uri: event.imageUrl }} style={styles.cardImage} />
                            ) : (
                                <Image source={require('../../assets/images/redvive.png')} style={styles.cardImage} />
                            )}

                            {/* Distance badge */}
                            {event.distanceKm !== undefined && (
                                <View style={styles.distanceBadge}>
                                    <Ionicons name="navigate" size={10} color="#FFF" />
                                    <Text style={styles.distanceBadgeText}>{event.distanceKm.toFixed(1)} km</Text>
                                </View>
                            )}

                            {/* Category badge */}
                            {event.category && (
                                <View style={styles.categoryBadge}>
                                    <Text style={styles.categoryBadgeText}>{String(event.category).toUpperCase()}</Text>
                                </View>
                            )}

                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{event.title}</Text>

                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="location" size={14} color={Colors.primary} />
                                        <Text style={styles.infoText} numberOfLines={1}>{event.location}</Text>
                                    </View>
                                    <View style={[styles.infoItem, { marginLeft: 12 }]}>
                                        <MaterialIcons name="access-time" size={14} color={Colors.primary} />
                                        <Text style={styles.infoText}>{event.dateTimeText}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.priceText}>
                                        {event.priceText} <Text style={styles.priceSub}>/Person</Text>
                                    </Text>
                                    {event.attendees.length > 0 && (
                                        <View style={styles.attendingContainer}>
                                            {event.attendees.slice(0, 4).map((att: any, idx: number) => (
                                                <Image
                                                    key={idx}
                                                    source={{ uri: att.avatarUrl || att.profilePictureUrl || `https://i.pravatar.cc/150?img=${idx + 5}` }}
                                                    style={[styles.avatar, { marginLeft: idx === 0 ? 0 : -8, zIndex: 10 - idx }]}
                                                />
                                            ))}
                                            {event.attendees.length > 4 && (
                                                <View style={[styles.avatar, styles.avatarMore, { marginLeft: -8 }]}>
                                                    <Text style={styles.avatarMoreText}>+{event.attendees.length - 4}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    {/* Load More */}
                    {hasMore && (
                        <TouchableOpacity style={styles.loadMoreBtn} onPress={handleLoadMore} disabled={loadingMore}>
                            {loadingMore
                                ? <ActivityIndicator size="small" color="#FFF" />
                                : <Text style={styles.loadMoreText}>Load More</Text>
                            }
                        </TouchableOpacity>
                    )}

                    <View style={{ height: 110 }} />
                </ScrollView>
            )}

            {/* Discover CTA */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.discoverButton}
                    activeOpacity={0.8}
                    onPress={() => router.push('/discover')}
                >
                    <Text style={styles.discoverButtonText}>Discover Events</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EventNearYouScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F9FAFB' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#F9FAFB',
    },
    headerIconButton: {
        width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1, borderColor: '#F0F0F0',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 3 },
        }),
    },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },
    searchRow: { paddingHorizontal: 20, paddingBottom: 12 },
    searchBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12,
        borderWidth: 1, borderColor: '#EEE', gap: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
            android: { elevation: 2 },
        }),
    },
    searchInput: { flex: 1, fontSize: 14, color: '#333', padding: 0 },
    sortPanel: {
        backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 16, padding: 16,
        marginBottom: 10, borderWidth: 1, borderColor: '#EEE',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
            android: { elevation: 4 },
        }),
    },
    sortLabel: { fontSize: 13, fontWeight: '700', color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
    sortRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8 },
    sortChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#EEE' },
    sortChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    sortChipText: { fontSize: 13, color: '#666', fontWeight: '600' },
    sortChipTextActive: { color: '#FFF' },
    statsBar: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingHorizontal: 20, paddingBottom: 8,
    },
    statsText: { fontSize: 12, color: '#999', fontWeight: '500' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 110 },
    card: {
        backgroundColor: '#FFF', borderRadius: 24, marginBottom: 20, overflow: 'hidden',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.08, shadowRadius: 15 },
            android: { elevation: 5 },
        }),
    },
    cardImage: { width: '100%', height: 220 },
    distanceBadge: {
        position: 'absolute', top: 14, right: 14,
        backgroundColor: Colors.primary, borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 5,
        flexDirection: 'row', alignItems: 'center', gap: 4,
    },
    distanceBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    categoryBadge: {
        position: 'absolute', top: 14, left: 14,
        backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 20,
        paddingHorizontal: 10, paddingVertical: 5,
    },
    categoryBadgeText: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
    cardBody: { padding: 18 },
    cardTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A2E', marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' },
    infoItem: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    infoText: { fontSize: 12, color: '#6B6B80', marginLeft: 5, fontWeight: '500', flex: 1 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    priceText: { fontSize: 17, fontWeight: '900', color: Colors.primary },
    priceSub: { fontSize: 12, color: '#999', fontWeight: '500' },
    attendingContainer: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: '#FFF' },
    avatarMore: { backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
    avatarMoreText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
    loadMoreBtn: {
        backgroundColor: Colors.primary, borderRadius: 24, paddingVertical: 14,
        alignItems: 'center', marginTop: 4, marginBottom: 16,
    },
    loadMoreText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
    bottomContainer: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, paddingTop: 15,
        backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.05, shadowRadius: 10 },
            android: { elevation: 10 },
        }),
    },
    discoverButton: {
        backgroundColor: Colors.primary, height: 60, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center',
    },
    discoverButtonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
