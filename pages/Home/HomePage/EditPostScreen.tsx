import { Colors } from '@/constants/Colors';
import { postService } from '@/services/postService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';

type MediaAsset = {
    uri: string;
    type: 'image' | 'video';
};

export default function EditPostScreen() {
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [content, setContent] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'followers-only' | 'private'>('public');
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [media, setMedia] = useState<MediaAsset[]>([]);
    const [showMediaPicker, setShowMediaPicker] = useState(false);

    useEffect(() => {
        if (!id) { setLoading(false); return; }
        postService.getPostById(id).then(post => {
            if (post) {
                setContent(post.content || post.caption || '');
                if (post.visibility) setVisibility(post.visibility as any);

                // Pre-populate existing media from the post
                const existing: MediaAsset[] = [];
                const urls: string[] = post.mediaUrls?.length
                    ? post.mediaUrls
                    : post.mediaUrl
                        ? [post.mediaUrl]
                        : post.imageUrl
                            ? [post.imageUrl]
                            : [];
                urls.forEach((uri, i) => {
                    const hint = post.mediaTypes?.[i] || post.mediaType || '';
                    existing.push({ uri, type: /video/i.test(hint) ? 'video' : 'image' });
                });
                setMedia(existing);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, [id]);

    // ── Permission helper ────────────────────────────────────────────────────
    const requestPermission = async (type: 'camera' | 'library'): Promise<boolean> => {
        if (type === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Camera access is needed to take a photo.');
                return false;
            }
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Media library access is needed to pick files.');
                return false;
            }
        }
        return true;
    };

    // ── Camera snap ──────────────────────────────────────────────────────────
    const handleCamera = async () => {
        setShowMediaPicker(false);
        const ok = await requestPermission('camera');
        if (!ok) return;

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.85,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            setMedia(prev => [...prev, { uri: asset.uri, type: 'image' }]);
        }
    };

    // ── Gallery picker (images + videos, multi-select) ───────────────────────
    const handleGallery = async () => {
        setShowMediaPicker(false);
        const ok = await requestPermission('library');
        if (!ok) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsMultipleSelection: true,
            quality: 0.85,
            selectionLimit: 10,
        });

        if (!result.canceled && result.assets.length > 0) {
            const picked: MediaAsset[] = result.assets.map(a => ({
                uri: a.uri,
                type: (a.type === 'video' ? 'video' : 'image') as 'image' | 'video',
            }));
            setMedia(prev => [...prev, ...picked]);
        }
    };

    // ── Remove a selected media item ─────────────────────────────────────────
    const removeMedia = (idx: number) => {
        setMedia(prev => prev.filter((_, i) => i !== idx));
    };

    // ── Save ─────────────────────────────────────────────────────────────────
    const handleSave = async () => {
        if (!id || !content.trim()) return;
        setSaving(true);
        try {
            // Pass updated caption and visibility; media URLs kept as-is
            // (new local URIs would require re-upload logic in postService.updatePost)
            await postService.updatePost(id, {
                content: content.trim(),
                visibility,
                ...(media.length > 0 && {
                    mediaUrls: media.map(m => m.uri),
                }),
            });
            router.back();
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    const VISIBILITIES: { value: 'public' | 'followers-only' | 'private'; label: string }[] = [
        { value: 'public', label: '🌍  Public' },
        { value: 'followers-only', label: '👥  Followers' },
        { value: 'private', label: '🔒  Only Me' },
    ];

    return (
        <SafeAreaView style={styles.safe} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Post</Text>
                <TouchableOpacity
                    style={[styles.saveBtn, (!content.trim() || saving) && styles.saveBtnDisabled]}
                    onPress={handleSave}
                    disabled={!content.trim() || saving}
                >
                    {saving
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <Text style={styles.saveBtnText}>Save</Text>}
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.loadingBox}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : (
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <ScrollView
                        contentContainerStyle={styles.body}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Caption */}
                        <Text style={styles.label}>Caption</Text>
                        <TextInput
                            style={styles.captionInput}
                            value={content}
                            onChangeText={setContent}
                            placeholder="What's on your mind?"
                            placeholderTextColor="#AAA"
                            multiline
                            textAlignVertical="top"
                            autoFocus
                        />

                        {/* Media section */}
                        <Text style={styles.label}>Media</Text>

                        {/* Media grid */}
                        {media.length > 0 && (
                            <View style={styles.mediaGrid}>
                                {media.map((item, idx) => (
                                    <View key={idx} style={styles.mediaTile}>
                                        <Image
                                            source={{ uri: item.uri }}
                                            style={styles.mediaTileImage}
                                            resizeMode="cover"
                                        />
                                        {/* Video badge */}
                                        {item.type === 'video' && (
                                            <View style={styles.mediaBadge}>
                                                <Ionicons name="videocam" size={12} color="#FFF" />
                                            </View>
                                        )}
                                        {/* Remove button */}
                                        <TouchableOpacity
                                            style={styles.mediaRemoveBtn}
                                            onPress={() => removeMedia(idx)}
                                        >
                                            <Ionicons name="close-circle" size={22} color="#FFF" />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        )}

                        {/* Add media buttons */}
                        <View style={styles.addMediaRow}>
                            {/* Camera */}
                            <TouchableOpacity style={styles.addMediaBtn} onPress={handleCamera}>
                                <View style={styles.addMediaIcon}>
                                    <Ionicons name="camera-outline" size={22} color={Colors.primary} />
                                </View>
                                <Text style={styles.addMediaLabel}>Camera</Text>
                            </TouchableOpacity>

                            {/* Gallery */}
                            <TouchableOpacity style={styles.addMediaBtn} onPress={handleGallery}>
                                <View style={styles.addMediaIcon}>
                                    <MaterialCommunityIcons name="image-multiple-outline" size={22} color={Colors.primary} />
                                </View>
                                <Text style={styles.addMediaLabel}>Gallery</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Visibility */}
                        <Text style={styles.label}>Visibility</Text>
                        <View style={styles.visibilityRow}>
                            {VISIBILITIES.map(v => (
                                <TouchableOpacity
                                    key={v.value}
                                    style={[styles.visChip, visibility === v.value && styles.visChipActive]}
                                    onPress={() => setVisibility(v.value)}
                                >
                                    <Text style={[styles.visChipText, visibility === v.value && styles.visChipTextActive]}>
                                        {v.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

const TILE_SIZE = 110;

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#FAFAFA' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 14,
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#EFEFEF',
        backgroundColor: '#FFF',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F3F3',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A2E' },
    saveBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 70,
        alignItems: 'center',
    },
    saveBtnDisabled: { opacity: 0.5 },
    saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
    loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    body: { padding: 20, paddingBottom: 80 },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 10,
        marginTop: 24,
    },
    captionInput: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#EAEAEA',
        padding: 16,
        fontSize: 15,
        color: '#1A1A2E',
        minHeight: 140,
        lineHeight: 22,
    },
    // ── Media grid ────────────────────────────────────────────────────────────
    mediaGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 12,
    },
    mediaTile: {
        width: TILE_SIZE,
        height: TILE_SIZE,
        borderRadius: 14,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#EEE',
    },
    mediaTileImage: { width: '100%', height: '100%' },
    mediaBadge: {
        position: 'absolute',
        bottom: 6,
        left: 6,
        backgroundColor: 'rgba(0,0,0,0.55)',
        borderRadius: 10,
        padding: 4,
    },
    mediaRemoveBtn: {
        position: 'absolute',
        top: 4,
        right: 4,
    },
    // ── Add media buttons ─────────────────────────────────────────────────────
    addMediaRow: {
        flexDirection: 'row',
        gap: 12,
    },
    addMediaBtn: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#EAEAEA',
        borderStyle: 'dashed',
        paddingVertical: 18,
        alignItems: 'center',
        gap: 8,
    },
    addMediaIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: `${Colors.primary}15`,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addMediaLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#555',
    },
    // ── Visibility ────────────────────────────────────────────────────────────
    visibilityRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    visChip: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1.5,
        borderColor: '#EAEAEA',
        backgroundColor: '#FFF',
    },
    visChipActive: { borderColor: Colors.primary, backgroundColor: `${Colors.primary}15` },
    visChipText: { fontSize: 14, color: '#555', fontWeight: '500' },
    visChipTextActive: { color: Colors.primary, fontWeight: '700' },
});
