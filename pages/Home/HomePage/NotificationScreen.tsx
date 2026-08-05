import React, { useEffect, useState, useCallback } from 'react';
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { notificationService, NotificationItem } from '@/services/notificationService';
import { socketService } from '@/services/socketService';
import { resolveImageUrl } from '@/services/apiClient';
import { navigateToUserProfile } from '@/utils/profileNavigation';
import { useAppSelector } from '@/store/hooks';
import UserAvatar from '@/components/UserAvatar';

const TABS = ['All', 'Mentions', 'Events', 'Messages', 'Tickets'];

type NotificationSection = {
    title: string;
    data: NotificationItem[];
};

// ─── Helpers for Time formatting & Section Grouping ─────────────────────────────

function formatNotificationTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}min`;
    if (diffHours < 24) return `${diffHours}hr`;
    if (diffDays < 7) return `${diffDays}d`;
    const diffWeeks = Math.floor(diffDays / 7);
    return `${diffWeeks}w`;
}

function groupNotificationsByDate(items: NotificationItem[]): NotificationSection[] {
    const today: NotificationItem[] = [];
    const yesterday: NotificationItem[] = [];
    const last7Days: NotificationItem[] = [];
    const older: NotificationItem[] = [];

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
    const sevenDaysAgo = todayStart - 6 * 24 * 60 * 60 * 1000;

    items.forEach((item) => {
        const itemTime = item.createdAt ? new Date(item.createdAt).getTime() : Date.now();
        if (itemTime >= todayStart) {
            today.push(item);
        } else if (itemTime >= yesterdayStart) {
            yesterday.push(item);
        } else if (itemTime >= sevenDaysAgo) {
            last7Days.push(item);
        } else {
            older.push(item);
        }
    });

    const sections: NotificationSection[] = [];
    if (today.length > 0) sections.push({ title: 'Today', data: today });
    if (yesterday.length > 0) sections.push({ title: 'Yesterday', data: yesterday });
    if (last7Days.length > 0) sections.push({ title: 'Last 7 days', data: last7Days });
    if (older.length > 0) sections.push({ title: 'Older', data: older });

    return sections;
}

function getNotificationCategory(item: NotificationItem): string {
    const rawType = (item.type || item.category || '').toLowerCase();
    if (rawType.includes('mention')) return 'Mentions';
    if (rawType.includes('event')) return 'Events';
    if (rawType.includes('message') || rawType.includes('chat')) return 'Messages';
    if (rawType.includes('ticket') || rawType.includes('booking')) return 'Tickets';
    return 'General';
}

function getNotificationIcon(type?: string): keyof typeof Ionicons.glyphMap {
    const t = (type || '').toLowerCase();
    if (t.includes('ticket')) return 'receipt-outline';
    if (t.includes('event')) return 'notifications-outline';
    if (t.includes('chat') || t.includes('message')) return 'chatbubble-ellipses-outline';
    if (t.includes('like')) return 'heart-outline';
    if (t.includes('follow')) return 'person-add-outline';
    return 'notifications-outline';
}

export default function NotificationScreen() {
    const currentUser = useAppSelector((state) => state.auth?.user);
    const currentUserId = currentUser?.id || currentUser?._id;
    const [activeTab, setActiveTab] = useState('All');
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const list = await notificationService.getNotifications();
            setNotifications(list || []);
        } catch (err) {
            console.warn('[NotificationScreen] Fetch failed:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Connect real-time socket listener for incoming notifications
    useEffect(() => {
        const handleNewNotification = (newNotif: any) => {
            if (!newNotif) return;
            setNotifications((prev) => [newNotif, ...prev]);
        };

        socketService.onNotificationNew(handleNewNotification);

        return () => {
            socketService.off('notification:new');
        };
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAllRead = async () => {
        await notificationService.markAllAsRead();
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, read: true, isRead: true }))
        );
    };

    const handleItemPress = async (item: NotificationItem) => {
        if (!item.read && !item.isRead) {
            await notificationService.markAsRead(item.id || item._id || '');
            setNotifications((prev) =>
                prev.map((n) =>
                    (n.id === item.id || n._id === item._id) ? { ...n, read: true, isRead: true } : n
                )
            );
        }

        // Deep link redirection based on notification metadata / category
        const metadata = item.metadata;
        if (metadata?.eventId) {
            router.push({ pathname: '/event-details', params: { id: metadata.eventId } });
        } else if (metadata?.postId) {
            router.push({ pathname: '/post-details', params: { id: metadata.postId } });
        } else if (metadata?.chatId || metadata?.threadId) {
            router.push({ pathname: '/chat-detail', params: { id: metadata.chatId || metadata.threadId } });
        }
    };

    // Filter items based on active tab
    const filteredNotifications = notifications.filter((item) => {
        if (activeTab === 'All') return true;
        const cat = getNotificationCategory(item);
        return cat.toLowerCase() === activeTab.toLowerCase();
    });

    const unreadCount = notifications.filter((n) => !n.read && !n.isRead).length;
    const sections = groupNotificationsByDate(filteredNotifications);

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={20} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notification</Text>
                    <View style={{ width: 44 }} />
                </View>
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header (Image 2 design) */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
                {unreadCount > 0 ? (
                    <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.8}>
                        <View style={styles.newBadge}>
                            <Text style={styles.newBadgeText}>{unreadCount} New</Text>
                        </View>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 44 }} />
                )}
            </View>

            {/* Filter Tabs (All, Mentions, Events, Messages, Tickets) */}
            <View style={styles.tabsWrapper}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.tabsContainer}
                >
                    {TABS.map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[
                                styles.tabButton,
                                activeTab === tab && styles.tabButtonActive,
                            ]}
                            onPress={() => setActiveTab(tab)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    activeTab === tab && styles.tabTextActive,
                                ]}
                            >
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Content Body: Empty State (Image 1) OR Notification List (Image 2) */}
            {filteredNotifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconCircle}>
                        <Ionicons name="chatbubble-ellipses-outline" size={40} color="#1A1A1A" />
                    </View>
                    <Text style={styles.emptyTitle}>No notifications yet</Text>
                    <Text style={styles.emptySubtitle}>
                        When people interact with your activity,{"\n"}you'll see it here
                    </Text>

                    <View style={styles.emptyFooter}>
                        <TouchableOpacity
                            style={styles.exploreBtn}
                            onPress={() => router.push('/(tabs)')}
                            activeOpacity={0.88}
                        >
                            <Text style={styles.exploreBtnText}>Explore Events</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
                    }
                >
                    {sections.map((section) => (
                        <View key={section.title} style={styles.sectionContainer}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            {section.data.map((item) => {
                                const sender = item.sender || item.user;
                                const avatarUrl = sender?.profilePictureUrl || sender?.avatarUrl;
                                const resolvedAvatar = resolveImageUrl(avatarUrl);
                                const isUnread = !item.read && !item.isRead;

                                return (
                                    <TouchableOpacity
                                        key={item.id || item._id || Math.random().toString()}
                                        style={[
                                            styles.notificationRow,
                                            isUnread && styles.unreadNotificationRow,
                                        ]}
                                        onPress={() => handleItemPress(item)}
                                        activeOpacity={0.7}
                                    >
                                        <TouchableOpacity
                                            onPress={() => sender && navigateToUserProfile(router, sender, currentUserId)}
                                            activeOpacity={0.8}
                                        >
                                            {resolvedAvatar ? (
                                                <Image source={{ uri: resolvedAvatar }} style={styles.avatar} />
                                            ) : (
                                                <UserAvatar avatarUrl={null} name={sender?.name || sender?.username || item.title} size={44} />
                                            )}
                                        </TouchableOpacity>

                                        <View style={styles.textContainer}>
                                            <Text style={styles.titleText} numberOfLines={1}>
                                                {item.title}
                                            </Text>
                                            <Text style={styles.subtitleText} numberOfLines={2}>
                                                {item.subtitle || item.message || item.body || ''}
                                            </Text>
                                        </View>

                                        <Text style={styles.timeText}>
                                            {item.time || formatNotificationTime(item.createdAt)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
    },
    newBadge: {
        backgroundColor: '#8E2DE2',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    newBadgeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
    },
    tabsWrapper: {
        marginBottom: 16,
    },
    tabsContainer: {
        paddingHorizontal: 20,
        gap: 10,
    },
    tabButton: {
        paddingHorizontal: 18,
        paddingVertical: 9,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    tabButtonActive: {
        backgroundColor: '#2A2A2A',
        borderColor: '#2A2A2A',
    },
    tabText: {
        color: '#666',
        fontSize: 13,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#FFF',
        fontWeight: '700',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#8A8A8A',
        marginBottom: 16,
    },
    notificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderRadius: 12,
    },
    unreadNotificationRow: {
        backgroundColor: 'rgba(142, 45, 226, 0.04)',
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginRight: 14,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 14,
        backgroundColor: '#EEE',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 13,
        color: '#888',
        lineHeight: 18,
    },
    timeText: {
        fontSize: 12,
        color: '#A0A0A0',
        marginLeft: 10,
        alignSelf: 'flex-start',
        marginTop: 4,
        fontWeight: '500',
    },
    /* Empty State Styles (100% matching Image 1) */
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
        marginTop: -30,
    },
    emptyIconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F5F5F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1A1A1A',
        marginBottom: 10,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#8A8A8A',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 30,
    },
    emptyFooter: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
    },
    exploreBtn: {
        backgroundColor: '#8E2DE2',
        paddingVertical: 16,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#8E2DE2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    exploreBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
