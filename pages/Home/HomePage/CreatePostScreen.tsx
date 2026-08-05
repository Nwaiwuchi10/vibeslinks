import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import { postService } from '@/services/postService';
import { storyService } from '@/services/storyService';
import UserAvatar from '@/components/UserAvatar';

type PostType = 'post' | 'story';
type Visibility = 'public' | 'followers-only' | 'private';

export type SelectedMediaItem = {
    id: string;
    uri: string;
    type: 'image' | 'video';
};

const VISIBILITY_OPTIONS: { label: string; value: Visibility; icon: string; desc: string }[] = [
    { label: 'Public', value: 'public', icon: 'earth', desc: 'Everyone can see this' },
    { label: 'Followers', value: 'followers-only', icon: 'people', desc: 'Only people who follow you' },
    { label: 'Private', value: 'private', icon: 'lock-closed', desc: 'Only you' },
];

export default function CreatePostScreen() {
    const insets = useSafeAreaInsets();
    const bottomPad = Platform.OS === 'android' ? Math.max(insets.bottom, 16) : insets.bottom;
    const params = useLocalSearchParams<{ defaultType?: 'post' | 'story' }>();
    const authUser = useAppSelector((state) => state.auth.user);
    const [postType, setPostType] = useState<PostType>(params.defaultType || 'post');
    const [content, setContent] = useState('');
    const [selectedMedia, setSelectedMedia] = useState<SelectedMediaItem[]>([]);
    const [visibility, setVisibility] = useState<Visibility>('public');
    const [showVisibility, setShowVisibility] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const currentVisibility = VISIBILITY_OPTIONS.find((v) => v.value === visibility)!;

    const pickFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your media library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All, // Images AND videos altogether
            allowsMultipleSelection: true,
            selectionLimit: 10,
            quality: 0.85,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const newItems: SelectedMediaItem[] = result.assets.map((asset) => ({
                id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                uri: asset.uri,
                type: asset.type === 'video' ? 'video' : 'image',
            }));
            setSelectedMedia((prev) => [...prev, ...newItems]);
        }
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow camera access.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            quality: 0.85,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            const asset = result.assets[0];
            const newItem: SelectedMediaItem = {
                id: `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
                uri: asset.uri,
                type: asset.type === 'video' ? 'video' : 'image',
            };
            setSelectedMedia((prev) => [...prev, newItem]);
        }
    };

    const removeMediaItem = (id: string) => {
        setSelectedMedia((prev) => prev.filter((item) => item.id !== id));
    };

    const handleSubmit = async () => {
        if (!content.trim() && selectedMedia.length === 0) {
            Alert.alert('Nothing to post', 'Please write something or attach photos/videos.');
            return;
        }
        setSubmitting(true);
        try {
            if (postType === 'story') {
                const firstItem = selectedMedia[0];
                const isLocalFile = firstItem ? !firstItem.uri.startsWith('http') : false;
                await storyService.createStory({
                    imageUri: isLocalFile ? firstItem.uri : undefined,
                    mediaUrl: !isLocalFile ? firstItem?.uri : undefined,
                    caption: content.trim() || undefined,
                    visibility,
                });
            } else {
                await postService.createPost({
                    content: content.trim(),
                    mediaItems: selectedMedia.map((m) => ({ uri: m.uri, type: m.type })),
                    imageUri: selectedMedia.length > 0 ? selectedMedia[0].uri : undefined,
                    visibility,
                });
            }
            router.back();
        } catch (err: any) {
            console.error('[CreatePostScreen] Error creating:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const avatarUri =
        authUser?.profilePictureUrl ||
        authUser?.avatarUrl ||
        `https://i.pravatar.cc/150?img=68`;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                    <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>

                {/* Segment Selector: Feed Post vs 24h Story */}
                <View style={styles.typeSegment}>
                    <TouchableOpacity
                        style={[styles.segmentBtn, postType === 'post' && styles.segmentBtnActive]}
                        onPress={() => setPostType('post')}
                    >
                        <Text style={[styles.segmentText, postType === 'post' && styles.segmentTextActive]}>
                            Post
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.segmentBtn, postType === 'story' && styles.segmentBtnActive]}
                        onPress={() => setPostType('story')}
                    >
                        <Text style={[styles.segmentText, postType === 'story' && styles.segmentTextActive]}>
                            Story
                        </Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.postBtn, submitting && { opacity: 0.6 }]}
                    onPress={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <LinearGradient
                            colors={['#9B5FFF', '#7B2FFF']}
                            style={styles.postBtnGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.postBtnText}>{postType === 'story' ? 'Share' : 'Post'}</Text>
                        </LinearGradient>
                    )}
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Author Row */}
                    <View style={styles.authorRow}>
                        <UserAvatar
                            avatarUrl={authUser?.profilePictureUrl || authUser?.avatarUrl}
                            name={authUser?.fullName || authUser?.name || authUser?.username || 'You'}
                            size={44}
                        />
                        <View style={styles.authorMeta}>
                            <Text style={styles.authorName}>
                                {authUser?.fullName || authUser?.name || authUser?.username || 'You'}
                            </Text>
                            {/* Visibility Picker */}
                            <TouchableOpacity
                                style={styles.visibilityChip}
                                onPress={() => setShowVisibility(!showVisibility)}
                            >
                                <Ionicons
                                    name={currentVisibility.icon as any}
                                    size={12}
                                    color={Colors.primary}
                                />
                                <Text style={styles.visibilityText}>{currentVisibility.label}</Text>
                                <Ionicons
                                    name={showVisibility ? 'chevron-up' : 'chevron-down'}
                                    size={10}
                                    color={Colors.primary}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Visibility Dropdown */}
                    {showVisibility && (
                        <View style={styles.visibilityDropdown}>
                            {VISIBILITY_OPTIONS.map((opt) => (
                                <TouchableOpacity
                                    key={opt.value}
                                    style={[
                                        styles.visibilityOption,
                                        visibility === opt.value && styles.visibilityOptionActive,
                                    ]}
                                    onPress={() => {
                                        setVisibility(opt.value);
                                        setShowVisibility(false);
                                    }}
                                >
                                    <Ionicons
                                        name={opt.icon as any}
                                        size={18}
                                        color={visibility === opt.value ? Colors.primary : '#666'}
                                    />
                                    <View style={{ marginLeft: 12 }}>
                                        <Text
                                            style={[
                                                styles.visibilityOptionLabel,
                                                visibility === opt.value && { color: Colors.primary },
                                            ]}
                                        >
                                            {opt.label}
                                        </Text>
                                        <Text style={styles.visibilityOptionDesc}>{opt.desc}</Text>
                                    </View>
                                    {visibility === opt.value && (
                                        <Ionicons
                                            name="checkmark-circle"
                                            size={18}
                                            color={Colors.primary}
                                            style={{ marginLeft: 'auto' }}
                                        />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}

                    {/* Caption / Content Input */}
                    <TextInput
                        style={styles.contentInput}
                        placeholder="What's on your mind?"
                        placeholderTextColor="#BBBBC0"
                        multiline
                        maxLength={2000}
                        value={content}
                        onChangeText={setContent}
                        autoFocus
                    />

                    {/* Multiple Media Preview Section */}
                    {selectedMedia.length > 0 && (
                        <View style={styles.mediaPreviewSection}>
                            <View style={styles.mediaSectionHeader}>
                                <Text style={styles.mediaSectionTitle}>
                                    Attached Media ({selectedMedia.length})
                                </Text>
                                <TouchableOpacity onPress={pickFromLibrary}>
                                    <Text style={styles.addMoreLink}>+ Add More</Text>
                                </TouchableOpacity>
                            </View>

                            <ScrollView
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={styles.mediaScroll}
                                contentContainerStyle={{ paddingRight: 10 }}
                            >
                                {selectedMedia.map((item) => (
                                    <View key={item.id} style={styles.mediaTile}>
                                        <Image source={{ uri: item.uri }} style={styles.mediaTileImage} />
                                        {item.type === 'video' && (
                                            <View style={styles.videoBadgeOverlay}>
                                                <Ionicons name="videocam" size={14} color="#FFF" />
                                            </View>
                                        )}
                                        <TouchableOpacity
                                            style={styles.removeMediaBtn}
                                            onPress={() => removeMediaItem(item.id)}
                                        >
                                            <Ionicons name="close-circle" size={24} color="#FF3B30" />
                                        </TouchableOpacity>
                                    </View>
                                ))}

                                <TouchableOpacity style={styles.addMoreTile} onPress={pickFromLibrary}>
                                    <Ionicons name="add" size={28} color={Colors.primary} />
                                    <Text style={styles.addMoreText}>Add</Text>
                                </TouchableOpacity>
                            </ScrollView>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Toolbar */}
                <View style={[styles.toolbar, { paddingBottom: (Platform.OS === 'ios' ? 24 : 16) + bottomPad }]}>
                    <Text style={styles.toolbarLabel}>Add to your post</Text>
                    <View style={styles.toolbarActions}>
                        <TouchableOpacity style={styles.toolbarBtn} onPress={pickFromLibrary}>
                            <LinearGradient
                                colors={['#43E97B', '#38F9D7']}
                                style={styles.toolbarIconBg}
                            >
                                <Ionicons name="images" size={22} color="#FFF" />
                            </LinearGradient>
                            <Text style={styles.toolbarBtnLabel}>Gallery</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.toolbarBtn} onPress={openCamera}>
                            <LinearGradient
                                colors={['#4FACFE', '#00F2FE']}
                                style={styles.toolbarIconBg}
                            >
                                <Ionicons name="camera" size={22} color="#FFF" />
                            </LinearGradient>
                            <Text style={styles.toolbarBtnLabel}>Camera</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.toolbarBtn}
                            onPress={() => setShowVisibility(!showVisibility)}
                        >
                            <LinearGradient
                                colors={['#FA709A', '#FEE140']}
                                style={styles.toolbarIconBg}
                            >
                                <Ionicons
                                    name={currentVisibility.icon as any}
                                    size={22}
                                    color="#FFF"
                                />
                            </LinearGradient>
                            <Text style={styles.toolbarBtnLabel}>Audience</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.toolbarBtn}>
                            <LinearGradient
                                colors={['#A18CD1', '#FBC2EB']}
                                style={styles.toolbarIconBg}
                            >
                                <MaterialCommunityIcons
                                    name="emoticon-happy-outline"
                                    size={22}
                                    color="#FFF"
                                />
                            </LinearGradient>
                            <Text style={styles.toolbarBtnLabel}>Feeling</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
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
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EFEFEF',
    },
    typeSegment: {
        flexDirection: 'row',
        backgroundColor: '#F0F0F5',
        borderRadius: 20,
        padding: 3,
    },
    segmentBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 17,
    },
    segmentBtnActive: {
        backgroundColor: '#FFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    segmentText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#888',
    },
    segmentTextActive: {
        color: Colors.primary,
    },
    cancelBtn: {
        paddingVertical: 6,
        paddingHorizontal: 4,
    },
    cancelText: {
        fontSize: 16,
        color: Colors.textGray,
        fontWeight: '500',
    },
    postBtn: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    postBtnGradient: {
        paddingVertical: 8,
        paddingHorizontal: 22,
        borderRadius: 20,
    },
    postBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 15,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 20,
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        marginRight: 12,
        backgroundColor: '#EEE',
    },
    authorMeta: {
        flex: 1,
    },
    authorName: {
        fontSize: 15,
        fontWeight: '700',
        color: Colors.textDark,
        marginBottom: 6,
    },
    visibilityChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: `${Colors.primary}18`,
        borderWidth: 1,
        borderColor: `${Colors.primary}40`,
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
        alignSelf: 'flex-start',
        gap: 5,
    },
    visibilityText: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.primary,
    },
    visibilityDropdown: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
        overflow: 'hidden',
    },
    visibilityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    visibilityOptionActive: {
        backgroundColor: '#F9F5FF',
    },
    visibilityOptionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    visibilityOptionDesc: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    contentInput: {
        fontSize: 17,
        color: Colors.textDark,
        lineHeight: 24,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: 16,
    },
    mediaPreviewSection: {
        marginTop: 10,
        marginBottom: 20,
    },
    mediaSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    mediaSectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#333',
    },
    addMoreLink: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.primary,
    },
    mediaScroll: {
        flexDirection: 'row',
    },
    mediaTile: {
        width: 110,
        height: 110,
        borderRadius: 16,
        marginRight: 12,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#EEE',
    },
    mediaTileImage: {
        width: '100%',
        height: '100%',
    },
    videoBadgeOverlay: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 8,
    },
    removeMediaBtn: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 12,
    },
    addMoreTile: {
        width: 110,
        height: 110,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F9F5FF',
    },
    addMoreText: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: 4,
    },
    toolbar: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    },
    toolbarLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#999',
        marginBottom: 10,
    },
    toolbarActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    toolbarBtn: {
        alignItems: 'center',
    },
    toolbarIconBg: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 4,
    },
    toolbarBtnLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#666',
    },
});
