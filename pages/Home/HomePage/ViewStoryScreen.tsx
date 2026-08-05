import { storyService } from '@/services/storyService';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
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
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resolveImageUrl } from '@/services/apiClient';

const { width, height } = Dimensions.get('window');
const STORY_DURATION = 5000; // 5 seconds per story slide

export default function ViewStoryScreen() {
    const params = useLocalSearchParams<{ id?: string; storiesData?: string }>();
    const storyId = params.id;

    const [stories, setStories] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(!params.storiesData);
    const [showOptions, setShowOptions] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [isPaused, setIsPaused] = useState(false);

    // Progress bar animation
    const progressAnim = useRef(new Animated.Value(0)).current;
    const progressRef = useRef(0);

    // Reset progress tracking when current index changes
    useEffect(() => {
        progressRef.current = 0;
        progressAnim.setValue(0);
    }, [currentIndex]);

    // Track animation progression to handle pause/resume accurately
    useEffect(() => {
        const listener = progressAnim.addListener(({ value }) => {
            progressRef.current = value;
        });
        return () => {
            progressAnim.removeListener(listener);
        };
    }, []);

    useEffect(() => {
        const initStories = async () => {
            setLoading(true);
            let storyList: any[] = [];

            if (params.storiesData) {
                try {
                    storyList = JSON.parse(params.storiesData);
                } catch (e) {
                    console.error('Error parsing storiesData param', e);
                }
            }

            if (storyList.length === 0 && storyId) {
                try {
                    const data = await storyService.getStoryById(storyId);
                    if (data) storyList = [data];
                } catch (err) {
                    console.error(err);
                }
            }

            // Sort stories from newest to oldest
            storyList.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

            if (storyList.length === 0) {
                // Fallback default
                storyList = [{
                    id: 'default',
                    // mediaUrl: 'https://images.unsplash.com/photo-1615112196695-171542f53d4c?w=600',
                    caption: '',
                }];
            }

            setStories(storyList);
            setCurrentIndex(0);
            setLoading(false);
        };

        initStories();
    }, [storyId, params.storiesData]);

    const currentStory = stories[currentIndex] || {};

    // Mark current story as viewed
    useEffect(() => {
        if (currentStory?.id && currentStory.id !== 'default') {
            storyService.markStoryViewed(currentStory.id);
        }
    }, [currentIndex, currentStory]);

    // Handle slide animation and auto-advancing, with support for pause / hold-to-stop
    useEffect(() => {
        if (!loading && stories.length > 0 && !showOptions && !isPaused) {
            const remainingDuration = STORY_DURATION * (1 - progressRef.current);
            const anim = Animated.timing(progressAnim, {
                toValue: 1,
                duration: remainingDuration > 0 ? remainingDuration : STORY_DURATION,
                useNativeDriver: false,
            });
            anim.start(({ finished }) => {
                if (finished) {
                    progressRef.current = 0;
                    progressAnim.setValue(0);
                    if (currentIndex < stories.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                    } else {
                        router.back();
                    }
                }
            });
            return () => anim.stop();
        }
    }, [loading, currentIndex, stories.length, showOptions, isPaused]);

    const handleNextSlide = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            router.back();
        }
    };

    const handlePrevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const author = currentStory?.author || currentStory?.user || currentStory?.creator || {};
    const avatarUri = resolveImageUrl(author?.profilePictureUrl || author?.avatarUrl || null);
    const username = author?.username || author?.name || 'User';

    // Check if the story is text-only (no media url provided)
    const hasMedia = !!(currentStory?.mediaUrl || currentStory?.imageUrl);
    const caption = currentStory?.caption || currentStory?.text || currentStory?.content || '';
    const isTextOnly = !hasMedia && caption.trim().length > 0;
    const mediaUri = resolveImageUrl(currentStory?.mediaUrl || currentStory?.imageUrl || null) || '';

    return (
        <View style={styles.container}>
            {loading ? null : (
                <>
                    {isTextOnly ? (
                        <View style={[styles.backgroundImage, styles.textStoryBackground, showOptions && { opacity: 0.6 }]}>
                            <Text style={styles.centerTextStory}>{caption}</Text>
                        </View>
                    ) : (
                        <Image
                            source={{ uri: mediaUri }}
                            style={[styles.backgroundImage, showOptions && { opacity: 0.6 }]}
                            resizeMode="cover"
                            blurRadius={showOptions ? 10 : 0}
                        />
                    )}

                    {/* Dark overlay */}
                    <View style={styles.overlay} />

                    {/* Tap overlay for slide navigation (hold down to pause, release to resume) */}
                    <View style={styles.touchOverlay} pointerEvents="box-none">
                        <TouchableOpacity
                            style={styles.touchLeft}
                            onPress={handlePrevSlide}
                            onPressIn={() => setIsPaused(true)}
                            onPressOut={() => setIsPaused(false)}
                            activeOpacity={1}
                        />
                        <TouchableOpacity
                            style={styles.touchRight}
                            onPress={handleNextSlide}
                            onPressIn={() => setIsPaused(true)}
                            onPressOut={() => setIsPaused(false)}
                            activeOpacity={1}
                        />
                    </View>

                    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']} pointerEvents="box-none">
                        {/* Multi-segment Progress Bar */}
                        <View style={styles.progressBarContainer}>
                            {stories.map((_, idx) => {
                                let widthInterpolation;
                                if (idx < currentIndex) {
                                    widthInterpolation = '100%';
                                } else if (idx === currentIndex) {
                                    widthInterpolation = progressAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0%', '100%'],
                                    });
                                } else {
                                    widthInterpolation = '0%';
                                }

                                return (
                                    <View key={idx} style={styles.progressBarTrack}>
                                        <Animated.View
                                            style={[styles.progressBarFill, { width: widthInterpolation as any }]}
                                        />
                                    </View>
                                );
                            })}
                        </View>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.userInfo}>
                                {avatarUri ? (
                                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                                ) : (
                                    <View style={styles.avatarFallbackSmall}>
                                        <Text style={styles.avatarInitialsSmall}>
                                            {(username || 'U').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)}
                                        </Text>
                                    </View>
                                )}
                                <Text style={styles.username}>{username}</Text>
                            </View>
                            <View style={styles.headerRight}>
                                {/* <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => setShowOptions(true)}
                                >
                                    <Ionicons name="ellipsis-horizontal" size={20} color="#333" />
                                </TouchableOpacity> */}
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => router.back()}
                                >
                                    <Ionicons name="close" size={20} color="#333" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Caption (media posts only) */}
                        {!isTextOnly && caption ? (
                            <View style={styles.captionContainer}>
                                <Text style={styles.captionText}>{caption}</Text>
                            </View>
                        ) : null}
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
    textStoryBackground: {
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    centerTextStory: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: '700',
        textAlign: 'center',
        lineHeight: 34,
        textShadowColor: 'rgba(0,0,0,0.25)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 4,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    safeArea: {
        flex: 1,
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
    touchOverlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'row',
        zIndex: 5,
    },
    touchLeft: {
        flex: 1,
        height: '100%',
    },
    touchRight: {
        flex: 2,
        height: '100%',
    },
    progressBarContainer: {
        flexDirection: 'row',
        gap: 4,
        paddingHorizontal: 12,
        paddingTop: Platform.OS === 'android' ? 8 : 0,
        marginBottom: 10,
    },
    progressBarTrack: {
        flex: 1,
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
    avatarFallbackSmall: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#FFF',
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitialsSmall: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '700',
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
