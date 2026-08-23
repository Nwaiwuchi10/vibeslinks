import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    Feather,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
} from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { postService } from '@/services/postService';
import { userService } from '@/services/userService';
import { useAppSelector } from '@/store/hooks';

import { Video, ResizeMode } from 'expo-av';
import { Dimensions, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { resolveImageUrl } from '@/services/apiClient';

import { navigateToUserProfile } from '@/utils/profileNavigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function timeAgo(dateStr?: string | Date, _tick?: number): string {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr as string).getTime();
    if (diff < 0) return 'just now';
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
}

function isVideoUrl(url?: string | null, hint?: string): boolean {
    if (hint === 'video') return true;
    if (!url) return false;
    return /\.(mp4|mov|avi|webm|mkv|m4v|3gp)(\?.*)?$/i.test(url);
}

function VideoCell({ uri, isActive = true }: { uri: string; isActive?: boolean }) {
    const videoRef = useRef<Video>(null);
    const isScreenFocused = useIsFocused();
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const canPlay = isActive && isScreenFocused;

    // Pause & mute when slide is not active or screen is unfocused
    useEffect(() => {
        if (!canPlay && videoRef.current) {
            videoRef.current.pauseAsync().catch(() => {});
            videoRef.current.setIsMutedAsync(true).catch(() => {});
            setIsPlaying(false);
        }
    }, [canPlay]);

    const togglePlay = async () => {
        if (!videoRef.current) return;
        try {
            if (isPlaying) {
                await videoRef.current.pauseAsync();
                setIsPlaying(false);
            } else {
                if (isMuted) {
                    await videoRef.current.setIsMutedAsync(false);
                    setIsMuted(false);
                }
                await videoRef.current.playAsync();
                setIsPlaying(true);
            }
        } catch (err) {
            console.log('[VideoCell] Detail video play/pause status handled:', err);
        }
    };

    const toggleMute = async () => {
        if (!videoRef.current) return;
        try {
            await videoRef.current.setIsMutedAsync(!isMuted);
            setIsMuted(!isMuted);
        } catch (err) {
            console.log('[VideoCell] Detail video mute status handled:', err);
        }
    };

    const resolvedUri = resolveImageUrl(uri) || uri;

    return (
        <View style={styles.detailVideoContainer}>
            <Video
                ref={videoRef}
                source={{ uri: resolvedUri }}
                style={styles.detailVideoPlayer}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={!canPlay || isMuted}
                useNativeControls={false}
                shouldPlay={false}
                onError={(err) => {
                    console.warn('[VideoCell] Detail Android/iOS Video Error:', err, 'URI:', resolvedUri);
                }}
                onPlaybackStatusUpdate={status => {
                    if (status.isLoaded) {
                        setIsPlaying(status.isPlaying ?? false);
                        setIsMuted(status.isMuted ?? false);
                    }
                }}
            />
            <TouchableOpacity style={styles.detailVideoOverlay} onPress={togglePlay} activeOpacity={0.85}>
                {!isPlaying && (
                    <View style={styles.playBtnCircle}>
                        <Ionicons name="play" size={28} color="#FFF" />
                    </View>
                )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.muteBtnCircle} onPress={toggleMute} activeOpacity={0.8}>
                <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={16} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.videoBadge}>
                <Ionicons name="videocam" size={13} color="#FFF" />
            </View>
        </View>
    );
}

function MediaCarousel({
    allUrls,
    typeHints,
    mediaType,
}: {
    allUrls: string[];
    typeHints: string[];
    mediaType?: string;
}) {
    const isScreenFocused = useIsFocused();
    const [activeIndex, setActiveIndex] = useState(0);
    const flatRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0 && viewableItems[0].index != null) {
            setActiveIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

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
                    const isSlideActive = idx === activeIndex && isScreenFocused;
                    return (
                        <View style={{ width: SCREEN_WIDTH - 32 }}>
                            {isVideoUrl(url, hint)
                                ? <VideoCell uri={url} isActive={isSlideActive} />
                                : <Image source={{ uri: url }} style={styles.postImage} resizeMode="cover" />}
                        </View>
                    );
                }}
            />
            <View style={styles.slideCounter}>
                <Text style={styles.slideCounterText}>
                    {activeIndex + 1} / {allUrls.length}
                </Text>
            </View>
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

function DetailMediaRenderer({ post }: { post?: any }) {
    const isScreenFocused = useIsFocused();
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
    if (post?.videoUrls?.length) {
        post.videoUrls.forEach(addUrl);
    }
    addUrl(post?.mediaUrl);
    addUrl(post?.imageUrl);
    addUrl(post?.videoUrl);

    const typeHints = post?.mediaTypes || [];

    if (allUrls.length === 0) return null;

    if (allUrls.length === 1) {
        const url = allUrls[0];
        const hint = typeHints[0] || post?.mediaType;
        if (isVideoUrl(url, hint)) {
            return <VideoCell uri={url} isActive={isScreenFocused} />;
        }
        return (
            <View style={styles.mediaContainer}>
                <Image source={{ uri: url }} style={styles.postImage} resizeMode="cover" />
            </View>
        );
    }

    return <MediaCarousel allUrls={allUrls} typeHints={typeHints} mediaType={post?.mediaType} />;
}

function renderCommentText(text: string) {
    if (!text) return null;
    // Split by whitespace to process mentions, preserving whitespace characters
    const words = text.split(/(\s+)/);
    return (
        <Text style={styles.commentText}>
            {words.map((word, i) => {
                if (word.match(/^@[a-zA-Z0-9_]+/)) {
                    return (
                        <Text key={i} style={{ color: Colors.primary, fontWeight: '600' }}>
                            {word}
                        </Text>
                    );
                }
                return <Text key={i}>{word}</Text>;
            })}
        </Text>
    );
}

export default function PostDetailScreen() {
    const insets = useSafeAreaInsets();
    const currentUser = useAppSelector((state) => state.auth?.user);
    const currentUserId = currentUser?.id || currentUser?._id;

    const params = useLocalSearchParams<{ id?: string; focusComment?: string }>();
    const postId = params.id;
    const focusComment = params.focusComment === 'true';

    const commentInputRef = useRef<TextInput>(null);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(!!postId);
    const [replyText, setReplyText] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [commentsList, setCommentsList] = useState<any[]>([]);
    const [likesCount, setLikesCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [repostsCount, setRepostsCount] = useState(0);
    const [sharesCount, setSharesCount] = useState(0);
    const [hasReposted, setHasReposted] = useState(false);
    // Tick every 60s so relative timestamps ("just now" → "1m" etc.) stay accurate
    const [nowTick, setNowTick] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => setNowTick(t => t + 1), 60000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (!postId) {
            setLoading(false);
            return;
        }
        
        const loadData = async () => {
            try {
                const data = await postService.getPostById(postId);
                setPost(data);
                const postAuthor = data?.author || data?.user;
                if (postAuthor?.isFollowing !== undefined) {
                    setIsFollowing(postAuthor.isFollowing);
                }

                // Load comments from the dedicated endpoint (always returns an array)
                const commentsRes = await postService.getPostComments(postId);
                setCommentsList(commentsRes);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [postId]);

    useEffect(() => {
        if (post) {
            setLikesCount(post.likesCount ?? 0);
            setRepostsCount(post.repostsCount ?? 0);
            setSharesCount(post.sharesCount ?? 0);
            const hasReacted = post?.engagement?.myReaction === 'like' || post?.myReaction === 'like' || post?.engagement?.like === true;
            setHasLiked(!!hasReacted);
        }
    }, [post]);

    const author = post?.author || post?.user;

    const handleFollowToggle = async () => {
        if (!author?.id && !author?._id) return;
        const authorId = author.id || author._id;
        try {
            if (isFollowing) {
                await userService.unfollowUser(authorId);
                setIsFollowing(false);
            } else {
                await userService.followUser(authorId);
                setIsFollowing(true);
            }
        } catch (err) {
            console.error('Follow action failed:', err);
        }
    };

    const handleLikeToggle = async () => {
        if (!postId) return;
        try {
            if (hasLiked) {
                await postService.removeReactionFromPost(postId);
                setHasLiked(false);
                setLikesCount(prev => Math.max(0, prev - 1));
            } else {
                await postService.reactToPost(postId, 'like');
                setHasLiked(true);
                setLikesCount(prev => prev + 1);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleRepost = async () => {
        if (!postId) return;
        try {
            await postService.repostPost(postId);
            setRepostsCount(prev => prev + 1);
            setHasReposted(true);
        } catch (err) {
            console.error('[PostDetailScreen] Repost error:', err);
        }
    };

    const handleShare = async () => {
        try {
            const shareContent = post?.content || post?.caption || 'Check out this post on VibezLink!';
            await Share.share({
                message: `${shareContent}\n\nShared via VibezLink`,
            });
            if (postId) await postService.sharePost(postId);
            setSharesCount(prev => prev + 1);
        } catch (error) {
            console.error('[PostDetailScreen] Share error:', error);
        }
    };

    const handleSendComment = async () => {
        if (!postId || !replyText.trim()) return;
        try {
            const response = await postService.createPostComment(postId, replyText);
            // Backend returns { message, comment, post } — extract the actual comment object
            const newComment = response?.comment ?? response;
            if (newComment && !newComment.author && !newComment.user) {
                newComment.author = currentUser;
            }
            setCommentsList((prev: any[]) => [newComment, ...prev]);
            setReplyText('');
        } catch (err) {
            console.error(err);
        }
    };


    useEffect(() => {
        if (focusComment && !loading && commentInputRef.current) {
            const t = setTimeout(() => {
                commentInputRef.current?.focus();
            }, 150);
            return () => clearTimeout(t);
        }
    }, [focusComment, loading]);

    const avatarUri =
        author?.profilePictureUrl ||
        author?.avatarUrl ||
        `https://i.pravatar.cc/150?img=11`;
    const displayName = author?.name || author?.username || 'VibezLink User';
    const username = author?.username || author?.name || 'vibezlink';
    const caption = post?.content || post?.caption || 'Check this out!';
    const mediaUri = post?.mediaUrls?.[0] || post?.mediaUrl || post?.imageUrl || null;
    const timestamp = timeAgo(post?.createdAt);
    const likes = likesCount;
    const comments = commentsList.length;
    const shares = sharesCount;
    const reposts = repostsCount;
    const postComments: any[] = commentsList;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>VIBEZLINK</Text>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconBtn}>
                        <MaterialCommunityIcons
                            name="file-document-outline"
                            size={22}
                            color="#000"
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBtn}>
                        <Ionicons name="notifications-outline" size={22} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Post Content */}
                        <View style={styles.postCard}>
                            <View style={styles.postHeader}>
                                <TouchableOpacity
                                    style={{ flexDirection: 'row', alignItems: 'center', flex: 1, gap: 12 }}
                                    onPress={() => navigateToUserProfile(router, author, currentUserId)}
                                    activeOpacity={0.8}
                                >
                                    <Image source={{ uri: avatarUri }} style={styles.postAvatar} />
                                    <View style={styles.postAuthorInfo}>
                                        <Text style={styles.postName}>
                                            {username}{' '}
                                            {/* <MaterialIcons
                                                name="verified"
                                                size={14}
                                                color={Colors.primary}
                                            /> */}
                                            {timestamp ? (
                                                <Text style={styles.postTime}> · {timestamp}</Text>
                                            ) : null}
                                        </Text>
                                        {displayName !== username && (
                                            <Text style={styles.postDisplayName}>{displayName}</Text>
                                        )}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={[styles.followBtn, isFollowing && styles.followingBtn]}
                                    onPress={handleFollowToggle}
                                >
                                    <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                                        {isFollowing ? 'Following' : 'Follow'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            {caption ? (
                                <Text style={styles.postCaption}>{caption}</Text>
                            ) : null}

                            <DetailMediaRenderer post={post} />

                            {/* Actions */}
                            <View style={styles.postActions}>
                                <TouchableOpacity style={styles.actionItem} onPress={handleLikeToggle}>
                                    <Ionicons
                                        name={hasLiked ? "heart" : "heart-outline"}
                                        size={20}
                                        color={hasLiked ? Colors.primary : "#8A8A8A"}
                                    />
                                    {likes > 0 && (
                                        <Text style={[styles.actionText, hasLiked && { color: Colors.primary }]}>
                                            {likes}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <View style={styles.actionItem}>
                                    <MaterialCommunityIcons
                                        name="comment-outline"
                                        size={20}
                                        color="#8A8A8A"
                                    />
                                    {comments > 0 && (
                                        <Text style={styles.actionText}>{comments}</Text>
                                    )}
                                </View>
                                <TouchableOpacity style={styles.actionItem} onPress={handleRepost}>
                                    <Feather name="repeat" size={20} color={hasReposted ? Colors.primary : '#8A8A8A'} />
                                    {reposts > 0 && (
                                        <Text style={[styles.actionText, hasReposted && { color: Colors.primary }]}>{reposts}</Text>
                                    )}
                                </TouchableOpacity>
                                 <TouchableOpacity style={styles.actionItem} onPress={handleShare}>
                                     <Feather name="send" size={20} color="#8A8A8A" />
                                     {shares > 0 && (
                                         <Text style={styles.actionText}>{shares}</Text>
                                     )}
                                 </TouchableOpacity>
                            </View>
                        </View>

                        {/* Comments */}
                        {postComments.length > 0 ? (
                            <View style={styles.commentsSection}>
                                <Text style={styles.commentsSectionTitle}>Comments</Text>
                                 {postComments.map((comment: any, idx: number) => {
                                     const commenter =
                                         comment.author || comment.user || {};
                                     const rawAvatar = commenter.profilePictureUrl || commenter.avatarUrl || null;
                                     const commenterAvatar = resolveImageUrl(rawAvatar);
                                     const commenterName =
                                         commenter.username || commenter.name || 'User';
                                     const commentText = comment.text || comment.message || comment.content || '';
                                     return (
                                         <View key={comment.id || idx} style={styles.commentRow}>
                                             <TouchableOpacity onPress={() => navigateToUserProfile(router, commenter, currentUserId)} activeOpacity={0.8}>
                                                 {commenterAvatar ? (
                                                     <Image
                                                         source={{ uri: commenterAvatar }}
                                                         style={styles.commentAvatar}
                                                     />
                                                 ) : (
                                                     <View style={styles.commentAvatarFallback}>
                                                         <Text style={styles.commentAvatarInitials}>
                                                             {(commenterName || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                                         </Text>
                                                     </View>
                                                 )}
                                             </TouchableOpacity>
                                             <View style={styles.commentContent}>
                                                 <View style={styles.commentHeader}>
                                                     <TouchableOpacity onPress={() => navigateToUserProfile(router, commenter, currentUserId)} activeOpacity={0.8}>
                                                         <Text style={styles.commentName}>
                                                             {commenterName}
                                                         </Text>
                                                     </TouchableOpacity>
                                                     <Text style={styles.commentTime}>
                                                         {timeAgo(comment.createdAt, nowTick)}
                                                     </Text>
                                                 </View>
                                                 {commentText ? renderCommentText(commentText) : null}
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        ) : (
                            <View style={styles.noCommentsBox}>
                                <MaterialCommunityIcons
                                    name="comment-outline"
                                    size={32}
                                    color="#DDD"
                                />
                                <Text style={styles.noCommentsText}>
                                    Be the first to comment
                                </Text>
                            </View>
                        )}
                    </ScrollView>

                    {/* Input Bar */}
                    <View style={[styles.inputContainer, { paddingBottom: Platform.OS === 'android' ? Math.max(insets.bottom, 16) : Math.max(insets.bottom, 12) }]}>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                ref={commentInputRef}
                                style={styles.input}
                                placeholder="Add your reply..."
                                placeholderTextColor="#888"
                                value={replyText}
                                onChangeText={setReplyText}
                            />
                        </View>
                        <TouchableOpacity style={styles.sendBtn} onPress={handleSendComment}>
                            <Ionicons name="arrow-up" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            )}
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
        paddingVertical: 12,
        justifyContent: 'space-between',
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#333',
        letterSpacing: 1,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 8,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EAEAEA',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    postCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 16,
        borderRadius: 24,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 20,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    postAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        marginRight: 10,
        backgroundColor: '#EEE',
    },
    postAuthorInfo: {
        flex: 1,
    },
    postName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    postDisplayName: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    postTime: {
        fontSize: 13,
        color: '#888',
        fontWeight: '400',
    },
    followBtn: {
        backgroundColor: '#000',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    followingBtn: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    followBtnText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    followingBtnText: {
        color: '#000',
    },
    postCaption: {
        fontSize: 15,
        color: '#333',
        marginBottom: 12,
        lineHeight: 22,
    },
    mediaContainer: {
        width: '100%',
        height: 380,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16,
        position: 'relative',
    },
    postImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
    },
    muteBtn: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postActions: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    actionText: {
        marginLeft: 6,
        fontSize: 14,
        color: '#8A8A8A',
        fontWeight: '500',
    },
    commentsSection: {
        paddingHorizontal: 20,
    },
    commentsSectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 16,
    },
    commentRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    commentAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
        backgroundColor: '#EEE',
    },
    commentAvatarFallback: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    commentAvatarInitials: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
    },
    commentContent: {
        flex: 1,
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    commentName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    commentTime: {
        fontSize: 12,
        color: '#888',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    noCommentsBox: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 8,
    },
    noCommentsText: {
        fontSize: 14,
        color: '#BBB',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: '#FAFAFA',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 12,
    },
    input: {
        fontSize: 15,
        color: '#333',
    },
    sendBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Video & Carousel Styles
    detailVideoContainer: {
        width: '100%',
        height: 380,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: '#000',
        position: 'relative',
        marginBottom: 16,
    },
    detailVideoPlayer: { width: '100%', height: '100%' },
    detailVideoOverlay: {
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
    carouselWrapper: {
        position: 'relative',
        marginBottom: 16,
    },
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
});
