import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import SuggestedHosts from './SuggestedHosts';
import VibingEventPost from './VibingEventPost';
import PhotoSocialPost from './PhotoSocialPost';
import VideoSocialPost from './VideoSocialPost';
import { homeService } from '@/services/homeService';

const SocialFeed = () => {
    const [recommendedEvents, setRecommendedEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        homeService.getRecommendedEvents()
            .then((cards: any[]) => {
                setRecommendedEvents(cards);
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <ActivityIndicator size="small" color="#8E2DE2" style={{ marginVertical: 30 }} />;
    }

    const firstEvent = recommendedEvents.length > 0 ? recommendedEvents[0] : null;
    const remainingEvents = recommendedEvents.slice(1);

    return (
        <View>
            {/* "See where your friends are vibing" — powered by first recommended event */}
            <VibingEventPost event={firstEvent} />

            {/* Dynamic Social posts mapping from remaining recommended events */}
            {remainingEvents.map((evt, idx) => {
                const cover = evt.imageUrl || evt.eventPosterUrl || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000';
                return (
                    <PhotoSocialPost 
                        key={evt.id || idx} 
                        imageSource={{ uri: cover }} 
                    />
                );
            })}

            {remainingEvents.length === 0 && (
                <>
                    <PhotoSocialPost imageSource={require('../../../assets/images/event.png')} />
                    <VideoSocialPost />
                </>
            )}

            <SuggestedHosts />
            
            {remainingEvents.length === 0 && (
                <PhotoSocialPost imageSource={require('../../../assets/images/ye.png')} />
            )}
        </View>
    );
};

export default SocialFeed;
