import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AdsBanner from './AdsBanner';
import HomeHeader from './HomeHeader';
import LiveCreators from './LiveCreators';
import SocialFeed from './SocialFeed';
import StoriesSection from './StoriesSection';

import TrendingNearYou from './TrendingNearYou';

export default function HomeScreen({ onOpenStream }: { onOpenStream: () => void }) {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            <HomeHeader onAddPress={onOpenStream} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <StoriesSection />
                <AdsBanner />
                <TrendingNearYou />
                <LiveCreators />
                <SocialFeed />


                <View style={{ height: 40 }} />
            </ScrollView>
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
