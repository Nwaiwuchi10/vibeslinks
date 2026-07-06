import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type PaymentOption = 'paypal' | 'google' | 'apple' | null;

export default function PaymentMethodScreen() {
    const [selectedOption, setSelectedOption] = useState<PaymentOption>(null);

    const MORE_OPTIONS = [
        { id: 'paypal' as PaymentOption, label: 'Paypal', icon: '🅿️', color: '#003087' },
        { id: 'google' as PaymentOption, label: 'Google', icon: '🅶', color: '#EA4335' },
        { id: 'apple' as PaymentOption, label: 'Apple Pay', icon: '🍎', color: '#000' },
    ];

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Method</Text>
                <View style={{ width: 44 }} />
            </View>

            <View style={styles.content}>
                {/* Credit & Debit Card Section */}
                <Text style={styles.sectionLabel}>Credit & Debit Card</Text>
                <View style={styles.cardSection}>
                    <TouchableOpacity
                        style={styles.cardRow}
                        onPress={() => router.push('/add-card-ticket')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.cardLeft}>
                            <MaterialCommunityIcons name="credit-card-outline" size={22} color="#8E2DE2" />
                            <Text style={styles.cardLabel}>Card</Text>
                        </View>
                        <Ionicons name="arrow-forward" size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                {/* More Payment Options */}
                <View style={styles.moreSection}>
                    <Text style={styles.moreSectionTitle}>More Payment Options</Text>

                    {/* Paypal */}
                    <TouchableOpacity
                        style={styles.optionRow}
                        onPress={() => setSelectedOption('paypal')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.optionLeft}>
                            <View style={[styles.paypalIcon]}>
                                <Text style={styles.paypalP}>P</Text>
                            </View>
                            <Text style={styles.optionLabel}>Paypal</Text>
                        </View>
                        <View style={[styles.radioOuter, selectedOption === 'paypal' && styles.radioSelected]}>
                            {selectedOption === 'paypal' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Google Pay */}
                    <TouchableOpacity
                        style={styles.optionRow}
                        onPress={() => setSelectedOption('google')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.optionLeft}>
                            <View style={styles.googleIcon}>
                                <Text style={styles.googleG}>G</Text>
                            </View>
                            <Text style={styles.optionLabel}>Google</Text>
                        </View>
                        <View style={[styles.radioOuter, selectedOption === 'google' && styles.radioSelected]}>
                            {selectedOption === 'google' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Apple Pay */}
                    <TouchableOpacity
                        style={styles.optionRow}
                        onPress={() => setSelectedOption('apple')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.optionLeft}>
                            <View style={styles.appleIcon}>
                                <Ionicons name="logo-apple" size={18} color="#000" />
                            </View>
                            <Text style={styles.optionLabel}>Apple Pay</Text>
                        </View>
                        <View style={[styles.radioOuter, selectedOption === 'apple' && styles.radioSelected]}>
                            {selectedOption === 'apple' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => router.back()}
                    activeOpacity={0.85}
                >
                    <Text style={styles.ctaBtnText}>Continue</Text>
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
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555',
        marginBottom: 10,
    },
    cardSection: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 18,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardLabel: { fontSize: 16, color: '#333', fontWeight: '500' },
    moreSection: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 18,
    },
    moreSectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#222',
        marginBottom: 16,
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionLabel: { fontSize: 15, color: '#444', fontWeight: '500' },
    paypalIcon: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#E8F0FE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paypalP: { fontSize: 14, fontWeight: '800', color: '#003087' },
    googleIcon: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#FEE8E8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    googleG: { fontSize: 14, fontWeight: '800', color: '#EA4335' },
    appleIcon: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
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
    radioSelected: { borderColor: '#8E2DE2' },
    radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8E2DE2' },
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
