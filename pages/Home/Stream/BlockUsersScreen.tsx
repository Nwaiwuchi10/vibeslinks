import React, { useState } from 'react';
import {
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

const USERS = [
    { id: '1', name: 'Sophia Carter',  avatar: 'https://i.pravatar.cc/150?img=47', muted: false },
    { id: '2', name: 'Malik Johnson',  avatar: 'https://i.pravatar.cc/150?img=12', muted: true  },
    { id: '3', name: 'Elena Rossi',    avatar: 'https://i.pravatar.cc/150?img=9',  muted: false },
    { id: '4', name: 'Hiroshi Tanaka', avatar: 'https://i.pravatar.cc/150?img=55', muted: false },
    { id: '5', name: 'Amina Yusuf',    avatar: 'https://i.pravatar.cc/150?img=44', muted: false },
    { id: '6', name: 'Diego Morales',  avatar: 'https://i.pravatar.cc/150?img=32', muted: false },
    { id: '7', name: 'Priya Sharma',   avatar: 'https://i.pravatar.cc/150?img=68', muted: true  },
];

export default function BlockUsersScreen() {
    const [mutedIds, setMutedIds] = useState<Set<string>>(
        new Set(USERS.filter((u) => u.muted).map((u) => u.id))
    );

    const toggle = (id: string) => {
        setMutedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Block users</Text>
                <View style={{ width: 42 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {USERS.map((user) => {
                    const isMuted = mutedIds.has(user.id);
                    return (
                        <View key={user.id} style={styles.userRow}>
                            <Image source={{ uri: user.avatar }} style={styles.userAvatar} />
                            <Text style={styles.userName}>{user.name}</Text>
                            <TouchableOpacity
                                style={[styles.actionBtn, isMuted ? styles.unmuteBtn : styles.muteBtn]}
                                onPress={() => toggle(user.id)}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.actionBtnText}>
                                    {isMuted ? 'Unmute' : 'Mute'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F5F5F5',
    },
    backBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 3 },
        }),
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 40,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    userAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        marginRight: 14,
    },
    userName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    actionBtn: {
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 10,
        minWidth: 80,
        alignItems: 'center',
    },
    muteBtn: {
        backgroundColor: '#E9174B',
    },
    unmuteBtn: {
        backgroundColor: '#111',
    },
    actionBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
});
