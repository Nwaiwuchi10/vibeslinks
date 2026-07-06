import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const MEMBERS = [
    { id: '1', name: 'Sophia Carter', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '2', name: 'Malik Jonson', image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' },
    { id: '3', name: 'Elena Rossi', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150' },
    { id: '4', name: 'Hiroshi Tanaka', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: '5', name: 'Amina Yusuf', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: '6', name: 'Diego Morales', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
];

export default function TransferOwnershipScreen() {
    const [selectedMember, setSelectedMember] = useState<string>('2'); // Malik preselected for demo
    const [showModal, setShowModal] = useState<boolean>(false);

    const activeMemberName = MEMBERS.find(m => m.id === selectedMember)?.name || 'User';

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transfer ownership</Text>
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name or username"
                    placeholderTextColor="#A0A0A0"
                />
            </View>

            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.membersTitle}>Members</Text>
                
                {MEMBERS.map((user) => {
                    const isSelected = selectedMember === user.id;
                    return (
                        <TouchableOpacity 
                            key={user.id} 
                            style={styles.userRow}
                            onPress={() => setSelectedMember(user.id)}
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
                <TouchableOpacity style={styles.actionBtn} onPress={() => setShowModal(true)}>
                    <Text style={styles.actionText}>Confirm</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={showModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Make {activeMemberName} Owner?</Text>
                        <Text style={styles.modalSubtitle}>All ownership rights will be transfer to this users, and you will not be able to manage this group.</Text>
                        
                        <View style={styles.modalBtnsRow}>
                            <TouchableOpacity style={styles.confirmBtn} onPress={() => { setShowModal(false); router.back(); }}>
                                <Text style={styles.confirmBtnText}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
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
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    membersTitle: {
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
    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#8A8A8A',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 10,
    },
    modalBtnsRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    confirmBtn: {
        flex: 1,
        backgroundColor: '#333',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    confirmBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#EAEAEA',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#E91E63',
        fontSize: 15,
        fontWeight: '600',
    },
});
