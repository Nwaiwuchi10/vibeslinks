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

const DISCOVER_EVENTS = [
  { id: '1', title: 'Afro Summer Festival', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'NIGHTLIFE', image: 'https://images.unsplash.com/photo-1514525253361-bee8d4884c6c?q=80&w=1000' },
  { id: '2', title: 'Worship De King', location: 'Lekki Ikata, Lagos', price: '15,000', tag: 'FESTIVALS', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000' },
  { id: '3', title: 'Afro Summer Festival', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'SPORTS EVENTS', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000' },
  { id: '4', title: 'Paint With Mimi, &…', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'COMEDY', image: 'https://images.unsplash.com/photo-1460661419201-fd4cecea8f82?q=80&w=1000' },
];

const DiscoverResultsScreen = ({ query, onBack }: { query: string, onBack: () => void }) => {
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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {DISCOVER_EVENTS.map((event) => (
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
        <View style={{ height: 100 }} />
      </ScrollView>
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
});
