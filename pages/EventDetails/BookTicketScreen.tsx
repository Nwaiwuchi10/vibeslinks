import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookTicketScreen() {
    const [gender, setGender] = useState('Male');
    const [country, setCountry] = useState('Nigeria');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Book Ticket</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Full Name */}
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Full Name"
                        placeholderTextColor="#BBBBBB"
                        value={fullName}
                        onChangeText={setFullName}
                    />
                </View>

                {/* Email */}
                <View style={styles.inputBox}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#BBBBBB"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                {/* Gender */}
                <Text style={styles.fieldLabel}>Gender</Text>
                <TouchableOpacity style={styles.dropdownBox}>
                    <Text style={styles.dropdownText}>{gender}</Text>
                    <Ionicons name="chevron-down" size={18} color="#888" />
                </TouchableOpacity>

                {/* Phone */}
                <Text style={styles.fieldLabel}>Phone</Text>
                <View style={styles.phoneRow}>
                    <TouchableOpacity style={styles.countryCodeBox}>
                        <Text style={styles.countryCodeText}>NGN +234</Text>
                        <Ionicons name="chevron-down" size={16} color="#888" />
                    </TouchableOpacity>
                    <View style={styles.phoneInputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone Number"
                            placeholderTextColor="#BBBBBB"
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={setPhone}
                        />
                    </View>
                </View>

                {/* Country */}
                <Text style={styles.fieldLabel}>Country</Text>
                <TouchableOpacity style={styles.dropdownBox}>
                    <Text style={styles.dropdownText}>{country}</Text>
                    <Ionicons name="chevron-down" size={18} color="#888" />
                </TouchableOpacity>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom CTA */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.ctaBtn}
                    onPress={() => router.push('/ticket-summary')}
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
    scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
    inputBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EBEBEB',
    },
    input: {
        fontSize: 15,
        color: '#333',
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
        marginTop: 4,
    },
    dropdownBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dropdownText: { fontSize: 15, color: '#333' },
    phoneRow: { flexDirection: 'row', gap: 10, marginBottom: 12 },
    countryCodeBox: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    countryCodeText: { fontSize: 14, color: '#333' },
    phoneInputBox: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 14,
        paddingHorizontal: 18,
        paddingVertical: 16,
        borderWidth: 1,
        borderColor: '#EBEBEB',
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
    ctaBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
