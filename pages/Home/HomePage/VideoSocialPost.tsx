import { Colors } from '../../../constants/Colors';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function VideoSocialPost() {
    const [showOptions, setShowOptions] = useState(false);
    const [showHideModal, setShowHideModal] = useState(false);

    const handleOptionsPress = () => setShowOptions(true);

    const handleHidePress = () => {
        setShowOptions(false);
        setTimeout(() => setShowHideModal(true), 300);
    };

    return (
        <>
            <TouchableOpacity style={styles.socialCard} activeOpacity={0.9} onPress={() => router.push('/post-details')}>
                <View style={styles.socialHeader}>
                    <Image source={{ uri: 'https://i.pravatar.cc/150?img=12' }} style={styles.socialAvatar} />
                    <Text style={styles.socialName}>am_official_percy <MaterialIcons name="verified" size={12} color={Colors.primary} /> <Text style={styles.socialTime}>. 2h</Text></Text>
                    <TouchableOpacity style={{ marginLeft: 'auto', padding: 4 }} onPress={handleOptionsPress}>
                        <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.socialCaption}>It's Friday. Let party together</Text>

                <View style={{ position: 'relative' }}>
                    <Image source={require('../../../assets/images/Rectangle 135.png')} style={styles.socialImage} />
                    <View style={styles.videoPlayOverlay}>
                        <View style={styles.playButtonWrapper}>
                            <Ionicons name="play" size={24} color={Colors.primary} style={{ marginLeft: 3 }} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.volumeIcon}>
                        <Ionicons name="volume-mute" size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.socialActions}>
                    <View style={styles.actionItem}>
                        <Ionicons name="heart" size={18} color="#ED4956" />
                        <Text style={styles.actionText}>441</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <MaterialCommunityIcons name="comment-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>108</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="repeat" size={18} color="#888" />
                        <Text style={styles.actionText}>83</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="share" size={18} color="#888" />
                        <Text style={styles.actionText}>579</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Options Modal */}
            <Modal visible={showOptions} transparent animationType="slide" onRequestClose={() => setShowOptions(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowOptions(false)} />
                    <View style={styles.optionsContent}>
                        <View style={styles.dragIndicator} />
                        <TouchableOpacity style={styles.optionBtn}>
                            <Text style={styles.optionBtnText}>Follow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn}>
                            <Text style={styles.optionBtnText}>Unfollow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn} onPress={handleHidePress}>
                            <Text style={styles.optionBtnText}>Hide</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn}>
                            <Text style={[styles.optionBtnText, { color: '#E91E63' }]}>Report</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Hide Post Modal */}
            <Modal visible={showHideModal} transparent animationType="fade" onRequestClose={() => setShowHideModal(false)}>
                <View style={styles.centerModalOverlay}>
                    <View style={styles.hideModalContent}>
                        <View style={styles.hideIconOuter}>
                            <MaterialCommunityIcons name="eye-off-outline" size={32} color="#8E2DE2" />
                        </View>
                        <Text style={styles.hideTitle}>Hide this post?</Text>
                        <Text style={styles.hideSubtitle}>You'll see fewer posts like this.</Text>
                        <View style={styles.hideBtnRow}>
                            <TouchableOpacity style={styles.hideConfirmBtn} onPress={() => setShowHideModal(false)}>
                                <Text style={styles.hideConfirmText}>Hide Post</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.hideCancelBtn} onPress={() => setShowHideModal(false)}>
                                <Text style={styles.hideCancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    socialCard: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
        paddingVertical: 16,
        marginBottom: 16,
    },
    socialHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    socialAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
    socialName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
    socialTime: { fontSize: 13, fontWeight: '400', color: '#888' },
    socialCaption: { fontSize: 14, color: '#1A1A2E', paddingHorizontal: 20, marginBottom: 12 },
    socialImage: { width: '100%', height: 300 },
    socialActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        justifyContent: 'flex-start',
    },
    actionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
    actionText: { fontSize: 13, color: '#888', marginLeft: 6 },
    videoPlayOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonWrapper: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    volumeIcon: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Modals
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'flex-end' },
    modalDismiss: { flex: 1 },
    optionsContent: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 12,
    },
    dragIndicator: { width: 48, height: 4, backgroundColor: '#CCC', borderRadius: 2, alignSelf: 'center', marginBottom: 24 },
    optionBtn: {
        backgroundColor: '#F9F9F9',
        borderRadius: 16,
        paddingVertical: 18,
        paddingHorizontal: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    optionBtnText: { fontSize: 16, fontWeight: '500', color: '#333' },
    centerModalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
    hideModalContent: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, width: '100%', alignItems: 'center' },
    hideIconOuter: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F7F4FA', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    hideTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
    hideSubtitle: { fontSize: 14, color: '#8A8A8A', textAlign: 'center', marginBottom: 24 },
    hideBtnRow: { flexDirection: 'row', gap: 12, width: '100%' },
    hideConfirmBtn: { flex: 1, backgroundColor: '#333', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    hideConfirmText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
    hideCancelBtn: { flex: 1, backgroundColor: '#EAEAEA', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
    hideCancelText: { color: '#333', fontSize: 15, fontWeight: '600' },
});
