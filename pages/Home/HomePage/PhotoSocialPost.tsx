import { Colors } from '../../../constants/Colors';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resolveImageUrl } from '@/services/apiClient';

export type PostData = {
    id?: string;
    content?: string;
    caption?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    imageUrl?: string;
    author?: {
        id?: string;
        name?: string;
        username?: string;
        profilePictureUrl?: string;
        avatarUrl?: string;
    };
    user?: {
        id?: string;
        name?: string;
        username?: string;
        profilePictureUrl?: string;
        avatarUrl?: string;
    };
    likesCount?: number;
    commentsCount?: number;
    sharesCount?: number;
    createdAt?: string;
    visibility?: string;
};

interface Props {
    post?: PostData;
    // Legacy fallback — imageSource can still be passed directly
    imageSource?: any;
}

function timeAgo(dateStr?: string): string {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
}

export default function PhotoSocialPost({ post, imageSource }: Props) {
    const [showOptions, setShowOptions] = useState(false);
    const [showHideModal, setShowHideModal] = useState(false);

    const handleOptionsPress = () => setShowOptions(true);
    const handleHidePress = () => {
        setShowOptions(false);
        setTimeout(() => setShowHideModal(true), 300);
    };

    // Resolve fields from the post object, with fallbacks for legacy imageSource usage
    const author = post?.author || post?.user;
    const avatarUri = resolveImageUrl(
        author?.profilePictureUrl ||
        author?.avatarUrl ||
        null
    ) || `https://i.pravatar.cc/150?img=12`;
    const displayName = author?.name || author?.username || 'VibezLink User';
    const username = author?.username || author?.name || 'vibezlink';
    const caption = post?.content || post?.caption || '';
    const mediaUri = post?.mediaUrls?.[0] || post?.mediaUrl || post?.imageUrl || null;
    const timestamp = timeAgo(post?.createdAt);
    const likes = post?.likesCount ?? 0;
    const comments = post?.commentsCount ?? 0;
    const shares = post?.sharesCount ?? 0;

    const resolvedImage =
        mediaUri ? { uri: mediaUri } : imageSource ?? null;

    const goToDetail = () => {
        if (post?.id) {
            router.push({ pathname: '/post-details', params: { id: post.id } });
        } else {
            router.push('/post-details');
        }
    };

    return (
        <>
            <TouchableOpacity style={styles.socialCard} activeOpacity={0.9} onPress={goToDetail}>
                <View style={styles.socialHeader}>
                    <Image source={{ uri: avatarUri }} style={styles.socialAvatar} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.socialName} numberOfLines={1}>
                            {username}{' '}
                            <MaterialIcons name="verified" size={12} color={Colors.primary} />
                            {timestamp ? (
                                <Text style={styles.socialTime}> · {timestamp}</Text>
                            ) : null}
                        </Text>
                        {displayName !== username && (
                            <Text style={styles.displayName} numberOfLines={1}>
                                {displayName}
                            </Text>
                        )}
                    </View>
                    <TouchableOpacity style={{ padding: 4 }} onPress={handleOptionsPress}>
                        <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                {caption ? <Text style={styles.socialCaption}>{caption}</Text> : null}

                {resolvedImage && (
                    <Image source={resolvedImage} style={styles.socialImage} />
                )}

                <View style={styles.socialActions}>
                    <View style={styles.actionItem}>
                        <Ionicons name="heart-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>{likes > 0 ? likes : ''}</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <MaterialCommunityIcons name="comment-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>{comments > 0 ? comments : ''}</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="repeat" size={18} color="#888" />
                        <Text style={styles.actionText}>{shares > 0 ? shares : ''}</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="share" size={18} color="#888" />
                    </View>
                </View>
            </TouchableOpacity>

            {/* Options Modal */}
            <Modal
                visible={showOptions}
                transparent
                animationType="slide"
                onRequestClose={() => setShowOptions(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalDismiss}
                        onPress={() => setShowOptions(false)}
                    />
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
            <Modal
                visible={showHideModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowHideModal(false)}
            >
                <View style={styles.centerModalOverlay}>
                    <View style={styles.hideModalContent}>
                        <View style={styles.hideIconOuter}>
                            <MaterialCommunityIcons
                                name="eye-off-outline"
                                size={32}
                                color={Colors.primary}
                            />
                        </View>
                        <Text style={styles.hideTitle}>Hide this post?</Text>
                        <Text style={styles.hideSubtitle}>You'll see fewer posts like this.</Text>
                        <View style={styles.hideBtnRow}>
                            <TouchableOpacity
                                style={styles.hideConfirmBtn}
                                onPress={() => setShowHideModal(false)}
                            >
                                <Text style={styles.hideConfirmText}>Hide Post</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.hideCancelBtn}
                                onPress={() => setShowHideModal(false)}
                            >
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
        marginBottom: 10,
        gap: 10,
    },
    socialAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EEE' },
    socialName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
    displayName: { fontSize: 12, color: '#888', marginTop: 1 },
    socialTime: { fontSize: 13, fontWeight: '400', color: '#888' },
    socialCaption: { fontSize: 14, color: '#1A1A2E', paddingHorizontal: 20, marginBottom: 12, lineHeight: 20 },
    socialImage: { width: '100%', height: 300, backgroundColor: '#F5F5F5' },
    socialActions: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingTop: 16,
        justifyContent: 'flex-start',
    },
    actionItem: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
    actionText: { fontSize: 13, color: '#888', marginLeft: 6 },
    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    modalDismiss: { flex: 1 },
    optionsContent: {
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
        backgroundColor: '#CCC',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
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
    centerModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    hideModalContent: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        alignItems: 'center',
    },
    hideIconOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F7F4FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    hideTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 8 },
    hideSubtitle: {
        fontSize: 14,
        color: '#8A8A8A',
        textAlign: 'center',
        marginBottom: 24,
    },
    hideBtnRow: { flexDirection: 'row', gap: 12, width: '100%' },
    hideConfirmBtn: {
        flex: 1,
        backgroundColor: '#333',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    hideConfirmText: { color: '#FFF', fontSize: 15, fontWeight: '600' },
    hideCancelBtn: {
        flex: 1,
        backgroundColor: '#EAEAEA',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    hideCancelText: { color: '#333', fontSize: 15, fontWeight: '600' },
});
