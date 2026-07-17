import React from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export default function EReceiptScreen() {
    const lastPurchase = useSelector((state: RootState) => state.event.lastPurchase);

    if (!lastPurchase || !lastPurchase.receipt) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No receipt available.</Text>
                    <TouchableOpacity onPress={() => router.replace('/')} style={{ marginTop: 15, padding: 10, backgroundColor: '#8E2DE2', borderRadius: 8 }}>
                        <Text style={{ color: '#FFF' }}>Go to Home</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const { receipt } = lastPurchase;
    const { event, attendee, items, summary } = receipt;

    // QR Server API requires url encoded value
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(receipt.qrCodeValue || 'vibezlink://ticket')}`;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>E-Receipt</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* QR Code */}
                <View style={styles.qrCard}>
                    <Image
                        source={{ uri: qrCodeUrl }}
                        style={styles.qrImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.divider} />

                {/* Event Details */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Event Name</Text>
                        <Text style={styles.rowValue}>{event.title}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Event Category</Text>
                        <Text style={styles.rowValue}>{(event.category || 'Event').toUpperCase()}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Event Date and Time</Text>
                        <Text style={styles.rowValue}>{event.dateTimeText}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Organizer</Text>
                        <Text style={styles.rowValue}>{event.organizer || 'Vibez Nation'}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Buyer Info */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Full Name</Text>
                        <Text style={styles.rowValue}>{attendee.fullName}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Phone Number</Text>
                        <Text style={styles.rowValue}>{attendee.phoneNumber || 'N/A'}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Email</Text>
                        <Text style={styles.rowValue} numberOfLines={1}>{attendee.email}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Ticket Breakdown */}
                <View style={styles.section}>
                    {items.map((item: any, idx: number) => (
                        <View key={idx} style={styles.row}>
                            <Text style={styles.rowLabel}>{item.quantity.toString().padStart(2, '0')} {item.tierName} Ticket</Text>
                            <Text style={styles.rowValue}>{item.currency || '₦'}{item.totalAmount.toLocaleString()}</Text>
                        </View>
                    ))}
                    {summary?.lineItems?.map((line: any, idx: number) => (
                        line.label.toLowerCase().includes('fee') && (
                            <View key={idx} style={styles.row}>
                                <Text style={styles.rowLabel}>{line.label}</Text>
                                <Text style={styles.rowValue}>{line.value}</Text>
                            </View>
                        )
                    ))}
                    <View style={[styles.row, { marginTop: 8 }]}>
                        <Text style={[styles.rowLabel, { fontWeight: '700', color: '#333' }]}>Total</Text>
                        <Text style={[styles.rowValue, { fontWeight: '800', color: '#8E2DE2', fontSize: 16 }]}>{summary?.totalLabel}</Text>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Actions */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.85}>
                    <Text style={styles.primaryBtnText}>Download E-Receipt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.ghostBtn}
                    onPress={() => router.push('/e-ticket')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.ghostBtnText}>View E-Ticket</Text>
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
    scrollContent: { paddingHorizontal: 20, paddingTop: 8 },
    qrCard: {
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 24,
        alignItems: 'center',
        marginBottom: 16,
    },
    qrImage: {
        width: 200,
        height: 200,
    },
    divider: { height: 1, backgroundColor: '#EBEBEB', marginVertical: 16 },
    section: { gap: 14 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    rowLabel: { fontSize: 14, color: '#999' },
    rowValue: { fontSize: 14, color: '#222', fontWeight: '600', flexShrink: 1, marginLeft: 12, textAlign: 'right' },
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
