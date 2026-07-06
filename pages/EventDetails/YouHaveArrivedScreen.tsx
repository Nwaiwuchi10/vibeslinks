import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function YouHaveArrivedScreen() {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.content}>
                {/* Badge Icon */}
                <View style={styles.badgeOuter}>
                    <Ionicons name="checkmark" size={44} color="#FFF" />
                </View>

                <Text style={styles.title}>You have arrived</Text>
                <Text style={styles.subtitle}>You have arrived in the event location.</Text>
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.okBtn}
                    onPress={() => router.replace('/')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.okBtnText}>OK</Text>
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
    badgeOuter: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        // Notched badge effect using box shadow
        shadowColor: '#8E2DE2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 10,
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
    },
    okBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
    },
    okBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '600',
    },
});
