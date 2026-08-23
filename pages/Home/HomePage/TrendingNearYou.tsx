import { eventService } from '@/services/eventService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';
import { resolveImageUrl } from '@/services/apiClient';

const TrendingNearYou = ({ refreshKey }: { refreshKey?: number }) => {
    const dispatch = useAppDispatch();
    const nearYouEvents = useAppSelector((state) => state.event.nearYou);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        eventService.getEventsNearYou({ radiusKm: '20', limit: 3, sortBy: 'distance' })
            .catch((err) => { console.log('[TrendingNearYou] Error fetching near-you events:', err); })
            .finally(() => setLoading(false));
    }, [refreshKey]);

    const displayEvents = nearYouEvents.map((evt: any) => ({
        id: evt.id,
        title: evt.title,
        imageUrl: resolveImageUrl(evt.imageUrl || evt.coverImageUrl || evt.eventPosterUrl || null),
        location: evt.locationText || evt.location || evt.venue || 'Lagos, Nigeria',
        dateTimeText: evt.dateTimeText || (evt.startsAt || evt.startDateTime || evt.date ? new Date(evt.startsAt || evt.startDateTime || evt.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }) : 'Upcoming'),
        priceText: evt.priceText || (evt.price !== undefined ? (evt.price > 0 ? `₦${Number(evt.price).toLocaleString()}` : 'Free') : (evt.ticketTiers?.[0]?.price
            ? `₦${Number(evt.ticketTiers[0].price).toLocaleString()}`
            : 'Free')),
        attendees: Array.isArray(evt.attendees) ? evt.attendees : (evt.attendees?.avatars || evt.peopleIFollowAttending || evt.followersAttending || []),
        distanceKm: evt.distanceKm,
    }));

    if (!loading && displayEvents.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Near you</Text>
                <TouchableOpacity onPress={() => router.push('/event-near-you')}>
                    <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={12} /></Text>
                </TouchableOpacity>
            </View>

            {loading && (
                <View style={styles.skeleton}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonLine} />
                    <View style={[styles.skeletonLine, { width: '60%' }]} />
                </View>
            )}

            {!loading && displayEvents.slice(0, 3).map((event: any) => (
                <TouchableOpacity
                    key={event.id}
                    style={styles.nearYouCard}
                    onPress={() => router.push({
                        pathname: '/event-details',
                        params: { id: event.id }
                    })}
                    activeOpacity={0.9}
                >
                    <View style={{ position: 'relative' }}>
                        {event.imageUrl ? (
                            <Image source={{ uri: event.imageUrl }} style={styles.nearYouImage} />
                        ) : (
                            <Image source={require('../../../assets/images/redvive.png')} style={styles.nearYouImage} />
                        )}
                        {event.distanceKm !== undefined && (
                            <View style={styles.distanceBadge}>
                                <Ionicons name="navigate" size={10} color="#FFF" />
                                <Text style={styles.distanceBadgeText}>{Number(event.distanceKm).toFixed(1)} km</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.nearYouTitle}>{event.title}</Text>

                    <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                            <Ionicons name="location" size={14} color={Colors.primary} />
                            <Text style={styles.nearYouInfoText}>{event.location}</Text>
                        </View>
                        <View style={[styles.infoItem, { marginLeft: 16 }]}>
                            <Ionicons name="calendar" size={14} color={Colors.primary} />
                            <Text style={styles.nearYouInfoText}>{event.dateTimeText}</Text>
                        </View>
                    </View>

                    <View style={styles.nearYouFooter}>
                        <Text style={styles.priceHighlight}>
                            {event.priceText} <Text style={styles.priceSub}>/ Person</Text>
                        </Text>
                        {event.attendees?.length > 0 && (
                            <View style={styles.attendingStack}>
                                {event.attendees.slice(0, 4).map((att: any, i: number) => {
                                    const avatar = resolveImageUrl(att.avatarUrl || att.profilePictureUrl || null) || `https://i.pravatar.cc/150?img=${i + 5}`;
                                    return (
                                        <Image
                                            key={i}
                                            source={{ uri: avatar }}
                                            style={[styles.attendingAvatar, { right: i * 15 }]}
                                        />
                                    );
                                })}
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};


export default TrendingNearYou;

const styles = StyleSheet.create({
    container: { marginBottom: 30 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
    seeAllText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
    skeleton: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    skeletonImage: {
        width: '100%',
        height: 180,
        backgroundColor: '#E8E8E8',
        borderRadius: 16,
        marginBottom: 10,
    },
    skeletonLine: {
        height: 14,
        backgroundColor: '#EEEEEE',
        borderRadius: 8,
        marginBottom: 8,
        width: '80%',
    },
    emptyState: {
        paddingVertical: 30,
        alignItems: 'center',
    },
    emptyText: { color: '#BBB', fontSize: 14, marginTop: 8 },
    nearYouCard: { paddingHorizontal: 20 },
    nearYouImage: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        marginBottom: 12,
    },
    distanceBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: Colors.primary,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    distanceBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    nearYouTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center' },
    nearYouInfoText: { fontSize: 12, color: '#6B6B80', marginLeft: 4 },
    nearYouFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    priceHighlight: { fontSize: 16, color: Colors.primary, fontWeight: '800' },
    priceSub: { fontSize: 12, color: '#8A8A8A', fontWeight: '500' },
    attendingStack: { flexDirection: 'row', position: 'relative', height: 24, width: 80 },
    attendingAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#FFF',
        position: 'absolute',
    },
});
