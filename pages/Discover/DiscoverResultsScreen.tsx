import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { eventService } from '@/services/eventService';
import { useRouter } from 'expo-router';

const DiscoverResultsScreen = ({
  query,
  onBack,
}: {
  query: string;
  onBack: () => void;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await eventService.searchEvents(query);
        setEvents(res?.cards || res?.items || res || []);
      } catch (e) {
        console.warn('[DiscoverResultsScreen] search error:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            value={query}
            style={styles.input}
            editable={false}
          />
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No events found matching "{query}"</Text>
            </View>
          ) : (
            events.map((event) => {
              const coverUri = event.imageUrl || event.coverImageUrl || event.eventPosterUrl;
              return (
                <TouchableOpacity
                  key={event.id}
                  style={styles.eventCard}
                  onPress={() => event.id && router.push({ pathname: '/event-details', params: { id: event.id } })}
                >
                  {coverUri ? (
                    <Image source={{ uri: coverUri }} style={styles.eventImage} />
                  ) : (
                    <Image source={require('../../assets/images/paint.png')} style={styles.eventImage} />
                  )}
                  <View style={styles.eventContent}>
                    {event.category && (
                      <View style={styles.eventTag}>
                        <Text style={styles.eventTagText}>{String(event.category).toUpperCase()}</Text>
                      </View>
                    )}
                    <Text style={styles.eventName}>{event.title}</Text>
                    {event.location && (
                      <View style={styles.eventLoc}>
                        <Ionicons name="location" size={12} color="#8E2DE2" />
                        <Text style={styles.eventLocText}>{event.location}</Text>
                      </View>
                    )}
                    {event.priceText && (
                      <Text style={styles.eventPrice}>
                        {event.priceText} <Text style={styles.priceSub}>/Person</Text>
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DiscoverResultsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2 },
  searchBar: { flex: 1, backgroundColor: '#EEE', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45 },
  input: { flex: 1, color: '#000', fontSize: 14 },
  scrollContent: { paddingHorizontal: 20 },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginBottom: 15, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  eventImage: { width: 100, height: 100, borderRadius: 12 },
  eventContent: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  eventTag: { backgroundColor: '#000', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  eventTagText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  eventName: { fontSize: 16, fontWeight: '700', color: '#000' },
  eventLoc: { flexDirection: 'row', alignItems: 'center' },
  eventLocText: { fontSize: 12, color: '#666', marginLeft: 4 },
  eventPrice: { fontSize: 16, fontWeight: '800', color: '#8E2DE2' },
  priceSub: { fontSize: 10, color: '#999', fontWeight: '500' },
  emptyState: { alignItems: 'center', paddingVertical: 50 },
  emptyText: { color: '#999', fontSize: 14, marginTop: 10 },
});
