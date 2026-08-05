import React, { useEffect, useState } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { liveStreamService } from '@/services/liveStreamService';

const { width, height } = Dimensions.get('window');

const CARD_WIDTH = width - 24;
const CARD_HEIGHT = height * 0.42;

const LiveCreatorsListScreen = () => {
  const [feed, setFeed] = useState<any[]>([]);
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [activeStreams, onLive] = await Promise.allSettled([
          liveStreamService.getActiveStreams(),
          liveStreamService.getCreatorsOnLive(),
        ]);

        if (activeStreams.status === 'fulfilled') {
          const items = Array.isArray(activeStreams.value)
            ? activeStreams.value
            : activeStreams.value?.items || activeStreams.value?.streams || [];
          setFeed(items);
        }

        if (onLive.status === 'fulfilled') {
          const items = Array.isArray(onLive.value)
            ? onLive.value
            : onLive.value?.items || onLive.value?.creators || [];
          setCreators(items);
        }
      } catch (err) {
        console.warn('Error loading live streams feed:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ── Stories row ── */}
      <View style={styles.storiesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.storiesScroll}
        >
          {creators.map((creator) => {
            const avatar = creator.creator?.profilePictureUrl || creator.creatorAvatarUrl || `https://i.pravatar.cc/150?img=${creator.id || 10}`;
            const name = creator.creator?.name || creator.creatorName || 'Creator';
            return (
              <TouchableOpacity
                key={creator.id}
                style={styles.storyItem}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/live-details', params: { id: creator.id } })}
              >
                {/* Gradient ring */}
                <LinearGradient
                  colors={['#C850C0', '#FFCC70', '#FF6B6B']}
                  style={styles.gradientRing}
                  start={{ x: 0.1, y: 0.9 }}
                  end={{ x: 0.9, y: 0.1 }}
                >
                  <View style={styles.avatarInnerRing}>
                    <Image source={{ uri: avatar }} style={styles.storyAvatar} />
                  </View>
                </LinearGradient>
                <Text style={styles.storyName} numberOfLines={1}>
                  {name}
                </Text>
              </TouchableOpacity>
            );
          })}

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
      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : feed.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Ionicons name="videocam-off-outline" size={48} color="#444" style={{ marginBottom: 12 }} />
          <Text style={{ color: '#888', fontSize: 15 }}>No active live streams found</Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.feedContent}
          decelerationRate="fast"
        >
          {feed.map((item) => {
            const coverUri = item.coverUrl || item.imageUrl || item.thumbnailUrl;
            const avatar = item.creator?.profilePictureUrl || item.hostAvatar || `https://i.pravatar.cc/150?img=${item.id || 5}`;
            const username = item.creator?.name || item.creatorName || 'Host';
            const likes = item.viewerCount != null ? `${item.viewerCount}` : '0';
            const isPaid = item.ticketPrice > 0;
            const badgeText = isPaid ? `₦${item.ticketPrice.toLocaleString()}` : 'Free';
            const badgeColor = isPaid ? '#1A1A6E' : '#7B2FBE';

            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.95}
                onPress={() => router.push({ pathname: '/live-details', params: { id: item.id } })}
              >
                <ImageBackground
                  source={coverUri ? { uri: coverUri } : require('../../assets/images/studio_mic.png')}
                  style={styles.cardBg}
                  imageStyle={styles.cardBgImage}
                  resizeMode="cover"
                >
                  <LinearGradient
                    colors={['rgba(0,0,0,0.38)', 'transparent', 'transparent']}
                    style={StyleSheet.absoluteFill}
                  />

                  {/* Top overlay row */}
                  <View style={styles.cardTopRow}>
                    {/* Creator pill */}
                    <View style={styles.creatorPill}>
                      <Image source={{ uri: avatar }} style={styles.pillAvatar} />
                      <Text style={styles.pillName}>{username}</Text>
                      <Ionicons name="eye" size={11} color="#FFF" style={styles.pillHeart} />
                      <Text style={styles.pillLikes}>{likes}</Text>
                    </View>

                    {/* Price / access badge */}
                    <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                      <Text style={styles.badgeText}>{badgeText}</Text>
                    </View>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            );
          })}

          <View style={{ height: 32 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default LiveCreatorsListScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#1A1A1A' },
  storiesContainer: { backgroundColor: '#FFFFFF', paddingVertical: 10 },
  storiesScroll: { paddingHorizontal: 14, alignItems: 'flex-start', gap: 12 },
  storyItem: { alignItems: 'center', width: 60 },
  gradientRing: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 5 },
  avatarInnerRing: { width: 53, height: 53, borderRadius: 26.5, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  storyAvatar: { width: 50, height: 50, borderRadius: 25 },
  storyName: { fontSize: 9.5, color: '#333', fontWeight: '500', textAlign: 'center', maxWidth: 58 },
  seeMoreBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginLeft: 4 },
  feedContent: { paddingTop: 10, paddingHorizontal: 12, gap: 10 },
  card: { width: CARD_WIDTH, height: CARD_HEIGHT, borderRadius: 22, overflow: 'hidden', ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 10 }, android: { elevation: 8 } }) },
  cardBg: { flex: 1, width: '100%', height: '100%' },
  cardBgImage: { borderRadius: 22 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 12, paddingTop: 12 },
  creatorPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.42)', paddingLeft: 5, paddingRight: 10, paddingVertical: 5, borderRadius: 20 },
  pillAvatar: { width: 26, height: 26, borderRadius: 13, borderWidth: 1.5, borderColor: '#FFF', marginRight: 6 },
  pillName: { color: '#FFF', fontSize: 13, fontWeight: '700', letterSpacing: 0.1 },
  pillHeart: { marginLeft: 7, marginRight: 2 },
  pillLikes: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  badge: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 18 },
  badgeText: { color: '#FFF', fontSize: 13, fontWeight: '800', letterSpacing: 0.2 },
});
