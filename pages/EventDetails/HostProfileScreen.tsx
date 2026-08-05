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

const { width } = Dimensions.get('window');
const COVER_H = 220;
const AVATAR_D = 100;

const TAB_LABELS = ['Past Events', 'Reviews', 'About Host'];

export default function HostProfileScreen() {
  const params = useLocalSearchParams<{ id?: string; name?: string; avatar?: string }>();
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
      setIsFollowing(res?.host?.isFollowing ?? false);
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
  const hostName = about.name || profileData?.host?.fullName || params.name || 'Host';
  const hostAvatar = about.profilePictureUrl || params.avatar || 'https://i.pravatar.cc/150?img=33';
  const location = about.contactDetails?.location || about.location || 'Lekki, Lagos Nigeria';
  const bio = about.bio || 'Experience one of the biggest Afrobeat festivals featuring top DJs, live performances, VIP experiences, and unforgettable nightlife energy.';

  return (
    <View style={s.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false} contentContainerStyle={s.scrollContainer}>
        {/* COVER IMAGE */}
        <View style={s.coverWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800' }}
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
            <Image source={{ uri: hostAvatar }} style={s.avatarImg} />
          </View>

          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Text style={s.statNum}>{Number(stats.followersCount || 0).toLocaleString()}</Text>
              <Text style={s.statLbl}>Followers</Text>
            </View>
            <View style={{ width: AVATAR_D + 24 }} />
            <View style={s.statItem}>
              <Text style={s.statNum}>{Number(stats.followingCount || 0).toLocaleString()}</Text>
              <Text style={s.statLbl}>Following</Text>
            </View>
          </View>

          <Text style={s.hostName}>{hostName}</Text>

          <View style={s.locRow}>
            <Ionicons name="location" size={14} color="#8E2DE2" style={{ marginRight: 4 }} />
            <Text style={s.locText}>{location}</Text>
          </View>
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
          {tab === 0 && <PastEventsContent events={events.past || []} />}
          {tab === 1 && <ReviewsContent reviews={profileData?.reviews || []} summary={profileData?.reviewSummary} />}
          {tab === 2 && <AboutHostContent bio={bio} profileData={profileData} />}
        </View>
      </ScrollView>

      {/* FLOATING ACTION BUTTON */}
      {!isSelf && (
        <View style={s.fabRow}>
          {tab === 0 ? (
            <TouchableOpacity style={[s.actionBtn, s.primaryBtn]} activeOpacity={0.85} onPress={handleFollowToggle}>
              <Ionicons name={isFollowing ? 'person-remove-outline' : 'person-add-outline'} size={20} color="#FFF" />
              <Text style={s.actionBtnText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={[s.actionBtn, s.dangerBtn]} activeOpacity={0.85}>
              <Ionicons name="flag-outline" size={20} color="#FFF" />
              <Text style={s.actionBtnText}>Report</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={[s.actionBtn, s.chatBtn]} activeOpacity={0.85} onPress={startChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#FFF" />
            <Text style={s.actionBtnText}>Message</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function PastEventsContent({ events }: { events: any[] }) {
  if (events.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Text style={{ color: '#999', fontSize: 14 }}>No past events found</Text>
      </View>
    );
  }
  return (
    <View style={s.tabContentContainer}>
      {events.map((ev) => {
        const coverUri = ev.imageUrl || ev.coverImageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500';
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
                <Text style={s.catTxt}>{String(ev.category || 'Nightlife').toUpperCase()}</Text>
              </View>
              <Text style={s.evTitle}>{ev.title}</Text>
              <View style={s.evLocRow}>
                <Ionicons name="location" size={12} color="#8E2DE2" />
                <Text style={s.evLocTxt}>{ev.location || 'Lekki, Lagos'}</Text>
              </View>
              {ev.priceText && (
                <Text style={s.evPrice}>
                  {ev.priceText}
                  <Text style={s.evPriceSub}>/Person</Text>
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function ReviewsContent({ reviews, summary }: { reviews: any[]; summary: any }) {
  const avg = summary?.averageRating ?? 0;
  const count = summary?.totalReviews ?? 0;

  if (reviews.length === 0) {
    return (
      <View style={{ alignItems: 'center', paddingVertical: 40 }}>
        <Ionicons name="star-outline" size={40} color="#CCC" />
        <Text style={{ color: '#999', fontSize: 14, marginTop: 10 }}>No reviews yet</Text>
      </View>
    );
  }

  return (
    <View style={s.tabContentContainer}>
      {reviews.map((r) => (
        <View key={r.id} style={s.reviewRow}>
          <Image source={{ uri: r.avatar || 'https://i.pravatar.cc/150?img=20' }} style={s.rvAvatar} />
          <View style={{ flex: 1 }}>
            <View style={s.rvTopRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={s.rvUser}>{r.username || 'User'}</Text>
                <MaterialCommunityIcons name="check-decagram" size={14} color="#8E2DE2" style={{ marginLeft: 4 }} />
                {r.time && <Text style={s.rvTime}> . {r.time}</Text>}
              </View>
            </View>
            <Text style={s.rvBody}>{r.body}</Text>
            <View style={s.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <FontAwesome key={i} name="star" size={14} color={i <= (r.rating ?? 5) ? '#FFA800' : '#CCC'} style={{ marginRight: 2 }} />
              ))}
              <Text style={s.ratingTxt}>{Number(r.rating || 5).toFixed(1)}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function AboutHostContent({ bio, profileData }: { bio: string; profileData: any }) {
  const directions = profileData?.directions || {};
  const manager = profileData?.manager || { name: 'Vibez Nation', avatarUrl: 'https://i.pravatar.cc/150?img=10' };
  const address = directions.address || directions.formattedAddress || 'Jegede Tayo No 4 Ibeju Lekki Lagos Nigeria';

  return (
    <View style={s.tabContentContainer}>
      <View style={s.section}>
        <View style={s.sectionHdr}>
          <Text style={s.sectionTitle}>About Host</Text>
        </View>
        <Text style={s.aboutTxt}>{bio}</Text>
      </View>

      <View style={s.section}>
        <Text style={s.sectionTitle}>Manager</Text>
        <View style={s.mgRow}>
          <Image source={{ uri: manager.avatarUrl }} style={s.mgAvatar} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.mgName}>{manager.name}</Text>
            <Text style={s.mgRole}>Manager</Text>
          </View>
        </View>
      </View>

      <View style={s.section}>
        <View style={s.sectionHdr}>
          <Text style={s.sectionTitle}>Directions</Text>
        </View>
        <Image source={require('../../assets/images/staticMap.png')} style={s.mapImg} resizeMode="cover" />
        <Text style={s.addrTxt}>{address}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContainer: { paddingBottom: 150 },
  coverWrap: { height: COVER_H, position: 'relative' },
  coverImg: { width: '100%', height: '100%' },
  backBtn: { marginTop: 16, marginLeft: 16, width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 3 },
  profileBlock: { backgroundColor: '#FFF', alignItems: 'center', paddingBottom: 20, marginTop: -(AVATAR_D / 2), marginHorizontal: 16, borderRadius: 24, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12 },
  avatarShadow: { width: AVATAR_D, height: AVATAR_D, borderRadius: AVATAR_D / 2, borderWidth: 4, borderColor: '#FFF', overflow: 'hidden', backgroundColor: '#CCC', elevation: 6 },
  avatarImg: { width: '100%', height: '100%' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', paddingHorizontal: 20, marginTop: -35 },
  statItem: { flex: 1, alignItems: 'center' },
  statNum: { fontSize: 20, fontWeight: '900', color: '#111' },
  statLbl: { fontSize: 12, color: '#888', marginTop: 2, fontWeight: '500' },
  hostName: { fontSize: 22, fontWeight: '900', color: '#111', marginTop: 15 },
  locRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  locText: { fontSize: 13, color: '#888', fontWeight: '500' },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF', marginTop: 16, marginHorizontal: 16, borderRadius: 16, paddingVertical: 14, elevation: 2 },
  tabBtn: { alignItems: 'center', flex: 1 },
  tabTxt: { fontSize: 14, color: '#888', fontWeight: '600' },
  tabTxtActive: { color: '#8E2DE2', fontWeight: '800' },
  tabLine: { width: 24, height: 3, backgroundColor: '#8E2DE2', borderRadius: 2, marginTop: 6 },
  body: { marginTop: 16 },
  tabContentContainer: { paddingHorizontal: 16 },
  evCard: { backgroundColor: '#FFF', borderRadius: 20, marginBottom: 16, padding: 12, flexDirection: 'row', elevation: 2 },
  evThumb: { width: 100, height: 100, borderRadius: 16 },
  evInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  catBadge: { backgroundColor: '#111', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 6 },
  catTxt: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  evTitle: { fontSize: 16, fontWeight: '800', color: '#111', marginBottom: 4 },
  evLocRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  evLocTxt: { fontSize: 12, color: '#888', marginLeft: 4 },
  evPrice: { fontSize: 14, fontWeight: '800', color: '#8E2DE2' },
  evPriceSub: { fontSize: 11, color: '#888', fontWeight: '400' },
  reviewRow: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, flexDirection: 'row', marginBottom: 12, elevation: 2 },
  rvAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  rvTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  rvUser: { fontSize: 14, fontWeight: '800', color: '#111' },
  rvTime: { fontSize: 12, color: '#888' },
  rvBody: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 8 },
  starsRow: { flexDirection: 'row', alignItems: 'center' },
  ratingTxt: { fontSize: 12, color: '#888', fontWeight: '600', marginLeft: 6 },
  photoGrid: { flexDirection: 'row', gap: 12, marginTop: 8, marginBottom: 20 },
  photoCell: { flex: 1, height: 120, borderRadius: 16 },
  section: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 16, elevation: 2 },
  sectionHdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: '#111', marginBottom: 12 },
  readMoreRow: { flexDirection: 'row', alignItems: 'center' },
  readMoreTxt: { fontSize: 12, color: '#888', fontWeight: '600' },
  aboutTxt: { fontSize: 14, color: '#666', lineHeight: 22 },
  mgRow: { flexDirection: 'row', alignItems: 'center' },
  mgAvatar: { width: 44, height: 44, borderRadius: 22 },
  mgName: { fontSize: 15, fontWeight: '700', color: '#111' },
  mgRole: { fontSize: 12, color: '#888' },
  mgIconsRow: { flexDirection: 'row', gap: 10 },
  mgIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  mapImg: { width: '100%', height: 150, borderRadius: 16, marginBottom: 12 },
  addrTxt: { fontSize: 13, color: '#888', fontWeight: '500', lineHeight: 18 },
  fabRow: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: Platform.OS === 'ios' ? 34 : 20, paddingTop: 12, flexDirection: 'row', gap: 12, backgroundColor: 'rgba(255, 255, 255, 0.85)' },
  actionBtn: { flex: 1, borderRadius: 28, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 4 },
  primaryBtn: { backgroundColor: '#8E2DE2' },
  dangerBtn: { backgroundColor: '#FF0F6C' },
  chatBtn: { backgroundColor: '#000' },
  actionBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
