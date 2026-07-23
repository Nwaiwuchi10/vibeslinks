import { Colors } from '@/constants/Colors';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { resolveImageUrl } from '@/services/apiClient';
import { userService } from '@/services/userService';
import { postService } from '@/services/postService';

export type PostData = {
    id?: string;
    content?: string;
    caption?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    imageUrl?: string;
    author?: {
        id?: string;
        _id?: string;
        name?: string;
        username?: string;
        profilePictureUrl?: string;
        avatarUrl?: string;
        isFollowing?: boolean;
    };
    user?: {
        id?: string;
        _id?: string;
        name?: string;
        username?: string;
        profilePictureUrl?: string;
        avatarUrl?: string;
        isFollowing?: boolean;
    };
    likesCount?: number;
    commentsCount?: number;
    sharesCount?: number;
    createdAt?: string;
    visibility?: string;
    myReaction?: string;
    engagement?: {
        like?: boolean;
        love?: number;
        wow?: number;
        sad?: number;
        angry?: number;
        total?: number;
        myReaction?: string;
    };
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
    const [isHidden, setIsHidden] = useState(false);

    const author = post?.author || post?.user;
    const [isFollowing, setIsFollowing] = useState(false);
    const [likesCount, setLikesCount] = useState(post?.likesCount ?? 0);
    const [hasLiked, setHasLiked] = useState(false);

    useEffect(() => {
        if (author?.isFollowing !== undefined) {
            setIsFollowing(author.isFollowing);
        }
    }, [author]);

    useEffect(() => {
        if (post?.likesCount !== undefined) {
            setLikesCount(post.likesCount);
        }
        const hasReacted = post?.engagement?.myReaction === 'like' || post?.myReaction === 'like' || post?.engagement?.like === true;
        setHasLiked(!!hasReacted);
    }, [post]);

    const handleLikeToggle = async () => {
        if (!post?.id) return;
        try {
            if (hasLiked) {
                await postService.removeReactionFromPost(post.id);
                setHasLiked(false);
                setLikesCount(prev => Math.max(0, prev - 1));
            } else {
                await postService.reactToPost(post.id, 'like');
                setHasLiked(true);
                setLikesCount(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleOptionsPress = () => setShowOptions(true);
    
    const handleHidePress = () => {
        setShowOptions(false);
        setTimeout(() => setShowHideModal(true), 300);
    };

    const handleHideConfirm = () => {
        setShowHideModal(false);
        setIsHidden(true);
    };

    const handleFollow = async () => {
        const authorId = author?.id || author?._id;
        if (!authorId) return;
        try {
            await userService.followUser(authorId);
            setIsFollowing(true);
            setShowOptions(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUnfollow = async () => {
        const authorId = author?.id || author?._id;
        if (!authorId) return;
        try {
            await userService.unfollowUser(authorId);
            setIsFollowing(false);
            setShowOptions(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleReport = () => {
        setShowOptions(false);
        if (post?.id) {
            router.push({ pathname: '/report', params: { id: post.id, type: 'post' } });
        }
    };

    if (isHidden) {
        return null;
    }
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

    const handleCommentPress = () => {
        if (post?.id) {
            router.push({ pathname: '/post-details', params: { id: post.id, focusComment: 'true' } });
        } else {
            router.push('/post-details');
        }
    };

    return (
        <>
            <View style={styles.socialCard}>
                <View style={styles.socialHeader}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 }}
                        activeOpacity={0.7}
                        onPress={goToDetail}
                    >
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
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 4 }} onPress={handleOptionsPress}>
                        <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity activeOpacity={0.9} onPress={goToDetail}>
                    {caption ? <Text style={styles.socialCaption}>{caption}</Text> : null}

                    {resolvedImage && (
                        <Image source={resolvedImage} style={styles.socialImage} />
                    )}
                </TouchableOpacity>

                <View style={styles.socialActions}>
                    <TouchableOpacity style={styles.actionItem} onPress={handleLikeToggle}>
                        <Ionicons
                            name={hasLiked ? "heart" : "heart-outline"}
                            size={18}
                            color={hasLiked ? Colors.primary : "#888"}
                        />
                        <Text style={[styles.actionText, hasLiked && { color: Colors.primary }]}>
                            {likesCount > 0 ? likesCount : ''}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionItem} onPress={handleCommentPress}>
                        <MaterialCommunityIcons name="comment-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>{comments > 0 ? comments : ''}</Text>
                    </TouchableOpacity>
                    <View style={styles.actionItem}>
                        <Feather name="repeat" size={18} color="#888" />
                        <Text style={styles.actionText}>{shares > 0 ? shares : ''}</Text>
                    </View>
                    <View style={styles.actionItem}>
                        <Feather name="share" size={18} color="#888" />
                    </View>
                </View>
            </View>

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
                        {isFollowing ? (
                            <TouchableOpacity style={styles.optionBtn} onPress={handleUnfollow}>
                                <Text style={styles.optionBtnText}>Unfollow</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity style={styles.optionBtn} onPress={handleFollow}>
                                <Text style={styles.optionBtnText}>Follow</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles.optionBtn} onPress={handleHidePress}>
                            <Text style={styles.optionBtnText}>Hide</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn} onPress={handleReport}>
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
                                onPress={handleHideConfirm}
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
