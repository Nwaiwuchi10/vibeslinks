import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { userService } from '@/services/userService';
import { chatService } from '@/services/chatService';
import { resolveImageUrl } from '@/services/apiClient';
import { useAppSelector } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

const { width } = Dimensions.get('window');
const POST_ITEM_SIZE = (width - 48) / 3;

export default function UserProfileScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    avatar?: string;
    username?: string;
  }>();

  const userId = params.id;
  const currentUser = useAppSelector((state) => state.auth?.user);
  const currentUserId = currentUser?.id || (currentUser as any)?._id;
  const isSelf = !!(userId && currentUserId && String(userId) === String(currentUserId));

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'posts' | 'about'>('posts');
  const [posts, setPosts] = useState<any[]>([]);

  const loadUserProfile = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await userService.getHostProfile(userId);
      const userObj = res?.user || res?.host || res?.about || res;
      setProfile(userObj);
      setIsFollowing(res?.isFollowing ?? userObj?.isFollowing ?? false);
      if (Array.isArray(res?.posts)) {
        setPosts(res.posts);
      } else if (Array.isArray(userObj?.posts)) {
        setPosts(userObj.posts);
      }
    } catch (err) {
      console.warn('[UserProfileScreen] Failed to load user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSelf) {
      router.replace('/(tabs)/profile');
      return;
    }
    loadUserProfile();
  }, [userId, isSelf]);

  const handleFollowToggle = async () => {
    if (!userId) return;
    try {
      if (isFollowing) {
        await userService.unfollowUser(userId);
        setIsFollowing(false);
        if (profile) {
          setProfile((p: any) => ({
            ...p,
            followerCount: Math.max(0, (p.followerCount || 1) - 1),
          }));
        }
      } else {
        await userService.followUser(userId);
        setIsFollowing(true);
        if (profile) {
          setProfile((p: any) => ({
            ...p,
            followerCount: (p.followerCount || 0) + 1,
          }));
        }
      }
    } catch (err) {
      console.warn('Follow toggle error:', err);
    }
  };

  const handleMessageUser = async () => {
    if (!userId) return;
    try {
      const thread = await chatService.createDirectThread(userId);
      router.push({
        pathname: '/chat-detail',
        params: {
          id: thread.id,
          name: displayName,
          image: avatarUrl || '',
        },
      });
    } catch (err) {
      console.error('[UserProfileScreen] Failed to create chat:', err);
      store.dispatch(showToast({ type: 'error', message: 'Could not open chat.' }));
    }
  };

  const handleShareProfile = async () => {
    try {
      await Share.share({
        message: `Check out ${displayName}'s profile on VibezLink!`,
      });
    } catch {}
  };

  const rawName = profile?.name || profile?.fullName || params.name || 'User';
  const displayName = rawName;
  const username = profile?.username || params.username || displayName.toLowerCase().replace(/\s+/g, '');
  const avatarUrl = resolveImageUrl(
    profile?.profilePictureUrl ||
    profile?.avatarUrl ||
    profile?.profilePicture ||
    profile?.avatar ||
    params.avatar ||
    null
  );
  const bio = profile?.bio || profile?.about || 'VibezLink member';
  const location = profile?.location || profile?.city || profile?.country || 'Earth';
  const followersCount = profile?.followerCount ?? profile?.followers ?? profile?.followersCount ?? 0;
  const followingCount = profile?.followingCount ?? profile?.following ?? 0;
  const postsCount = posts.length || profile?.postsCount || 0;

  const isHostRole = profile?.role === 'host' || profile?.isHost === true;

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer} edges={['top']}>
        <ActivityIndicator size="large" color="#8E2DE2" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A2E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          @{username}
        </Text>
        <TouchableOpacity style={styles.shareBtn} onPress={handleShareProfile}>
          <Ionicons name="share-outline" size={20} color="#1A1A2E" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarRow}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Ionicons name="person" size={44} color="#888" />
              </View>
            )}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{postsCount}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {followersCount >= 1000 ? `${(followersCount / 1000).toFixed(1)}k` : followersCount}
                </Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {followingCount >= 1000 ? `${(followingCount / 1000).toFixed(1)}k` : followingCount}
                </Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>

          {/* User Bio & Details */}
          <Text style={styles.nameText}>{displayName}</Text>
          <Text style={styles.usernameText}>@{username}</Text>
          <Text style={styles.bioText}>{bio}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#666" />
            <Text style={styles.locationText}>{location}</Text>
          </View>

          {/* If they are a host, show Host Profile Link */}
          {isHostRole && (
            <TouchableOpacity
              style={styles.hostBanner}
              onPress={() =>
                router.push({
                  pathname: '/host-profile',
                  params: { id: userId, name: displayName, avatar: avatarUrl || undefined },
                })
              }
            >
              <MaterialCommunityIcons name="star-circle" size={20} color="#8E2DE2" />
              <Text style={styles.hostBannerText}>View Verified Host Account</Text>
              <Ionicons name="chevron-forward" size={16} color="#8E2DE2" />
            </TouchableOpacity>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsRow}>
            <TouchableOpacity
              style={[styles.followBtn, isFollowing && styles.followingBtn]}
              onPress={handleFollowToggle}
              activeOpacity={0.85}
            >
              <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.messageBtn} onPress={handleMessageUser} activeOpacity={0.85}>
              <Ionicons name="chatbubble-ellipses-outline" size={18} color="#1A1A2E" />
              <Text style={styles.messageBtnText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabsHeader}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'posts' && styles.tabButtonActive]}
            onPress={() => setActiveTab('posts')}
          >
            <Ionicons
              name="grid-outline"
              size={18}
              color={activeTab === 'posts' ? '#8E2DE2' : '#888'}
            />
            <Text style={[styles.tabText, activeTab === 'posts' && styles.tabTextActive]}>
              Posts
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'about' && styles.tabButtonActive]}
            onPress={() => setActiveTab('about')}
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={activeTab === 'about' ? '#8E2DE2' : '#888'}
            />
            <Text style={[styles.tabText, activeTab === 'about' && styles.tabTextActive]}>
              About
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Contents */}
        {activeTab === 'posts' && (
          <View style={styles.postsSection}>
            {posts.length > 0 ? (
              <View style={styles.postsGrid}>
                {posts.map((post: any, idx: number) => {
                  const media = resolveImageUrl(
                    post.imageUrl || post.mediaUrl || post.mediaUrls?.[0] || null
                  );
                  return (
                    <TouchableOpacity
                      key={post.id || idx}
                      style={styles.postGridItem}
                      onPress={() =>
                        post.id &&
                        router.push({ pathname: '/post-details', params: { id: post.id } })
                      }
                    >
                      {media ? (
                        <Image source={{ uri: media }} style={styles.postThumb} />
                      ) : (
                        <View style={styles.postThumbPlaceholder}>
                          <Text style={styles.postThumbText} numberOfLines={3}>
                            {post.content || post.caption || 'Post'}
                          </Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ) : (
              <View style={styles.emptyPostsBox}>
                <Ionicons name="images-outline" size={48} color="#CCC" />
                <Text style={styles.emptyPostsTitle}>No Posts Yet</Text>
                <Text style={styles.emptyPostsSub}>
                  {displayName} hasn't published any posts yet.
                </Text>
              </View>
            )}
          </View>
        )}

        {activeTab === 'about' && (
          <View style={styles.aboutSection}>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutSectionTitle}>Member Details</Text>
              <View style={styles.aboutRow}>
                <Ionicons name="person-outline" size={18} color="#8E2DE2" />
                <Text style={styles.aboutRowLabel}>Role:</Text>
                <Text style={styles.aboutRowVal}>
                  {isHostRole ? 'Host / Creator' : 'Member'}
                </Text>
              </View>
              <View style={styles.aboutRow}>
                <Ionicons name="location-outline" size={18} color="#8E2DE2" />
                <Text style={styles.aboutRowLabel}>Location:</Text>
                <Text style={styles.aboutRowVal}>{location}</Text>
              </View>
              <View style={styles.aboutRow}>
                <Ionicons name="calendar-outline" size={18} color="#8E2DE2" />
                <Text style={styles.aboutRowLabel}>Joined:</Text>
                <Text style={styles.aboutRowVal}>
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })
                    : 'Recently'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'android' ? 12 : 8,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: '#8E2DE2',
  },
  avatarPlaceholder: {
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#DDD',
  },
  statsContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  statLabel: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
  },
  usernameText: {
    fontSize: 13,
    color: '#8E2DE2',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 6,
  },
  bioText: {
    fontSize: 14,
    color: '#444',
    lineHeight: 20,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  hostBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F2FF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  hostBannerText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#8E2DE2',
    marginLeft: 8,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  followBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#8E2DE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: '#FFF',
    borderWidth: 1.5,
    borderColor: '#8E2DE2',
  },
  followBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  followingBtnText: {
    color: '#8E2DE2',
  },
  messageBtn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  messageBtnText: {
    color: '#1A1A2E',
    fontSize: 14,
    fontWeight: '700',
  },
  tabsHeader: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginTop: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    borderBottomColor: '#8E2DE2',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  tabTextActive: {
    color: '#8E2DE2',
    fontWeight: '700',
  },
  postsSection: {
    padding: 16,
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  postGridItem: {
    width: POST_ITEM_SIZE,
    height: POST_ITEM_SIZE,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
  },
  postThumb: {
    width: '100%',
    height: '100%',
  },
  postThumbPlaceholder: {
    width: '100%',
    height: '100%',
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F0FA',
  },
  postThumbText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  emptyPostsBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyPostsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 10,
  },
  emptyPostsSub: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  aboutSection: {
    padding: 16,
  },
  aboutCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  aboutSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F8F8F8',
  },
  aboutRowLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
    marginLeft: 8,
    width: 80,
  },
  aboutRowVal: {
    fontSize: 13,
    color: '#1A1A2E',
    fontWeight: '600',
    flex: 1,
  },
});
