import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { stripeService } from '@/services/stripeService';
import { Colors } from '@/constants/Colors';


export default function PaymentMethodScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);
    const [savedCards, setSavedCards] = useState<any[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
    const [walletSelected, setWalletSelected] = useState(false);
    const [wallet, setWallet] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [cards, walletData] = await Promise.allSettled([
                    stripeService.getPaymentMethods(),
                    stripeService.getWallet(),
                ]);
                if (cards.status === 'fulfilled') {
                    setSavedCards(cards.value);
                    const def = (cards.value as any[]).find((c: any) => c.isDefault);
                    if (def) setSelectedCardId(def.id);
                }
                if (walletData.status === 'fulfilled') {
                    setWallet(walletData.value);
                }
            } catch (err) {
                console.warn('[PaymentMethod] Load error:', err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleContinue = () => {
        if (!selectedCardId && !walletSelected) {
            Alert.alert('Select Payment', 'Please select a payment method to continue.');
            return;
        }
        const method = walletSelected ? 'wallet' : 'stripe';
        const methodId = walletSelected ? undefined : selectedCardId;
        // Store selection then go to ticket summary
        router.push({ pathname: '/ticket-summary', params: { id, paymentMethod: method, paymentMethodId: methodId ?? '' } });
    };

    const cardBrandIcon = (brand: string) => {
        switch (brand?.toLowerCase()) {
            case 'visa': return 'credit-card';
            case 'mastercard': return 'credit-card-chip';
            default: return 'credit-card-outline';
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Method</Text>
                <View style={{ width: 44 }} />
            </View>

            {loading ? (
                <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
            ) : (
                <View style={styles.content}>
                    {/* Wallet Option */}
                    {wallet && (
                        <View style={styles.section}>
                            <Text style={styles.sectionLabel}>Wallet</Text>
                            <TouchableOpacity
                                style={[styles.cardRow, walletSelected && styles.cardRowSelected]}
                                onPress={() => { setWalletSelected(true); setSelectedCardId(null); }}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardLeft}>
                                    <Ionicons name="wallet-outline" size={22} color="#8E2DE2" />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.cardLabel}>VibezLink Wallet</Text>
                                        <Text style={styles.cardSub}>Balance: ₦{Number(wallet.balance || 0).toLocaleString()}</Text>
                                    </View>
                                </View>
                                <View style={[styles.radioOuter, walletSelected && styles.radioSelected]}>
                                    {walletSelected && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    {/* Saved Cards */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Credit & Debit Card</Text>
                        {savedCards.map((card: any) => (
                            <TouchableOpacity
                                key={card.id}
                                style={[styles.cardRow, selectedCardId === card.id && styles.cardRowSelected]}
                                onPress={() => { setSelectedCardId(card.id); setWalletSelected(false); }}
                                activeOpacity={0.8}
                            >
                                <View style={styles.cardLeft}>
                                    <MaterialCommunityIcons name={cardBrandIcon(card.brand) as any} size={22} color="#8E2DE2" />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text style={styles.cardLabel}>{(card.brand || 'Card').toUpperCase()} •••• {card.last4}</Text>
                                        <Text style={styles.cardSub}>Expires {card.expMonth}/{card.expYear}</Text>
                                    </View>
                                </View>
                                <View style={[styles.radioOuter, selectedCardId === card.id && styles.radioSelected]}>
                                    {selectedCardId === card.id && <View style={styles.radioInner} />}
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* Add new card */}
                        <TouchableOpacity
                            style={styles.cardRow}
                            onPress={() => router.push({ pathname: '/add-card-ticket', params: { id } })}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardLeft}>
                                <Ionicons name="add-circle-outline" size={22} color="#8E2DE2" />
                                <Text style={[styles.cardLabel, { marginLeft: 12 }]}>Add New Card</Text>
                            </View>
                            <Ionicons name="arrow-forward" size={20} color="#888" />
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            <View style={styles.footer}>
                <TouchableOpacity style={styles.continueBtn} onPress={handleContinue}>
                    <Text style={styles.continueBtnText}>Continue</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F9F9F9' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
    backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
    content: { flex: 1, paddingTop: 10 },
    section: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: 16, borderRadius: 16, paddingVertical: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    sectionLabel: { fontSize: 12, fontWeight: '700', color: '#888', paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    cardRowSelected: { backgroundColor: '#F8F0FF' },
    cardLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    cardLabel: { fontSize: 15, fontWeight: '600', color: '#1A1A1A' },
    cardSub: { fontSize: 12, color: '#999', marginTop: 2 },
    radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#CCC', justifyContent: 'center', alignItems: 'center' },
    radioSelected: { borderColor: '#8E2DE2' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8E2DE2' },
    footer: { padding: 20, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0' },
    continueBtn: { backgroundColor: '#8E2DE2', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
    continueBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
