import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SUGGESTED_HOSTS = [
    { id: '1', name: 'Davido', tag: 'Afrobeats', followers: '2.3m', image: require('../../../assets/images/davido.png') },
    { id: '2', name: 'Odumodublv...', tag: 'EDM', followers: '2.3m', image: require('../../../assets/images/modu.png') },
];

const SuggestedHosts = () => {
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Suggested Host</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={12} /></Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hostContainer}>
                {SUGGESTED_HOSTS.map((host) => (
                    <View key={host.id} style={styles.hostCard}>
                        <Image source={host.image} style={styles.hostImage} />
                        <View style={styles.hostInfo}>
                            <Text style={styles.hostName}>{host.name} <MaterialIcons name="verified" size={12} color={Colors.primary} /> <Text style={styles.hostTime}>{host.followers}</Text></Text>
                            <View style={styles.hostTagRow}>
                                <Ionicons name="musical-notes" size={12} color="#666" />
                                <Text style={styles.hostTag}>{host.tag}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

export default SuggestedHosts;

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
    hostContainer: {
        paddingHorizontal: 20,
    },
    hostCard: {
        width: 160,
        marginRight: 16,
    },
    hostImage: {
        width: '100%',
        height: 120,
        borderRadius: 16,
        marginBottom: 8,
    },
    hostInfo: {
        paddingHorizontal: 4,
    },
    hostName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
    hostTime: { fontSize: 12, color: '#888', fontWeight: '400' },
    hostTagRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    hostTag: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
});
