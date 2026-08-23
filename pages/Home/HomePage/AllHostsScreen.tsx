import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { homeService } from '@/services/homeService';
import { eventService } from '@/services/eventService';
import { resolveImageUrl } from '@/services/apiClient';
import { useAppSelector } from '@/store/hooks';

import { navigateToUserProfile } from '@/utils/profileNavigation';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export interface HostItem {
  id: string;
  name: string;
  username?: string;
  tag: string;
  followers: string;
  rawFollowers: number;
  avatar: string | null;
  role?: string;
  isHost?: boolean;
}

export default function AllHostsScreen() {
  const currentUser = useAppSelector((state) => state.auth?.user);
  const currentUserId = currentUser?.id || (currentUser as any)?._id;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hosts, setHosts] = useState<HostItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllHosts = async () => {
    try {
      let data = await homeService.getAllHosts();
      if (!Array.isArray(data) || data.length === 0) {
        data = await homeService.getSuggestedHosts(50);
      }

      let allHostsList: any[] = Array.isArray(data) ? [...data] : [];
      if (currentUserId) {
        allHostsList = allHostsList.filter((h) => (h.id || h._id) !== currentUserId);
      }

      const formatted: HostItem[] = allHostsList.map((h: any) => {
        const hostName = h.name
          ? `${h.firstName || ''} ${h.lastName || ''}`.trim() || h.name
          : h.fullName || h.username || 'Host';

        const rawFollowerCount = h.followerCount ?? h.followers ?? 0;
        const followersStr =
          rawFollowerCount >= 1_000_000
            ? `${(rawFollowerCount / 1_000_000).toFixed(1)}M`
            : rawFollowerCount >= 1_000
            ? `${(rawFollowerCount / 1_000).toFixed(1)}K`
            : rawFollowerCount > 0
            ? String(rawFollowerCount)
            : '';

        const rawAvatar =
          h.profilePictureUrl ||
          h.avatarUrl ||
          h.profilePicture ||
          h.avatar ||
          h.picture ||
          h.imageUrl ||
          h.image ||
          null;
        const resolved = resolveImageUrl(rawAvatar);
        const finalAvatar =
          resolved && typeof resolved === 'string' && resolved.trim().length > 0
            ? resolved
            : `https://ui-avatars.com/api/?name=${encodeURIComponent(hostName)}&background=7C3AED&color=fff&size=500`;

        return {
          id: String(h.id || h._id || Math.random()),
          name: hostName,
          username: h.username || '',
          tag: h.category || h.interests?.[0] || h.genre || (h.role === 'host' ? 'Host' : 'Creator'),
          followers: followersStr,
          rawFollowers: rawFollowerCount,
          role: h.role,
          isHost: h.role === 'host' || h.isHost === true,
          avatar: finalAvatar,
        };
      });

      setHosts(formatted);
    } catch (err) {
      console.warn('[AllHostsScreen] Failed to load hosts:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllHosts();
  }, [currentUser]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllHosts();
  };

  const filteredHosts = useMemo(() => {
    if (!searchQuery.trim()) return hosts;
    const q = searchQuery.toLowerCase().trim();
    return hosts.filter(
      (h) => h.name.toLowerCase().includes(q) || h.tag.toLowerCase().includes(q)
    );
  }, [hosts, searchQuery]);

  const handleHostPress = (host: HostItem) => {
    navigateToUserProfile(router, host, currentUserId);
  };

  const renderHostCard = ({ item }: { item: HostItem }) => (
    <TouchableOpacity
      style={styles.hostCard}
      activeOpacity={0.88}
      onPress={() => handleHostPress(item)}
    >
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.hostImage} resizeMode="cover" />
      ) : (
        <View style={[styles.hostImage, styles.hostImagePlaceholder]}>
          <Ionicons name="person" size={40} color="#999" />
        </View>
      )}
      <View style={styles.hostInfo}>
        <Text style={styles.hostName} numberOfLines={1}>
          {item.name}
        </Text>
        {item.followers ? (
          <Text style={styles.hostFollowers}>{item.followers} followers</Text>
        ) : null}
        <View style={styles.hostTagRow}>
          <Ionicons name="musical-notes" size={12} color="#8E2DE2" />
          <Text style={styles.hostTag} numberOfLines={1}>
            {item.tag}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Hosts</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#999" style={{ marginRight: 8 }} />
          <TextInput
            placeholder="Search hosts or categories..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            clearButtonMode="while-editing"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#999" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Host Grid */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8E2DE2" />
          <Text style={styles.loadingText}>Loading hosts...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHosts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={renderHostCard}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#8E2DE2']}
              tintColor="#8E2DE2"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={56} color="#CCC" />
              <Text style={styles.emptyTitle}>No Hosts Found</Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery
                  ? `No hosts match "${searchQuery}"`
                  : 'There are no hosts available at the moment.'}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 12 : 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    height: 46,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A2E',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hostCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
  },
  hostImage: {
    width: '100%',
    height: 130,
    borderRadius: 14,
    marginBottom: 8,
  },
  hostImagePlaceholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hostInfo: {
    paddingHorizontal: 2,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 2,
  },
  hostFollowers: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
    marginBottom: 4,
  },
  hostTagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  hostTag: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
    marginLeft: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
