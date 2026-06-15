import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AI_EVENTS = [
  { id: '1', title: 'Afro Summer Festival', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'NIGHTLIFE', image: 'https://images.unsplash.com/photo-1514525253361-bee8d4884c6c?q=80&w=1000' },
  { id: '2', title: 'Worship De King', location: 'Lekki Ikata, Lagos', price: '15,000', tag: 'FESTIVALS', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000' },
  { id: '3', title: 'Afro Summer Festival', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'SPORTS EVENTS', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000' },
];

const VibezAIScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>VIBEZ AI</Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onBack}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.aiText}>Here are the hottest Afrobeat events happening this Saturday near you.</Text>

        {AI_EVENTS.map((event) => (
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

        <Text style={styles.filterTitle}>Filters</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScroll}>
          <TouchableOpacity style={styles.tagChip}><Text style={styles.tagText}>Show only VIP events</Text></TouchableOpacity>
          <TouchableOpacity style={styles.tagChip}><Text style={styles.tagText}>Which one has the biggest crowd?</Text></TouchableOpacity>
        </ScrollView>
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Ask Vibez Ai"
          placeholderTextColor="#999"
          style={styles.input}
        />
        <TouchableOpacity style={styles.sendBtn}>
          <Ionicons name="arrow-up" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VibezAIScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#333' },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  aiText: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 25 },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8 },
  eventImage: { width: 120, height: 120, borderRadius: 12 },
  eventContent: { flex: 1, marginLeft: 15, justifyContent: 'space-between', paddingVertical: 2 },
  eventTag: { backgroundColor: '#000', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  eventTagText: { color: '#FFF', fontSize: 10, fontWeight: '800' },
  eventName: { fontSize: 16, fontWeight: '700', color: '#000' },
  eventLoc: { flexDirection: 'row', alignItems: 'center' },
  eventLocText: { fontSize: 12, color: '#666', marginLeft: 4 },
  eventPrice: { fontSize: 16, fontWeight: '800', color: '#8E2DE2' },
  priceSub: { fontSize: 10, color: '#999', fontWeight: '500' },
  filterTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 20, marginBottom: 15 },
  tagScroll: { marginBottom: 30 },
  tagChip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 25, backgroundColor: '#F3E8FF', marginRight: 12 },
  tagText: { color: '#8E2DE2', fontSize: 13, fontWeight: '600' },
  inputContainer: { paddingHorizontal: 20, paddingBottom: 20, flexDirection: 'row', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#F8F8F8', height: 50, borderRadius: 25, paddingHorizontal: 20, fontSize: 15, borderWidth: 1, borderColor: '#EEE' },
  sendBtn: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#8E2DE2', marginLeft: 10, justifyContent: 'center', alignItems: 'center' },
});
