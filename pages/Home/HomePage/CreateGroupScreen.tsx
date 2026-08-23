import React, { useEffect, useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userService } from '@/services/userService';
import { chatService } from '@/services/chatService';

export default function CreateGroupScreen() {
    const params = useLocalSearchParams<{ mode: string }>();
    const isAddMode = params.mode === 'add';

    const [friends, setFriends] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedList, setSelectedList] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        userService.getFollowers()
            .then((res) => {
                const list = Array.isArray(res) ? res : res.followers || res.items || [];
                setFriends(list.map((item: any) => ({
                    id: String(item.id || item._id),
                    name: item.fullName || item.name || item.username || 'User',
                    image: item.profilePictureUrl || item.avatarUrl || `https://i.pravatar.cc/150?username=${item.username || 'user'}`,
                })));
            })
            .catch((err) => console.warn('Error loading followers:', err))
            .finally(() => setLoading(false));
    }, []);

    const toggleSelection = (id: string) => {
        setSelectedList(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const filteredUsers = friends.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalSelected = selectedList.length;

    const handleCreateOrAdd = async () => {
        if (totalSelected === 0) return;
        try {
            const thread = await chatService.createGroupThread("Group Chat " + (new Date().toLocaleDateString()), selectedList);
            if (thread && thread.id) {
                router.replace({ pathname: '/chat-detail', params: { id: thread.id, name: thread.title, isGroup: 'true' } });
            } else {
                router.back();
            }
        } catch (e) {
            console.error('Failed to create group thread:', e);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isAddMode ? 'Add people' : 'Create group chat'}</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or username"
                    placeholderTextColor="#A0A0A0"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
            ) : filteredUsers.length === 0 ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: '#999' }}>No contacts found.</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    <Text style={styles.suggestedTitle}>Suggested</Text>
                    
                    {filteredUsers.map((user) => {
                        const isSelected = selectedList.includes(user.id);
                        return (
                            <TouchableOpacity 
                                key={user.id} 
                                style={styles.userRow}
                                onPress={() => toggleSelection(user.id)}
                                activeOpacity={0.8}
                            >
                                <Image source={{ uri: user.image }} style={styles.userAvatar} />
                                <Text style={[styles.userName, !isSelected && { color: '#8A8A8A', fontWeight: '500' }]}>{user.name}</Text>
                                
                                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                                    {isSelected && <Ionicons name="checkmark" size={12} color="#FFF" />}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            )}

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleCreateOrAdd}>
                    <Text style={styles.actionText}>{isAddMode ? `Add (${totalSelected})` : `Create (${totalSelected})`}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA', marginRight: 16 },
    headerTitle: { fontSize: 20, fontWeight: '700', color: '#333' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F3F3', borderRadius: 14, paddingHorizontal: 15, height: 50, marginHorizontal: 20, marginBottom: 15 },
    searchInput: { flex: 1, fontSize: 15, color: '#333', marginLeft: 10 },
    listContent: { paddingHorizontal: 20, paddingBottom: 100 },
    suggestedTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 15, marginTop: 10 },
    userRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    userAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    userName: { flex: 1, fontSize: 15, color: '#222', fontWeight: '600' },
    radioOuter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
    radioOuterSelected: { backgroundColor: '#7B39FD', borderColor: '#7B39FD' },
    bottomContainer: { padding: 20, position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F5F5F5' },
    actionBtn: { backgroundColor: '#7B39FD', height: 54, borderRadius: 27, justifyContent: 'center', alignItems: 'center' },
    actionText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
