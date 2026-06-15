import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { router } from 'expo-router';

const LIVE_CREATORS = [
    { id: '1', title: 'Join me with the paint of art', name: 'Olivia', time: '. 3m', image: require('../../../assets/images/ye.png'), avatar: 'https://i.pravatar.cc/150?img=43' },
    { id: '2', title: 'President BOIC advised the for 2024.join', name: 'Wizzooko', time: '. 2m', image: require('../../../assets/images/skibi.png'), avatar: 'https://i.pravatar.cc/150?img=15' },
    { id: '3', title: 'Cooking up some afrobeats', name: 'DJ Snake', time: '. 5m', image: require('../../../assets/images/modu.png'), avatar: 'https://i.pravatar.cc/150?img=60' },
];

const LiveCreators = () => {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Creators on Live</Text>
                <TouchableOpacity onPress={() => router.push('/live-creators')}>
                    <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={12} /></Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveContainer}>
                {LIVE_CREATORS.map((live) => (
                    <ImageBackground key={live.id} source={live.image} style={styles.liveCard} imageStyle={{ borderRadius: 12 }}>
                        <View style={styles.liveOverlay}>
                            <Text style={styles.liveTitle} numberOfLines={2}>{live.title}</Text>
                            <View style={styles.liveCreatorRow}>
                                <Image source={{ uri: live.avatar }} style={styles.liveAvatar} />
                                <Text style={styles.liveName}>{live.name}</Text>
                                <Text style={styles.liveTime}>{live.time}</Text>
                            </View>
                        </View>
                    </ImageBackground>
                ))}
            </ScrollView>
        </View>
    );
};

export default LiveCreators;

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
    liveContainer: {
        paddingHorizontal: 20,
    },
    liveCard: {
        width: 140,
        height: 180,
        marginRight: 12,
    },
    liveOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: 12,
        padding: 12,
        justifyContent: 'flex-end',
    },
    liveTitle: { color: '#FFF', fontSize: 12, fontWeight: '600', marginBottom: 8 },
    liveCreatorRow: { flexDirection: 'row', alignItems: 'center' },
    liveAvatar: { width: 20, height: 20, borderRadius: 10, marginRight: 6 },
    liveName: { color: '#FFF', fontSize: 10, fontWeight: '500' },
    liveTime: { color: '#E0E0E0', fontSize: 10, marginLeft: 2 },
});
