import React, { useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const INITIAL_FRIENDS = [
    { id: '1', name: 'Sophia Carter', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200', status: 'invite' },
    { id: '2', name: 'Malik Johnson', avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200', status: 'sent' },
    { id: '3', name: 'Elena Rossi',   avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=200', status: 'invite' },
    { id: '4', name: 'Hiroshi Tanaka',avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200', status: 'invite' },
    { id: '5', name: 'Amina Yusuf',   avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', status: 'invite' },
    { id: '6', name: 'Diego Morales', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', status: 'invite' },
    { id: '7', name: 'Priya Sharma',  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200', status: 'sent' },
];

export default function InviteFriendsScreen() {
    const [friends, setFriends] = useState(INITIAL_FRIENDS);

    const toggleInvite = (id: string) => {
        setFriends(prev => prev.map(f => {
            if (f.id === id) {
                return { ...f, status: f.status === 'invite' ? 'sent' : 'invite' };
            }
            return f;
        }));
    };

    const renderItem = ({ item }: { item: typeof INITIAL_FRIENDS[0] }) => (
        <View style={styles.userRow}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <TouchableOpacity
                style={[
                    styles.actionBtn,
                    item.status === 'sent' ? styles.actionBtnSent : styles.actionBtnInvite,
                ]}
                onPress={() => toggleInvite(item.id)}
                activeOpacity={0.8}
            >
                <Text
                    style={[
                        styles.actionBtnText,
                        item.status === 'sent' ? styles.actionBtnTextSent : styles.actionBtnTextInvite,
                    ]}
                >
                    {item.status === 'invite' ? 'Invite' : 'Sent'}
                </Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Invite Friends</Text>
                <TouchableOpacity style={styles.copyLinkBtn} activeOpacity={0.8}>
                    <Ionicons name="link-outline" size={16} color="#FFF" />
                    <Text style={styles.copyLinkText}>Copy Link</Text>
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={friends}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: { elevation: 2 },
        }),
    },
    headerTitle: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 12,
    },
    copyLinkBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#000',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 6,
    },
    copyLinkText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    listContent: {
        paddingTop: 10,
        paddingBottom: 40,
        paddingHorizontal: 20,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 16,
        backgroundColor: '#E0E0E0',
    },
    name: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
    },
    actionBtn: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 6,
        minWidth: 80,
        alignItems: 'center',
    },
    actionBtnInvite: {
        backgroundColor: '#8E2DE2',
    },
    actionBtnSent: {
        backgroundColor: '#000',
    },
    actionBtnText: {
        fontSize: 13,
        fontWeight: '600',
    },
    actionBtnTextInvite: {
        color: '#FFF',
    },
    actionBtnTextSent: {
        color: '#FFF',
    },
    separator: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginLeft: 72, // Align with text start
    },
});
