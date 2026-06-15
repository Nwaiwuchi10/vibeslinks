import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const STORIES = [
    { id: '1', name: 'Your story', avatar: 'https://i.pravatar.cc/150?img=68', hasPlus: true },
    { id: '2', name: 'cdevibes', avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: '3', name: 'Nicky', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '4', name: 'romansbrown', avatar: 'https://i.pravatar.cc/150?img=8' },
    { id: '5', name: 'sarah', avatar: 'https://i.pravatar.cc/150?img=9' },
];

const StoriesSection = () => {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesContainer}>
            {STORIES.map((story, index) => (
                <View key={story.id} style={styles.storyItem}>
                    <View style={[styles.storyAvatarWrapper, index > 0 && styles.storyAvatarBorder]}>
                        <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                        {story.hasPlus && (
                            <View style={styles.storyPlusBadge}>
                                <Ionicons name="add" size={12} color="#FFF" />
                            </View>
                        )}
                    </View>
                    <Text style={styles.storyName}>{story.name}</Text>
                </View>
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
    storyName: {
        fontSize: 11,
        color: '#333',
        fontWeight: '500',
    },
});
