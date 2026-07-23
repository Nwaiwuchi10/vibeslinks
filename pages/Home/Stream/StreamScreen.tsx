import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { liveStreamService } from '@/services/liveStreamService';
import { homeService } from '@/services/homeService';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: '1', name: 'Go Live', icon: 'video', color: '#8E2DE2' },
  { id: '5', name: 'Create Post', icon: 'pencil-box-multiple', color: '#7B2FFF' },
  { id: '6', name: 'Add Story', icon: 'circle-slice-8', color: '#FF6B35' },
  { id: '2', name: 'Create Event', icon: 'file-document', color: '#0082FF' },
  { id: '3', name: 'Radio FM', icon: 'microphone-variant', color: '#6BB100' },
  { id: '4', name: 'Watch Stream', icon: 'television-play', color: '#FF006B' },
];

const StreamScreen = ({ onBack, onCreateEventPress }: { onBack: () => void, onCreateEventPress: () => void }) => {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [advert, setAdvert] = useState<any>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const [feedData, adverts] = await Promise.allSettled([
          liveStreamService.getWatchFeed(),
          homeService.getAdverts(),
        ]);
        if (feedData.status === 'fulfilled') {
          const items = Array.isArray(feedData.value)
            ? feedData.value
            : feedData.value?.items || feedData.value?.streams || [];
          setFeed(items);
        }
        if (adverts.status === 'fulfilled' && (adverts.value as any[]).length > 0) {
          setAdvert((adverts.value as any[])[0]);
        }
      } catch (error) {
        console.error('Failed to fetch stream feed:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const displayFeed = feed;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stream</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialCommunityIcons name="file-document-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Quick Actions Scroll Horizontal */}
        <View style={{ marginBottom: 25 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.actionsScrollContainer}
          >
            {QUICK_ACTIONS.map((action) => (
              <View key={action.id} style={styles.actionItem}>
                <TouchableOpacity 
                  style={[styles.actionCircle, { backgroundColor: action.color }]}
                  onPress={() => {
                    if (action.id === '1') router.push('/go-live');
                    else if (action.id === '2') onCreateEventPress();
                    else if (action.id === '3') router.push('/radio');
                    else if (action.id === '4') router.push('/watch-stream');
                    else if (action.id === '5') router.push('/create-post');
                    else if (action.id === '6') router.push('/add-story');
                  }}
                >
                  <MaterialCommunityIcons name={action.icon as any} size={28} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.actionName}>{action.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Ad Banner */}
        <TouchableOpacity
          style={styles.adBanner}
          onPress={() => advert?.id && router.push({ pathname: '/event-details', params: { id: advert.id } })}
        >
          <Image 
            source={{ uri: advert?.imageUrl || advert?.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000' }} 
            style={styles.adImage} 
          />
          <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.adOverlay}>
            <View style={styles.adHeader}>
              <View style={styles.adBadge}><Text style={styles.adBadgeText}>{((advert?.category || 'NIGHTLIFE') as string).toUpperCase()}</Text></View>
              <View style={styles.adSmallBadge}><Text style={styles.adSmallBadgeText}>Ad</Text></View>
            </View>
            <View style={styles.adFooter}>
              <Text style={styles.adTitle}>{advert?.title || 'Worship De King'} <Ionicons name="arrow-forward-circle" size={16} /></Text>
              <Text style={styles.adPrice}>{advert?.price ? `₦${Number(advert.price).toLocaleString()}` : '₦15,000'}</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Feed */}
        {loading ? (
          <ActivityIndicator size="large" color="#8E2DE2" style={{ marginTop: 40 }} />
        ) : displayFeed.length === 0 ? (
          <View style={{ paddingVertical: 40, alignItems: 'center' }}>
            <MaterialCommunityIcons name="television-off" size={48} color="#DDD" />
            <Text style={{ color: '#999', marginTop: 12, fontSize: 14 }}>No live streams available right now</Text>
          </View>
        ) : (
          displayFeed.map((post: any, index: number) => {
            const coverUri = post.coverUrl || post.thumbnailUrl || post.imageUrl;
            const avatar = post.creator?.profilePictureUrl || post.hostAvatar || post.creatorAvatarUrl || `https://i.pravatar.cc/100?img=${index + 10}`;
            const name = post.creator?.name || post.creatorName || post.hostName || post.user || 'Creator';
            const viewers = post.viewerCount ?? post.likes ?? 0;
            const isPaid = post.ticketPrice > 0 || post.type === 'Paid';
            return (
              <TouchableOpacity
                key={post.id || index}
                style={styles.feedCard}
                activeOpacity={0.92}
                onPress={() => post.id && router.push({ pathname: '/watch-stream', params: { id: post.id } })}
              >
                {coverUri ? (
                  <Image source={{ uri: coverUri }} style={styles.feedImage} />
                ) : (
                  <Image source={require('../../../assets/images/artist_event.png')} style={styles.feedImage} />
                )}
                <View style={styles.cardHeader}>
                  <View style={styles.userInfo}>
                    <Image source={{ uri: avatar }} style={styles.userAvatar} />
                    <Text style={styles.userName}>{name}</Text>
                    <View style={styles.likeInfo}>
                      <Ionicons name="eye" size={12} color="#FFF" />
                      <Text style={styles.likeText}>{typeof viewers === 'number' ? viewers.toLocaleString() : viewers}</Text>
                    </View>
                  </View>
                  <View style={[styles.typeBadge, { backgroundColor: isPaid ? '#8E2DE2' : '#7F36FF' }]}>
                    <Text style={styles.typeText}>{isPaid ? 'Paid' : 'Free'}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default StreamScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  headerRight: { flexDirection: 'row' },
  iconBtn: { marginLeft: 15, width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  actionsScrollContainer: { gap: 16, paddingRight: 20 },
  actionItem: { alignItems: 'center', width: 72 },
  actionCircle: { width: 68, height: 68, borderRadius: 34, justifyContent: 'center', alignItems: 'center', elevation: 3 },
  actionName: { fontSize: 11, color: '#333', fontWeight: '700', marginTop: 10 },
  adBanner: { width: '100%', height: 160, borderRadius: 20, overflow: 'hidden', marginBottom: 25 },
  adImage: { ...StyleSheet.absoluteFillObject },
  adOverlay: { flex: 1, padding: 15, justifyContent: 'space-between' },
  adHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  adBadge: { backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  adBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  adSmallBadge: { backgroundColor: 'rgba(255,255,255,0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  adSmallBadgeText: { fontSize: 8, fontWeight: '700', color: '#000' },
  adFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adTitle: { color: '#FFF', fontWeight: '700', fontSize: 15 },
  adPrice: { color: '#FFF', fontWeight: '800', fontSize: 18 },
  feedCard: { width: '100%', height: 420, borderRadius: 30, overflow: 'hidden', marginBottom: 20, backgroundColor: '#EEE' },
  feedImage: { ...StyleSheet.absoluteFillObject },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 20 },
  userInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 25 },
  userAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8 },
  userName: { color: '#FFF', fontWeight: '700', fontSize: 13, marginRight: 8 },
  likeInfo: { flexDirection: 'row', alignItems: 'center' },
  likeText: { color: '#FFF', fontSize: 11, marginLeft: 4, fontWeight: '600' },
  typeBadge: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20 },
  typeText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
});
