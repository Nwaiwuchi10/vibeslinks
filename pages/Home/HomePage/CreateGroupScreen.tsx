import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';

const USERS = [
    { id: '1', name: 'Sophia Carter', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '2', name: 'Malik Johnson', image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' },
    { id: '3', name: 'Elena Rossi', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150' },
    { id: '4', name: 'Hiroshi Tanaka', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: '5', name: 'Amina Yusuf', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: '6', name: 'Diego Morales', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
];

const INITIAL_SELECTED = [
    { id: 's1', name: 'adevibes', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150' },
    { id: 's2', name: 'Nicky', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 's3', name: 'ramonbrown', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 's4', name: 'topaz', image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' },
];

export default function CreateGroupScreen() {
    const params = useLocalSearchParams<{ mode: string }>();
    const isAddMode = params.mode === 'add';

    const [selectedTop, setSelectedTop] = useState(INITIAL_SELECTED);
    const [selectedList, setSelectedList] = useState<string[]>(['2', '6']); // Malik and Diego preselected for demo

    const toggleSelection = (id: string) => {
        setSelectedList(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const removeTopItem = (id: string) => {
        setSelectedTop(prev => prev.filter(item => item.id !== id));
    };

    const totalSelected = selectedTop.length + selectedList.length;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isAddMode ? 'Add people' : 'Create group chart'}</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or username"
                    placeholderTextColor="#A0A0A0"
                />
            </View>

            {/* Selected Top Row */}
            {selectedTop.length > 0 && (
                <View style={styles.selectedContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.selectedScroll}>
                        {selectedTop.map((user) => (
                            <View key={user.id} style={styles.selectedItem}>
                                <View style={styles.selectedImageContainer}>
                                    <Image source={{ uri: user.image }} style={styles.selectedImage} />
                                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeTopItem(user.id)}>
                                        <Ionicons name="close" size={12} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.selectedName} numberOfLines={1}>{user.name}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}

            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.suggestedTitle}>Suggested</Text>
                
                {USERS.map((user) => {
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

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/chat-profile', params: { isGroup: 'true' }})}>
                    <Text style={styles.actionText}>{isAddMode ? `Add (${totalSelected})` : `Create (${totalSelected})`}</Text>
                </TouchableOpacity>
            </View>
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
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
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
    selectedContainer: {
        marginBottom: 20,
    },
    selectedScroll: {
        paddingHorizontal: 20,
        gap: 16,
    },
    selectedItem: {
        alignItems: 'center',
        width: 64,
    },
    selectedImageContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginBottom: 6,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
    },
    removeBtn: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#8E2DE2',
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FAFAFA',
    },
    selectedName: {
        fontSize: 12,
        color: '#333',
        fontWeight: '500',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    suggestedTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 16,
    },
    userRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    userAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 14,
    },
    userName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioOuterSelected: {
        backgroundColor: '#8E2DE2',
        borderColor: '#8E2DE2',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
        backgroundColor: '#FAFAFA',
    },
    actionBtn: {
        backgroundColor: '#8E2DE2',
        paddingVertical: 16,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#8E2DE2',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    actionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
