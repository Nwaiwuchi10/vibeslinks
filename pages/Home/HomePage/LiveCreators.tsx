import React, { useEffect, useState } from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../../constants/Colors';
import { router } from 'expo-router';
import { homeService } from '@/services/homeService';


const LiveCreators = ({ refreshKey }: { refreshKey?: number }) => {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    homeService.getCreatorsOnLive()
      .then(setCreators)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [refreshKey]);

  const displayCreators = creators.map((c: any) => ({
    id: c.id || c.streamId || String(Math.random()),
    title: c.title || c.streamTitle || 'Live now',
    name: c.creatorName || c.name || c.creator?.name || c.creator?.username || 'Creator',
    time: c.viewerCount != null ? `${c.viewerCount} viewers` : '. live',
    coverUrl: c.coverUrl || c.thumbnailUrl || c.creator?.profilePictureUrl || null,
    avatar: c.creatorAvatarUrl || c.creator?.profilePictureUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
    viewerCount: c.viewerCount || null,
  }));

  if (!loading && displayCreators.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Creators on Live</Text>
        <TouchableOpacity onPress={() => router.push('/live-creators')}>
          <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={12} /></Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.liveCard, styles.liveCardPlaceholder, { backgroundColor: '#E8E8E8' }]} />
          ))}
        </ScrollView>
      ) : displayCreators.length === 0 ? null : (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.liveContainer}>
        {displayCreators.map((live: any) => (
          <TouchableOpacity
            key={live.id}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/watch-stream', params: { id: live.id } })}
          >
            {live.coverUrl ? (
              <ImageBackground
                source={{ uri: live.coverUrl }}
                style={styles.liveCard}
                imageStyle={{ borderRadius: 12 }}
              >
                <LiveCardOverlay live={live} />
              </ImageBackground>
            ) : (
              <View style={[styles.liveCard, styles.liveCardPlaceholder]}>
                <LiveCardOverlay live={live} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      )}
    </View>
  );
};

function LiveCardOverlay({ live }: { live: any }) {
  return (
    <View style={styles.liveOverlay}>
      {/* Top Badge */}
      <View style={styles.topBadges}>
        <View style={styles.liveBadge}>
          <View style={styles.dot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        {live.viewerCount != null && (
          <View style={styles.viewerBadge}>
            <Ionicons name="eye" size={9} color="#FFF" />
            <Text style={styles.viewerText}>{live.viewerCount}</Text>
          </View>
        )}
      </View>
      {/* Bottom Content */}
      <View>
        <Text style={styles.liveTitle} numberOfLines={2}>{live.title}</Text>
        <View style={styles.liveCreatorRow}>
          <Image source={{ uri: live.avatar }} style={styles.liveAvatar} />
          <Text style={styles.liveName}>{live.name}</Text>
          <Text style={styles.liveTime}>{live.time}</Text>
        </View>
      </View>
    </View>
  );
}

export default LiveCreators;

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  seeAllText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  liveContainer: {
    paddingHorizontal: 20,
  },
  liveCard: {
    width: 140,
    height: 180,
    marginRight: 12,
  },
  liveCardPlaceholder: {
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
  },
  liveOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
    padding: 12,
    justifyContent: 'space-between',
  },
  topBadges: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 6,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4B4B',
    marginRight: 4,
  },
  liveText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  viewerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  viewerText: {
    fontSize: 8,
    color: '#FFF',
    fontWeight: '600',
  },
  liveTitle: { color: '#FFF', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  liveCreatorRow: { flexDirection: 'row', alignItems: 'center' },
  liveAvatar: { width: 20, height: 20, borderRadius: 10, marginRight: 6 },
  liveName: { color: '#FFF', fontSize: 10, fontWeight: '500' },
  liveTime: { color: '#E0E0E0', fontSize: 10, marginLeft: 2 },
});
