import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { homeService } from '@/services/homeService';
import { eventService } from '@/services/eventService';
import { resolveImageUrl } from '@/services/apiClient';

import { useAppSelector } from '@/store/hooks';

const SuggestedHosts = () => {
  const currentUser = useAppSelector((state) => state.auth?.user);
  const [hosts, setHosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        let data = await homeService.getSuggestedHosts();
        if (!Array.isArray(data) || data.length === 0) {
          data = await homeService.getAllHosts();
        }
        if (!Array.isArray(data) || data.length === 0) {
          const res = await eventService.getArtistOptions();
          data = Array.isArray(res) ? res : res?.artists || [];
        }
        
        let allHostsList = Array.isArray(data) ? [...data] : [];
        if (currentUser) {
          const currentUserId = currentUser.id || (currentUser as any)._id;
          allHostsList = allHostsList.filter((h) => (h.id || h._id) !== currentUserId);
          allHostsList.unshift(currentUser);
        }
        if (allHostsList.length > 0) {
          setHosts(allHostsList);
        }
      } catch (err) {
        console.log('[SuggestedHosts] Error loading hosts:', err);
      }
    };
    fetchHosts();
  }, [currentUser]);

  if (hosts.length === 0) {
    return null;
  }

  const displayHosts = hosts.map((h: any) => ({
    id: h.id || (h as any)._id || String(Math.random()),
    name: h.name ? `${h.firstName || ''} ${h.lastName || ''}`.trim() || h.name : h.fullName || h.username || 'Host',
    tag: h.category || h.interests?.[0] || h.genre || 'Host',
    followers: h.followerCount != null || h.followers != null
      ? (h.followerCount || h.followers) >= 1_000_000
        ? `${((h.followerCount || h.followers) / 1_000_000).toFixed(1)}M`
        : (h.followerCount || h.followers) >= 1_000
        ? `${((h.followerCount || h.followers) / 1_000).toFixed(1)}K`
        : String(h.followerCount || h.followers)
      : '',
    avatar: resolveImageUrl(
      h.profilePictureUrl ||
      h.avatarUrl ||
      h.profilePicture ||
      h.avatar ||
      h.picture ||
      h.imageUrl ||
      h.image ||
      null
    ),
    image: null,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Suggested Host</Text>
        <TouchableOpacity onPress={() => router.push('/recent-search')} activeOpacity={0.8}>
          <Text style={styles.seeAllText}>See all <Ionicons name="chevron-forward" size={12} /></Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hostContainer}>
        {displayHosts.map((host: any) => (
          <TouchableOpacity
            key={host.id}
            style={styles.hostCard}
            activeOpacity={0.9}
            onPress={() => router.push({ pathname: '/profile', params: { id: host.id } })}
          >
            {host.avatar ? (
              <Image source={{ uri: host.avatar }} style={styles.hostImage} resizeMode="cover" />
            ) : (
              <View style={[styles.hostImage, styles.hostImagePlaceholder]}>
                <Ionicons name="person" size={36} color="#888" />
              </View>
            )}
            <View style={styles.hostInfo}>
              <Text style={styles.hostName} numberOfLines={1}>
                {host.name} <MaterialIcons name="verified" size={12} color={Colors.primary} />
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
  },
  hostImagePlaceholder: {
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
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
