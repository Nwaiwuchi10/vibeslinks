import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../../constants/Colors';

const TrendingNearYou = () => {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Trending Near you</Text>
                <TouchableOpacity onPress={() => router.push('/event-near-you')}>
                    <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={12} /></Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.nearYouCard}
                onPress={() => router.push('/event-details')}
                activeOpacity={0.9}
            >
                <Image source={require('../../../assets/images/redvive.png')} style={styles.nearYouImage} />
                <Text style={styles.nearYouTitle}>Deejay Coded Showcase</Text>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Ionicons name="location" size={14} color={Colors.primary} />
                        <Text style={styles.nearYouInfoText}>Lekki Ikola, Lagos Nigeria</Text>
                    </View>
                    <View style={[styles.infoItem, { marginLeft: 16 }]}>
                        <Ionicons name="calendar" size={14} color={Colors.primary} />
                        <Text style={styles.nearYouInfoText}>May 15 - 9:00 PM</Text>
                    </View>
                </View>
                <View style={styles.nearYouFooter}>
                    <Text style={styles.priceHighlight}>₦10,000 <Text style={styles.priceSub}>/ Person</Text></Text>
                    <View style={styles.attendingStack}>
                        {[5, 11, 8, 9].map((img, i) => (
                            <Image key={i} source={{ uri: `https://i.pravatar.cc/150?img=${img}` }} style={[styles.attendingAvatar, { right: i * 15 }]} />
                        ))}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};

export default TrendingNearYou;

const styles = StyleSheet.create({
    container: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
    seeAllText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
    nearYouCard: {
        paddingHorizontal: 20,
    },
    nearYouImage: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        marginBottom: 12,
    },
    nearYouTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A2E', marginBottom: 8 },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nearYouInfoText: {
        fontSize: 12,
        color: '#6B6B80',
        marginLeft: 4,
    },
    nearYouFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceHighlight: { fontSize: 16, color: Colors.primary, fontWeight: '800' },
    priceSub: { fontSize: 12, color: '#8A8A8A', fontWeight: '500' },
    attendingStack: {
        flexDirection: 'row',
        position: 'relative',
        height: 24,
        width: 80,
    },
    attendingAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#FFF',
        position: 'absolute',
    },
});
