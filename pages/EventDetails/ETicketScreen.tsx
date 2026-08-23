import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { eventService } from '@/services/eventService';

const { width } = Dimensions.get('window');

interface TicketItem {
    tierName: string;
    seatNumber: string;
    qrCodeValue: string;
    ticketIndex: number;
    totalTickets: number;
}

export default function ETicketScreen() {
    const insets = useSafeAreaInsets();
    const params = useLocalSearchParams<{ eventId?: string; purchaseId?: string; view?: 'single' | 'all' }>();
    const reduxPurchase = useSelector((state: RootState) => state.event.lastPurchase);

    const [fetchedDetails, setFetchedDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(!!(params.eventId && params.purchaseId));
    
    // View state: 'single' (Carousel) or 'all' (All Tickets Summary)
    const [viewMode, setViewMode] = useState<'single' | 'all'>(params.view === 'all' ? 'all' : 'single');
    const [currentTicketIndex, setCurrentTicketIndex] = useState(0);

    useEffect(() => {
        if (params.eventId && params.purchaseId) {
            setLoading(true);
            eventService.getTicketPurchaseDetails(params.eventId, params.purchaseId)
                .then((res) => {
                    if (res) setFetchedDetails(res);
                })
                .catch((err) => {
                    console.warn('[ETicketScreen] Failed to fetch purchase details:', err);
                })
                .finally(() => setLoading(false));
        }
    }, [params.eventId, params.purchaseId]);

    const activePurchase = fetchedDetails || reduxPurchase;

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>E-Receipt</Text>
                    <View style={{ width: 44 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#8E2DE2" />
                </View>
            </SafeAreaView>
        );
    }

    if (!activePurchase) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>E-Receipt</Text>
                    <View style={{ width: 44 }} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#666', fontWeight: '500' }}>No ticket available.</Text>
                    <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 15, paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#8E2DE2', borderRadius: 12 }}>
                        <Text style={{ color: '#FFF', fontWeight: '600' }}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const ticketData = activePurchase?.ticket || activePurchase?.receipt || activePurchase?.purchase || activePurchase || {};
    const purchaseInfo = activePurchase?.purchase || activePurchase;
    const event = ticketData?.event || purchaseInfo?.event || {};
    const attendee = ticketData?.attendee || activePurchase?.user || {};
    
    // Process items / tiers
    const rawItems: any[] = ticketData?.ticketTypes || ticketData?.items || activePurchase?.items || [
        {
            tierName: purchaseInfo?.tierName || 'General',
            quantity: purchaseInfo?.quantity || 1,
            seatNumbers: purchaseInfo?.seatNumbers || ['E(71)'],
        }
    ];

    // Build individual tickets array for Carousel
    const individualTickets: TicketItem[] = [];
    rawItems.forEach((tier) => {
        const count = tier.quantity || 1;
        const baseSeatList = tier.seatNumbers && tier.seatNumbers.length > 0
            ? tier.seatNumbers
            : Array.from({ length: count }, (_, i) => `E(${70 + i})`);

        for (let i = 0; i < count; i++) {
            const seatNum = baseSeatList[i] || `E(${70 + i})`;
            individualTickets.push({
                tierName: tier.tierName || 'General',
                seatNumber: seatNum.startsWith('E(') ? seatNum : `E(${seatNum})`,
                qrCodeValue: `vibezlink://events/${event?.id || 'event'}/tickets/${purchaseInfo?.id || 'ticket'}?tier=${encodeURIComponent(tier.tierName || 'General')}&seat=${encodeURIComponent(seatNum)}`,
                ticketIndex: individualTickets.length,
                totalTickets: 0, // updated below
            });
        }
    });

    individualTickets.forEach((t) => { t.totalTickets = individualTickets.length; });

    const totalTicketsCount = individualTickets.length || 1;
    const safeIndex = Math.min(Math.max(0, currentTicketIndex), totalTicketsCount - 1);
    const activeSingleTicket = individualTickets[safeIndex] || {
        tierName: 'General',
        seatNumber: 'E(71)',
        qrCodeValue: `vibezlink://events/${event?.id || 'event'}/tickets/${purchaseInfo?.id || 'ticket'}`,
        ticketIndex: 0,
        totalTickets: 1,
    };

    const groupQrCodeValue = ticketData?.qrCodeValue || activePurchase?.qrCodeValue || `vibezlink://events/${event?.id || 'event'}/tickets/${purchaseInfo?.id || 'ticket'}`;
    const singleQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(activeSingleTicket.qrCodeValue)}`;
    const groupQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(groupQrCodeValue)}`;

    const handlePrevTicket = () => {
        setCurrentTicketIndex((prev) => (prev > 0 ? prev - 1 : totalTicketsCount - 1));
    };

    const handleNextTicket = () => {
        setCurrentTicketIndex((prev) => (prev < totalTicketsCount - 1 ? prev + 1 : 0));
    };

    const handleDownloadETicket = async () => {
        try {
            const content = viewMode === 'single'
                ? `
VIBEZLINK E-TICKET (${activeSingleTicket.ticketIndex + 1}/${totalTicketsCount})
=========================
Event: ${event?.title || 'Event'}
Date/Time: ${event?.dateTimeText || 'TBD'}
Attendee: ${attendee?.fullName || 'N/A'}
Ticket Type: ${activeSingleTicket.tierName}
Seat: ${activeSingleTicket.seatNumber}
Verify Code: ${activeSingleTicket.qrCodeValue}
=========================
Present this at the venue entrance.
                `.trim()
                : `
VIBEZLINK ALL TICKETS (${totalTicketsCount} Total)
=========================
Event: ${event?.title || 'Event'}
Date/Time: ${event?.dateTimeText || 'TBD'}
Attendee: ${attendee?.fullName || 'N/A'}
${rawItems.map((item: any) => `• ${item.tierName} (x${item.quantity}): ${item.seatNumbers ? item.seatNumbers.join(', ') : 'General'}`).join('\n')}
Booking Code: ${groupQrCodeValue}
=========================
Present this at the venue entrance.
                `.trim();

            await Share.share({
                message: content,
                title: `${event?.title || 'Event'} - E-Ticket`,
            });
        } catch (err) {
            console.warn('[ETicketScreen] Download/Share error:', err);
            Alert.alert('Error', 'Unable to download or share ticket.');
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header (Screenshot 2, 3, 4) */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>E-Receipt</Text>

                {/* Right Mode Toggle Pill: "General ↓" in single view, "All Tickets →" in all view */}
                {viewMode === 'single' ? (
                    <TouchableOpacity
                        style={styles.pillButton}
                        activeOpacity={0.85}
                        onPress={() => setViewMode('all')}
                    >
                        <MaterialCommunityIcons name="book-open-outline" size={14} color="#FFF" />
                        <Text style={styles.pillButtonText}>{activeSingleTicket.tierName}</Text>
                        <Ionicons name="arrow-down" size={13} color="#FFF" />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={styles.pillButton}
                        activeOpacity={0.85}
                        onPress={() => setViewMode('single')}
                    >
                        <MaterialCommunityIcons name="book-open-outline" size={14} color="#FFF" />
                        <Text style={styles.pillButtonText}>All Tickets</Text>
                        <Ionicons name="arrow-forward" size={13} color="#FFF" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Event Cover Banner */}
                <View style={styles.bannerCard}>
                    <Image
                        source={event?.imageUrl ? { uri: event.imageUrl } : { uri: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600' }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>

                {/* Buyer / Event Info Details */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>{attendee?.fullName || 'Roland Emmanuel'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Event Name</Text>
                        <Text style={styles.infoValue}>{event?.title || 'Deejay Coded Showcase'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Event Date and Time</Text>
                        <Text style={styles.infoValue}>{event?.dateTimeText || 'May 15 – 9:00 PM'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Event Name</Text>
                        <Text style={styles.infoValue}>{event?.title || 'Deejay Coded Showcase'}</Text>
                    </View>
                </View>

                {/* VIEW MODE 1: SINGLE TICKET CAROUSEL (Screenshots 2 & 4) */}
                {viewMode === 'single' && (
                    <>
                        {/* Ticket Type & Seat Header */}
                        <View style={styles.singleTicketTypeHeader}>
                            <View>
                                <Text style={styles.typeSeatLabel}>Ticket Type</Text>
                                <Text style={styles.typeSeatValue}>{activeSingleTicket.tierName}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.typeSeatLabel}>Seat</Text>
                                <Text style={styles.typeSeatValue}>{activeSingleTicket.seatNumber}</Text>
                            </View>
                        </View>

                        {/* Centered Single QR Code Card */}
                        <View style={styles.qrCard}>
                            <Image
                                source={{ uri: singleQrUrl }}
                                style={styles.qrImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Carousel Pagination Bottom Bar (Screenshots 2 & 4) */}
                        <View style={styles.carouselControlsRow}>
                            <TouchableOpacity style={styles.carouselArrowBtn} onPress={handlePrevTicket} activeOpacity={0.8}>
                                <Ionicons name="arrow-back" size={16} color="#333" />
                            </TouchableOpacity>

                            {/* Pagination Dots */}
                            <View style={styles.dotsContainer}>
                                {Array.from({ length: totalTicketsCount }).map((_, idx) => (
                                    <View
                                        key={idx}
                                        style={[
                                            styles.dot,
                                            idx === safeIndex ? styles.dotActive : styles.dotInactive,
                                        ]}
                                    />
                                ))}
                            </View>

                            <TouchableOpacity style={styles.carouselArrowBtnPurple} onPress={handleNextTicket} activeOpacity={0.8}>
                                <Ionicons name="arrow-forward" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        {/* Download E-Ticket Link */}
                        <TouchableOpacity style={styles.downloadLinkBtn} onPress={handleDownloadETicket} activeOpacity={0.7}>
                            <Text style={styles.downloadLinkText}>Download E-Ticket</Text>
                        </TouchableOpacity>
                    </>
                )}

                {/* VIEW MODE 2: ALL TICKETS GROUP VIEW (Screenshot 3) */}
                {viewMode === 'all' && (
                    <>
                        {/* Ticket Type & Seat Table */}
                        <View style={styles.allTicketsTable}>
                            <View style={styles.tableHeaderRow}>
                                <Text style={styles.typeSeatLabel}>Ticket Type</Text>
                                <Text style={styles.typeSeatLabel}>Seat</Text>
                            </View>
                            {rawItems.map((type: any, idx: number) => {
                                const seatString = type.seatNumbers && type.seatNumbers.length > 0
                                    ? `E(${type.seatNumbers.map((s: string) => s.replace(/[^0-9]/g, '')).filter(Boolean).join(',')})`
                                    : `E(${Array.from({ length: type.quantity || 1 }, (_, i) => 70 + i).join(',')})`;

                                return (
                                    <View key={idx} style={styles.tableDataRow}>
                                        <Text style={styles.typeSeatValue}>{type.tierName}</Text>
                                        <Text style={[styles.typeSeatValue, { textAlign: 'right', flex: 1, marginLeft: 16 }]}>
                                            {seatString}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>

                        {/* Centered Group QR Code Card */}
                        <View style={styles.qrCard}>
                            <Image
                                source={{ uri: groupQrUrl }}
                                style={styles.qrImage}
                                resizeMode="contain"
                            />
                        </View>

                        {/* Bottom Actions for All Tickets: Purple Download Button + Get Direction Link */}
                        <View style={styles.allTicketsActionCol}>
                            <TouchableOpacity style={styles.primaryPurpleBtn} onPress={handleDownloadETicket} activeOpacity={0.85}>
                                <Text style={styles.primaryPurpleBtnText}>Download E-Ticket</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.getDirectionBtn}
                                onPress={() => router.push('/get-direction')}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.getDirectionBtnText}>Get Direction</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8F9FA' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EBEBEB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 20, fontWeight: '800', color: '#1E2026' },
    pillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#7C3AED',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    pillButtonText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 6 },
    bannerCard: {
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 18,
        height: 180,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    infoSection: {
        marginBottom: 16,
        gap: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: { fontSize: 14, color: '#9CA3AF', fontWeight: '500' },
    infoValue: { fontSize: 14, color: '#111827', fontWeight: '700', flexShrink: 1, textAlign: 'right', marginLeft: 10 },
    
    // Single ticket headers & all ticket tables
    singleTicketTypeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 14,
    },
    allTicketsTable: {
        marginVertical: 14,
        gap: 10,
    },
    tableHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    tableDataRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    typeSeatLabel: { fontSize: 13, color: '#9CA3AF', fontWeight: '600' },
    typeSeatValue: { fontSize: 15, color: '#111827', fontWeight: '800', marginTop: 2 },

    // QR Card
    qrCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        alignItems: 'center',
        marginVertical: 12,
        alignSelf: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.06, shadowRadius: 12 },
            android: { elevation: 3 },
        }),
    },
    qrImage: {
        width: 220,
        height: 220,
    },

    // Carousel Controls (Screenshots 2 & 4)
    carouselControlsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16,
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    carouselArrowBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    carouselArrowBtnPurple: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#7C3AED',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 3.5,
    },
    dotActive: {
        backgroundColor: '#7C3AED',
        width: 9,
        height: 9,
        borderRadius: 4.5,
    },
    dotInactive: {
        backgroundColor: '#E5E7EB',
    },
    downloadLinkBtn: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    downloadLinkText: {
        color: '#7C3AED',
        fontSize: 16,
        fontWeight: '700',
    },

    // All Tickets Action Col (Screenshot 3)
    allTicketsActionCol: {
        marginTop: 16,
        gap: 12,
    },
    primaryPurpleBtn: {
        backgroundColor: '#7C3AED',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10 },
            android: { elevation: 6 },
        }),
    },
    primaryPurpleBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    getDirectionBtn: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    getDirectionBtnText: {
        color: '#7C3AED',
        fontSize: 15,
        fontWeight: '700',
    },
});
