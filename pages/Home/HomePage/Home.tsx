import { useAppSelector } from '@/store/hooks';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdsBanner from './AdsBanner';
import FloatingStreamBanner from './FloatingStreamBanner';
import HomeHeader from './HomeHeader';
import LiveCreators from './LiveCreators';
import SocialFeed from './SocialFeed';
import StoriesSection from './StoriesSection';
import TrendingNearYou from './TrendingNearYou';
import { resolveImageUrl } from '@/services/apiClient';

export default function HomeScreen({ onOpenStream, refreshKey }: { onOpenStream: () => void; refreshKey?: number }) {
    // Read the logged-in user directly from Redux (populated at login/signup — no separate GET endpoint exists)
    const authUser = useAppSelector((state) => state.auth.user);
    const userAvatar = resolveImageUrl(authUser?.profilePictureUrl || authUser?.avatarUrl || null);
    const userName = authUser?.fullName || authUser?.name || authUser?.username || null;

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
            >
                <StoriesSection refreshKey={refreshKey} />
                <AdsBanner refreshKey={refreshKey} />
                <TrendingNearYou refreshKey={refreshKey} />
                <LiveCreators refreshKey={refreshKey} />
                <SocialFeed refreshKey={refreshKey} />

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
