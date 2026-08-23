import { eventService } from '@/services/eventService';
import { liveStreamService } from '@/services/liveStreamService';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import AdsBanner from '@/components/AdsBanner';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DiscoverHomeScreen = ({
  onSearchPress,
  onFilterPress,
  onAiPress,
  activeFilters,
  onUpdateFilters,
}: {
  onSearchPress: () => void;
  onFilterPress: () => void;
  onAiPress: () => void;
  activeFilters: { category: string; range: string };
  onUpdateFilters: (f: { category: string; range: string }) => void;
}) => {
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android'
    ? (StatusBar.currentHeight ?? insets.top ?? 24)
    : insets.top;
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredEvent, setFeaturedEvent] = useState<any>(null);
  const [liveStreams, setLiveStreams] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [opts, recommended, liveData] = await Promise.allSettled([
          eventService.getCreateEventOptions(),
          eventService.getRecommendedEvents(),
          liveStreamService.getWatchFeed({ limit: 4 }),
        ]);

        if (opts.status === 'fulfilled' && opts.value?.categories) {
          const cats = [
            { id: 'all', name: 'All' },
            ...opts.value.categories.map((c: any) => ({
              id: c.value || c.id || c,
              name: c.label || c.name || c,
            })),
          ];
          setCategories(cats);
        } else {
          setCategories([
            { id: 'all', name: 'All' },
            { id: 'amapiano', name: 'Amapiano' },
            { id: 'edm', name: 'EDM' },
            { id: 'festivals', name: 'Festivals' },
          ]);
        }

        const recCards: any[] = recommended.status === 'fulfilled'
          ? (recommended.value?.cards || recommended.value?.items || [])
          : [];
        if (recCards.length) {
          setFeaturedEvent(recCards[0]);
          setEvents(recCards.slice(1, 7));
        }

        const liveItems: any[] = liveData.status === 'fulfilled'
          ? (Array.isArray(liveData.value) ? liveData.value : liveData.value?.items || [])
          : [];
        setLiveStreams(liveItems.slice(0, 4));
      } catch (err) {
        console.warn('[DiscoverHomeScreen] fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredEvents = events.filter((e: any) => {
    // Category filter
    const matchesCategory =
      activeFilters.category === 'All' ||
      (e.category || '').toLowerCase() === activeFilters.category.toLowerCase();

    // Date range filter
    if (!matchesCategory) return false;
    if (activeFilters.range === 'all') return true;

    const startsAt = e.startsAt ? new Date(e.startsAt) : null;
    if (!startsAt) return false;

    const now = new Date();
    if (activeFilters.range === 'today') {
      return startsAt.toDateString() === now.toDateString();
    } else if (activeFilters.range === 'thisMonth') {
      return startsAt.getMonth() === now.getMonth() && startsAt.getFullYear() === now.getFullYear();
    } else if (activeFilters.range === 'lastMonth') {
      const lastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      return startsAt.getMonth() === lastMonth && startsAt.getFullYear() === year;
    }
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: statusBarHeight }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchBar} onPress={onSearchPress}>
          <Ionicons name="search-outline" size={20} color="#666" />
          <Text style={styles.searchText}>Search events, artists, venues...</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress}>
          <Ionicons name="options" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.categorySection}>
        <Text style={styles.categoryText}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catChip,
                activeFilters.category.toLowerCase() === cat.name.toLowerCase() && styles.catChipActive,
              ]}
              onPress={() => onUpdateFilters({ ...activeFilters, category: cat.name })}
            >
              <Text
                style={[
                  styles.catName,
                  activeFilters.category.toLowerCase() === cat.name.toLowerCase() && styles.catNameActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <AdsBanner paddingHorizontal={0} />

          {/* Featured Event Card */}
          {featuredEvent && (
            <View style={styles.majorEventCard}>
              <Image
                source={featuredEvent.imageUrl || featuredEvent.coverImageUrl
                  ? { uri: featuredEvent.imageUrl || featuredEvent.coverImageUrl }
                  : require('../../assets/images/dav.png')}
                style={styles.majorImage}
              />
              <TouchableOpacity style={styles.aiBtnFloat} onPress={onAiPress}>
                <MaterialCommunityIcons name="auto-fix" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addBtnFloat}
                onPress={() => featuredEvent.id && router.push({ pathname: '/event-details', params: { id: featuredEvent.id } })}
              >
                <Ionicons name="arrow-forward" size={20} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.majorContent}>
                <Text style={styles.majorTitle}>{featuredEvent.title || 'Featured Event'}</Text>
                <View style={styles.majorRow}>
                  {featuredEvent.location && (
                    <View style={styles.majorInfo}><Ionicons name="location" size={14} color="#8E2DE2" /><Text style={styles.majorInfoText}>{featuredEvent.location}</Text></View>
                  )}
                  {featuredEvent.dateTimeText && (
                    <View style={styles.majorInfo}><Ionicons name="calendar" size={14} color="#8E2DE2" /><Text style={styles.majorInfoText}>{featuredEvent.dateTimeText}</Text></View>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Live Section */}
          {liveStreams.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Live Now</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveScroll}>
                {liveStreams.map((stream: any, i: number) => (
                  <TouchableOpacity
                    key={stream.id || i}
                    style={styles.liveCard}
                    onPress={() => router.push({ pathname: '/watch-stream', params: { id: stream.id } })}
                  >
                    {stream.coverUrl ? (
                      <Image source={{ uri: stream.coverUrl }} style={styles.liveImage} />
                    ) : null}
                    <View style={styles.liveTop}>
                      <View style={styles.liveBadge}><View style={styles.dot} /><Text style={styles.liveBadgeText}>LIVE</Text></View>
                      <View style={styles.viewerBadge}><Ionicons name="people" size={10} color="#FFF" /><Text style={styles.viewerText}>{stream.viewerCount ?? '—'}</Text></View>
                    </View>
                    <View style={styles.liveBottom}>
                      <Text style={styles.liveTitle} numberOfLines={2}>{stream.title || 'Live Stream'}</Text>
                      <View style={styles.userRow}>
                        {(stream.creator?.profilePictureUrl || stream.creatorAvatarUrl) && (
                          <Image source={{ uri: stream.creator?.profilePictureUrl || stream.creatorAvatarUrl }} style={styles.userAvatar} />
                        )}
                        <Text style={styles.userName}>{stream.creator?.name || stream.creatorName || 'Creator'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          )}

          <Text style={styles.sectionTitle}>
            {filteredEvents.length ? 'Events you may like' : 'Discover Events'}
          </Text>
          {filteredEvents.length === 0 && !loading && (
            <View style={{ padding: 30, alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>No events found matching current filters</Text>
            </View>
          )}
          {filteredEvents.map((event: any) => (
            <TouchableOpacity
              key={event.id || event.title}
              style={styles.eventCard}
              onPress={() => event.id && router.push({ pathname: '/event-details', params: { id: event.id } })}
            >
              <Image
                source={event.imageUrl || event.coverImageUrl
                  ? { uri: event.imageUrl || event.coverImageUrl }
                  : require('../../assets/images/paint.png')}
                style={styles.eventImage}
              />
              <View style={styles.eventContent}>
                {event.category && (
                  <View style={styles.eventTag}><Text style={styles.eventTagText}>{String(event.category).toUpperCase()}</Text></View>
                )}
                <Text style={styles.eventName} numberOfLines={1}>{event.title || 'Event'}</Text>
                {event.location && (
                  <View style={styles.eventLoc}><Ionicons name="location" size={12} color="#8E2DE2" /><Text style={styles.eventLocText}>{event.location}</Text></View>
                )}
                {event.priceText && (
                  <Text style={styles.eventPrice}>{event.priceText} <Text style={styles.priceSub}>/Person</Text></Text>
                )}
              </View>
            </TouchableOpacity>
          ))}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
};

export default DiscoverHomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, alignItems: 'center' },
  searchBar: { flex: 1, backgroundColor: '#FFF', borderRadius: 25, height: 45, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  searchText: { marginLeft: 10, color: '#999', fontSize: 13 },
  filterBtn: { width: 45, height: 45, backgroundColor: '#000', borderRadius: 12, marginLeft: 12, justifyContent: 'center', alignItems: 'center' },
  categorySection: { marginTop: 20, paddingLeft: 20 },
  categoryText: { fontSize: 18, fontWeight: '700', color: '#333' },
  catScroll: { marginTop: 12 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EEE', marginRight: 10 },
  catChipActive: { backgroundColor: '#8E2DE2' },
  catName: { fontSize: 14, color: '#666', fontWeight: '600' },
  catNameActive: { color: '#FFF' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20 },
  majorEventCard: { width: '100%', borderRadius: 20, backgroundColor: '#FFF', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, marginBottom: 20 },
  majorImage: { width: '100%', height: 220 },
  aiBtnFloat: { position: 'absolute', right: 15, bottom: 80, width: 36, height: 36, borderRadius: 10, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center' },
  addBtnFloat: { position: 'absolute', right: 15, bottom: 35, width: 44, height: 44, borderRadius: 22, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  majorContent: { padding: 15 },
  majorTitle: { fontSize: 18, fontWeight: '800', color: '#000' },
  majorRow: { flexDirection: 'row', marginTop: 8, flexWrap: 'wrap' },
  majorInfo: { flexDirection: 'row', alignItems: 'center', marginRight: 15, marginTop: 4 },
  majorInfoText: { fontSize: 10, color: '#666', marginLeft: 4, fontWeight: '600' },
  liveScroll: { marginBottom: 25 },
  liveCard: { width: 180, height: 240, borderRadius: 16, overflow: 'hidden', marginRight: 15, backgroundColor: '#1A1A2E' },
  liveImage: { ...StyleSheet.absoluteFillObject, opacity: 0.7 },
  liveTop: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#FF0000', marginRight: 4 },
  liveBadgeText: { fontSize: 8, fontWeight: '800', color: '#000' },
  viewerBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  viewerText: { color: '#FFF', fontSize: 8, marginLeft: 2, fontWeight: '700' },
  liveBottom: { position: 'absolute', bottom: 10, left: 10, right: 10 },
  liveTitle: { color: '#FFF', fontSize: 12, fontWeight: '700', marginBottom: 8 },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 20, height: 20, borderRadius: 10, marginRight: 6 },
  userName: { color: '#FFF', fontSize: 10, fontWeight: '600', flex: 1 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginBottom: 15, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  eventImage: { width: 100, height: 100, borderRadius: 12 },
  eventContent: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  eventTag: { backgroundColor: '#000', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, marginBottom: 4 },
  eventTagText: { color: '#FFF', fontSize: 8, fontWeight: '800' },
  eventName: { fontSize: 15, fontWeight: '700', color: '#000' },
  eventLoc: { flexDirection: 'row', alignItems: 'center' },
  eventLocText: { fontSize: 11, color: '#666', marginLeft: 4 },
  eventPrice: { fontSize: 14, fontWeight: '800', color: '#8E2DE2' },
  priceSub: { fontSize: 10, color: '#999', fontWeight: '500' },
});
