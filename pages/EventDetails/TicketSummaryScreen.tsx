import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { setLastPurchase } from '@/store/slices/eventSlice';
import { eventService } from '@/services/eventService';

export default function TicketSummaryScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const dispatch = useDispatch();
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
    const [isPaying, setIsPaying] = useState(false);

    const bookingInfo = useSelector((state: RootState) => state.event.bookingInfo);
    const event = useSelector((state: RootState) => state.event.currentEvent);

    if (!bookingInfo || !event) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No booking in progress.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const ticketTiers = event.ticketTiers || event.ticketCards?.tickets || [];
    const selectedTierIds = Object.keys(bookingInfo.selectedTiers);

    // Dynamic event details mapping
    const eventImage = event.hero?.imageUrl || event.imageUrl || event.eventPosterUrl || '';
    const eventTitle = event.summary?.title || event.title || 'Untitled Event';
    const eventCategory = event.summary?.categoryLabel || event.category || 'Event';
    const eventLocation = event.summary?.locationText || event.location || 'TBD';

    // Compute prices
    let subtotal = 0;
    const itemsList: any[] = [];
    selectedTierIds.forEach(tierId => {
        const tier = ticketTiers.find((t: any) => t.id === tierId);
        const qty = bookingInfo.selectedTiers[tierId] || 0;
        if (tier && qty > 0) {
            const price = tier.price || parseFloat(tier.priceText?.replace(/[^0-9]/g, '')) || 0;
            const itemTotal = price * qty;
            subtotal += itemTotal;
            itemsList.push({
                tierId,
                name: tier.name || tier.label || 'Ticket',
                quantity: qty,
                priceText: tier.priceText || `₦${price.toLocaleString()}`,
                totalText: `₦${itemTotal.toLocaleString()}`
            });
        }
    });

    const fee = Math.round(subtotal * 0.035); // 3.5% fee
    const total = subtotal + fee;

    const handlePay = async () => {
        if (isPaying) return;
        setIsPaying(true);
        try {
            const payload = {
                items: selectedTierIds.map(tierId => ({
                    tierId,
                    quantity: bookingInfo.selectedTiers[tierId],
                })),
                paymentMethod: paymentMethod === 'card' ? 'stripe-card' : 'bank-transfer',
                buyer: bookingInfo.buyer,
            };

            const res = await eventService.purchaseTickets(id || event.id, payload);
            dispatch(setLastPurchase(res));
            setShowPayment(false);
            router.push('/booking-success');
        } catch (err) {
            console.warn('[TicketSummaryScreen] Purchase failed:', err);
        } finally {
            setIsPaying(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ticket Summary</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Event Info Card */}
                <View style={styles.eventCard}>
                    <Image
                        source={eventImage ? { uri: eventImage } : require('../../assets/images/burna_boy.png')}
                        style={styles.eventImage}
                    />
                    <View style={styles.eventInfo}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{eventCategory.toUpperCase()}</Text>
                        </View>
                        <Text style={styles.eventName}>{eventTitle}</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={13} color="#8E2DE2" />
                            <Text style={styles.locationText}>{eventLocation}</Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Buyer Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>{bookingInfo.buyer.fullName}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone Number</Text>
                        <Text style={styles.infoValue}>{bookingInfo.buyer.phoneNumber}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>{bookingInfo.buyer.email}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Ticket Breakdown */}
                <View style={styles.infoSection}>
                    {itemsList.map((item, idx) => (
                        <View key={idx} style={styles.infoRow}>
                            <Text style={styles.infoLabel}>{item.quantity.toString().padStart(2, '0')} {item.name} Ticket</Text>
                            <Text style={styles.infoValue}>{item.totalText}</Text>
                        </View>
                    ))}
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fees (3.5%)</Text>
                        <Text style={styles.infoValue}>₦{fee.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Total */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₦{total.toLocaleString()}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Payment Method Display */}
                <View style={styles.paymentRow}>
                    <View style={styles.paymentLeft}>
                        <MaterialCommunityIcons name="credit-card-outline" size={22} color="#888" />
                        <Text style={styles.paymentLabel}>{paymentMethod === 'card' ? 'Debit Card' : 'Transfer'}</Text>
                    </View>
                    <TouchableOpacity style={styles.changeRow} onPress={() => setShowPayment(true)}>
                        <Text style={styles.changeText}>Change</Text>
                        <Ionicons name="chevron-forward-circle" size={18} color="#8E2DE2" />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => setShowPayment(true)}
                    activeOpacity={0.85}
                >
                    <Text style={styles.ctaBtnText}>Continue</Text>
                </TouchableOpacity>
            </View>

            {/* Payment Modal */}
            <Modal
                visible={showPayment}
                transparent
                animationType="slide"
                onRequestClose={() => setShowPayment(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowPayment(false)} />
                    <View style={styles.paySheet}>
                        {/* Close */}
                        <TouchableOpacity style={styles.closeBtn} onPress={() => setShowPayment(false)}>
                            <Ionicons name="close" size={18} color="#666" />
                        </TouchableOpacity>

                        {/* Total amount */}
                        <Text style={styles.payAmount}>₦{total.toLocaleString()}.00</Text>

                        {/* Breakdown */}
                        <View style={styles.payBreakdown}>
                            {itemsList.map((item, idx) => (
                                <View key={idx} style={styles.payRow}>
                                    <Text style={styles.payLabel}>{item.quantity.toString().padStart(2, '0')} {item.name}</Text>
                                    <Text style={styles.payValue}>{item.totalText}</Text>
                                </View>
                            ))}
                            <View style={styles.payRow}>
                                <Text style={styles.payLabel}>Fees</Text>
                                <Text style={styles.payValue}>₦{fee.toLocaleString()}</Text>
                            </View>
                            <View style={[styles.payRow, { borderTopWidth: 1, borderTopColor: '#EBEBEB', paddingTop: 12, marginTop: 4 }]}>
                                <Text style={styles.payLabel}>Total</Text>
                                <Text style={styles.payValue}>₦{total.toLocaleString()}</Text>
                            </View>
                        </View>

                        {/* Payment Method Selection */}
                        <TouchableOpacity style={styles.payMethodHeader}>
                            <Text style={styles.payMethodTitle}>Payment Method</Text>
                        </TouchableOpacity>

                        <View style={styles.payMethodOptions}>
                            <TouchableOpacity style={styles.payMethodRow} onPress={() => setPaymentMethod('card')}>
                                <Text style={styles.payMethodLabel}>Debit Card (Stripe)</Text>
                                <View style={[styles.radioOuter, paymentMethod === 'card' && styles.radioOuterSelected]}>
                                    {paymentMethod === 'card' && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.payMethodRow} onPress={() => setPaymentMethod('transfer')}>
                                <Text style={styles.payMethodLabel}>Transfer (Manual)</Text>
                                <View style={[styles.radioOuter, paymentMethod === 'transfer' && styles.radioOuterSelected]}>
                                    {paymentMethod === 'transfer' && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Pay Button */}
                        <TouchableOpacity
                            style={[styles.payBtn, isPaying && { opacity: 0.7 }]}
                            onPress={handlePay}
                            activeOpacity={0.85}
                            disabled={isPaying}
                        >
                            {isPaying ? <ActivityIndicator size="small" color="#FFF" /> : <Text style={styles.payBtnText}>Pay Now</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    eventCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 16,
    },
    eventImage: {
        width: 110,
        height: 90,
    },
    eventInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    categoryBadge: {
        backgroundColor: '#333',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    categoryText: { color: '#FFF', fontSize: 11, fontWeight: '700' },
    eventName: { fontSize: 15, fontWeight: '700', color: '#222', marginBottom: 4 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { fontSize: 12, color: '#888' },
    divider: { height: 1, backgroundColor: '#EBEBEB', marginVertical: 16 },
    infoSection: { gap: 14 },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: { fontSize: 14, color: '#999', fontWeight: '400' },
    infoValue: { fontSize: 14, color: '#222', fontWeight: '600', flexShrink: 1, marginLeft: 12, textAlign: 'right' },
    totalLabel: { fontSize: 15, color: '#444', fontWeight: '600' },
    totalValue: { fontSize: 15, color: '#222', fontWeight: '800' },
    paymentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    paymentLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    paymentLabel: { fontSize: 15, color: '#333', fontWeight: '500' },
    changeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    changeText: { fontSize: 14, color: '#8E2DE2', fontWeight: '600' },
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
    ctaBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
    // Payment Modal
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', justifyContent: 'flex-end' },
    modalDismiss: { flex: 1 },
    paySheet: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingBottom: 40,
    },
    closeBtn: {
        alignSelf: 'flex-end',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    payAmount: {
        fontSize: 28,
        fontWeight: '800',
        color: '#8E2DE2',
        textAlign: 'center',
        marginBottom: 20,
    },
    payBreakdown: {
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        gap: 10,
    },
    payRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    payLabel: { fontSize: 13, color: '#888' },
    payValue: { fontSize: 13, color: '#333', fontWeight: '600' },
    payMethodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 14,
    },
    payMethodTitle: { fontSize: 14, fontWeight: '700', color: '#8E2DE2' },
    payMethodOptions: { gap: 12, marginBottom: 20 },
    payMethodRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    payMethodLabel: { fontSize: 15, color: '#666' },
    radioOuter: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2, borderColor: '#CCC',
        justifyContent: 'center', alignItems: 'center',
    },
    radioOuterSelected: { borderColor: '#8E2DE2' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8E2DE2' },
    payBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
    },
    payBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
