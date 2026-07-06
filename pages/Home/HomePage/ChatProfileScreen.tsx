import React, { useState } from 'react';
import {
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const MEMBERS = [
    { id: '1', name: 'Sophia Carter', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: '2', name: 'Malik Johnson', image: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' },
    { id: '3', name: 'Elena Rossi', image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150' },
];

export default function ChatProfileScreen() {
    const params = useLocalSearchParams<{ name: string, image: string, isGroup: string }>();
    const isGroup = params.isGroup === 'true';
    const chatName = params.name || 'Roland Emmanuel';
    const chatImage = params.image || 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=300';

    const [showEndGroupModal, setShowEndGroupModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

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
                            <Text style={styles.membersTitle}>Members({MEMBERS.length})</Text>
                            {MEMBERS.map((member) => (
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
                        <Text style={styles.modalSubtitle}>All group member will be remove from this chart.</Text>
                        
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
                                    <Image source={{ uri: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=150' }} style={styles.shareAvatar} />
                                    <View style={styles.shareAddBtn}><Ionicons name="add" size={12} color="#FFF" /></View>
                                </View>
                                <Text style={styles.shareUserName}>Your Story</Text>
                            </View>
                            {['adevibes', 'Nicky', 'ramonbrown', 'topaz'].map((name, i) => (
                                <View key={i} style={styles.shareUserItem}>
                                    <View style={[styles.shareAvatarOuter, { borderColor: '#8E2DE2', borderWidth: 2 }]}>
                                        <Image source={{ uri: `https://i.pravatar.cc/150?img=${i + 10}` }} style={styles.shareAvatar} />
                                    </View>
                                    <Text style={styles.shareUserName}>{name}</Text>
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
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
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
    content: {
        paddingTop: 20,
        paddingBottom: 100,
    },
    profileSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
    },
    nameText: {
        fontSize: 22,
        fontWeight: '800',
        color: '#333',
    },
    actionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 10,
        marginBottom: 40,
    },
    actionItem: {
        alignItems: 'center',
    },
    iconCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        marginBottom: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
    },
    reportBtn: {
        backgroundColor: '#E91E63',
        flexDirection: 'row',
        paddingVertical: 16,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reportText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    editGroupText: {
        fontSize: 14,
        color: '#8E2DE2',
        fontWeight: '600',
    },
    groupActionsCard: {
        backgroundColor: '#F5F5F5',
        borderRadius: 24,
        marginHorizontal: 20,
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginBottom: 30,
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    actionGridItem: {
        width: '25%',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircleGrid: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTextGrid: {
        fontSize: 11,
        fontWeight: '600',
        color: '#111',
        textAlign: 'center',
    },
    membersSection: {
        paddingHorizontal: 20,
    },
    membersTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginBottom: 16,
    },
    memberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    memberAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 12,
    },
    memberName: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },
    msgBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    msgBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    // Modals
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

    // Share Modal
    shareOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    shareDismiss: {
        flex: 1,
    },
    shareContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingTop: 12,
        paddingBottom: 40,
    },
    dragIndicator: {
        width: 48,
        height: 4,
        backgroundColor: '#E0E0E0',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    shareSearchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    shareSearchBox: {
        flex: 1,
        backgroundColor: '#F3F3F3',
        borderRadius: 24,
        paddingVertical: 14,
        paddingHorizontal: 20,
        marginRight: 12,
    },
    shareSearchBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareUsersRow: {
        paddingHorizontal: 20,
        gap: 16,
        marginBottom: 30,
    },
    shareUserItem: {
        alignItems: 'center',
        width: 72,
    },
    shareAvatarOuter: {
        width: 68,
        height: 68,
        borderRadius: 34,
        padding: 3,
        marginBottom: 6,
    },
    shareAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
    },
    shareAddBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#8E2DE2',
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    shareUserName: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
    },
    shareActionsRow: {
        paddingHorizontal: 20,
        gap: 16,
    },
    shareActionItem: {
        alignItems: 'center',
        width: 80,
    },
    shareActionIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    shareActionText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },
});
