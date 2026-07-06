import React, { useState } from 'react';
import {
    FlatList,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const TABS = ['All', 'Mentions', 'Events', 'Messages', 'Tickets'];

type NotificationItem = {
    id: string;
    type: 'icon' | 'avatar';
    iconName?: keyof typeof Ionicons.glyphMap;
    avatarUri?: string;
    title: string;
    subtitle: string;
    time: string;
};

type NotificationSection = {
    title: string;
    data: NotificationItem[];
};

const NOTIFICATIONS: NotificationSection[] = [
    {
        title: 'Today',
        data: [
            {
                id: '1',
                type: 'icon',
                iconName: 'receipt-outline',
                title: 'Ticket Update',
                subtitle: 'DJ Neptune is live now.',
                time: '30min',
            },
        ],
    },
    {
        title: 'Yesterday',
        data: [
            {
                id: '2',
                type: 'avatar',
                avatarUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                title: 'am_sarah_percy',
                subtitle: 'Sarah liked your post.',
                time: '1hr',
            },
            {
                id: '3',
                type: 'icon',
                iconName: 'receipt-outline',
                title: 'Ticket Update',
                subtitle: 'DJ Neptune is live now.',
                time: '3hr',
            },
            {
                id: '4',
                type: 'avatar',
                avatarUri: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150',
                title: 'Mikeonam',
                subtitle: 'Mike commented: This event go mad',
                time: '12hr',
            },
            {
                id: '5',
                type: 'avatar',
                avatarUri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
                title: 'percy_love',
                subtitle: 'Started following you.',
                time: '14hr',
            },
            {
                id: '6',
                type: 'icon',
                iconName: 'notifications-outline',
                title: 'Event Reminder',
                subtitle: 'Afro Vibez Festival starts tomorrow.',
                time: '20hr',
            },
        ],
    },
    {
        title: 'Last 7 days',
        data: [
            {
                id: '7',
                type: 'avatar',
                avatarUri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                title: 'Ticket Update',
                subtitle: 'Topaz and 1 other like your story',
                time: '1w',
            },
        ],
    },
];

export default function NotificationScreen() {
    const [activeTab, setActiveTab] = useState('All');

    const renderItem = (item: NotificationItem) => (
        <View key={item.id} style={styles.notificationRow}>
            {item.type === 'avatar' ? (
                <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
            ) : (
                <View style={styles.iconCircle}>
                    <Ionicons name={item.iconName} size={20} color="#111" />
                </View>
            )}
            
            <View style={styles.textContainer}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.subtitleText}>{item.subtitle}</Text>
            </View>
            
            <Text style={styles.timeText}>{item.time}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notification</Text>
                <View style={styles.newBadge}>
                    <Text style={styles.newBadgeText}>4 New</Text>
                </View>
            </View>

            {/* Tabs */}
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
                                activeTab === tab && styles.tabButtonActive
                            ]}
                            onPress={() => setActiveTab(tab)}
                            activeOpacity={0.8}
                        >
                            <Text style={[
                                styles.tabText,
                                activeTab === tab && styles.tabTextActive
                            ]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
                {NOTIFICATIONS.map((section) => (
                    <View key={section.title} style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        {section.data.map(renderItem)}
                    </View>
                ))}
            </ScrollView>
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
        borderColor: '#EAEAEA',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
    },
    newBadge: {
        backgroundColor: '#8E2DE2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    newBadgeText: {
        color: '#FFF',
        fontSize: 12,
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
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    tabButtonActive: {
        backgroundColor: '#333',
        borderColor: '#333',
    },
    tabText: {
        color: '#666',
        fontSize: 13,
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#FFF',
        fontWeight: '600',
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
        fontWeight: '600',
        color: '#8A8A8A',
        marginBottom: 16,
    },
    notificationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    titleText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    subtitleText: {
        fontSize: 13,
        color: '#888',
    },
    timeText: {
        fontSize: 12,
        color: '#A0A0A0',
        marginLeft: 10,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
});
