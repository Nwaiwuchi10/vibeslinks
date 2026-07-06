import React from 'react';
import { View } from 'react-native';
import SuggestedHosts from './SuggestedHosts';
import VibingEventPost from './VibingEventPost';
import PhotoSocialPost from './PhotoSocialPost';
import VideoSocialPost from './VideoSocialPost';

const SocialFeed = () => {
    return (
        <View>
            <VibingEventPost />
            <PhotoSocialPost imageSource={require('../../../assets/images/event.png')} />
            <VideoSocialPost />
            <SuggestedHosts />
            <PhotoSocialPost imageSource={require('../../../assets/images/ye.png')} />
        </View>
    );
};

export default SocialFeed;
