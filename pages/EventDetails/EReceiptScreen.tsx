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

export default function EReceiptScreen() {
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
                        source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=VibezLinkTicket12345' }}
                        style={styles.qrImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.divider} />

                {/* Event Details */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Event Name</Text>
                        <Text style={styles.rowValue}>Deejay Coded Showcase</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Event Category</Text>
                        <Text style={styles.rowValue}>Nightlife</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Event Date and Time</Text>
                        <Text style={styles.rowValue}>May 15 - 9:00 PM</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Organizer</Text>
                        <Text style={styles.rowValue}>Vibez Nation</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Buyer Info */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Full Name</Text>
                        <Text style={styles.rowValue}>Roland Emmanuel</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Phone Number</Text>
                        <Text style={styles.rowValue}>234 9384058382</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Email</Text>
                        <Text style={styles.rowValue} numberOfLines={1}>rolandemmanuell03@gmai.com</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Ticket Breakdown */}
                <View style={styles.section}>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>09 General Ticket</Text>
                        <Text style={styles.rowValue}>₦720,000</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>03 VVIP Ticket</Text>
                        <Text style={styles.rowValue}>₦780,000</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Fees</Text>
                        <Text style={styles.rowValue}>$3.5</Text>
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
