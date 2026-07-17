import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function ETicketScreen() {
    const lastPurchase = useSelector((state: RootState) => state.event.lastPurchase);

    if (!lastPurchase || !lastPurchase.ticket) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No ticket available.</Text>
                    <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 15, padding: 10, backgroundColor: '#8E2DE2', borderRadius: 8 }}>
                        <Text style={{ color: '#FFF' }}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const { ticket } = lastPurchase;
    const { event, attendee, ticketTypes } = ticket;

    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(ticket.qrCodeValue || 'vibezlink://ticket')}`;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>E-Ticket</Text>
                <TouchableOpacity style={styles.allTicketsBtn} onPress={() => router.push('/tickets')}>
                    <MaterialCommunityIcons name="ticket-outline" size={14} color="#FFF" />
                    <Text style={styles.allTicketsText}>All Tickets</Text>
                    <Ionicons name="arrow-forward" size={14} color="#FFF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Event Banner */}
                <View style={styles.bannerCard}>
                    <Image
                        source={event.imageUrl ? { uri: event.imageUrl } : { uri: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600' }}
                        style={styles.bannerImage}
                        resizeMode="cover"
                    />
                </View>

                <View style={styles.divider} />

                {/* Buyer / Event Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>{attendee.fullName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Event Name</Text>
                        <Text style={styles.infoValue}>{event.title}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Event Date and Time</Text>
                        <Text style={styles.infoValue}>{event.dateTimeText}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Ticket Type & Seat Table */}
                <View style={styles.tableSection}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.tableHeaderLabel}>Ticket Type</Text>
                        <Text style={styles.tableHeaderLabel}>Seat</Text>
                    </View>
                    {ticketTypes.map((type: any, idx: number) => (
                        <View key={idx} style={styles.tableRow}>
                            <Text style={styles.tableRowType}>{type.tierName} (x{type.quantity})</Text>
                            <Text style={styles.tableRowSeat} numberOfLines={2}>
                                {type.seatNumbers && type.seatNumbers.length > 0 
                                  ? type.seatNumbers.join(', ') 
                                  : 'General Entry'}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* QR Code */}
                <View style={styles.qrCard}>
                    <Image
                        source={{ uri: qrCodeUrl }}
                        style={styles.qrImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={{ height: 140 }} />
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
                    <Text style={styles.primaryBtnText}>Download E-Ticket</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.ghostBtn}
                    onPress={() => router.push('/get-direction')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.ghostBtnText}>Get Direction</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
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
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#222' },
    allTicketsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#8E2DE2',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 24,
        gap: 6,
    },
    allTicketsText: { color: '#FFF', fontSize: 13, fontWeight: '600' },
    scrollContent: { paddingHorizontal: 20, paddingTop: 4 },
    bannerCard: {
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 20,
        height: 200,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    divider: { height: 1, backgroundColor: '#EBEBEB', marginVertical: 16 },
    infoSection: { gap: 14 },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: { fontSize: 14, color: '#999' },
    infoValue: {
        fontSize: 14,
        color: '#222',
        fontWeight: '600',
        flexShrink: 1,
        marginLeft: 12,
        textAlign: 'right',
    },
    tableSection: { marginTop: 4 },
    tableHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    tableHeaderLabel: { fontSize: 13, color: '#999', fontWeight: '500' },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    tableRowType: { fontSize: 15, fontWeight: '700', color: '#222' },
    tableRowSeat: {
        fontSize: 13,
        color: '#555',
        flexShrink: 1,
        marginLeft: 16,
        textAlign: 'right',
    },
    qrCard: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    qrImage: {
        width: 180,
        height: 180,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 12,
        backgroundColor: '#F5F5F7',
        gap: 12,
    },
    primaryBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
    },
    primaryBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
    ghostBtn: { alignItems: 'center', paddingVertical: 6 },
    ghostBtnText: { fontSize: 16, color: '#8E2DE2', fontWeight: '500' },
});
