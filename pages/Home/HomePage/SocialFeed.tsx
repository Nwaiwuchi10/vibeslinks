import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { postService } from '@/services/postService';
import { eventService } from '@/services/eventService';
import { homeService } from '@/services/homeService';
import PhotoSocialPost from './PhotoSocialPost';
import SuggestedHosts from './SuggestedHosts';
import VibingEventPost from './VibingEventPost';

const SocialFeed = ({ refreshKey }: { refreshKey?: number }) => {
    const [feedItems, setFeedItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const loadFeed = useCallback(async () => {
        try {
            const [postsRes, eventsRes, hostsRes] = await Promise.allSettled([
                postService.getPostFeed(),
                eventService.getAllEvents(),
                homeService.getSuggestedHosts().catch(() => homeService.getAllHosts()),
            ]);

            const posts = postsRes.status === 'fulfilled' ? postsRes.value : [];
            const events = eventsRes.status === 'fulfilled' ? eventsRes.value : [];
            const hosts = hostsRes.status === 'fulfilled' ? hostsRes.value : [];

            const items: any[] = [];

            // Add social posts
            if (Array.isArray(posts)) {
                posts.forEach((post: any) => {
                    items.push({
                        type: 'post',
                        timestamp: post.createdAt ? new Date(post.createdAt).getTime() : 0,
                        data: post,
                    });
                });
            }

            // Add vibing event post
            if (Array.isArray(events) && events.length > 0) {
                const latestEvent = events[0];
                items.push({
                    type: 'event-post',
                    timestamp: latestEvent.createdAt
                        ? new Date(latestEvent.createdAt).getTime()
                        : (latestEvent.startsAt ? new Date(latestEvent.startsAt).getTime() : 0),
                    data: latestEvent,
                });
            }

            // Add suggested hosts
            if (Array.isArray(hosts) && hosts.length > 0) {
                const latestHostTime = hosts.reduce((max: number, h: any) => {
                    const t = h.createdAt ? new Date(h.createdAt).getTime() : 0;
                    return Math.max(max, t);
                }, 0);

                items.push({
                    type: 'suggested-hosts',
                    timestamp: latestHostTime > 0 ? latestHostTime : Date.now() - 3600000, // default 1 hour ago
                    data: hosts,
                });
            }

            // Sort dynamically by timestamp (latest update first)
            items.sort((a, b) => b.timestamp - a.timestamp);
            setFeedItems(items);
        } catch (err) {
            console.error('[SocialFeed] Failed to load unified feed:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadFeed();
    }, [loadFeed, refreshKey]);

    if (loading) {
        return (
            <ActivityIndicator
                size="small"
                color={Colors.primary}
                style={{ marginVertical: 30 }}
            />
        );
    }

    if (feedItems.length === 0) {
        return (
            <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <MaterialCommunityIcons name="image-off-outline" size={48} color="#DDD" />
                <Text style={{ color: '#999', marginTop: 12, fontSize: 14 }}>
                    No feed items yet.
                </Text>
            </View>
        );
    }

    return (
        <View>
            {feedItems.map((item: any, idx: number) => {
                if (item.type === 'post') {
                    return <PhotoSocialPost key={`post-${item.data.id || idx}`} post={item.data} />;
                }
                if (item.type === 'event-post') {
                    return <VibingEventPost key={`event-${item.data.id || idx}`} event={item.data} refreshKey={refreshKey} />;
                }
                if (item.type === 'suggested-hosts') {
                    return <SuggestedHosts key={`hosts-${idx}`} />;
                }
                return null;
            })}
        </View>
    );
};

export default SocialFeed;
