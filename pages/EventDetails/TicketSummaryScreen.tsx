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
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TicketSummaryScreen() {
    const [showPayment, setShowPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
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
                        source={{ uri: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=300' }}
                        style={styles.eventImage}
                    />
                    <View style={styles.eventInfo}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>COMEDY</Text>
                        </View>
                        <Text style={styles.eventName}>Paint With Mimi, &...</Text>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={13} color="#8E2DE2" />
                            <Text style={styles.locationText}>Lekki Ikata, Lagos</Text>
                        </View>
                    </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Buyer Info */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Full Name</Text>
                        <Text style={styles.infoValue}>Roland Emmanuel</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone Number</Text>
                        <Text style={styles.infoValue}>234 9384058382</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Email</Text>
                        <Text style={styles.infoValue} numberOfLines={1}>rolandemmanuell03@gmai.com</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Ticket Breakdown */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>09 General Ticket</Text>
                        <Text style={styles.infoValue}>₦720,000</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>03 VVIP Ticket</Text>
                        <Text style={styles.infoValue}>₦780,000</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Fees</Text>
                        <Text style={styles.infoValue}>$3.5</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Total */}
                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>₦1,680,000</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Payment Method */}
                <View style={styles.paymentRow}>
                    <View style={styles.paymentLeft}>
                        <MaterialCommunityIcons name="credit-card-outline" size={22} color="#888" />
                        <Text style={styles.paymentLabel}>Card</Text>
                    </View>
                    <TouchableOpacity style={styles.changeRow} onPress={() => router.push('/payment-method')}>
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
                        <Text style={styles.payAmount}>₦1,680,000.00</Text>

                        {/* Breakdown */}
                        <View style={styles.payBreakdown}>
                            <View style={styles.payRow}>
                                <Text style={styles.payLabel}>09 General Ticket</Text>
                                <Text style={styles.payValue}>₦720,000</Text>
                            </View>
                            <View style={styles.payRow}>
                                <Text style={styles.payLabel}>03 VVIP Ticket</Text>
                                <Text style={styles.payValue}>₦780,000</Text>
                            </View>
                            <View style={styles.payRow}>
                                <Text style={styles.payLabel}>Fees</Text>
                                <Text style={styles.payValue}>$3.5</Text>
                            </View>
                            <View style={[styles.payRow, { borderTopWidth: 1, borderTopColor: '#EBEBEB', paddingTop: 12, marginTop: 4 }]}>
                                <Text style={styles.payLabel}>Total</Text>
                                <Text style={styles.payValue}>₦1,680,000</Text>
                            </View>
                        </View>

                        {/* Payment Method */}
                        <TouchableOpacity style={styles.payMethodHeader}>
                            <Text style={styles.payMethodTitle}>Payment Method</Text>
                            <Ionicons name="chevron-forward-circle" size={18} color="#8E2DE2" />
                        </TouchableOpacity>

                        <View style={styles.payMethodOptions}>
                            <TouchableOpacity style={styles.payMethodRow} onPress={() => setPaymentMethod('card')}>
                                <Text style={styles.payMethodLabel}>Debit Card</Text>
                                <View style={[styles.radioOuter, paymentMethod === 'card' && styles.radioOuterSelected]}>
                                    {paymentMethod === 'card' && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.payMethodRow} onPress={() => setPaymentMethod('transfer')}>
                                <Text style={styles.payMethodLabel}>Transfer</Text>
                                <View style={[styles.radioOuter, paymentMethod === 'transfer' && styles.radioOuterSelected]}>
                                    {paymentMethod === 'transfer' && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Pay Button */}
                        <TouchableOpacity
                            style={styles.payBtn}
                            onPress={() => {
                                setShowPayment(false);
                                router.push('/booking-success');
                            }}
                            activeOpacity={0.85}
                        >
                            <Text style={styles.payBtnText}>Pay</Text>
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
