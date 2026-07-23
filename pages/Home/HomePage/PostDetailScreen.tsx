import React, { useEffect, useState, useRef } from 'react';
import {
    ActivityIndicator,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { postService } from '@/services/postService';
import { userService } from '@/services/userService';

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

export default function PostDetailScreen() {
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

                // Load comments
                const commentsRes = await postService.getPostComments(postId);
                if (Array.isArray(commentsRes)) {
                    setCommentsList(commentsRes);
                } else if (Array.isArray(commentsRes?.comments)) {
                    setCommentsList(commentsRes.comments);
                } else if (Array.isArray(data?.comments)) {
                    setCommentsList(data.comments);
                }
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

    const handleSendComment = async () => {
        if (!postId || !replyText.trim()) return;
        try {
            const newComment = await postService.createPostComment(postId, replyText);
            setCommentsList(prev => [newComment, ...prev]);
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
    const shares = post?.sharesCount ?? 0;
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
                                <Image source={{ uri: avatarUri }} style={styles.postAvatar} />
                                <View style={styles.postAuthorInfo}>
                                    <Text style={styles.postName}>
                                        {username}{' '}
                                        <MaterialIcons
                                            name="verified"
                                            size={14}
                                            color={Colors.primary}
                                        />
                                        {timestamp ? (
                                            <Text style={styles.postTime}> · {timestamp}</Text>
                                        ) : null}
                                    </Text>
                                    {displayName !== username && (
                                        <Text style={styles.postDisplayName}>{displayName}</Text>
                                    )}
                                </View>
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

                            {mediaUri && (
                                <View style={styles.mediaContainer}>
                                    <Image
                                        source={{ uri: mediaUri }}
                                        style={styles.postImage}
                                        resizeMode="cover"
                                    />
                                    <TouchableOpacity style={styles.muteBtn}>
                                        <Ionicons
                                            name="volume-mute"
                                            size={18}
                                            color="#FFF"
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}

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
                                <View style={styles.actionItem}>
                                    <Feather name="repeat" size={20} color="#8A8A8A" />
                                    {shares > 0 && (
                                        <Text style={styles.actionText}>{shares}</Text>
                                    )}
                                </View>
                                <View style={styles.actionItem}>
                                    <Feather name="send" size={20} color="#8A8A8A" />
                                </View>
                            </View>
                        </View>

                        {/* Comments */}
                        {postComments.length > 0 ? (
                            <View style={styles.commentsSection}>
                                <Text style={styles.commentsSectionTitle}>Comments</Text>
                                {postComments.map((comment: any, idx: number) => {
                                    const commenter =
                                        comment.author || comment.user || {};
                                    const commenterAvatar =
                                        commenter.profilePictureUrl ||
                                        commenter.avatarUrl ||
                                        `https://i.pravatar.cc/150?img=${idx + 5}`;
                                    const commenterName =
                                        commenter.username || commenter.name || 'User';
                                    const commentText = comment.text || comment.message || comment.content || '';
                                    return (
                                        <View key={comment.id || idx} style={styles.commentRow}>
                                            <Image
                                                source={{ uri: commenterAvatar }}
                                                style={styles.commentAvatar}
                                            />
                                            <View style={styles.commentContent}>
                                                <View style={styles.commentHeader}>
                                                    <Text style={styles.commentName}>
                                                        {commenterName}
                                                    </Text>
                                                    <Text style={styles.commentTime}>
                                                        {timeAgo(comment.createdAt)}
                                                    </Text>
                                                </View>
                                                <Text style={styles.commentText}>{commentText}</Text>
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
                    <View style={styles.inputContainer}>
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
});
