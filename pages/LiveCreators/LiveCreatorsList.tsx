import React from 'react';
import {
    Dimensions,
    Image,
    ImageBackground,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

// Cards are almost full-width with small side margins
const CARD_WIDTH = width - 24;
// Each card is roughly 42% of screen height — tall but shows peek of next card
const CARD_HEIGHT = height * 0.42;

const STORY_CREATORS = [
    { id: '1', name: 'adevibes',   avatar: 'https://i.pravatar.cc/150?img=11' },
    { id: '2', name: 'Nicky',      avatar: 'https://i.pravatar.cc/150?img=20' },
    { id: '3', name: 'ramonbrown', avatar: 'https://i.pravatar.cc/150?img=32' },
    { id: '4', name: 'topaz',      avatar: 'https://i.pravatar.cc/150?img=44' },
];

const LIVE_FEED = [
    {
        id: '1',
        username: 'Olivia',
        avatar: 'https://i.pravatar.cc/150?img=20',
        likes: '1k',
        badge: 'Paid',
        badgeColor: '#7B2FBE',
        image: require('../../assets/images/artist_event.png'),
    },
    {
        id: '2',
        username: 'Roland',
        avatar: 'https://i.pravatar.cc/150?img=32',
        likes: '9.4k',
        badge: 'Free',
        badgeColor: '#7B2FBE',
        image: require('../../assets/images/tiger_event.png'),
    },
    {
        id: '3',
        username: 'Donkam',
        avatar: 'https://i.pravatar.cc/150?img=55',
        likes: '9.4k',
        badge: '₦15,000',
        badgeColor: '#1A1A6E',
        image: require('../../assets/images/studio_mic.png'),
    },
];

const LiveCreatorsListScreen = () => {
    return (
        <SafeAreaView style={styles.safeArea} edges={['top']}>
            {/* ── Stories row ── */}
            <View style={styles.storiesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.storiesScroll}
                >
                    {STORY_CREATORS.map((creator) => (
                        <TouchableOpacity
                            key={creator.id}
                            style={styles.storyItem}
                            activeOpacity={0.8}
                            onPress={() => router.push('/live-details')}
                        >
                            {/* Gradient ring */}
                            <LinearGradient
                                colors={['#C850C0', '#FFCC70', '#FF6B6B']}
                                style={styles.gradientRing}
                                start={{ x: 0.1, y: 0.9 }}
                                end={{ x: 0.9, y: 0.1 }}
                            >
                                <View style={styles.avatarInnerRing}>
                                    <Image
                                        source={{ uri: creator.avatar }}
                                        style={styles.storyAvatar}
                                    />
                                </View>
                            </LinearGradient>
                            <Text style={styles.storyName} numberOfLines={1}>
                                {creator.name}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {/* Up arrow — tap to return to live details */}
                    <TouchableOpacity
                        style={styles.seeMoreBtn}
                        onPress={() => router.back()}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="chevron-up" size={16} color="#555" />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* ── Feed ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.feedContent}
                decelerationRate="fast"
            >
                {LIVE_FEED.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        style={styles.card}
                        activeOpacity={0.95}
                        onPress={() => router.push('/live-details')}
                    >
                        <ImageBackground
                            source={item.image}
                            style={styles.cardBg}
                            imageStyle={styles.cardBgImage}
                            resizeMode="cover"
                        >
                            {/* Subtle gradient so top text is readable */}
                            <LinearGradient
                                colors={['rgba(0,0,0,0.38)', 'transparent', 'transparent']}
                                style={StyleSheet.absoluteFill}
                            />

                            {/* Top overlay row */}
                            <View style={styles.cardTopRow}>
                                {/* Creator pill */}
                                <View style={styles.creatorPill}>
                                    <Image
                                        source={{ uri: item.avatar }}
                                        style={styles.pillAvatar}
                                    />
                                    <Text style={styles.pillName}>{item.username}</Text>
                                    <Ionicons
                                        name="heart"
                                        size={11}
                                        color="#FFF"
                                        style={styles.pillHeart}
                                    />
                                    <Text style={styles.pillLikes}>{item.likes}</Text>
                                </View>

                                {/* Price / access badge */}
                                <View style={[styles.badge, { backgroundColor: item.badgeColor }]}>
                                    <Text style={styles.badgeText}>{item.badge}</Text>
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                ))}

                {/* Bottom breathing room */}
                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default LiveCreatorsListScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#1A1A1A',
    },

    // ── Stories ──────────────────────────────────────────────
    storiesContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
    },
    storiesScroll: {
        paddingHorizontal: 14,
        alignItems: 'flex-start',
        gap: 12,
    },
    storyItem: {
        alignItems: 'center',
        width: 60,
    },
    gradientRing: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatarInnerRing: {
        width: 53,
        height: 53,
        borderRadius: 26.5,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    storyAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    storyName: {
        fontSize: 9.5,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
        maxWidth: 58,
    },
    seeMoreBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFEFEF',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 4,
    },

    // ── Feed Cards ───────────────────────────────────────────
    feedContent: {
        paddingTop: 10,
        paddingHorizontal: 12,
        gap: 10,
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 22,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.35,
                shadowRadius: 10,
            },
            android: { elevation: 8 },
        }),
    },
    cardBg: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    cardBgImage: {
        borderRadius: 22,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 12,
    },

    // Creator pill
    creatorPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.42)',
        paddingLeft: 5,
        paddingRight: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    pillAvatar: {
        width: 26,
        height: 26,
        borderRadius: 13,
        borderWidth: 1.5,
        borderColor: '#FFF',
        marginRight: 6,
    },
    pillName: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '700',
        letterSpacing: 0.1,
    },
    pillHeart: {
        marginLeft: 7,
        marginRight: 2,
    },
    pillLikes: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: '600',
    },

    // Price badge
    badge: {
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 18,
    },
    badgeText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '800',
        letterSpacing: 0.2,
    },
});
