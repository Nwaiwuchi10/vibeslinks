import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';
import { chatService } from '@/services/chatService';
import StoriesSection from '@/components/StoriesSection';



import { resolveImageUrl } from '@/services/apiClient';

export default function MessagesListScreen() {
    const [showFilter, setShowFilter] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<'All' | 'Unread' | 'Groups' | 'Favorite'>('All');
    const currentUser = useAppSelector((state) => state.auth?.user);
    const currentUserId = currentUser?.id || currentUser?._id;
    const rawThreads = useAppSelector((state) => state.chat?.threads);
    const threads: any[] = Array.isArray(rawThreads) ? rawThreads : [];
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            chatService.getThreads()
                .catch(() => {})
                .finally(() => setLoading(false));
        }, [])
    );

    const filteredThreads = threads.filter(chat => {
        // 1. Search Query Filter
        const title = chat.title || chat.name || '';
        const lastMsg = chat.lastMessage?.message || '';
        const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        // 2. Tab Category Filter
        if (selectedFilter === 'Unread') {
            return (chat.unreadCount && chat.unreadCount > 0) || chat.unread === true;
        }
        if (selectedFilter === 'Groups') {
            return chat.type === 'host-event' || chat.type === 'community' || chat.isGroup === true;
        }
        if (selectedFilter === 'Favorite') {
            return chat.pinned === true || chat.isFavorite === true;
        }
        return true; // 'All'
    });

    const renderChat = ({ item }: { item: any }) => {
        const lastMsgObj = item.lastMessage;
        const lastMsg = typeof lastMsgObj === 'string'
            ? lastMsgObj
            : lastMsgObj?.message || lastMsgObj?.text || lastMsgObj?.content || item.lastMessageText || 'No messages yet';

        const rawDate = lastMsgObj?.createdAt || item.lastMessageAt || item.updatedAt;
        const lastMsgTime = rawDate
            ? new Date(rawDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : '';
        
        const currentIdStr = String(currentUserId || '');
        const otherParticipant = (item.participants || []).find((p: any) => {
            const pid = String(p.id || p._id || p.userId || '');
            return pid && pid !== currentIdStr;
        }) || {};

        const isDirect = item.type === 'direct';
        const name = (isDirect && (otherParticipant.name || otherParticipant.fullName || otherParticipant.username))
            ? (otherParticipant.name || otherParticipant.fullName || otherParticipant.username)
            : (item.title && item.title !== 'Direct Chat' && item.title !== 'Host Event Chat')
            ? item.title
            : (otherParticipant.name || otherParticipant.fullName || otherParticipant.username || item.name || 'Chat');

        const rawAvatar = isDirect
            ? (otherParticipant.avatarUrl || otherParticipant.profilePictureUrl || otherParticipant.avatar || item.imageUrl || item.avatarUrl)
            : (item.imageUrl || item.avatarUrl || otherParticipant.avatarUrl || otherParticipant.profilePictureUrl);

        const image = resolveImageUrl(rawAvatar);

        return (
            <TouchableOpacity
                style={styles.chatRow}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/chat-detail', params: { id: item.id || item._id, name, image } })}
            >
                {image ? (
                    <Image source={{ uri: image }} style={styles.chatAvatar} />
                ) : (
                    <View style={styles.chatAvatarPlaceholder}>
                        <Text style={styles.chatAvatarInitials}>
                            {(name || 'C').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                        </Text>
                    </View>
                )}
                <View style={styles.chatBody}>
                    <Text style={styles.chatName}>{name}</Text>
                    <Text style={styles.chatMessage} numberOfLines={1}>{lastMsg}</Text>
                </View>
                <View style={styles.chatRight}>
                    <Text style={[styles.chatTime, item.unreadCount ? styles.chatTimeUnread : null]}>{lastMsgTime}</Text>
                    <View style={styles.chatIcons}>
                        {item.muted && <Ionicons name="volume-mute" size={14} color="#A0A0A0" />}
                        {item.pinned && <MaterialCommunityIcons name="pin" size={14} color="#A0A0A0" />}
                        {item.unreadCount > 0 && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadText}>{item.unreadCount}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Message</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TouchableOpacity style={styles.gridBtn} onPress={() => router.push('/create-group')}>
                        <Ionicons name="person-add-outline" size={18} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.gridBtn} onPress={() => setShowFilter(true)}>
                        <MaterialCommunityIcons name="dots-grid" size={20} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search messages, artists, events..."
                    placeholderTextColor="#A0A0A0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {/* Filter Pills Row */}
            <View style={styles.pillsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsScroll}>
                    {['All', 'Unread', 'Groups', 'Favorite'].map((option) => {
                        const active = selectedFilter === option;
                        return (
                            <TouchableOpacity
                                key={option}
                                style={[styles.pill, active && styles.pillActive]}
                                onPress={() => setSelectedFilter(option as any)}
                            >
                                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Stories Row */}
                {/* Stories Row */}
                <StoriesSection />

                {/* Chats List */}
                <View style={styles.chatsContainer}>
                    {loading ? (
                        <ActivityIndicator size="small" color="#8E2DE2" style={{ marginVertical: 30 }} />
                    ) : filteredThreads.length === 0 ? (
                        <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                            <MaterialCommunityIcons name="message-text-outline" size={48} color="#DDD" />
                            <Text style={{ color: '#999', marginTop: 12, fontSize: 14 }}>
                                No threads found.
                            </Text>
                        </View>
                    ) : (
                        filteredThreads.map(chat => <React.Fragment key={chat.id}>{renderChat({ item: chat })}</React.Fragment>)
                    )}
                </View>
            </ScrollView>

            {/* Filter Bottom Sheet */}
            <Modal
                visible={showFilter}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilter(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalDismissArea} onPress={() => setShowFilter(false)} />
                    <View style={styles.modalContent}>
                        <View style={styles.dragIndicator} />
                        
                        {['All', 'Unread', 'Groups', 'Favorite'].map((option) => (
                            <TouchableOpacity
                                key={option}
                                style={[
                                    styles.filterOption,
                                    selectedFilter === option && styles.filterOptionActive
                                ]}
                                onPress={() => {
                                    setSelectedFilter(option as any);
                                    setShowFilter(false);
                                }}
                            >
                                <Text style={[
                                    styles.filterOptionText,
                                    selectedFilter === option && styles.filterOptionTextActive
                                ]}>{option}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>
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
        fontSize: 20,
        fontWeight: '700',
        color: '#1A1A1A',
        flex: 1,
        textAlign: 'center',
    },
    gridBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F3F3',
        marginHorizontal: 20,
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginBottom: 20,
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 15,
        color: '#333',
    },
    storiesContainer: {
        marginBottom: 20,
    },
    storiesScroll: {
        paddingHorizontal: 20,
        gap: 16,
    },
    storyItem: {
        alignItems: 'center',
        width: 72,
    },
    storyImageContainer: {
        width: 68,
        height: 68,
        borderRadius: 34,
        padding: 3,
        backgroundColor: '#FFF',
        borderWidth: 2,
        borderColor: '#8E2DE2', // Purple border for others
        marginBottom: 6,
    },
    storyImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    storyAddBtn: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        backgroundColor: '#8E2DE2',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    storyName: {
        fontSize: 12,
        color: '#111',
        fontWeight: '500',
    },
    chatsContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    chatRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
    },
    chatAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 14,
    },
    chatBody: {
        flex: 1,
        justifyContent: 'center',
    },
    chatName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginBottom: 4,
    },
    chatMessage: {
        fontSize: 14,
        color: '#8A8A8A',
    },
    chatRight: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        height: 48,
    },
    chatTime: {
        fontSize: 12,
        color: '#A0A0A0',
    },
    chatTimeUnread: {
        color: '#8E2DE2',
        fontWeight: '600',
    },
    chatIcons: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    unreadBadge: {
        backgroundColor: '#8E2DE2',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    unreadText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    // Filter Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalDismissArea: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 12,
    },
    filterOptionActive: {
        backgroundColor: '#F3E8FF',
        borderRadius: 16,
    },
    filterOptionTextActive: {
        color: '#8E2DE2',
        fontWeight: '700',
    },
    // Pills
    pillsContainer: {
        marginBottom: 16,
    },
    pillsScroll: {
        paddingHorizontal: 20,
        gap: 10,
    },
    pill: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F3F3F3',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    pillActive: {
        backgroundColor: '#8E2DE2',
        borderColor: '#8E2DE2',
    },
    pillText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    pillTextActive: {
        color: '#FFF',
    },
    // Initials Avatar Placeholder
    chatAvatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatAvatarInitials: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    dragIndicator: {
        width: 48,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    filterOption: {
        backgroundColor: '#F9F9F9',
        borderWidth: 1,
        borderColor: '#F0F0F0',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    filterOptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
