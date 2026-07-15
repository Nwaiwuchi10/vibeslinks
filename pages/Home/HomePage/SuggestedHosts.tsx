import { Colors } from '@/constants/Colors';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { homeService } from '@/services/homeService';

const MOCK_SUGGESTED_HOSTS = [
  { id: '1', name: 'Davido', tag: 'Afrobeats', followers: '2.3M', image: require('../../../assets/images/davido.png'), avatar: null },
  { id: '2', name: 'Odumodublv', tag: 'EDM', followers: '1.8M', image: require('../../../assets/images/modu.png'), avatar: null },
];

const SuggestedHosts = () => {
  const [hosts, setHosts] = useState<any[]>([]);

  useEffect(() => {
    homeService.getSuggestedHosts().then((data) => {
      if (Array.isArray(data) && data.length > 0) setHosts(data);
    });
  }, []);

  const displayHosts = hosts.length > 0
    ? hosts.map((h: any) => ({
        id: h.id || String(Math.random()),
        name: h.name || h.fullName || h.username || 'Creator',
        tag: h.interests?.[0] || h.category || h.genre || 'Music',
        followers: h.followerCount != null
          ? h.followerCount >= 1_000_000
            ? `${(h.followerCount / 1_000_000).toFixed(1)}M`
            : h.followerCount >= 1_000
            ? `${(h.followerCount / 1_000).toFixed(1)}K`
            : String(h.followerCount)
          : '',
        avatar: h.profilePictureUrl || h.avatarUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        image: null,
      }))
    : MOCK_SUGGESTED_HOSTS;

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
              <Image source={{ uri: host.avatar }} style={styles.hostImage} />
            ) : host.image ? (
              <Image source={host.image} style={styles.hostImage} />
            ) : (
              <View style={[styles.hostImage, styles.hostImagePlaceholder]} />
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
    backgroundColor: '#DDD',
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
