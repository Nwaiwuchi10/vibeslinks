import { Colors } from '@/constants/Colors';
import { resolveImageUrl } from '@/services/apiClient';
import { postService } from '@/services/postService';
import { userService } from '@/services/userService';
import { useAppSelector } from '@/store/hooks';
import { Feather, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Video, ResizeMode } from 'expo-av';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type PostData = {
    id?: string;
    content?: string;
    caption?: string;
    mediaUrls?: string[];
    mediaUrl?: string;
    imageUrl?: string;
    mediaType?: string;         // 'image' | 'video' | 'mixed' – from backend
    mediaTypes?: string[];      // per-item types when multiple media
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
    imageSource?: any; // Legacy fallback
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

/** Detect if a URL points to a video based on extension or mediaType hint */
function isVideoUrl(url?: string | null, hint?: string): boolean {
    if (hint === 'video') return true;
    if (!url) return false;
    return /\.(mp4|mov|avi|webm|mkv|m4v|3gp)(\?.*)?$/i.test(url);
}

// ─── Video Cell ───────────────────────────────────────────────────────────────

function VideoCell({ uri }: { uri: string }) {
    const videoRef = useRef<Video>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const resolvedUri = resolveImageUrl(uri) || uri;

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

    const toggleMute = async () => {
        if (!videoRef.current) return;
        await videoRef.current.setIsMutedAsync(!isMuted);
        setIsMuted(!isMuted);
    };

    return (
        <View style={styles.videoContainer}>
            <Video
                ref={videoRef}
                source={{ uri: resolvedUri }}
                style={styles.videoPlayer}
                resizeMode={ResizeMode.COVER}
                useNativeControls={false}
                shouldPlay={false}
                isLooping
                isMuted={isMuted}
                onError={(err) => {
                    console.warn('[VideoCell] Android/iOS Video Error:', err, 'URI:', resolvedUri);
                }}
                onPlaybackStatusUpdate={status => {
                    if (status.isLoaded) {
                        setIsPlaying(status.isPlaying ?? false);
                        setIsMuted(status.isMuted ?? false);
                    }
                }}
            />
            {/* Play / Pause overlay */}
            <TouchableOpacity style={styles.videoOverlay} onPress={togglePlay} activeOpacity={0.85}>
                {!isPlaying && (
                    <View style={styles.playBtnCircle}>
                        <Ionicons name="play" size={28} color="#FFF" />
                    </View>
                )}
            </TouchableOpacity>
            {/* Mute/Unmute audio button */}
            <TouchableOpacity style={styles.muteBtnCircle} onPress={toggleMute} activeOpacity={0.8}>
                <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={16} color="#FFF" />
            </TouchableOpacity>
            {/* Video badge */}
            <View style={styles.videoBadge}>
                <Ionicons name="videocam" size={13} color="#FFF" />
            </View>
        </View>
    );
}

// ─── Media Renderer ───────────────────────────────────────────────────────────

function MediaRenderer({ post, imageSource }: { post?: PostData; imageSource?: any }) {
    const allUrls: string[] = [];
    const addUrl = (u?: string | null) => {
        if (!u) return;
        const resolved = resolveImageUrl(u);
        if (resolved && !allUrls.includes(resolved)) {
            allUrls.push(resolved);
        }
    };

    if (post?.mediaUrls?.length) {
        post.mediaUrls.forEach(addUrl);
    }
    if ((post as any)?.videoUrls?.length) {
        (post as any).videoUrls.forEach(addUrl);
    }
    addUrl(post?.mediaUrl);
    addUrl(post?.imageUrl);
    addUrl((post as any)?.videoUrl);

    // Per-item type hints from backend (if available)
    const typeHints = post?.mediaTypes || [];

    // If no backend URLs but legacy imageSource provided
    if (allUrls.length === 0) {
        if (imageSource) {
            return <Image source={imageSource} style={styles.socialImage} />;
        }
        return null;
    }

    // Single media item
    if (allUrls.length === 1) {
        const url = allUrls[0];
        const hint = typeHints[0] || post?.mediaType;
        if (isVideoUrl(url, hint)) {
            return <VideoCell uri={url} />;
        }
        return <Image source={{ uri: url }} style={styles.socialImage} resizeMode="cover" />;
    }

    // Multiple media items — swipeable paged carousel
    return <MediaCarousel allUrls={allUrls} typeHints={typeHints} mediaType={post?.mediaType} />;
}

// ─── Swipeable Carousel ───────────────────────────────────────────────────────

function MediaCarousel({
    allUrls,
    typeHints,
    mediaType,
}: {
    allUrls: string[];
    typeHints: string[];
    mediaType?: string;
}) {
    const [activeIndex, setActiveIndex] = useState(0);
    const flatRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

    return (
        <View style={styles.carouselWrapper}>
            <FlatList
                ref={flatRef}
                data={allUrls}
                keyExtractor={(_, idx) => String(idx)}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                renderItem={({ item: url, index: idx }) => {
                    const hint = typeHints[idx] || mediaType;
                    return (
                        <View style={styles.carouselSlide}>
                            {isVideoUrl(url, hint)
                                ? <VideoCell uri={url} />
                                : <Image source={{ uri: url }} style={styles.socialImage} resizeMode="cover" />}
                        </View>
                    );
                }}
            />

            {/* "1 / N" counter — top right */}
            <View style={styles.slideCounter}>
                <Text style={styles.slideCounterText}>
                    {activeIndex + 1} / {allUrls.length}
                </Text>
            </View>

            {/* Dot indicators — bottom centre */}
            <View style={styles.dotsRow}>
                {allUrls.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            i === activeIndex ? styles.dotActive : styles.dotInactive,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PhotoSocialPost({ post, imageSource }: Props) {
    const currentUser = useAppSelector((state) => state.auth?.user);
    const [showOptions, setShowOptions] = useState(false);
    const [showHideModal, setShowHideModal] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    const author = post?.author || post?.user;
    const [isFollowing, setIsFollowing] = useState(false);
    const [likesCount, setLikesCount] = useState(post?.likesCount ?? 0);
    const [hasLiked, setHasLiked] = useState(false);

    // Is the current user the creator of this post?
    const authorId = author?.id || author?._id;
    const currentUserId = currentUser?.id || currentUser?._id;
    const isOwner = !!(authorId && currentUserId && authorId === currentUserId);

    useEffect(() => {
        if (author?.isFollowing !== undefined) {
            setIsFollowing(author.isFollowing);
        }
    }, [author]);

    useEffect(() => {
        if (post?.likesCount !== undefined) setLikesCount(post.likesCount);
        const reacted =
            post?.engagement?.myReaction === 'like' ||
            post?.myReaction === 'like' ||
            post?.engagement?.like === true;
        setHasLiked(!!reacted);
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

    const handleEditPost = () => {
        setShowOptions(false);
        if (post?.id) {
            router.push({ pathname: '/edit-post', params: { id: post.id } });
        }
    };

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

    if (isHidden) return null;

    // ── Derived display values ──
    const avatarUri = resolveImageUrl(author?.profilePictureUrl || author?.avatarUrl || null) || undefined;
    const displayName = author?.name || author?.username || 'VibezLink User';
    const username = author?.username || author?.name || 'vibezlink';
    const caption = post?.content || post?.caption || '';
    const timestamp = timeAgo(post?.createdAt);
    const comments = post?.commentsCount ?? 0;
    const shares = post?.sharesCount ?? 0;

    return (
        <>
            <View style={styles.socialCard}>
                {/* Header */}
                <View style={styles.socialHeader}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 10 }}
                        activeOpacity={0.7}
                        onPress={goToDetail}
                    >
                        {avatarUri ? (
                            <Image source={{ uri: avatarUri }} style={styles.socialAvatar} />
                        ) : (
                            <View style={[styles.socialAvatar, styles.avatarPlaceholder]}>
                                <Ionicons name="person" size={18} color="#CCC" />
                            </View>
                        )}
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

                {/* Caption + Media */}
                <TouchableOpacity activeOpacity={0.9} onPress={goToDetail}>
                    {caption ? <Text style={styles.socialCaption}>{caption}</Text> : null}
                </TouchableOpacity>

                <MediaRenderer post={post} imageSource={imageSource} />

                {/* Actions */}
                <View style={styles.socialActions}>
                    <TouchableOpacity style={styles.actionItem} onPress={handleLikeToggle}>
                        <Ionicons
                            name={hasLiked ? 'heart' : 'heart-outline'}
                            size={18}
                            color={hasLiked ? Colors.primary : '#888'}
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

                        {/* Edit Post — only for owner */}
                        {isOwner && (
                            <TouchableOpacity style={styles.optionBtn} onPress={handleEditPost}>
                                <View style={styles.optionRow}>
                                    <Ionicons name="create-outline" size={20} color={Colors.primary} />
                                    <Text style={[styles.optionBtnText, { color: Colors.primary }]}>Edit Post</Text>
                                </View>
                            </TouchableOpacity>
                        )}

                        {/* Follow / Unfollow — only for non-owners */}
                        {!isOwner && (
                            isFollowing ? (
                                <TouchableOpacity style={styles.optionBtn} onPress={handleUnfollow}>
                                    <Text style={styles.optionBtnText}>Unfollow</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.optionBtn} onPress={handleFollow}>
                                    <Text style={styles.optionBtnText}>Follow</Text>
                                </TouchableOpacity>
                            )
                        )}

                        <TouchableOpacity style={styles.optionBtn} onPress={handleHidePress}>
                            <Text style={styles.optionBtnText}>Hide</Text>
                        </TouchableOpacity>

                        {!isOwner && (
                            <TouchableOpacity style={styles.optionBtn} onPress={handleReport}>
                                <Text style={[styles.optionBtnText, { color: '#E91E63' }]}>Report</Text>
                            </TouchableOpacity>
                        )}
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
                            <MaterialCommunityIcons name="eye-off-outline" size={32} color={Colors.primary} />
                        </View>
                        <Text style={styles.hideTitle}>Hide this post?</Text>
                        <Text style={styles.hideSubtitle}>You'll see fewer posts like this.</Text>
                        <View style={styles.hideBtnRow}>
                            <TouchableOpacity style={styles.hideConfirmBtn} onPress={handleHideConfirm}>
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
        marginBottom: 10,
        gap: 10,
    },
    socialAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EEE' },
    avatarPlaceholder: {
        backgroundColor: '#F0F0F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    socialName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E' },
    displayName: { fontSize: 12, color: '#888', marginTop: 1 },
    socialTime: { fontSize: 13, fontWeight: '400', color: '#888' },
    socialCaption: {
        fontSize: 14,
        color: '#1A1A2E',
        paddingHorizontal: 20,
        marginBottom: 12,
        lineHeight: 20,
    },
    socialImage: { width: '100%', height: 300, backgroundColor: '#F5F5F5' },
    // Video
    videoContainer: {
        width: '100%',
        height: 300,
        backgroundColor: '#000',
        position: 'relative',
    },
    videoPlayer: { width: '100%', height: '100%' },
    videoOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playBtnCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoBadge: {
        position: 'absolute',
        top: 10,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    muteBtnCircle: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    // ── Carousel ──────────────────────────────────────────────────────────────
    carouselWrapper: {
        position: 'relative',
    },
    carouselSlide: {
        width: SCREEN_WIDTH,
    },
    // "1 / N" counter — top right corner
    slideCounter: {
        position: 'absolute',
        top: 10,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.52)',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    slideCounterText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
    // Dot indicators — bottom centre
    dotsRow: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    dotActive: {
        width: 20,
        backgroundColor: '#FFF',
    },
    dotInactive: {
        width: 6,
        backgroundColor: 'rgba(255,255,255,0.45)',
    },
    // Actions
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
    optionRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
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
