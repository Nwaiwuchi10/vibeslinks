import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { userService } from '@/services/userService';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';
import { Colors } from '@/constants/Colors';

export default function FollowingMain() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [followers, setFollowers] = useState<any[]>([]);
  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadFollowData = async () => {
    try {
      const followersData = await userService.getFollowers();
      const followingData = await userService.getFollowing();

      setFollowers(Array.isArray(followersData) ? followersData : []);
      
      const followedIds = Array.isArray(followingData) 
        ? followingData.map((f: any) => String(f.id || f.userId))
        : [];
      setFollowingIds(followedIds);
    } catch (err) {
      console.warn('[FollowingMain] Error loading follow data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFollowData();
  }, []);

  const handleFollowToggle = async (userId: string) => {
    setActionLoadingId(userId);
    try {
      const isFollowing = followingIds.includes(userId);
      await userService.followArtist(userId);
      
      if (isFollowing) {
        setFollowingIds(prev => prev.filter(id => id !== userId));
        dispatch(showToast({ type: 'success', message: 'Unfollowed successfully' }));
      } else {
        setFollowingIds(prev => [...prev, userId]);
        dispatch(showToast({ type: 'success', message: 'Followed successfully' }));
      }
    } catch (err) {
      console.error('[FollowingMain] Follow toggle failed:', err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const userId = String(item.id || item.userId);
    const isFollowing = followingIds.includes(userId);
    const avatar = item.profilePictureUrl || item.avatarUrl || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          <Image source={{ uri: avatar }} style={styles.itemImage} />
          <View style={styles.textContainer}>
            <Text style={styles.itemName}>{item.fullName || item.name || 'User'}</Text>
            <Text style={styles.itemUsername}>@{item.username || 'username'}</Text>
          </View>
        </View>
        <TouchableOpacity 
          style={[styles.followBtn, isFollowing && styles.followingBtn]}
          onPress={() => handleFollowToggle(userId)}
          disabled={actionLoadingId === userId}
        >
          {actionLoadingId === userId ? (
            <ActivityIndicator size="small" color={isFollowing ? Colors.primary : "#FFF"} />
          ) : (
            <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
              {isFollowing ? 'Following' : 'Follow Back'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Followers</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : followers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color="#CCC" />
          <Text style={styles.emptyText}>No followers found</Text>
        </View>
      ) : (
        <FlatList
          data={followers}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id || item.userId || Math.random())}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  itemUsername: {
    fontSize: 12,
    color: '#888',
  },
  followBtn: {
    backgroundColor: '#7B39FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 90,
  },
  followBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  followingBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#7B39FD',
  },
  followingBtnText: {
    color: '#7B39FD',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    marginTop: 10,
    fontWeight: '500',
  },
});
