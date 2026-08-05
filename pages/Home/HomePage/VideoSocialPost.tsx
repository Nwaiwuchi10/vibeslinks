import { Colors } from '@/constants/Colors';
import { resolveImageUrl } from '@/services/apiClient';
import { postService } from '@/services/postService';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Image, Modal, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import UserAvatar from '@/components/UserAvatar';

interface VideoSocialPostProps {
    post?: any;
}

export default function VideoSocialPost({ post }: VideoSocialPostProps) {
    const videoRef = useRef<Video>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [showHideModal, setShowHideModal] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    const [likesCount, setLikesCount] = useState(post?.likesCount ?? post?.likes?.length ?? 0);
    const [hasLiked, setHasLiked] = useState(post?.myReaction === 'like' || post?.hasLiked === true);
    const [repostsCount, setRepostsCount] = useState(post?.repostsCount ?? 0);
    const [commentsCount] = useState(post?.commentsCount ?? post?.comments?.length ?? 0);
    const [sharesCount, setSharesCount] = useState(post?.sharesCount ?? 0);

    if (!post) return null;

    const author = post.author || post.user || {};
    const authorName = author.username || author.name || author.fullName || 'Creator';
    const avatarUrl = resolveImageUrl(author.profilePictureUrl || author.avatarUrl || null);
    const caption = post.content || post.caption || '';
    const rawMedia = post.mediaUrl || post.videoUrl || post.mediaUrls?.[0] || post.imageUrl || null;
    const mediaUri = resolveImageUrl(rawMedia);

    const timeAgoText = post.createdAt
        ? new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : 'recently';

    const handleOptionsPress = () => setShowOptions(true);

    const handleHidePress = () => {
        setShowOptions(false);
        setTimeout(() => setShowHideModal(true), 300);
    };

    const handleLikeToggle = async () => {
        if (!post?.id) return;
        try {
            if (hasLiked) {
                await postService.removeReactionFromPost(post.id);
                setHasLiked(false);
                setLikesCount((prev: number) => Math.max(0, prev - 1));
            } else {
                await postService.reactToPost(post.id, 'like');
                setHasLiked(true);
                setLikesCount((prev: number) => prev + 1);
            }
        } catch (err) {
            console.error('Like toggle error:', err);
        }
    };

    const handleShare = async () => {
        if (!post?.id) return;
        try {
            await Share.share({ message: `${caption || 'Check out this video on VibezLink!'}` });
            await postService.sharePost(post.id);
            setSharesCount((c: number) => c + 1);
        } catch {}
    };

    const togglePlay = async () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            await videoRef.current.pauseAsync();
            setIsPlaying(false);
        } else {
            await videoRef.current.playAsync();
            setIsPlaying(true);
        }
    };

    return (
        <>
            <TouchableOpacity
                style={styles.socialCard}
                activeOpacity={0.95}
                onPress={() => post?.id && router.push({ pathname: '/post-details', params: { id: post.id } })}
            >
                <View style={styles.socialHeader}>
                    <UserAvatar avatarUrl={avatarUrl} name={authorName} size={38} />
                    <Text style={styles.socialName}>
                        {authorName} <MaterialIcons name="verified" size={12} color={Colors.primary} />{' '}
                        <Text style={styles.socialTime}>. {timeAgoText}</Text>
                    </Text>
                    <TouchableOpacity style={{ marginLeft: 'auto', padding: 4 }} onPress={handleOptionsPress}>
                        <MaterialCommunityIcons name="dots-horizontal" size={20} color="#333" />
                    </TouchableOpacity>
                </View>
                
                {caption ? <Text style={styles.socialCaption}>{caption}</Text> : null}

                <View style={styles.mediaContainer}>
                    {mediaUri ? (
                        <TouchableOpacity activeOpacity={0.9} onPress={togglePlay} style={StyleSheet.absoluteFill}>
                            <Video
                                ref={videoRef}
                                source={{ uri: mediaUri }}
                                style={styles.socialImage}
                                resizeMode={ResizeMode.COVER}
                                isLooping
                                isMuted={isMuted}
                                useNativeControls={false}
                            />
                            {!isPlaying && (
                                <View style={styles.videoPlayOverlay}>
                                    <View style={styles.playButtonWrapper}>
                                        <Ionicons name="play" size={24} color={Colors.primary} style={{ marginLeft: 3 }} />
                                    </View>
                                </View>
                            )}
                        </TouchableOpacity>
                    ) : (
                        <Image source={require('../../../assets/images/Rectangle 135.png')} style={styles.socialImage} />
                    )}

                    <TouchableOpacity style={styles.volumeIcon} onPress={() => setIsMuted(m => !m)}>
                        <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={18} color="#FFF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.socialActions}>
                    <TouchableOpacity style={styles.actionItem} onPress={handleLikeToggle}>
                        <Ionicons name={hasLiked ? 'heart' : 'heart-outline'} size={18} color={hasLiked ? '#ED4956' : '#888'} />
                        <Text style={styles.actionText}>{likesCount}</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => post?.id && router.push({ pathname: '/post-details', params: { id: post.id, focusComment: 'true' } })}
                    >
                        <MaterialCommunityIcons name="comment-outline" size={18} color="#888" />
                        <Text style={styles.actionText}>{commentsCount}</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.actionItem}>
                        <Feather name="repeat" size={18} color="#888" />
                        <Text style={styles.actionText}>{repostsCount}</Text>
                    </View>
                    
                    <TouchableOpacity style={styles.actionItem} onPress={handleShare}>
                        <Feather name="share" size={18} color="#888" />
                        <Text style={styles.actionText}>{sharesCount}</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>

            {/* Options Modal */}
            <Modal visible={showOptions} transparent animationType="slide" onRequestClose={() => setShowOptions(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalDismiss} onPress={() => setShowOptions(false)} />
                    <View style={styles.optionsContent}>
                        <View style={styles.dragIndicator} />
                        <TouchableOpacity style={styles.optionBtn} onPress={() => setShowOptions(false)}>
                            <Text style={styles.optionBtnText}>Follow Creator</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn} onPress={handleHidePress}>
                            <Text style={styles.optionBtnText}>Hide</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.optionBtn} onPress={() => { setShowOptions(false); router.push('/report'); }}>
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
                        <Text style={styles.hideSubtitle}>You'll see fewer posts like this in your feed.</Text>
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
    socialName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginLeft: 8 },
    socialTime: { fontSize: 13, fontWeight: '400', color: '#888' },
    socialCaption: { fontSize: 14, color: '#1A1A2E', paddingHorizontal: 20, marginBottom: 12 },
    mediaContainer: { width: '100%', height: 300, position: 'relative', backgroundColor: '#000' },
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
        backgroundColor: 'rgba(255,255,255,0.85)',
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
        backgroundColor: Colors.primary || '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
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
