import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import { storyService } from '@/services/storyService';

const { width, height } = Dimensions.get('window');

type Visibility = 'public' | 'followers-only' | 'private';

const VISIBILITY_OPTIONS: { label: string; value: Visibility; icon: string }[] = [
    { label: 'Public', value: 'public', icon: 'earth' },
    { label: 'Followers', value: 'followers-only', icon: 'people' },
    { label: 'Private', value: 'private', icon: 'lock-closed' },
];

export default function StoryPreviewScreen() {
    const params = useLocalSearchParams<{ image: string; mediaType?: string }>();
    const imageUri =
        params.image || 'https://images.unsplash.com/photo-1605022600390-071c6ef3518a?w=600';
    const mediaType = (params.mediaType as 'image' | 'video') || 'image';

    const authUser = useAppSelector((state) => state.auth.user);
    const [caption, setCaption] = useState('');
    const [visibility, setVisibility] = useState<Visibility>('public');
    const [showVisibility, setShowVisibility] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const currentVis = VISIBILITY_OPTIONS.find((v) => v.value === visibility)!;
    const avatarUri =
        authUser?.profilePictureUrl || authUser?.avatarUrl || `https://i.pravatar.cc/150?img=68`;

    const handleShare = async () => {
        setSubmitting(true);
        try {
            // If uri starts with http it is a hosted URL, otherwise it is a local file
            const isLocalFile = !imageUri.startsWith('http');
            await storyService.createStory({
                imageUri: isLocalFile ? imageUri : undefined,
                mediaUrl: !isLocalFile ? imageUri : undefined,
                caption: caption.trim() || undefined,
                mediaType,
                visibility,
            });
            router.replace('/');
        } catch (err: any) {
            console.error('[StoryPreviewScreen] Error sharing story:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Background Media */}
            <Image source={{ uri: imageUri }} style={styles.backgroundImage} resizeMode="cover" />

            {/* Dark overlay */}
            <View style={styles.overlay} />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <Image source={{ uri: avatarUri }} style={styles.avatar} />
                        <Text style={styles.username} numberOfLines={1}>
                            {authUser?.username ||
                                authUser?.fullName?.split(' ')[0] ||
                                'You'}
                        </Text>
                    </View>
                    <View style={styles.headerRight}>
                        {/* Visibility picker */}
                        <TouchableOpacity
                            style={styles.visibilityBtn}
                            onPress={() => setShowVisibility(!showVisibility)}
                        >
                            <Ionicons name={currentVis.icon as any} size={14} color="#FFF" />
                            <Text style={styles.visibilityBtnText}>{currentVis.label}</Text>
                            <Ionicons
                                name={showVisibility ? 'chevron-up' : 'chevron-down'}
                                size={10}
                                color="#FFF"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeBtn} onPress={() => router.back()}>
                            <Ionicons name="close" size={20} color="#333" />
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
                                    size={16}
                                    color={visibility === opt.value ? Colors.primary : '#EEE'}
                                />
                                <Text
                                    style={[
                                        styles.visibilityOptionText,
                                        visibility === opt.value && { color: Colors.primary },
                                    ]}
                                >
                                    {opt.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                {/* Caption input in the middle */}
                <View style={styles.captionContainer}>
                    <TextInput
                        style={styles.captionInput}
                        placeholder="Add a caption..."
                        placeholderTextColor="rgba(255,255,255,0.6)"
                        value={caption}
                        onChangeText={setCaption}
                        multiline
                        maxLength={500}
                    />
                </View>

                {/* Bottom action bar */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity
                        style={styles.friendsBtn}
                        onPress={() => setShowVisibility(!showVisibility)}
                    >
                        <Ionicons name={currentVis.icon as any} size={16} color="#FFF" />
                        <Text style={styles.friendsBtnText}>{currentVis.label}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.shareBtn, submitting && { opacity: 0.6 }]}
                        onPress={handleShare}
                        disabled={submitting}
                    >
                        {submitting ? (
                            <View style={styles.shareBtnGradient}>
                                <ActivityIndicator size="small" color="#FFF" />
                            </View>
                        ) : (
                            <LinearGradient
                                colors={[Colors.primaryLight, Colors.primary]}
                                style={styles.shareBtnGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Ionicons name="paper-plane" size={16} color="#FFF" />
                                <Text style={styles.shareBtnText}>Share Story</Text>
                            </LinearGradient>
                        )}
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backgroundImage: {
        width,
        height,
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    username: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
        maxWidth: 120,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    visibilityBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        gap: 5,
    },
    visibilityBtnText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    visibilityDropdown: {
        backgroundColor: 'rgba(20,20,30,0.95)',
        marginHorizontal: 20,
        marginTop: 8,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.15)',
    },
    visibilityOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.08)',
        gap: 12,
    },
    visibilityOptionActive: {
        backgroundColor: 'rgba(123,47,255,0.2)',
    },
    visibilityOptionText: {
        color: '#EEE',
        fontSize: 14,
        fontWeight: '500',
    },
    captionContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    captionInput: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '500',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.6)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
        minHeight: 60,
    },
    bottomBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 8 : 20,
        gap: 12,
    },
    friendsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
        gap: 8,
    },
    friendsBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    shareBtn: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
    },
    shareBtnGradient: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 24,
        gap: 8,
    },
    shareBtnText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '700',
    },
});
