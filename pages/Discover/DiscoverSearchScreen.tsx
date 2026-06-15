import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RECENT_SEARCH = ['Music Event', 'Dance Event', 'Business Event'];

const RECENT_VIEW = [
  { id: '1', title: 'Worship De King', location: 'Lekki Ikata, Lagos', price: '15,000', tag: 'FESTIVALS', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000' },
  { id: '2', title: 'Afro Summer Festival', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'SPORTS EVENTS', image: 'https://images.unsplash.com/photo-1514525253361-bee8d4884c6c?q=80&w=1000' },
];

const DiscoverSearchScreen = ({ onBack, onSearchSubmit }: { onBack: () => void, onSearchSubmit: (q: string) => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="type text"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            autoFocus
          />
          <TouchableOpacity>
            <Ionicons name="search" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Recent Search</Text>
        {RECENT_SEARCH.map((item, idx) => (
          <TouchableOpacity key={idx} style={styles.recentItem} onPress={() => onSearchSubmit(item)}>
            <Text style={styles.recentText}>{item}</Text>
            <TouchableOpacity>
              <Ionicons name="close" size={18} color="#8A8A8A" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Recent View</Text>
        {RECENT_VIEW.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <Image source={{ uri: event.image }} style={styles.eventImage} />
            <View style={styles.eventContent}>
              <View style={styles.eventTag}><Text style={styles.eventTagText}>{event.tag}</Text></View>
              <Text style={styles.eventName}>{event.title}</Text>
              <View style={styles.eventLoc}><Ionicons name="location" size={12} color="#8E2DE2" /><Text style={styles.eventLocText}>{event.location}</Text></View>
              <Text style={styles.eventPrice}>₦{event.price} <Text style={styles.priceSub}>/Person</Text></Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  recentItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
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
