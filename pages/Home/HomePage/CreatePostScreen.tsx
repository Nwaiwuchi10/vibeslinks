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
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import { postService } from '@/services/postService';
import { storyService } from '@/services/storyService';

type PostType = 'post' | 'story';
type Visibility = 'public' | 'followers-only' | 'private';

const VISIBILITY_OPTIONS: { label: string; value: Visibility; icon: string; desc: string }[] = [
    { label: 'Public', value: 'public', icon: 'earth', desc: 'Everyone can see this' },
    { label: 'Followers', value: 'followers-only', icon: 'people', desc: 'Only people who follow you' },
    { label: 'Private', value: 'private', icon: 'lock-closed', desc: 'Only you' },
];

export default function CreatePostScreen() {
    const params = useLocalSearchParams<{ defaultType?: 'post' | 'story' }>();
    const authUser = useAppSelector((state) => state.auth.user);
    const [postType, setPostType] = useState<PostType>(params.defaultType || 'post');
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [visibility, setVisibility] = useState<Visibility>('public');
    const [showVisibility, setShowVisibility] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const currentVisibility = VISIBILITY_OPTIONS.find((v) => v.value === visibility)!;

    const pickFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow access to your photo library.');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.85,
        });
        if (!result.canceled && result.assets[0]) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const openCamera = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please allow camera access.');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.85,
        });
        if (!result.canceled && result.assets[0]) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSubmit = async () => {
        if (!content.trim() && !selectedImage) {
            Alert.alert('Nothing to post', 'Please write something or attach an image.');
            return;
        }
        setSubmitting(true);
        try {
            if (postType === 'story') {
                const isLocalFile = selectedImage ? !selectedImage.startsWith('http') : false;
                await storyService.createStory({
                    imageUri: isLocalFile ? selectedImage! : undefined,
                    mediaUrl: !isLocalFile ? selectedImage || undefined : undefined,
                    caption: content.trim() || undefined,
                    visibility,
                });
            } else {
                await postService.createPost({
                    content: content.trim(),
                    imageUri: selectedImage ?? undefined,
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
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
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

                    {/* Selected Image Preview */}
                    {selectedImage && (
                        <View style={styles.imagePreviewContainer}>
                            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                            <TouchableOpacity
                                style={styles.removeImageBtn}
                                onPress={() => setSelectedImage(null)}
                            >
                                <Ionicons name="close-circle" size={28} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {/* Bottom Toolbar */}
                <View style={styles.toolbar}>
                    <Text style={styles.toolbarLabel}>Add to your post</Text>
                    <View style={styles.toolbarActions}>
                        <TouchableOpacity style={styles.toolbarBtn} onPress={pickFromLibrary}>
                            <LinearGradient
                                colors={['#43E97B', '#38F9D7']}
                                style={styles.toolbarIconBg}
                            >
                                <Ionicons name="image" size={22} color="#FFF" />
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
    headerTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: Colors.textDark,
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
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    visibilityOptionActive: {
        backgroundColor: `${Colors.primary}08`,
    },
    visibilityOptionLabel: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.textDark,
    },
    visibilityOptionDesc: {
        fontSize: 12,
        color: Colors.textGray,
        marginTop: 2,
    },
    contentInput: {
        fontSize: 17,
        color: Colors.textDark,
        lineHeight: 26,
        minHeight: 120,
        textAlignVertical: 'top',
        paddingTop: 0,
    },
    imagePreviewContainer: {
        marginTop: 16,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: 260,
        borderRadius: 16,
        backgroundColor: '#EEE',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    toolbar: {
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#EFEFEF',
        paddingHorizontal: 20,
        paddingVertical: 14,
        paddingBottom: Platform.OS === 'ios' ? 24 : 14,
    },
    toolbarLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.textGray,
        marginBottom: 12,
    },
    toolbarActions: {
        flexDirection: 'row',
        gap: 20,
    },
    toolbarBtn: {
        alignItems: 'center',
        flex: 1,
    },
    toolbarIconBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 3,
    },
    toolbarBtnLabel: {
        fontSize: 11,
        color: Colors.textGray,
        fontWeight: '500',
    },
});
