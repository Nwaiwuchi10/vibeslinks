import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BookingSuccessScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
                <View style={styles.iconOuter}>
                    <View style={styles.iconInner}>
                        <Ionicons name="checkmark" size={40} color="#FFF" />
                    </View>
                </View>

                <Text style={styles.title}>Congratulations!</Text>
                <Text style={styles.subtitle}>You Have Successfully Book Event Ticket.</Text>
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => router.push('/e-receipt')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.primaryBtnText}>View E-Receipt</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.ghostBtn}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.ghostBtnText}>Go to Home</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconOuter: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 28,
        // Badge shape notches via border radius tricks
        transform: [{ rotate: '0deg' }],
    },
    iconInner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#222',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#888',
        textAlign: 'center',
        lineHeight: 22,
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingBottom: 40,
        gap: 14,
    },
    primaryBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
    },
    primaryBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
    ghostBtn: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    ghostBtnText: {
        fontSize: 16,
        color: '#8E2DE2',
        fontWeight: '500',
    },
});
