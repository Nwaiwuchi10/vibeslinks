import { Colors } from '@/constants/Colors';
import { resolveImageUrl } from '@/services/apiClient';
import { postService } from '@/services/postService';
import { useAppSelector } from '@/store/hooks';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { Image as ExpoImage } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    SafeAreaView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ViewToken,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface PostItem {
    id: string;
    content?: string;
    mediaUrls?: string[];
    author?: { id?: string; name?: string; username?: string; profilePictureUrl?: string };
    engagement?: { like?: number; total?: number; myReaction?: string };
    likesCount?: number;
    commentsCount?: number;
    repostsCount?: number;
    sharesCount?: number;
    createdAt?: string;
}

function isVideoUrl(url?: string | null): boolean {
    if (!url) return false;
    return /\.(mp4|mov|avi|webm|mkv|m4v|3gp)(\?.*)?$/i.test(url);
}

function postHasVideo(post: any): boolean {
    if (isVideoUrl(post.videoUrl)) return true;
    if (isVideoUrl(post.mediaUrl)) return true;
    if (post.mediaUrls && post.mediaUrls.some(isVideoUrl)) return true;
    return false;
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

function FullScreenVideo({ uri, isActive }: { uri: string; isActive: boolean }) {
    const ref = useRef<Video>(null);
    const isScreenFocused = useIsFocused();
    const [isMuted, setIsMuted] = useState(true);

    const shouldPlay = isActive && isScreenFocused;

    useEffect(() => {
        if (!ref.current) return;
        if (shouldPlay) {
            ref.current.playAsync().catch(() => {});
        } else {
            ref.current.pauseAsync().catch(() => {});
            ref.current.setIsMutedAsync(true).catch(() => {});
        }
    }, [shouldPlay]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Video
                ref={ref}
                source={{ uri: resolveImageUrl(uri) || uri }}
                style={StyleSheet.absoluteFill}
                resizeMode={ResizeMode.COVER}
                isLooping
                isMuted={isMuted}
                shouldPlay={false}
                useNativeControls={false}
            />
            <TouchableOpacity style={styles.muteBtn} onPress={() => setIsMuted(m => !m)}>
                <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={18} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

function ActionPanel({ post }: { post: PostItem }) {
    const [likesCount, setLikesCount] = useState(post.likesCount ?? 0);
    const [hasLiked, setHasLiked] = useState(post.engagement?.myReaction === 'like');
    const [repostsCount, setRepostsCount] = useState(post.repostsCount ?? 0);
    const [hasReposted, setHasReposted] = useState(false);
    const [commentsCount] = useState(post.commentsCount ?? 0);

    const handleLike = async () => {
        try {
            if (hasLiked) {
                await postService.removeReactionFromPost(post.id);
                setHasLiked(false);
                setLikesCount(c => Math.max(0, c - 1));
            } else {
                await postService.reactToPost(post.id, 'like');
                setHasLiked(true);
                setLikesCount(c => c + 1);
            }
        } catch { }
    };

    const handleRepost = async () => {
        try {
            await postService.repostPost(post.id);
            setRepostsCount(c => c + 1);
            setHasReposted(true);
        } catch { }
    };

    const handleShare = async () => {
        try {
            await Share.share({ message: `${post.content ?? 'Check this out!'}\n\nShared via VibezLink` });
            await postService.sharePost(post.id);
        } catch { }
    };

    const handleComment = () => {
        router.push({ pathname: '/post-details', params: { id: post.id, focusComment: 'true' } });
    };

    return (
        <View style={styles.actionPanel}>
            <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.8}>
                <Ionicons name={hasLiked ? 'heart' : 'heart-outline'} size={30} color={hasLiked ? '#FF4D6D' : '#FFF'} />
                {likesCount > 0 && <Text style={styles.actionCount}>{likesCount}</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleComment} activeOpacity={0.8}>
                <MaterialCommunityIcons name="comment-outline" size={28} color="#FFF" />
                {commentsCount > 0 && <Text style={styles.actionCount}>{commentsCount}</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleRepost} activeOpacity={0.8}>
                <Feather name="repeat" size={26} color={hasReposted ? Colors.primary : '#FFF'} />
                {repostsCount > 0 && <Text style={styles.actionCount}>{repostsCount}</Text>}
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionBtn} onPress={handleShare} activeOpacity={0.8}>
                <Feather name="share" size={26} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

function PostSlide({ post, isActive }: { post: PostItem; isActive: boolean }) {
    const author = post.author;
    const avatarUrl = resolveImageUrl(author?.profilePictureUrl) || author?.profilePictureUrl;
    const username = author?.username || author?.name || 'VibezLink';

    const allMedia: string[] = [];
    const addMedia = (u?: string | null) => {
        if (!u) return;
        const resolved = resolveImageUrl(u) || u;
        if (resolved && !allMedia.includes(resolved)) {
            allMedia.push(resolved);
        }
    };

    if (post.mediaUrls && post.mediaUrls.length > 0) {
        post.mediaUrls.forEach(addMedia);
    }
    addMedia((post as any).mediaUrl);
    addMedia((post as any).imageUrl);
    addMedia((post as any).videoUrl);

    const [innerIndex, setInnerIndex] = useState(0);

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setInnerIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

    return (
        <View style={styles.slide}>
            {allMedia.length === 0 ? (
                <View style={[StyleSheet.absoluteFill, styles.noMediaBg]} />
            ) : allMedia.length === 1 ? (
                isVideoUrl(allMedia[0]) ? (
                    <FullScreenVideo uri={allMedia[0]} isActive={isActive} />
                ) : (
                    <ExpoImage source={{ uri: allMedia[0] }} style={StyleSheet.absoluteFill} contentFit="cover" />
                )
            ) : (
                <View style={StyleSheet.absoluteFill}>
                    <FlatList
                        data={allMedia}
                        keyExtractor={(_, idx) => String(idx)}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        bounces={false}
                        onViewableItemsChanged={onViewableItemsChanged}
                        viewabilityConfig={viewabilityConfig}
                        renderItem={({ item: uri, index: idx }) => (
                            <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
                                {isVideoUrl(uri) ? (
                                    <FullScreenVideo uri={uri} isActive={isActive && idx === innerIndex} />
                                ) : (
                                    <ExpoImage source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
                                )}
                            </View>
                        )}
                    />
                    {/* Media position indicator dots */}
                    <View style={styles.horizontalDotsRow}>
                        {allMedia.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.horizontalDot,
                                    i === innerIndex ? styles.horizontalDotActive : styles.horizontalDotInactive,
                                ]}
                            />
                        ))}
                    </View>
                </View>
            )}

            {/* Author + caption info */}
            <View style={styles.postInfo} pointerEvents="box-none">
                <TouchableOpacity
                    style={styles.authorRow}
                    activeOpacity={0.8}
                    onPress={() => {
                        if (author?.id) {
                            (router as any).push({ pathname: '/profile', params: { id: author.id } });
                        }
                    }}
                >
                    {avatarUrl ? (
                        <ExpoImage source={{ uri: avatarUrl }} style={styles.authorAvatar} contentFit="cover" />
                    ) : (
                        <View style={styles.avatarFallback}>
                            <Text style={styles.avatarInitials}>{username.substring(0, 2).toUpperCase()}</Text>
                        </View>
                    )}
                    <Text style={styles.authorName}>@{username}</Text>
                    <Text style={styles.timestamp}>{timeAgo(post.createdAt)}</Text>
                </TouchableOpacity>

                {post.content ? (
                    <Text style={styles.caption} numberOfLines={3}>{post.content}</Text>
                ) : null}
            </View>

            <ActionPanel post={post} />
        </View>
    );
}

export default function FullScreenFeedScreen() {
    const params = useLocalSearchParams<{ startId?: string }>();
    const startId = params.startId;

    const [posts, setPosts] = useState<PostItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const flatRef = useRef<FlatList<PostItem>>(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await postService.getPostFeed();
                const items: PostItem[] = Array.isArray(data)
                    ? data
                    : Array.isArray((data as any)?.posts)
                        ? (data as any).posts
                        : Array.isArray((data as any)?.items)
                            ? (data as any).items
                            : [];
                
                const videoItems = items.filter(postHasVideo);
                setPosts(videoItems);

                if (startId) {
                    const idx = videoItems.findIndex(p => p.id === startId);
                    if (idx >= 0) setActiveIndex(idx);
                }
            } catch (err) {
                console.error('[FullScreenFeed] Load error:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [startId]);

    useEffect(() => {
        if (!loading && activeIndex > 0 && flatRef.current) {
            setTimeout(() => {
                flatRef.current?.scrollToIndex({ index: activeIndex, animated: false });
            }, 150);
        }
    }, [loading, activeIndex]);

    const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0 && viewableItems[0].index != null) {
            setActiveIndex(viewableItems[0].index);
        }
    }, []);

    const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 }).current;

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <SafeAreaView style={styles.backBtnContainer} pointerEvents="box-none">
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
            </SafeAreaView>

            <FlatList
                ref={flatRef}
                data={posts}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => (
                    <PostSlide post={item} isActive={index === activeIndex} />
                )}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                decelerationRate="fast"
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
                getItemLayout={(_, index) => ({
                    length: SCREEN_HEIGHT,
                    offset: SCREEN_HEIGHT * index,
                    index,
                })}
                removeClippedSubviews
                windowSize={3}
                maxToRenderPerBatch={2}
                initialNumToRender={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    loadingContainer: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
    backBtnContainer: { position: 'absolute', top: 0, left: 0, zIndex: 100, padding: 8 },
    backBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center', alignItems: 'center',
    },
    slide: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT, backgroundColor: '#111' },
    noMediaBg: { backgroundColor: '#1A1A2E' },
    horizontalDotsRow: {
        position: 'absolute',
        top: 60,
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 6,
        zIndex: 10,
    },
    horizontalDot: {
        height: 4,
        borderRadius: 2,
    },
    horizontalDotActive: {
        width: 16,
        backgroundColor: '#FFF',
    },
    horizontalDotInactive: {
        width: 6,
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    postInfo: { position: 'absolute', bottom: 90, left: 16, right: 80 },
    authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 8 },
    authorAvatar: { width: 36, height: 36, borderRadius: 18, borderWidth: 2, borderColor: '#FFF' },
    avatarFallback: {
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: Colors.primary,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: '#FFF',
    },
    avatarInitials: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    authorName: { color: '#FFF', fontSize: 15, fontWeight: '700' },
    timestamp: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginLeft: 4 },
    caption: { color: '#FFF', fontSize: 14, lineHeight: 20 },
    actionPanel: { position: 'absolute', right: 12, bottom: 100, alignItems: 'center', gap: 20 },
    actionBtn: { alignItems: 'center', gap: 4 },
    actionCount: {
        color: '#FFF', fontSize: 12, fontWeight: '700',
        textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4,
    },
    muteBtn: {
        position: 'absolute', bottom: 20, left: 16,
        width: 36, height: 36, borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'center', alignItems: 'center',
    },
});
