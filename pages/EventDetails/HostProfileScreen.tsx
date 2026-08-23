import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppSelector } from '@/store/hooks';
import { chatService } from '@/services/chatService';
import { userService } from '@/services/userService';
import { resolveImageUrl } from '@/services/apiClient';

const { width } = Dimensions.get('window');
const COVER_H = 220;
const AVATAR_D = 100;

const TAB_LABELS = ['Past Events', 'Reviews', 'About Host'];

export default function HostProfileScreen() {
  const params = useLocalSearchParams<{
    id?: string;
    name?: string;
    avatar?: string;
    role?: string;
    username?: string;
  }>();
  const hostId = params.id;

  const currentUser = useAppSelector((state) => state.auth?.user);
  const currentUserId = currentUser?.id || currentUser?._id;
  const isSelf = !!(hostId && currentUserId && hostId === currentUserId);

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [tab, setTab] = useState(0); 
  const [isFollowing, setIsFollowing] = useState(false);

  const loadProfile = async () => {
    if (!hostId) return;
    try {
      setLoading(true);
      const res = await userService.getHostProfile(hostId);
      setProfileData(res);
      setIsFollowing(res?.isFollowing ?? res?.host?.isFollowing ?? false);
    } catch (e) {
      console.warn('[HostProfileScreen] fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [hostId]);

  const handleFollowToggle = async () => {
    if (!hostId) return;
    try {
      if (isFollowing) {
        await userService.unfollowUser(hostId);
        setIsFollowing(false);
      } else {
        await userService.followUser(hostId);
        setIsFollowing(true);
      }
    } catch (e) {
      console.warn('Follow/Unfollow error:', e);
    }
  };

  const startChat = async () => {
    if (!hostId || !profileData) return;
    try {
      const thread = await chatService.createDirectThread(hostId);
      router.push({
        pathname: '/chat-detail',
        params: {
          id: thread.id,
          name: profileData.about?.name || profileData.host?.fullName || 'Host',
          image: profileData.about?.profilePictureUrl || '',
        },
      });
    } catch (err) {
      console.error('[HostProfileScreen] Failed to create direct chat thread:', err);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFAFA' }}>
        <ActivityIndicator size="large" color="#8E2DE2" />
      </View>
    );
  }

  const about = profileData?.about || {};
  const stats = profileData?.stats || {};
  const events = profileData?.events || {};
  const isHost = profileData?.user?.role === 'host' || profileData?.host?.role === 'host' || params.role === 'host' || about.role === 'host';
  const hostName =
    about.name ||
    profileData?.host?.name ||
    profileData?.host?.fullName ||
    profileData?.user?.fullName ||
    profileData?.user?.name ||
    params.name ||
    'User Profile';
  const hostAvatar =
    resolveImageUrl(
      about.profilePictureUrl ||
      profileData?.host?.profilePictureUrl ||
      profileData?.host?.avatarUrl ||
      profileData?.user?.profilePictureUrl ||
      params.avatar
    );
  const coverUri =
    resolveImageUrl(
      about.coverImageUrl ||
      profileData?.host?.coverImageUrl ||
      profileData?.user?.coverImageUrl
    ) || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800';
  const location =
    about.location ||
    about.contactDetails?.location ||
    profileData?.host?.location ||
    profileData?.user?.location ||
    '';
  const bio =
    about.bio ||
    profileData?.host?.bio ||
    profileData?.user?.bio ||
    '';
  const followersNum = stats.followersCount ?? profileData?.host?.followerCount ?? profileData?.user?.followerCount ?? 0;
  const followingNum = stats.followingCount ?? profileData?.host?.followingCount ?? profileData?.user?.followingCount ?? 0;

  const formatCount = (num: number) => {
    if (!num) return '0';
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1).replace('.0', '')}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}k`;
    return String(num);
  };

  const followersStr = formatCount(followersNum);
  const followingStr = formatCount(followingNum);

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={s.scrollContainer}>
        {/* COVER IMAGE */}
        <View style={s.coverWrap}>
          <Image
            source={{ uri: coverUri }}
            style={s.coverImg}
            resizeMode="cover"
          />
          <SafeAreaView style={StyleSheet.absoluteFill} edges={['top']} pointerEvents="box-none">
            <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color="#333" />
            </TouchableOpacity>
          </SafeAreaView>
        </View>

        {/* PROFILE BLOCK */}
        <View style={s.profileBlock}>
          <View style={s.avatarShadow}>
            {hostAvatar ? (
              <Image source={{ uri: hostAvatar }} style={s.avatarImg} />
            ) : (
              <View style={[s.avatarImg, { backgroundColor: '#E2D9F3', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={44} color="#8E2DE2" />
              </View>
            )}
          </View>

          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statNum}>{followersStr}</Text>
              <Text style={s.statLbl}>Followers</Text>
            </View>
            <View style={{ width: AVATAR_D + 24 }} />
            <View style={s.statItem}>
              <Text style={s.statNum}>{followingStr}</Text>
              <Text style={s.statLbl}>Following</Text>
            </View>
          </View>

          <Text style={s.hostName}>{hostName}</Text>

          {location ? (
            <View style={s.locRow}>
              <Ionicons name="location" size={14} color="#8E2DE2" style={{ marginRight: 4 }} />
              <Text style={s.locText}>{location}</Text>
            </View>
          ) : null}
        </View>

        {/* TABS */}
        <View style={s.tabBar}>
          {TAB_LABELS.map((label, i) => {
            const isActive = tab === i;
            return (
              <TouchableOpacity key={i} style={s.tabBtn} onPress={() => setTab(i)} activeOpacity={0.7}>
                <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>{label}</Text>
                {isActive && <View style={s.tabLine} />}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TAB CONTENT */}
        <View style={s.body}>
          {tab === 0 && <PastEventsContent events={events.past || []} isHost={isHost} />}
          {tab === 1 && (
            <ReviewsContent
              reviews={profileData?.reviews || []}
              photos={profileData?.photos || []}
            />
          )}
          {tab === 2 && <AboutHostContent bio={bio} profileData={profileData} isHost={isHost} location={location} startChat={startChat} />}
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      {!isSelf && (
        <View style={s.fabRow}>
          {tab === 0 ? (
            <TouchableOpacity style={[s.actionBtn, s.primaryBtn]} activeOpacity={0.88} onPress={handleFollowToggle}>
              <Ionicons name={isFollowing ? 'person-remove-outline' : 'person-add-outline'} size={20} color="#FFF" />
              <Text style={s.actionBtnText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[s.actionBtn, s.dangerBtn]} activeOpacity={0.88}>
              <Ionicons name="flag-outline" size={20} color="#FFF" />
              <Text style={s.actionBtnText}>Report</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

function PastEventsContent({ events, isHost }: { events: any[]; isHost?: boolean }) {
  if (!events || events.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Ionicons name="calendar-outline" size={40} color="#CCC" />
        <Text style={{ color: '#999', fontSize: 14, marginTop: 10 }}>
          {isHost ? 'No past events found' : 'No events hosted yet'}
        </Text>
      </View>
    );
  }
  return (
    <View style={s.tabContentContainer}>
      {events.map((ev) => {
        const coverUri =
          resolveImageUrl(ev.imageUrl || ev.coverImageUrl || (ev as any).eventPosterUrl) ||
          'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500';
        return (
          <TouchableOpacity
            key={ev.id}
            style={s.evCard}
            activeOpacity={0.88}
            onPress={() => router.push({ pathname: '/event-details', params: { id: ev.id } })}
          >
            <Image source={{ uri: coverUri }} style={s.evThumb} resizeMode="cover" />
            <View style={s.evInfo}>
              <View style={s.catBadge}>
                <Text style={s.catTxt}>{String(ev.category || 'NIGHTLIFE').toUpperCase()}</Text>
              </View>
              <Text style={s.evTitle}>{ev.title}</Text>
              <View style={s.evLocRow}>
                <Ionicons name="location" size={12} color="#8E2DE2" />
                <Text style={s.evLocTxt}>{ev.location || 'Lekki Ikata, Lagos'}</Text>
              </View>
              {ev.priceText && (
                <Text style={s.evPrice}>
                  {ev.priceText}
                  <Text style={s.evPriceSub}> /Person</Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ReviewsContent({ reviews, photos }: { reviews: any[]; photos?: string[] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Ionicons name="star-outline" size={40} color="#CCC" />
        <Text style={{ color: '#999', fontSize: 14, marginTop: 10 }}>No reviews yet</Text>
      </View>
    );
  }

  return (
    <View style={s.tabContentContainer}>
      {reviews.map((r) => {
        const rvAvatar = resolveImageUrl(r.avatar) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';
        return (
          <View key={r.id} style={s.reviewCard}>
            <Image source={{ uri: rvAvatar }} style={s.rvAvatar} />
            <View style={{ flex: 1 }}>
              <View style={s.rvTopRow}>
                <Text style={s.rvUser}>{r.username || r.reviewerName || 'Reviewer'}</Text>
                <MaterialCommunityIcons name="check-decagram" size={14} color="#8E2DE2" style={{ marginLeft: 4 }} />
                {r.time && <Text style={s.rvTime}> .{r.time}</Text>}
              </View>
              <Text style={s.rvBody}>{r.body || r.comment}</Text>
              <View style={s.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <FontAwesome key={i} name="star" size={14} color={i <= (r.rating ?? 5) ? '#FFA800' : '#CCC'} style={{ marginRight: 3 }} />
                ))}
                <Text style={s.ratingTxt}>{Number(r.rating || 5).toFixed(1)}</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Review Photos Grid (only if photos exist) */}
      {photos && photos.length > 0 && (
        <View style={s.photoGrid}>
          {photos.slice(0, 2).map((imgUri, idx) => (
            <Image key={idx} source={{ uri: resolveImageUrl(imgUri) || imgUri }} style={s.photoCell} resizeMode="cover" />
          ))}
        </View>
      )}
    </View>
  );
}

function AboutHostContent({
  bio,
  profileData,
  isHost,
  location,
  startChat,
}: {
  bio: string;
  profileData: any;
  isHost?: boolean;
  location?: string;
  startChat: () => void;
}) {
  const directions = profileData?.directions;
  const manager = profileData?.manager;
  const address = directions?.address || directions?.formattedAddress || location;
  const managerAvatar = resolveImageUrl(manager?.avatarUrl);

  return (
    <View style={s.tabContentContainer}>
      <View style={s.section}>
        <View style={s.sectionHdr}>
          <Text style={s.sectionTitle}>{isHost ? 'About Host' : 'About User'}</Text>
        </View>
        <Text style={s.aboutTxt}>{bio || (isHost ? 'Host & event organizer on VibezLink.' : 'Music and nightlife enthusiast on VibezLink.')}</Text>
      </View>

      {/* Manager (only rendered if host has real manager details) */}
      {manager && (
        <View style={s.section}>
          <Text style={s.sectionTitle}>Manager</Text>
          <View style={s.mgRow}>
            {managerAvatar ? (
              <Image source={{ uri: managerAvatar }} style={s.mgAvatar} />
            ) : (
              <View style={[s.mgAvatar, { backgroundColor: '#F0E6FF', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={22} color="#8E2DE2" />
              </View>
            )}
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.mgName}>{manager.name || 'Management'}</Text>
              <Text style={s.mgRole}>{manager.role || 'Manager'}</Text>
            </View>
            <View style={s.mgIconsRow}>
              <TouchableOpacity style={s.mgIcon} activeOpacity={0.75}>
                <Ionicons name="call" size={18} color="#8E2DE2" />
              </TouchableOpacity>
              <TouchableOpacity style={s.mgIcon} activeOpacity={0.75} onPress={startChat}>
                <Ionicons name="chatbox-ellipses" size={18} color="#8E2DE2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Directions (only rendered if address or directions exist) */}
      {address ? (
        <View style={s.section}>
          <View style={s.sectionHdr}>
            <Text style={s.sectionTitle}>Directions</Text>
            <TouchableOpacity activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={s.viewOnMapTxt}>View on Map</Text>
              <Ionicons name="chevron-forward-circle" size={14} color="#8E2DE2" style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <Image source={require('../../assets/images/staticMap.png')} style={s.mapImg} resizeMode="cover" />
          <View style={s.addrPill}>
            <Text style={s.addrTxt}>{address}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { paddingBottom: 120 },
  coverWrap: { height: COVER_H, position: 'relative' },
  coverImg: { width: '100%', height: '100%' },
  backBtn: {
    marginTop: 16,
    marginLeft: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileBlock: {
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingBottom: 22,
    marginTop: -(AVATAR_D / 2),
    marginHorizontal: 16,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  avatarShadow: {
    width: AVATAR_D,
    height: AVATAR_D,
    borderRadius: AVATAR_D / 2,
    borderWidth: 4,
    borderColor: '#FFF',
    overflow: 'hidden',
    backgroundColor: '#EEE',
    elevation: 6,
  },
  avatarImg: { width: '100%', height: '100%' },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: -38,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '900', color: '#111' },
  statLbl: { fontSize: 13, color: '#888', marginTop: 2, fontWeight: '500' },
  hostName: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', marginTop: 18, textAlign: 'center' },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locText: { fontSize: 14, color: '#777', fontWeight: '500' },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'transparent',
    marginTop: 20,
    marginHorizontal: 16,
    paddingVertical: 10,
  },
  tabBtn: { alignItems: 'center', flex: 1 },
  tabTxt: { fontSize: 14, color: '#777', fontWeight: '600' },
  tabTxtActive: { color: '#8E2DE2', fontWeight: '800' },
  tabLine: { width: 50, height: 3, backgroundColor: '#8E2DE2', borderRadius: 2, marginTop: 8 },
  body: { marginTop: 12 },
  tabContentContainer: { paddingHorizontal: 16 },
  evCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  evThumb: { width: 110, height: 110, borderRadius: 16 },
  evInfo: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  catBadge: {
    backgroundColor: '#000',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  catTxt: { color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  evTitle: { fontSize: 16, fontWeight: '900', color: '#111', marginBottom: 4 },
  evLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  evLocTxt: { fontSize: 12, color: '#888', marginLeft: 4, fontWeight: '500' },
  evPrice: { fontSize: 15, fontWeight: '900', color: '#8E2DE2', marginTop: 2 },
  evPriceSub: { fontSize: 12, color: '#888', fontWeight: '400' },
  reviewCard: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    flexDirection: 'row',
    marginBottom: 6,
  },
  rvAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  rvTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  rvUser: { fontSize: 14, fontWeight: '800', color: '#111' },
  rvTime: { fontSize: 12, color: '#888' },
  rvBody: { fontSize: 13, color: '#444', lineHeight: 19, marginBottom: 6 },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  ratingTxt: { fontSize: 13, color: '#888', fontWeight: '600', marginLeft: 6 },
  photoGrid: { flexDirection: 'row', gap: 12, marginTop: 12, marginBottom: 20 },
  photoCell: { flex: 1, height: 140, borderRadius: 18 },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  sectionHdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '900', color: '#111' },
  readMoreTxt: { fontSize: 13, color: '#888', fontWeight: '600', marginRight: 2 },
  viewOnMapTxt: { fontSize: 13, color: '#8E2DE2', fontWeight: '700' },
  aboutTxt: { fontSize: 14, color: '#666', lineHeight: 22 },
  mgRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  mgAvatar: { width: 48, height: 48, borderRadius: 24 },
  mgName: { fontSize: 15, fontWeight: '800', color: '#111' },
  mgRole: { fontSize: 12, color: '#888', marginTop: 2 },
  mgIconsRow: { flexDirection: 'row', gap: 10 },
  mgIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F5EBFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImg: { width: '100%', height: 160, borderRadius: 16, marginBottom: 12 },
  addrPill: { backgroundColor: '#F8F6FF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, alignSelf: 'flex-start' },
  addrTxt: { fontSize: 12, color: '#7B2CBF', fontWeight: '600' },
  fabRow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    paddingTop: 12,
    backgroundColor: 'rgba(250, 250, 250, 0.92)',
  },
  actionBtn: {
    width: '100%',
    borderRadius: 30,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    elevation: 4,
    shadowColor: '#8E2DE2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  primaryBtn: { backgroundColor: '#7B2CBF' },
  dangerBtn: { backgroundColor: '#FF0055' },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
});
