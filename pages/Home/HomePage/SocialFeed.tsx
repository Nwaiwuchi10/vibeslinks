import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { postService } from '@/services/postService';
import PhotoSocialPost from './PhotoSocialPost';
import SuggestedHosts from './SuggestedHosts';

const SocialFeed = ({ refreshKey }: { refreshKey?: number }) => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadPosts = useCallback(async () => {
        try {
            const data = await postService.getPostFeed();
            setPosts(data);
        } catch (err) {
            console.error('[SocialFeed] Failed to load posts:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadPosts();
    }, [loadPosts, refreshKey]);

    const handleRefresh = () => {
        setRefreshing(true);
        loadPosts();
    };

    if (loading) {
        return (
            <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginVertical: 30 }}
            />
        );
    }

    if (posts.length === 0) {
        return (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <MaterialCommunityIcons name="image-off-outline" size={48} color="#DDD" />
                <Text style={{ color: '#999', marginTop: 12, fontSize: 14 }}>
                    No posts yet. Be the first to post!
                </Text>
            </View>
        );
    }

    return (
        <View>
            {posts.map((post: any, idx: number) => (
                <PhotoSocialPost key={post.id || idx} post={post} />
            ))}
            <SuggestedHosts />
        </View>
    );
};

export default SocialFeed;
