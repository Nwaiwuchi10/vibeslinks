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

const DiscoverSearchScreen = ({
  onBack,
  onSearchSubmit,
}: {
  onBack: () => void;
  onSearchSubmit: (q: string) => void;
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [recentViews, setRecentViews] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const data = await eventService.getEventSearchScreen();
      setRecentSearches(data.recentSearches || []);
      setRecentViews(data.recentViews || []);
    } catch (e) {
      console.warn('[DiscoverSearchScreen] load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteSearch = async (searchId: string) => {
    try {
      await eventService.deleteRecentSearch(searchId);
      setRecentSearches((prev) => prev.filter((item) => item.id !== searchId));
    } catch (e) {
      console.warn('Error deleting search:', e);
    }
  };

  const handleSearchKeyPress = () => {
    if (searchText.trim()) {
      onSearchSubmit(searchText.trim());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search events, artists, venues..."
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={handleSearchKeyPress}
          />
          <TouchableOpacity onPress={handleSearchKeyPress}>
            <Ionicons name="search" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {recentSearches.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Recent Search</Text>
              {recentSearches.map((item) => (
                <View key={item.id} style={styles.recentItemContainer}>
                  <TouchableOpacity
                    style={styles.recentItemBtn}
                    onPress={() => onSearchSubmit(item.query)}
                  >
                    <Text style={styles.recentText}>{item.query}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteSearch(item.id)}>
                    <Ionicons name="close" size={18} color="#8A8A8A" />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}

          {recentViews.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Recent View</Text>
              {recentViews.map((event) => {
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
              })}
            </>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DiscoverSearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginRight: 15, elevation: 2 },
  searchBar: { flex: 1, backgroundColor: '#EEE', borderRadius: 25, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 45 },
  input: { flex: 1, color: '#000', fontSize: 14 },
  scrollContent: { paddingHorizontal: 20 },
  sectionTitle: { color: '#333', fontSize: 18, fontWeight: '700', marginBottom: 15 },
  recentItemContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  recentItemBtn: { flex: 1 },
  recentText: { color: '#666', fontSize: 16 },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginBottom: 15, elevation: 1 },
  eventImage: { width: 90, height: 90, borderRadius: 12 },
  eventContent: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  eventTag: { backgroundColor: '#000', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  eventTagText: { color: '#FFF', fontSize: 8, fontWeight: '800' },
  eventName: { fontSize: 14, fontWeight: '700', color: '#000' },
  eventLoc: { flexDirection: 'row', alignItems: 'center' },
  eventLocText: { fontSize: 10, color: '#666', marginLeft: 4 },
  eventPrice: { fontSize: 14, fontWeight: '800', color: '#8E2DE2' },
  priceSub: { fontSize: 10, color: '#999', fontWeight: '500' },
});
