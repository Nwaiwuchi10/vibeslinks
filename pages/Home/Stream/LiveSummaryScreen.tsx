import React from 'react';
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const STATS = [
    { label: 'Viewers',  value: '975K' },
    { label: 'Likes',    value: '6.1M' },
    { label: 'Comments', value: '103K' },
    { label: 'Reaction', value: '1.2M' },
];

const SIMILAR_CREATORS = [
    { id: '1', name: 'Sophia Carter',  avatar: 'https://i.pravatar.cc/150?img=47' },
    { id: '2', name: 'Malik Johnson',  avatar: 'https://i.pravatar.cc/150?img=12' },
    { id: '3', name: 'Elena Rossi',    avatar: 'https://i.pravatar.cc/150?img=9'  },
    { id: '4', name: 'Hiroshi Tanaka', avatar: 'https://i.pravatar.cc/150?img=55' },
];

export default function LiveSummaryScreen() {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Decorative bow top-right */}
            <View style={styles.bowDecor} pointerEvents="none">
                <View style={styles.bowLeft} />
                <View style={styles.bowRight} />
                <View style={styles.bowCenter} />
            </View>

            {/* Close button */}
            <TouchableOpacity style={styles.closeBtn} onPress={() => router.dismissAll()}>
                <Ionicons name="close" size={20} color="#111" />
            </TouchableOpacity>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Congratulation heading */}
                <Text style={styles.congratsTitle}>Congratulation!</Text>
                <Text style={styles.congratsSubtitle}>
                    You have likes than{' '}
                    <Text style={styles.highlightText}>60%</Text>
                    {' '}of LIVE creators with a similar following
                </Text>

                {/* Stats card */}
                <View style={styles.statsCard}>
                    {STATS.map((stat, index) => (
                        <View
                            key={stat.label}
                            style={[
                                styles.statItem,
                                index < STATS.length - 1 && styles.statItemBorder,
                            ]}
                        >
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Earnings card */}
                <View style={styles.earningsCard}>
                    <View style={styles.earningsCol}>
                        <Text style={styles.earningsLabel}>Total Earn</Text>
                        <Text style={styles.earningsValue}>1000,000</Text>
                    </View>
                    <View style={styles.earningsDivider} />
                    <View style={styles.earningsCol}>
                        <Text style={styles.earningsLabel}>Ticket Sold</Text>
                        <Text style={styles.earningsValue}>91</Text>
                    </View>
                </View>

                {/* Same niche creators */}
                <Text style={styles.sectionTitle}>Creators on the same niche</Text>
                {SIMILAR_CREATORS.map((creator) => (
                    <View key={creator.id} style={styles.creatorRow}>
                        <Image source={{ uri: creator.avatar }} style={styles.creatorAvatar} />
                        <Text style={styles.creatorName}>{creator.name}</Text>
                        <TouchableOpacity style={styles.followBtn} activeOpacity={0.85}>
                            <Text style={styles.followBtnText}>Follow</Text>
                        </TouchableOpacity>
                    </View>
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Download Stream button */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.87}>
                    <Text style={styles.downloadBtnText}>Download Stream</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    bowDecor: {
        position: 'absolute',
        top: -20,
        right: -10,
        width: 140,
        height: 160,
        zIndex: 0,
    },
    bowLeft: {
        position: 'absolute',
        top: 30,
        right: 60,
        width: 70,
        height: 90,
        borderRadius: 50,
        backgroundColor: '#6B7BD6',
        transform: [{ rotate: '-35deg' }],
        opacity: 0.9,
    },
    bowRight: {
        position: 'absolute',
        top: 20,
        right: 0,
        width: 70,
        height: 90,
        borderRadius: 50,
        backgroundColor: '#6B7BD6',
        transform: [{ rotate: '35deg' }],
        opacity: 0.9,
    },
    bowCenter: {
        position: 'absolute',
        top: 72,
        right: 47,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#8E99E6',
    },
    closeBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        marginBottom: 0,
        zIndex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 24,
        paddingBottom: 20,
    },
    congratsTitle: {
        fontSize: 30,
        fontWeight: '800',
        color: '#111',
        marginBottom: 10,
    },
    congratsSubtitle: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
        marginBottom: 24,
        maxWidth: width * 0.78,
    },
    highlightText: {
        color: '#8E2DE2',
        fontWeight: '700',
    },
    statsCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 },
            android: { elevation: 3 },
        }),
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statItemBorder: {
        borderRightWidth: 1,
        borderRightColor: '#F3F4F6',
    },
    statValue: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    earningsCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 28,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10 },
            android: { elevation: 3 },
        }),
    },
    earningsCol: {
        flex: 1,
    },
    earningsDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#F3F4F6',
        marginHorizontal: 16,
    },
    earningsLabel: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 6,
    },
    earningsValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111',
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111',
        marginBottom: 12,
    },
    creatorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    creatorAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 14,
    },
    creatorName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    followBtn: {
        backgroundColor: '#E9174B',
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 10,
    },
    followBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        paddingHorizontal: 24,
        paddingBottom: Platform.OS === 'ios' ? 34 : 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    downloadBtn: {
        backgroundColor: '#8E2DE2',
        borderRadius: 32,
        paddingVertical: 18,
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#8E2DE2', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12 },
            android: { elevation: 8 },
        }),
    },
    downloadBtnText: {
        color: '#FFF',
        fontSize: 17,
        fontWeight: '700',
    },
});
