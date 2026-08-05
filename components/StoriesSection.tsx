import React, { useCallback, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import { storyService } from '@/services/storyService';
import { resolveImageUrl } from '@/services/apiClient';

interface StoriesSectionProps {
    refreshKey?: number;
    paddingHorizontal?: number;
    marginBottom?: number;
}

const StoriesSection = ({ refreshKey, paddingHorizontal = 20, marginBottom = 20 }: StoriesSectionProps) => {
    const [storyGroups, setStoryGroups] = useState<any[]>([]);
    const currentUser = useAppSelector((state) => state.auth.user);

    const loadStories = useCallback(async () => {
        try {
            const data = await storyService.getStoryFeed();
            if (Array.isArray(data)) {
                setStoryGroups(data);
            }
        } catch {
            setStoryGroups([]);
        }
    }, []);

    useEffect(() => {
        loadStories();
    }, [loadStories, refreshKey]);

    const myAvatar = resolveImageUrl(currentUser?.profilePictureUrl || currentUser?.avatarUrl || null);
    const myName = currentUser?.username || currentUser?.name || 'You';
    const myInitials = myName
        ? myName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
        : 'VL';

    const myStory = {
        id: 'my-story',
        name: 'Your story',
        avatar: myAvatar,
        initials: myInitials,
        hasPlus: true,
        isLive: false,
        storyId: null as string | null,
    };

    const mappedStories = storyGroups.map((group: any) => {
        if (group.user && Array.isArray(group.stories)) {
            const sorted = [...group.stories].sort(
                (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
            );
            const first = sorted[0];
            const name = group.user.username || group.user.name || 'User';
            const initials = name
                ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
                : 'VL';
            return {
                id: group.user.id || first?.id || String(Math.random()),
                storyId: first?.id || null,
                stories: sorted,
                name: name,
                avatar: resolveImageUrl(
                    group.user.profilePictureUrl ||
                    group.user.avatarUrl ||
                    group.user.profilePicture ||
                    group.user.avatar ||
                    group.user.picture ||
                    group.user.imageUrl ||
                    group.user.image ||
                    null
                ),
                initials,
                isLive: false,
                hasPlus: false,
            };
        }
        const user = group.author || group.user || group.creator || {};
        const name = user.username || user.name || 'User';
        const initials = name
            ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
            : 'VL';
        return {
            id: group.id || String(Math.random()),
            storyId: group.id || null,
            stories: [group],
            name: name,
            avatar: resolveImageUrl(
                user.profilePictureUrl ||
                user.avatarUrl ||
                user.profilePicture ||
                user.avatar ||
                user.picture ||
                user.imageUrl ||
                user.image ||
                null
            ),
            initials,
            isLive: false,
            hasPlus: false,
        };
    });

    const allStories = [myStory, ...mappedStories];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.storiesContainer, { paddingHorizontal, marginBottom }]}
        >
            {allStories.map((story: any, index: number) => (
                <TouchableOpacity
                    key={story.id}
                    style={styles.storyItem}
                    activeOpacity={0.8}
                    onPress={() => {
                        if (story.hasPlus) {
                            router.push({ pathname: '/create-post', params: { defaultType: 'story' } });
                        } else if (story.stories && story.stories.length > 0) {
                            router.push({
                                pathname: '/view-story',
                                params: { storiesData: JSON.stringify(story.stories) },
                            });
                        } else if (story.storyId) {
                            router.push({
                                pathname: '/view-story',
                                params: { id: story.storyId },
                            });
                        } else {
                            router.push('/view-story');
                        }
                    }}
                >
                    <View
                        style={[
                            styles.storyAvatarWrapper,
                            index > 0 &&
                                (story.isLive
                                    ? styles.storyLiveBorder
                                    : styles.storyAvatarBorder),
                        ]}
                    >
                        {story.avatar ? (
                            <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitials}>{story.initials}</Text>
                            </View>
                        )}
                        {story.hasPlus && (
                            <View style={styles.storyPlusBadge}>
                                <Ionicons name="add" size={12} color="#FFF" />
                            </View>
                        )}
                        {story.isLive && (
                            <View style={styles.storyLiveBadge}>
                                <Text style={styles.storyLiveText}>LIVE</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.storyName} numberOfLines={1}>
                        {story.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

export default StoriesSection;

const styles = StyleSheet.create({
    storiesContainer: {
        // paddingHorizontal and marginBottom set inline
    },
    storyItem: {
        alignItems: 'center',
        marginRight: 16,
        width: 64,
    },
    storyAvatarWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    storyAvatarBorder: {
        borderWidth: 2,
        borderColor: Colors.primary,
        padding: 2,
    },
    storyLiveBorder: {
        borderWidth: 2.5,
        borderColor: '#FF4B4B',
        padding: 2,
    },
    storyAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#EEE',
    },
    avatarFallback: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#8E2DE2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    storyPlusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    storyLiveBadge: {
        position: 'absolute',
        bottom: -4,
        backgroundColor: '#FF4B4B',
        borderRadius: 4,
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderWidth: 1.5,
        borderColor: '#FFF',
    },
    storyLiveText: {
        fontSize: 8,
        fontWeight: '800',
        color: '#FFF',
    },
    storyName: {
        fontSize: 11,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
    },
});
