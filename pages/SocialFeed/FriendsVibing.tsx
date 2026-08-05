import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';
import { eventService } from '@/services/eventService';
import { resolveImageUrl } from '@/services/apiClient';

interface FriendAttending {
    id: string;
    name: string;
    avatar: string;
}

import { navigateToUserProfile } from '@/utils/profileNavigation';
import { useAppSelector } from '@/store/hooks';

const FriendsVibingScreen = () => {
    const currentUser = useAppSelector((state) => state.auth?.user);
    const currentUserId = currentUser?.id || currentUser?._id;
    const { eventId } = useLocalSearchParams<{ eventId?: string }>();
    const [friends, setFriends] = useState<FriendAttending[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchFriends() {
            if (!eventId) {
                setLoading(false);
                return;
            }
            try {
                const data = await eventService.getEventFriendsAttending(eventId);
                if (isMounted) {
                    const items = Array.isArray(data) ? data : data?.items || [];
                    const mapped = items.map((f: any, idx: number) => {
                        const user = f.user || f;
                        return {
                            id: user.id || user._id || String(idx),
                            name: user.fullName || user.name || user.username || 'Friend',
                            avatar: resolveImageUrl(user.profilePictureUrl || user.avatarUrl || null) || `https://i.pravatar.cc/150?img=${(idx % 50) + 10}`,
                        };
                    });
                    setFriends(mapped);
                }
            } catch (err) {
                console.warn('[FriendsVibingScreen] error fetching friends attending:', err);
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchFriends();
        return () => { isMounted = false; };
    }, [eventId]);

    const renderItem = ({ item }: { item: FriendAttending }) => (
        <TouchableOpacity
            style={styles.friendItem}
            activeOpacity={0.7}
            onPress={() => navigateToUserProfile(router, item, currentUserId)}
        >
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <Text style={styles.friendName}>{item.name}</Text>
            <TouchableOpacity style={styles.iconButton}>
                <MaterialCommunityIcons name="book-open-outline" size={20} color="#1A1A2E" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>

                <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Friends Attending Event</Text>
                    <Text style={styles.headerSubtitle}>See where your friends are vibing this weekend.</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#8E2DE2" />
                </View>
            ) : friends.length === 0 ? (
                <View style={styles.centerContainer}>
                    <MaterialCommunityIcons name="account-multiple-outline" size={48} color="#CCC" />
                    <Text style={styles.emptyText}>No friends attending this event yet.</Text>
                </View>
            ) : (
                <FlatList
                    data={friends}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}

            {/* Bottom Button Area */}
            <View style={styles.bottomContainer}>
                <TouchableOpacity
                    style={styles.buyButton}
                    activeOpacity={0.8}
                    onPress={() => eventId ? router.push({ pathname: '/event-details', params: { id: eventId } }) : router.push('/event-details')}
                >
                    <Text style={styles.buyButtonText}>Buy Tickets</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default FriendsVibingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
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
                shadowOpacity: 0.1,
                shadowRadius: 4,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    headerTitleContainer: {
        flex: 1,
        marginLeft: 15,
        alignItems: 'center',
        marginRight: 44, // Offset for back button to center title
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A2E',
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: 13,
        color: '#8A8A8A',
        marginTop: 4,
        textAlign: 'center',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 120,
    },
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EFEFEF',
    },
    friendName: {
        flex: 1,
        marginLeft: 16,
        fontSize: 16,
        fontWeight: '700',
        color: '#1A1A2E',
    },
    iconButton: {
        padding: 4,
    },
    separator: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingBottom: 120,
    },
    emptyText: {
        color: '#999',
        fontSize: 15,
        marginTop: 12,
        textAlign: 'center',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
        paddingTop: 15,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -5 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    buyButton: {
        backgroundColor: Colors.primary,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buyButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
    },
});
