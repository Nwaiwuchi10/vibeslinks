import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { storyService } from '@/services/storyService';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds per story

export default function ViewStoryScreen() {
    const params = useLocalSearchParams<{ id?: string }>();
    const storyId = params.id;

    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(!!storyId);
    const [showOptions, setShowOptions] = useState(false);
    const [replyText, setReplyText] = useState('');

    // Progress bar animation
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (!storyId) {
            setLoading(false);
            return;
        }
        storyService.getStoryById(storyId).then((data) => {
            setStory(data);
            setLoading(false);
            // Mark as viewed after loading
            storyService.markStoryViewed(storyId);
        });
    }, [storyId]);

    // Start progress bar when story loads
    useEffect(() => {
        if (!loading && story) {
            progressAnim.setValue(0);
            const anim = Animated.timing(progressAnim, {
                toValue: 1,
                duration: STORY_DURATION,
                useNativeDriver: false,
            });
            anim.start(({ finished }) => {
                if (finished) router.back();
            });
            return () => anim.stop();
        }
    }, [loading, story]);

    const author = story?.author || story?.user || story?.creator || {};
    const avatarUri =
        author?.profilePictureUrl ||
        author?.avatarUrl ||
        `https://i.pravatar.cc/150?img=11`;
    const username = author?.username || author?.name || 'User';
    const mediaUri =
        story?.mediaUrl ||
        story?.imageUrl ||
        'https://images.unsplash.com/photo-1615112196695-171542f53d4c?w=600';
    const caption = story?.caption || story?.text || '';

    const progressWidth = progressAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#FFF" />
                </View>
            ) : (
                <>
                    <Image
                        source={{ uri: mediaUri }}
                        style={[styles.backgroundImage, showOptions && { opacity: 0.6 }]}
                        resizeMode="cover"
                        blurRadius={showOptions ? 10 : 0}
                    />

                    {/* Dark overlay */}
                    <View style={styles.overlay} />

                    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                        {/* Progress Bar */}
                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarTrack}>
                                <Animated.View
                                    style={[styles.progressBarFill, { width: progressWidth }]}
                                />
                            </View>
                        </View>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.userInfo}>
                                <Image source={{ uri: avatarUri }} style={styles.avatar} />
                                <Text style={styles.username}>{username}</Text>
                            </View>
                            <View style={styles.headerRight}>
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => setShowOptions(true)}
                                >
                                    <Ionicons name="ellipsis-horizontal" size={20} color="#333" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="close" size={20} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Caption */}
                        {caption ? (
                            <View style={styles.captionContainer}>
                                <Text style={styles.captionText}>{caption}</Text>
                            </View>
                        ) : null}

                        {/* Bottom Bar */}
                        <View style={styles.safeBottom}>
                            <View style={styles.bottomBar}>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Send Message..."
                                        placeholderTextColor="#E0E0E0"
                                        value={replyText}
                                        onChangeText={setReplyText}
                                    />
                                </View>
                                <TouchableOpacity style={styles.actionIcon}>
                                    <Ionicons name="heart-outline" size={28} color="#FFF" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionIcon}>
                                    <Ionicons name="paper-plane-outline" size={28} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>

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
                            <View style={styles.modalContent}>
                                <View style={styles.dragIndicator} />
                                <TouchableOpacity
                                    style={styles.modalBtn}
                                    onPress={() => setShowOptions(false)}
                                >
                                    <Text style={styles.modalBtnText}>Follow</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.modalBtn}
                                    onPress={() => setShowOptions(false)}
                                >
                                    <Text style={[styles.modalBtnText, { color: '#E91E63' }]}>
                                        Report
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        width,
        height,
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.18)',
    },
    safeArea: {
        flex: 1,
    },
    progressBarContainer: {
        paddingHorizontal: 12,
        paddingTop: Platform.OS === 'android' ? 8 : 0,
        marginBottom: 10,
    },
    progressBarTrack: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.35)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#FFF',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
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
        borderWidth: 1,
        borderColor: '#FFF',
    },
    username: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '600',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 3,
    },
    headerRight: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captionContainer: {
        position: 'absolute',
        bottom: 120,
        left: 20,
        right: 20,
    },
    captionText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.7)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 6,
    },
    safeBottom: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    bottomBar: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputContainer: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#FFF',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 14,
        marginRight: 16,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    input: {
        color: '#FFF',
        fontSize: 15,
    },
    actionIcon: {
        marginLeft: 12,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'flex-end',
    },
    modalDismiss: {
        flex: 1,
    },
    modalContent: {
        backgroundColor: '#D1D1D1',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingBottom: 40,
        paddingTop: 12,
    },
    dragIndicator: {
        width: 48,
        height: 4,
        backgroundColor: '#888',
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 24,
    },
    modalBtn: {
        backgroundColor: '#EAEAEA',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        marginBottom: 12,
    },
    modalBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
});
