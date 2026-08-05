import { useAppSelector } from '@/store/hooks';
import React, { useState, useCallback } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdsBanner from '@/components/AdsBanner';
import FloatingStreamBanner from './FloatingStreamBanner';
import HomeHeader from './HomeHeader';
import LiveCreators from './LiveCreators';
import SocialFeed from './SocialFeed';
import StoriesSection from '@/components/StoriesSection';
import TrendingNearYou from './TrendingNearYou';
import { resolveImageUrl } from '@/services/apiClient';
import { Colors } from '@/constants/Colors';

export default function HomeScreen({ onOpenStream, refreshKey }: { onOpenStream: () => void; refreshKey?: number }) {
    const authUser = useAppSelector((state) => state.auth.user);
    const userAvatar = resolveImageUrl(authUser?.profilePictureUrl || authUser?.avatarUrl || null);
    const userName = authUser?.fullName || authUser?.name || authUser?.username || null;

    const [refreshing, setRefreshing] = useState(false);
    const [internalKey, setInternalKey] = useState(0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setInternalKey((k) => k + 1);
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);

    const combinedRefreshKey = (refreshKey || 0) + internalKey;

    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <HomeHeader
                onAddPress={onOpenStream}
                userAvatar={userAvatar}
                userName={userName}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary || '#8E2DE2']}
                        tintColor="#8E2DE2"
                    />
                }
            >
                <StoriesSection refreshKey={combinedRefreshKey} />
                <AdsBanner refreshKey={combinedRefreshKey} />
                <TrendingNearYou refreshKey={combinedRefreshKey} />
                <LiveCreators refreshKey={combinedRefreshKey} />
                <SocialFeed refreshKey={combinedRefreshKey} />

                <View style={{ height: 40 }} />
            </ScrollView>

            <FloatingStreamBanner />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    scrollContent: {
        paddingBottom: 20,
    },
});
