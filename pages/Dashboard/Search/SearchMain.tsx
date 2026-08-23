import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { hostService } from '@/services/hostService';

export default function SearchMain() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await hostService.getEvents({ q: q.trim() });
      const list: any[] = Array.isArray(data) ? data : data?.events || [];
      setResults(list);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header Search Input Row */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search your events"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={() => performSearch(searchText)}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => { setSearchText(''); setResults([]); setSearched(false); }}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={() => performSearch(searchText)}>
          <Ionicons name="search" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator color="#7B39FD" style={{ marginTop: 40 }} />
        ) : searched && results.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#CCC" />
            <Text style={styles.emptyText}>No events found for "{searchText}"</Text>
          </View>
        ) : results.length > 0 ? (
          <>
            <Text style={styles.sectionHeading}>Results ({results.length})</Text>
            {results.map((evt: any) => {
              const coverUri = evt.imageUrl || evt.coverImageUrl || evt.eventPosterUrl;
              const price = evt.ticketPricingTiers?.[0]?.price ?? evt.price ?? null;
              return (
                <TouchableOpacity
                  key={evt.id}
                  style={styles.eventCard}
                  onPress={() => router.push({ pathname: '/dashboard/analytics', params: { eventId: evt.id } })}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.categoryTitle}>{String(evt.category || 'EVENT').toUpperCase()}</Text>
                    <View style={styles.openLinkContainer}>
                      <Text style={styles.openLinkText}>Open</Text>
                      <Ionicons name="arrow-forward-circle" size={18} color="#7B39FD" />
                    </View>
                  </View>

                  {coverUri ? (
                    <Image source={{ uri: coverUri }} style={styles.eventCardImage} contentFit="cover" />
                  ) : (
                    <Image source={require('@/assets/images/paint.png')} style={styles.eventCardImage} contentFit="cover" />
                  )}

                  <View style={styles.eventCardContent}>
                    <View style={styles.eventTitleRow}>
                      <Text style={styles.eventCardTitle} numberOfLines={1}>{evt.title}</Text>
                      {price !== null && (
                        <Text style={styles.eventCardPrice}>₦{Number(price).toLocaleString()}</Text>
                      )}
                    </View>
                    {evt.startsAt && (
                      <Text style={styles.eventDate}>
                        {new Date(evt.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        ) : (
          <View style={styles.promptState}>
            <Ionicons name="search-outline" size={48} color="#DDD" />
            <Text style={styles.promptText}>Search your events by title, category, or venue</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
    gap: 12,
  },
  backButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  searchContainer: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F2F2F2', height: 48, borderRadius: 24,
    paddingHorizontal: 20, gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, color: '#1A1A1A', fontWeight: '500' },
  searchButton: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: '#000',
    justifyContent: 'center', alignItems: 'center',
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 },
  sectionHeading: { fontSize: 16, fontWeight: '700', color: '#1A1A1A', marginTop: 20, marginBottom: 12 },
  emptyState: { paddingVertical: 60, alignItems: 'center' },
  emptyText: { color: '#BBB', fontSize: 14, marginTop: 8, textAlign: 'center' },
  promptState: { paddingVertical: 80, alignItems: 'center', paddingHorizontal: 40 },
  promptText: { color: '#CCC', fontSize: 14, marginTop: 12, textAlign: 'center', lineHeight: 20 },
  eventCard: {
    backgroundColor: '#FFF', borderRadius: 28, borderWidth: 1, borderColor: '#F2F2F7',
    marginBottom: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02, shadowRadius: 10, elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 15,
  },
  categoryTitle: { fontSize: 13, fontWeight: '700', color: '#8E8E93', letterSpacing: 0.5 },
  openLinkContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  openLinkText: { fontSize: 13, fontWeight: '700', color: '#7B39FD' },
  eventCardImage: { width: '100%', height: 160 },
  eventCardContent: { padding: 20 },
  eventTitleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6,
  },
  eventCardTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', flex: 1, marginRight: 10 },
  eventCardPrice: { fontSize: 16, fontWeight: '700', color: '#7B39FD' },
  eventDate: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
});
