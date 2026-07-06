import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TICKETS = [
    {
        id: 'general',
        name: 'General',
        perks: ['Priority entry'],
        price: '₦80,000',
        priceLabel: '₦80,000 /Person',
    },
    {
        id: 'vip',
        name: 'VIP',
        perks: ['Lounge access', 'Free drinks', 'Priority entry'],
        price: '₦150,000',
        priceLabel: '₦150,000 /Person',
    },
    {
        id: 'vvip',
        name: 'VVIP',
        perks: ['Backstage access', 'Meet artists', 'Premium seating'],
        price: '₦260,000',
        priceLabel: '₦260,000 /Person',
    },
];

export default function SelectTicketScreen() {
    const [selected, setSelected] = useState<string[]>(['general', 'vvip']);
    const [showSeatsModal, setShowSeatsModal] = useState(false);
    const [seats, setSeats] = useState({ general: 9, vvip: 3 });

    const toggleSelect = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const changeSeats = (type: 'general' | 'vvip', delta: number) => {
        setSeats(prev => ({
            ...prev,
            [type]: Math.max(0, prev[type] + delta),
        }));
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Ticket</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* 2-column grid */}
                <View style={styles.ticketGrid}>
                    {TICKETS.map((ticket) => {
                        const isSelected = selected.includes(ticket.id);
                        return (
                            <TouchableOpacity
                                key={ticket.id}
                                style={[
                                    styles.ticketCard,
                                    ticket.id === 'vvip' && styles.ticketCardFull,
                                    isSelected && styles.ticketCardSelected,
                                ]}
                                onPress={() => toggleSelect(ticket.id)}
                                activeOpacity={0.8}
                            >
                                {/* Radio */}
                                <View style={styles.radioRow}>
                                    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                        {isSelected && <View style={styles.radioInner} />}
                                    </View>
                                </View>

                                {/* Icon */}
                                <View style={[styles.ticketIconBox, isSelected && styles.ticketIconBoxSelected]}>
                                    <MaterialCommunityIcons
                                        name="ticket-outline"
                                        size={28}
                                        color={isSelected ? '#8E2DE2' : '#AAA'}
                                    />
                                </View>

                                <Text style={styles.ticketName}>{ticket.name}</Text>

                                {/* Perks */}
                                <View style={styles.perksBox}>
                                    {ticket.perks.map((perk, i) =>
                                        ticket.perks.length === 1 ? (
                                            <View key={i} style={styles.perkPill}>
                                                <Text style={styles.perkPillText}>{perk}</Text>
                                            </View>
                                        ) : (
                                            <Text key={i} style={styles.perkBullet}>• {perk}</Text>
                                        )
                                    )}
                                </View>

                                <Text style={[styles.ticketPrice, isSelected && styles.ticketPriceSelected]}>
                                    {ticket.priceLabel}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => setShowSeatsModal(true)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.ctaBtnText}>Number of  Seats  →</Text>
                </TouchableOpacity>
            </View>

            {/* Number of Seats Modal */}
            <Modal
                visible={showSeatsModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowSeatsModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowSeatsModal(false)} />
                    <View style={styles.seatsSheet}>
                        <Text style={styles.seatsTitle}>Number of  Seats</Text>

                        {(['general', 'vvip'] as const).map(type => (
                            <View key={type} style={styles.seatRow}>
                                <Text style={styles.seatLabel}>{type === 'general' ? 'General' : 'VVIP'}</Text>
                                <View style={styles.counterRow}>
                                    <TouchableOpacity
                                        style={styles.counterBtnMinus}
                                        onPress={() => changeSeats(type, -1)}
                                    >
                                        <Ionicons name="remove" size={18} color="#888" />
                                    </TouchableOpacity>
                                    <Text style={styles.counterValue}>{seats[type]}</Text>
                                    <TouchableOpacity
                                        style={styles.counterBtnPlus}
                                        onPress={() => changeSeats(type, 1)}
                                    >
                                        <Ionicons name="add" size={18} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}

                        <TouchableOpacity
                            style={styles.selectBtn}
                            onPress={() => {
                                setShowSeatsModal(false);
                                router.push('/book-ticket');
                            }}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.selectBtnText}>Select</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const CARD_W = (width - 56) / 2;

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
    scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
    ticketGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    ticketCard: {
        width: CARD_W,
        backgroundColor: '#FFF',
        borderRadius: 18,
        padding: 16,
        borderWidth: 2,
        borderColor: 'transparent',
        minHeight: 230,
    },
    ticketCardFull: {
        width: '100%',
    },
    ticketCardSelected: {
        borderColor: '#8E2DE2',
    },
    radioRow: {
        alignItems: 'flex-end',
        marginBottom: 12,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        borderColor: '#8E2DE2',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#8E2DE2',
    },
    ticketIconBox: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    ticketIconBoxSelected: {
        backgroundColor: '#EDE0FA',
    },
    ticketName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#222',
        marginBottom: 10,
    },
    perksBox: {
        flex: 1,
        marginBottom: 14,
    },
    perkPill: {
        backgroundColor: '#F2F2F2',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        alignSelf: 'flex-start',
    },
    perkPillText: { fontSize: 12, color: '#555', fontWeight: '500' },
    perkBullet: { fontSize: 13, color: '#555', marginBottom: 4 },
    ticketPrice: {
        fontSize: 14,
        fontWeight: '700',
        color: '#888',
    },
    ticketPriceSelected: {
        color: '#8E2DE2',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 24,
        backgroundColor: '#F5F5F7',
    },
    ctaBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
    },
    ctaBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
    // Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
    modalDismiss: { flex: 1 },
    seatsSheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 28,
        paddingBottom: 40,
    },
    seatsTitle: { fontSize: 18, fontWeight: '700', color: '#222', marginBottom: 24 },
    seatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    seatLabel: { fontSize: 15, color: '#888', fontWeight: '500' },
    counterRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    counterBtnMinus: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterBtnPlus: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterValue: { fontSize: 17, fontWeight: '700', color: '#333', minWidth: 24, textAlign: 'center' },
    selectBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        marginTop: 8,
    },
    selectBtnText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
});
