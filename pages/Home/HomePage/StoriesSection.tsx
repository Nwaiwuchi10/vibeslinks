import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppSelector } from '@/store/hooks';
import { homeService } from '@/services/homeService';

const MOCK_STORIES = [
  { id: '2', name: 'cdevibes', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '3', name: 'Nicky', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '4', name: 'romansbrown', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '5', name: 'sarah', avatar: 'https://i.pravatar.cc/150?img=9' },
];

const StoriesSection = () => {
  const [liveCreators, setLiveCreators] = useState<any[]>([]);
  const currentUser = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    homeService.getCreatorsOnLive().then(setLiveCreators).catch(() => {});
  }, []);

  // Map live creators to story-shaped objects; fallback to mocks
  const storyItems = liveCreators.length > 0
    ? liveCreators.map((c: any) => ({
        id: c.id || c.streamId || String(Math.random()),
        name: c.creatorName || c.name || c.creator?.name || c.username || 'Creator',
        avatar: c.creatorAvatarUrl || c.avatarUrl || c.creator?.profilePictureUrl
          || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        isLive: true,
      }))
    : MOCK_STORIES.map((s) => ({ ...s, isLive: false }));

  // "Your story" built from logged-in user
  const myAvatar = currentUser?.profilePictureUrl
    || `https://i.pravatar.cc/150?img=68`;
  const myStory = { id: 'my-story', name: 'Your story', avatar: myAvatar, hasPlus: true, isLive: false };

  const allStories = [myStory, ...storyItems];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
      {allStories.map((story: any, index) => (
        <TouchableOpacity
          key={story.id}
          style={styles.storyItem}
          activeOpacity={0.8}
          onPress={() => router.push(story.hasPlus ? '/add-story' : '/view-story')}
        >
          <View style={[
            styles.storyAvatarWrapper,
            index > 0 && (story.isLive ? styles.storyLiveBorder : styles.storyAvatarBorder),
          ]}>
            <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
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
          <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default StoriesSection;

const styles = StyleSheet.create({
  storiesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
