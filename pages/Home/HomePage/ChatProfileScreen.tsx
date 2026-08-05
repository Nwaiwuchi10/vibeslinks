import React, { useState, useEffect } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';

export default function ChatProfileScreen() {
    const params = useLocalSearchParams<{ id?: string, name?: string, image?: string, isGroup?: string }>();
    const isGroup = params.isGroup === 'true';
    const conversationId = params.id;
    const chatName = params.name || 'Conversation Profile';
    const chatImage = params.image || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300';

    const [showEndGroupModal, setShowEndGroupModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

    const threads = useAppSelector((state) => state.chat.threads) || [];
    const activeThread = threads.find((t: any) => String(t.id || t._id) === String(conversationId));
    
    // Map actual participants from the active thread dynamically
    const members = (activeThread?.participants || []).map((p: any, idx: number) => ({
        id: p.id || p._id || p.userId || String(idx),
        name: p.name || p.fullName || p.username || 'Member',
        image: p.profilePictureUrl || p.avatarUrl || `https://i.pravatar.cc/150?img=${idx + 10}`,
    }));

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.profileSection}>
                    <Image source={{ uri: chatImage }} style={styles.avatar} />
                    <Text style={styles.nameText}>{chatName}</Text>
                    {isGroup && (
                        <TouchableOpacity style={{ marginTop: 6 }}>
                            <Text style={styles.editGroupText}>Edit group name</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {isGroup ? (
                    <>
                        {/* Group Actions Card */}
                        <View style={styles.groupActionsCard}>
                            <View style={styles.actionGrid}>
                                <TouchableOpacity style={styles.actionGridItem} onPress={() => router.push({ pathname: '/create-group', params: { mode: 'add' } })}>
                                    <View style={styles.iconCircleGrid}>
                                        <Ionicons name="person-outline" size={24} color="#333" />
                                    </View>
                                    <Text style={styles.actionTextGrid}>Add People</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionGridItem} onPress={() => setShowShareModal(true)}>
                                    <View style={styles.iconCircleGrid}>
                                        <Ionicons name="link-outline" size={24} color="#333" />
                                    </View>
                                    <Text style={styles.actionTextGrid}>Invite Link</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionGridItem}>
                                    <View style={styles.iconCircleGrid}>
                                        <MaterialCommunityIcons name="pin-outline" size={24} color="#333" />
                                    </View>
                                    <Text style={styles.actionTextGrid}>Pin Group</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionGridItem}>
                                    <View style={styles.iconCircleGrid}>
                                        <Ionicons name="volume-mute-outline" size={24} color="#333" />
                                    </View>
                                    <Text style={styles.actionTextGrid}>Mute</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionGridItem} onPress={() => router.push('/transfer-ownership')}>
                                    <View style={styles.iconCircleGrid}>
                                        <Ionicons name="settings-outline" size={24} color="#333" />
                                    </View>
                                    <Text style={styles.actionTextGrid}>Manage</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionGridItem} onPress={() => setShowEndGroupModal(true)}>
                                    <View style={styles.iconCircleGrid}>
                                        <Ionicons name="exit-outline" size={24} color="#333" />
                                    </View>
                                    <Text style={styles.actionTextGrid}>Exit Group</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Members List */}
                        <View style={styles.membersSection}>
                            <Text style={styles.membersTitle}>Members({members.length})</Text>
                            {members.map((member) => (
                                <View key={member.id} style={styles.memberRow}>
                                    <Image source={{ uri: member.image }} style={styles.memberAvatar} />
                                    <Text style={styles.memberName}>{member.name}</Text>
                                    <TouchableOpacity style={styles.msgBtn}>
                                        <Text style={styles.msgBtnText}>Message</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <View style={styles.actionsRow}>
                        <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/create-group')}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="people-outline" size={24} color="#333" />
                            </View>
                            <Text style={styles.actionText}>Create Group</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="person-outline" size={24} color="#333" />
                            </View>
                            <Text style={styles.actionText}>View Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem}>
                            <View style={styles.iconCircle}>
                                <MaterialCommunityIcons name="pin-outline" size={24} color="#333" />
                            </View>
                            <Text style={styles.actionText}>Pin Chart</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="volume-mute-outline" size={24} color="#333" />
                            </View>
                            <Text style={styles.actionText}>Mute</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.reportBtn} onPress={() => router.push('/report')} activeOpacity={0.8}>
                    <Ionicons name="flag-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.reportText}>Report</Text>
                </TouchableOpacity>
            </View>

            {/* End Group Modal */}
            <Modal visible={showEndGroupModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>End this group?</Text>
                        <Text style={styles.modalSubtitle}>All group members will be removed from this chat.</Text>
                        <View style={styles.modalBtnsRow}>
                            <TouchableOpacity style={styles.confirmBtn} onPress={() => setShowEndGroupModal(false)}>
                                <Text style={styles.confirmBtnText}>Confirm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowEndGroupModal(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Share/Invite Link Modal */}
            <Modal visible={showShareModal} transparent animationType="slide" onRequestClose={() => setShowShareModal(false)}>
                <View style={styles.shareOverlay}>
                    <TouchableOpacity style={styles.shareDismiss} onPress={() => setShowShareModal(false)} />
                    <View style={styles.shareContent}>
                        <View style={styles.dragIndicator} />
                        
                        <View style={styles.shareSearchRow}>
                            <View style={styles.shareSearchBox}>
                                <Text style={{ color: '#333' }}>Search People</Text>
                            </View>
                            <TouchableOpacity style={styles.shareSearchBtn}>
                                <Ionicons name="arrow-up" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shareUsersRow}>
                            <View style={styles.shareUserItem}>
                                <View style={styles.shareAvatarOuter}>
                                    <Image source={{ uri: chatImage }} style={styles.shareAvatar} />
                                    <View style={styles.shareAddBtn}><Ionicons name="add" size={12} color="#FFF" /></View>
                                </View>
                                <Text style={styles.shareUserName}>Your Story</Text>
                            </View>
                            {members.slice(0, 5).map((m) => (
                                <View key={m.id} style={styles.shareUserItem}>
                                    <View style={[styles.shareAvatarOuter, { borderColor: '#8E2DE2', borderWidth: 2 }]}>
                                        <Image source={{ uri: m.image }} style={styles.shareAvatar} />
                                    </View>
                                    <Text style={styles.shareUserName}>{m.name}</Text>
                                </View>
                            ))}
                        </ScrollView>

                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shareActionsRow}>
                            <View style={styles.shareActionItem}>
                                <View style={styles.shareActionIcon}><Ionicons name="copy-outline" size={20} color="#333" /></View>
                                <Text style={styles.shareActionText}>Copy Link</Text>
                            </View>
                            <View style={styles.shareActionItem}>
                                <View style={styles.shareActionIcon}><FontAwesome5 name="whatsapp" size={20} color="#333" /></View>
                                <Text style={styles.shareActionText}>WhatsApp</Text>
                            </View>
                            <View style={styles.shareActionItem}>
                                <View style={styles.shareActionIcon}><Ionicons name="share-outline" size={20} color="#333" /></View>
                                <Text style={styles.shareActionText}>Share to</Text>
                            </View>
                            <View style={styles.shareActionItem}>
                                <View style={styles.shareActionIcon}><Ionicons name="add-circle-outline" size={20} color="#333" /></View>
                                <Text style={styles.shareActionText}>Vibezlink story</Text>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#FAFAFA' },
    header: { paddingHorizontal: 20, paddingVertical: 16 },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#EAEAEA' },
    content: { paddingTop: 20, paddingBottom: 100 },
    profileSection: { alignItems: 'center', marginBottom: 32 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
    nameText: { fontSize: 20, fontWeight: '700', color: '#111' },
    editGroupText: { fontSize: 13, color: '#8E2DE2', fontWeight: '600' },
    groupActionsCard: { backgroundColor: '#FFF', borderRadius: 24, marginHorizontal: 20, padding: 20, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 25 },
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' },
    actionGridItem: { width: '30%', alignItems: 'center', marginVertical: 8 },
    iconCircleGrid: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#FAF6FF', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    actionTextGrid: { fontSize: 11, fontWeight: '600', color: '#555', textAlign: 'center' },
    membersSection: { paddingHorizontal: 24 },
    membersTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginBottom: 16 },
    memberRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
    memberAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    memberName: { flex: 1, fontSize: 14, fontWeight: '600', color: '#333' },
    msgBtn: { backgroundColor: '#FAF6FF', borderWidth: 1, borderColor: '#8E2DE2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    msgBtnText: { color: '#8E2DE2', fontSize: 11, fontWeight: '700' },
    actionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 20, backgroundColor: '#FFF', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#F0F0F0' },
    actionItem: { alignItems: 'center', gap: 6 },
    iconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FAF6FF', justifyContent: 'center', alignItems: 'center' },
    actionText: { fontSize: 12, fontWeight: '600', color: '#555' },
    bottomContainer: { padding: 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', backgroundColor: '#FFF' },
    reportBtn: { backgroundColor: '#FF3B30', height: 50, borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
    reportText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContent: { width: '80%', backgroundColor: '#FFF', borderRadius: 24, padding: 24, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
    modalSubtitle: { fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 20 },
    modalBtnsRow: { flexDirection: 'row', gap: 12 },
    confirmBtn: { flex: 1, backgroundColor: '#FF3B30', height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    confirmBtnText: { color: '#FFF', fontWeight: '700' },
    cancelBtn: { flex: 1, backgroundColor: '#F5F5F5', height: 46, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    cancelBtnText: { color: '#333', fontWeight: '700' },
    shareOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    shareDismiss: { flex: 1 },
    shareContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, pb: 40 },
    dragIndicator: { width: 40, height: 4, backgroundColor: '#DDD', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
    shareSearchRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
    shareSearchBox: { flex: 1, backgroundColor: '#F5F5F5', height: 46, borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15 },
    shareSearchBtn: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center' },
    shareUsersRow: { gap: 15, paddingBottom: 10 },
    shareUserItem: { alignItems: 'center', width: 68 },
    shareAvatarOuter: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    shareAvatar: { width: 50, height: 50, borderRadius: 25 },
    shareAddBtn: { position: 'absolute', right: -2, bottom: -2, width: 18, height: 18, borderRadius: 9, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center' },
    shareUserName: { fontSize: 10, color: '#666', marginTop: 6, textAlign: 'center' },
    shareActionsRow: { gap: 20, paddingTop: 20 },
    shareActionItem: { alignItems: 'center', width: 68 },
    shareActionIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
    shareActionText: { fontSize: 10, color: '#333', textAlign: 'center' },
});
