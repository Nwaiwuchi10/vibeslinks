import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import SuggestedHosts from './SuggestedHosts';
import VibingEventPost from './VibingEventPost';
import PhotoSocialPost from './PhotoSocialPost';
import VideoSocialPost from './VideoSocialPost';
import { homeService } from '@/services/homeService';

const SocialFeed = () => {
    const [recommendedEvent, setRecommendedEvent] = useState<any | null>(null);

    useEffect(() => {
        homeService.getRecommendedEvents().then((cards: any[]) => {
            if (cards.length > 0) setRecommendedEvent(cards[0]);
        });
    }, []);

    return (
        <View>
            {/* "See where your friends are vibing" — powered by recommended event */}
            <VibingEventPost event={recommendedEvent} />

            {/* Social posts — no backend feed endpoint exists yet; showing static mocks */}
            <PhotoSocialPost imageSource={require('../../../assets/images/event.png')} />
            <VideoSocialPost />
            <SuggestedHosts />
            <PhotoSocialPost imageSource={require('../../../assets/images/ye.png')} />
        </View>
    );
};

export default SocialFeed;
