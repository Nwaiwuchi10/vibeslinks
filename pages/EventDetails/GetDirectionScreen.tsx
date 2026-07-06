import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Lagos Nigeria coordinates (Surulere area matching the screenshot)
const MAP_CENTER_LAT = 6.5059;
const MAP_CENTER_LNG = 3.3567;
const MAP_ZOOM = 13;

// Google Static Maps — shows the route area from screenshot
const MAP_URL = `https://maps.googleapis.com/maps/api/staticmap?center=${MAP_CENTER_LAT},${MAP_CENTER_LNG}&zoom=${MAP_ZOOM}&size=600x900&scale=2&maptype=roadmap&path=color:0x000000|weight:5|6.4810,3.3580|6.5130,3.3742&markers=color:purple|label:A|6.4810,3.3580&markers=color:purple|label:B|6.5130,3.3742&key=AIzaSyDUMMY`;

// Fallback static map image from openstreetmap tile (no API key needed)
const FALLBACK_MAP_URL = `https://staticmap.openstreetmap.de/staticmap.php?center=${MAP_CENTER_LAT},${MAP_CENTER_LNG}&zoom=${MAP_ZOOM}&size=600x900`;

export default function GetDirectionScreen() {
    const [started, setStarted] = useState(false);

    const handleStart = () => {
        setStarted(true);
        // Simulate navigation — after 1.5s, navigate to arrived screen
        setTimeout(() => {
            router.push('/you-have-arrived');
        }, 1500);
    };

    return (
        <View style={styles.container}>
            {/* Full-screen Map */}
            <Image
                source={{ uri: FALLBACK_MAP_URL }}
                style={styles.mapImage}
                resizeMode="cover"
            />

            {/* Dark overlay for readability */}
            <View style={styles.overlay} />

            {/* Header */}
            <SafeAreaView style={styles.headerSafe} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Get Direction</Text>
                    <View style={{ width: 44 }} />
                </View>
            </SafeAreaView>

            {/* Route line drawn as SVG-like overlay pins */}
            <View style={styles.routeContainer}>
                {/* Origin Pin (A) */}
                <View style={[styles.pinWrapper, { bottom: '35%', left: '25%' }]}>
                    <View style={styles.pinOuter}>
                        <Ionicons name="navigate" size={16} color="#8E2DE2" />
                    </View>
                </View>
                {/* Destination Pin (B) */}
                <View style={[styles.pinWrapper, { top: '22%', right: '20%' }]}>
                    <View style={styles.destinationPin}>
                        <Ionicons name="location" size={18} color="#8E2DE2" />
                    </View>
                </View>
            </View>

            {/* Bottom Start Button */}
            <SafeAreaView style={styles.bottomSafe} edges={['bottom']}>
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={[styles.startBtn, started && styles.startBtnActive]}
                        onPress={handleStart}
                        activeOpacity={0.85}
                        disabled={started}
                    >
                        <Text style={styles.startBtnText}>
                            {started ? 'Navigating...' : 'Start'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8E8E8',
    },
    mapImage: {
        ...StyleSheet.absoluteFillObject,
        width,
        height,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    headerSafe: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 12,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    routeContainer: {
        ...StyleSheet.absoluteFillObject,
    },
    pinWrapper: {
        position: 'absolute',
        alignItems: 'center',
    },
    pinOuter: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    destinationPin: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    bottomSafe: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    bottomBar: {
        paddingHorizontal: 24,
        paddingBottom: 32,
        paddingTop: 16,
    },
    startBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        shadowColor: '#8E2DE2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 6,
    },
    startBtnActive: {
        backgroundColor: '#6A1FAE',
    },
    startBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
});
