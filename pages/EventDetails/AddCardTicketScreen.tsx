import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddCardTicketScreen() {
    const [cardName, setCardName] = useState('');
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [ccv, setCcv] = useState('');
    const [saveCard, setSaveCard] = useState(false);

    const formatCardNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 16);
        const groups = cleaned.match(/.{1,4}/g);
        return groups ? groups.join(' ') : cleaned;
    };

    const formatExpiry = (text: string) => {
        const cleaned = text.replace(/\D/g, '').slice(0, 4);
        if (cleaned.length >= 2) {
            return cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        }
        return cleaned;
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Card</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                {/* Card Brand Logos */}
                <View style={styles.brandsRow}>
                    {/* Verve */}
                    <View style={styles.brandBadge}>
                        <Text style={styles.verveText}>Verve</Text>
                    </View>
                    {/* VISA */}
                    <View style={[styles.brandBadge, styles.visaBadge]}>
                        <Text style={styles.visaText}>VISA</Text>
                    </View>
                    {/* Mastercard */}
                    <View style={styles.mastercardBadge}>
                        <View style={styles.mcCircleRed} />
                        <View style={styles.mcCircleYellow} />
                    </View>
                </View>

                {/* Card Holder Name */}
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="Card Holder Name"
                        placeholderTextColor="#BBBBBB"
                        value={cardName}
                        onChangeText={setCardName}
                        autoCapitalize="words"
                    />
                </View>

                {/* Card Number */}
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="Card Number"
                        placeholderTextColor="#BBBBBB"
                        value={cardNumber}
                        onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                        keyboardType="numeric"
                        maxLength={19}
                    />
                </View>

                {/* Expiry & CCV Row */}
                <View style={styles.rowInputs}>
                    <View style={[styles.inputBox, styles.halfInput]}>
                        <TextInput
                            style={styles.input}
                            placeholder="Expire Date"
                            placeholderTextColor="#BBBBBB"
                            value={expiry}
                            onChangeText={(t) => setExpiry(formatExpiry(t))}
                            keyboardType="numeric"
                            maxLength={5}
                        />
                    </View>
                    <View style={[styles.inputBox, styles.halfInput]}>
                        <TextInput
                            style={styles.input}
                            placeholder="CCV"
                            placeholderTextColor="#BBBBBB"
                            value={ccv}
                            onChangeText={setCcv}
                            keyboardType="numeric"
                            maxLength={3}
                            secureTextEntry
                        />
                    </View>
                </View>

                {/* Save Card */}
                <TouchableOpacity
                    style={styles.saveCardRow}
                    onPress={() => setSaveCard(!saveCard)}
                    activeOpacity={0.7}
                >
                    <View style={[styles.saveRadioOuter, saveCard && styles.saveRadioSelected]}>
                        {saveCard && <View style={styles.saveRadioInner} />}
                    </View>
                    <Text style={styles.saveCardText}>Save Card</Text>
                </TouchableOpacity>
            </View>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.85}
                >
                    <Text style={styles.ctaBtnText}>Add Card</Text>
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
    content: { flex: 1, paddingHorizontal: 20, paddingTop: 8 },
    // Card Brands
    brandsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    brandBadge: {
        backgroundColor: '#D32F2F',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    verveText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
    visaBadge: { backgroundColor: '#1A1F71' },
    visaText: { color: '#FFF', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
    mastercardBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 46,
        height: 28,
        position: 'relative',
    },
    mcCircleRed: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#EB001B',
        position: 'absolute',
        left: 0,
    },
    mcCircleYellow: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F79E1B',
        position: 'absolute',
        left: 18,
        opacity: 0.95,
    },
    // Inputs
    inputBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    input: { fontSize: 15, color: '#333' },
    rowInputs: {
        flexDirection: 'row',
        gap: 12,
    },
    halfInput: { flex: 1, marginBottom: 12 },
    // Save Card
    saveCardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 4,
    },
    saveRadioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#CCC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveRadioSelected: { borderColor: '#8E2DE2' },
    saveRadioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8E2DE2' },
    saveCardText: { fontSize: 15, color: '#666' },
    // Bottom
    bottomBar: {
        padding: 24,
        paddingBottom: 36,
        backgroundColor: '#F5F5F7',
    },
    ctaBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
    },
    ctaBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
