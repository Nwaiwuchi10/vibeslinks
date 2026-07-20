import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '../../../constants/Colors';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { eventService } from '@/services/eventService';

const TrendingNearYou = () => {
    const dispatch = useAppDispatch();
    const nearYouEvents = useAppSelector((state) => state.event.nearYou);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventService.getEventsNearYou()
            .catch((err) => { console.log('[TrendingNearYou] Error fetching near-you events:', err); })
            .finally(() => setLoading(false));
    }, []);

    const displayEvents = nearYouEvents.map((evt: any) => ({
        id: evt.id,
        title: evt.title,
        imageUrl: evt.imageUrl || evt.coverImageUrl || evt.eventPosterUrl || null,
        location: evt.location || evt.venue || evt.locationText || 'Lagos, Nigeria',
        dateTimeText: evt.dateTimeText || (evt.startDateTime ? new Date(evt.startDateTime).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }) : 'Upcoming'),
        priceText: evt.priceText || (evt.ticketPricingTiers?.[0]
            ? `₦${Number(evt.ticketPricingTiers[0].price).toLocaleString()}`
            : 'Free'),
        attendees: evt.attendees || [],
    }));

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

            {!loading && displayEvents.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="location-outline" size={36} color="#CCC" />
                    <Text style={styles.emptyText}>No events near you yet</Text>
                </View>
            )}

            {!loading && displayEvents.map((event: any) => (
                <TouchableOpacity
                    key={event.id}
                    style={styles.nearYouCard}
                    onPress={() => router.push({
                        pathname: '/event-details',
                        params: { id: event.id }
                    })}
                    activeOpacity={0.9}
                >
                    {event.imageUrl ? (
                        <Image source={{ uri: event.imageUrl }} style={styles.nearYouImage} />
                    ) : (
                        <Image source={require('../../../assets/images/redvive.png')} style={styles.nearYouImage} />
                    )}
                    
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
                                {event.attendees.slice(0, 4).map((att: any, i: number) => (
                                    <Image
                                        key={i}
                                        source={{ uri: att.avatarUrl || att.profilePictureUrl || `https://i.pravatar.cc/150?img=${i + 5}` }}
                                        style={[styles.attendingAvatar, { right: i * 15 }]}
                                    />
                                ))}
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
    nearYouTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center' },
    nearYouInfoText: { fontSize: 12, color: '#6B6B80', marginLeft: 4 },
    nearYouFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
