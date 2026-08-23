import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { homeService } from '@/services/homeService';
import { resolveImageUrl } from '@/services/apiClient';
import { useAppSelector } from '@/store/hooks';
import { navigateToUserProfile } from '@/utils/profileNavigation';

const SuggestedHosts = () => {
  const currentUser = useAppSelector((state) => state.auth?.user);
  const currentUserId = currentUser?.id || (currentUser as any)?._id;
  const [hosts, setHosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        let data = await homeService.getAllHosts();
        if (!Array.isArray(data) || data.length === 0) {
          data = await homeService.getSuggestedHosts();
        }
        
        let allHostsList = Array.isArray(data) ? [...data] : [];
        if (currentUserId) {
          allHostsList = allHostsList.filter((h) => (h.id || h._id) !== currentUserId);
        }
        setHosts(allHostsList);
      } catch (err) {
        console.log('[SuggestedHosts] Error loading hosts:', err);
      }
    };
    fetchHosts();
  }, [currentUserId]);

  if (hosts.length === 0) {
    return null;
  }

  const displayHosts = hosts.map((h: any) => {
    const hostName = h.name
      ? `${h.firstName || ''} ${h.lastName || ''}`.trim() || h.name
      : h.fullName || h.username || 'Host';

    const rawAvatar =
      h.profilePictureUrl ||
      h.avatarUrl ||
      h.profilePicture ||
      h.avatar ||
      h.picture ||
      h.imageUrl ||
      h.image ||
      null;

    const resolvedAvatar = resolveImageUrl(rawAvatar);
    // Real host profile picture with dynamic initials fallback (no dummy unsplash data)
    const finalAvatar =
      resolvedAvatar && typeof resolvedAvatar === 'string' && resolvedAvatar.trim().length > 0
        ? resolvedAvatar
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName)}&background=7C3AED&color=fff&size=500`;

    const hasCustomAvatar = Boolean(resolvedAvatar && typeof resolvedAvatar === 'string' && resolvedAvatar.trim().length > 0);

    return {
      id: h.id || (h as any)._id || String(Math.random()),
      name: hostName,
      username: h.username || '',
      role: h.role,
      isHost: h.role === 'host' || h.isHost === true,
      tag: h.category || h.interests?.[0] || h.genre || (h.role === 'host' ? 'Host' : 'Creator'),
      followers: h.followerCount != null || h.followers != null
        ? (h.followerCount || h.followers) >= 1_000_000
          ? `${((h.followerCount || h.followers) / 1_000_000).toFixed(1)}M`
          : (h.followerCount || h.followers) >= 1_000
          ? `${((h.followerCount || h.followers) / 1_000).toFixed(1)}K`
          : String(h.followerCount || h.followers)
        : '',
      avatar: finalAvatar,
      image: finalAvatar,
      hasCustomAvatar,
    };
  }).sort((a, b) => {
    if (a.hasCustomAvatar && !b.hasCustomAvatar) return -1;
    if (!a.hasCustomAvatar && b.hasCustomAvatar) return 1;
    return 0;
  });

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested Host</Text>
        <TouchableOpacity onPress={() => router.push('/all-hosts')} activeOpacity={0.8}>
          <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={12} /></Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hostContainer}>
        {displayHosts.map((host: any) => (
          <TouchableOpacity
            key={host.id}
            style={styles.hostCard}
            activeOpacity={0.9}
            onPress={() => {
              navigateToUserProfile(router, host, currentUserId);
            }}
          >
            <Image
              source={{ uri: host.avatar }}
              style={styles.hostImage}
              resizeMode="cover"
            />
            <View style={styles.hostInfo}>
              <Text style={styles.hostName} numberOfLines={1}>
                {host.name}
                {host.followers ? <Text style={styles.hostFollowers}> · {host.followers}</Text> : null}
              </Text>
              <View style={styles.hostTagRow}>
                <Ionicons name="musical-notes" size={12} color="#666" />
                <Text style={styles.hostTag}>{host.tag}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default SuggestedHosts;

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
  hostContainer: {
    paddingHorizontal: 20,
  },
  hostCard: {
    width: 160,
    marginRight: 16,
  },
  hostImage: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    marginBottom: 8,
    backgroundColor: '#35383F',
  },
  hostInfo: {
    paddingHorizontal: 4,
  },
  hostName: { fontSize: 14, fontWeight: '700', color: '#1A1A2E', marginBottom: 2 },
  hostFollowers: { fontSize: 12, color: '#888', fontWeight: '400' },
  hostTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  hostTag: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});
