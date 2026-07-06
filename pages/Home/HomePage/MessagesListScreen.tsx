import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const STORIES = [
    { id: '1', name: 'Your Story', image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150', isAdd: true },
    { id: '2', name: 'adevibes', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150' },
    { id: '3', name: 'Nicky', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '4', name: 'ramonbrown', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
];

const CHATS = [
    {
        id: '1',
        name: 'Roland',
        message: 'You dey come tonight?',
        time: '11:09 AM',
        image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150',
    },
    {
        id: '2',
        name: 'Joseph Ebuka',
        message: 'Sent a photo',
        time: 'Yesterday',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        unread: 2,
        pinned: true,
    },
    {
        id: '3',
        name: 'Telly Khabar',
        message: 'You dey come tonight?',
        time: '11:09 AM',
        image: 'https://images.unsplash.com/photo-1517070208541-6ddc4d3efbcb?w=150',
    },
    {
        id: '4',
        name: 'Joseph Ebuka',
        message: 'Sent a photo',
        time: '11:21 AM',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
        unread: 3,
        muted: true,
    },
    {
        id: '5',
        name: 'The lion King',
        message: 'You dey were added',
        time: '11:09 AM',
        image: 'https://images.unsplash.com/photo-1615112196695-171542f53d4c?w=150', // Tiger
    },
];

export default function MessagesListScreen() {
    const [showFilter, setShowFilter] = useState(false);

    const renderChat = ({ item }: { item: typeof CHATS[0] }) => (
        <TouchableOpacity
            style={styles.chatRow}
            activeOpacity={0.8}
            onPress={() => router.push({ pathname: '/chat-detail', params: { id: item.id, name: item.name, image: item.image } })}
        >
            <Image source={{ uri: item.image }} style={styles.chatAvatar} />
            <View style={styles.chatBody}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
            </View>
            <View style={styles.chatRight}>
                <Text style={[styles.chatTime, item.unread ? styles.chatTimeUnread : null]}>{item.time}</Text>
                <View style={styles.chatIcons}>
                    {item.muted && <Ionicons name="volume-mute" size={14} color="#A0A0A0" />}
                    {item.pinned && <MaterialCommunityIcons name="pin" size={14} color="#A0A0A0" />}
                    {item.unread && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

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
                />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Stories Row */}
                <View style={styles.storiesContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
                        {STORIES.map((story) => (
                            <TouchableOpacity 
                                key={story.id} 
                                style={styles.storyItem}
                                activeOpacity={0.8}
                                onPress={() => router.push(story.isAdd ? '/add-story' : '/view-story')}
                            >
                                <View style={styles.storyImageContainer}>
                                    <Image source={{ uri: story.image }} style={styles.storyImage} />
                                    {story.isAdd && (
                                        <View style={styles.storyAddBtn}>
                                            <Ionicons name="add" size={14} color="#FFF" />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Chats List */}
                <View style={styles.chatsContainer}>
                    {CHATS.map(chat => <React.Fragment key={chat.id}>{renderChat({ item: chat })}</React.Fragment>)}
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
                            <TouchableOpacity key={option} style={styles.filterOption} onPress={() => setShowFilter(false)}>
                                <Text style={styles.filterOptionText}>{option}</Text>
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
