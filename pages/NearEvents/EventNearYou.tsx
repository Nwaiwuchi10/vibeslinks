import { Colors } from '../../constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';
import { eventService } from '@/services/eventService';
import { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';

const { width } = Dimensions.get('window');

const EVENTS = [
    {
        id: '1',
        title: 'Can You see my cute face',
        location: 'Lekki Ikala, Lagos Nigeria',
        date: 'May 15 - 9:00 PM',
        price: '₦130,000',
        image: require('../../assets/images/tiger_event.png'),
        attending: [5, 11, 8, 9, 12],
    },
    {
        id: '2',
        title: 'When i Wake Up In The M.',
        location: 'Lekki Ikala, Lagos Nigeria',
        date: 'May 15 - 9:00 PM',
        price: '₦10,000',
        image: require('../../assets/images/artist_event.png'),
        attending: [7, 6, 10, 3, 14],
    },
];

const EventNearYouScreen = () => {
    const nearYouEvents = useAppSelector((state) => state.event.nearYou);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventService.getEventsNearYou()
            .catch((err) => console.log('[EventNearYouScreen] Error fetching events:', err))
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
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.headerIconButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Event Near You</Text>

                <TouchableOpacity style={styles.headerIconButton}>
                    <Ionicons name="search-outline" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8E2DE2" />
                </View>
            ) : displayEvents.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
                    <Ionicons name="location-outline" size={48} color="#CCC" />
                    <Text style={{ color: '#999', marginTop: 12, fontSize: 14, textAlign: 'center' }}>No events near you found</Text>
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {displayEvents.map((event: any) => (
                        <TouchableOpacity 
                            key={event.id} 
                            style={styles.card}
                            onPress={() => router.push({
                                pathname: '/event-details',
                                params: { id: event.id }
                            })}
                            activeOpacity={0.9}
                        >
                            {event.imageUrl ? (
                                <Image source={{ uri: event.imageUrl }} style={styles.cardImage} />
                            ) : (
                                <Image source={require('../../assets/images/redvive.png')} style={styles.cardImage} />
                            )}

                            <View style={styles.cardBody}>
                                <Text style={styles.cardTitle}>{event.title}</Text>

                                <View style={styles.infoRow}>
                                    <View style={styles.infoItem}>
                                        <Ionicons name="location" size={16} color={Colors.primary} />
                                        <Text style={styles.infoText}>{event.location}</Text>
                                    </View>
                                    <View style={[styles.infoItem, { marginLeft: 15 }]}>
                                        <MaterialIcons name="access-time" size={16} color={Colors.primary} />
                                        <Text style={styles.infoText}>{event.dateTimeText}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardFooter}>
                                    <Text style={styles.priceContainer}>
                                        <Text style={styles.priceText}>{event.priceText}</Text>
                                        <Text style={styles.priceSubText}>/Person</Text>
                                    </Text>

                                    {event.attendees?.length > 0 && (
                                        <View style={styles.attendingContainer}>
                                            {event.attendees.slice(0, 4).map((att: any, idx: number) => (
                                                <Image
                                                    key={idx}
                                                    source={{ uri: att.avatarUrl || att.profilePictureUrl || `https://i.pravatar.cc/150?img=${idx + 5}` }}
                                                    style={[
                                                        styles.avatar,
                                                        { marginLeft: idx === 0 ? 0 : -8, zIndex: 10 - idx }
                                                    ]}
                                                />
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            )}

            {/* Bottom Button Container */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.discoverButton} activeOpacity={0.8}>
                    <Text style={styles.discoverButtonText}>Discover Events</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EventNearYouScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#F9FAFB',
    },
    headerIconButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 110,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 28,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.08,
                shadowRadius: 15,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    cardImage: {
        width: '100%',
        height: 240,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    cardBody: {
        padding: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#1A1A2E',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 13,
        color: '#6B6B80',
        marginLeft: 6,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    priceText: {
        fontSize: 18,
        fontWeight: '900',
        color: Colors.primary,
    },
    priceSubText: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
        marginLeft: 2,
    },
    attendingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        paddingTop: 15,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    discoverButton: {
        backgroundColor: Colors.primary,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discoverButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});

