import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: '1', name: 'All', icon: null, active: true },
  { id: '2', name: 'Amapiano', icon: 'music-note' },
  { id: '3', name: 'EDM', icon: 'music' },
  { id: '4', name: 'Festivals', icon: 'umbrella' },
];

const DISCOVER_EVENTS = [
  { id: '1', title: 'Afro Summer Festival', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'NIGHTLIFE', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1000' },
  { id: '2', title: 'Worship De King', location: 'Lekki Ikata, Lagos', price: '15,000', tag: 'FESTIVALS', image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000' },
  { id: '3', title: 'Afro Summer Festival', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'SPORTS EVENTS', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000' },
  { id: '4', title: 'Paint With Mimi, &…', location: 'Lekki Ikata, Lagos', price: '80,000', tag: 'COMEDY', image: require('../../assets/images/paint.png') },
];

const DiscoverHomeScreen = ({ onSearchPress, onFilterPress, onAiPress }: { onSearchPress: () => void, onFilterPress: () => void, onAiPress: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
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
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={[styles.catChip, cat.active && styles.catChipActive]}>
              {cat.icon && <MaterialCommunityIcons name={cat.icon as any} size={16} color={cat.active ? "#FFF" : "#666"} style={{ marginRight: 6 }} />}
              <Text style={[styles.catName, cat.active && styles.catNameActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Ad Banner */}
        <TouchableOpacity style={styles.adBanner}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000' }} style={styles.adImage} />
          <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']} style={styles.adOverlay}>
            <View style={styles.adBadge}><Text style={styles.adBadgeText}>AFROBEATS</Text></View>
            <View style={styles.adFooter}>
              <Text style={styles.adTitle}>Worship De King <Ionicons name="arrow-forward-circle" size={16} /></Text>
              <Text style={styles.adPrice}>₦15,000</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Friends Section */}
        <View style={styles.friendsSection}>
          <Text style={styles.sectionSmallTitle}>See where your friends are vibing</Text>
          <View style={styles.avatarStack}>
            {[1, 2, 3, 4].map(i => (
              <Image key={i} source={{ uri: `https://i.pravatar.cc/100?img=${i + 10}` }} style={[styles.avatar, { marginLeft: -10 }]} />
            ))}
            <View style={styles.avatarMore}><Ionicons name="arrow-forward" size={10} color="#FFF" /></View>
          </View>
        </View>

        {/* Major Event Card */}
        <View style={styles.majorEventCard}>
          <Image source={require('../../assets/images/dav.png')} style={styles.majorImage} />
          <TouchableOpacity style={styles.aiBtnFloat} onPress={onAiPress}>
            <MaterialCommunityIcons name="auto-fix" size={20} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtnFloat}>
            <Ionicons name="add" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.majorContent}>
            <Text style={styles.majorTitle}>Afro Summer Festival</Text>
            <View style={styles.majorRow}>
              <View style={styles.majorInfo}><Ionicons name="location" size={14} color="#8E2DE2" /><Text style={styles.majorInfoText}>Lekki Ikata, Lagos Nigeria</Text></View>
              <View style={styles.majorInfo}><Ionicons name="calendar" size={14} color="#8E2DE2" /><Text style={styles.majorInfoText}>May 15 - 9:00 PM</Text></View>
            </View>
          </View>
        </View>

        {/* Live Section */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.liveScroll}>
          {[1, 2].map(i => (
            <View key={i} style={styles.liveCard}>
              <Image source={{ uri: i === 1 ? 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000' : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000' }} style={styles.liveImage} />
              <View style={styles.liveTop}>
                <View style={styles.liveBadge}><View style={styles.dot} /><Text style={styles.liveBadgeText}>LIVE</Text></View>
                <View style={styles.viewerBadge}><Ionicons name="people" size={10} color="#FFF" /><Text style={styles.viewerText}>{i}1.5K</Text></View>
              </View>
              <View style={styles.liveBottom}>
                <Text style={styles.liveTitle} numberOfLines={2}>{i === 1 ? 'Join me with, me paint the art' : 'President Bola Ahmed Flies for 3.5B Loan'}</Text>
                <View style={styles.userRow}>
                  <Image source={{ uri: `https://i.pravatar.cc/100?img=${i + 20}` }} style={styles.userAvatar} />
                  <Text style={styles.userName}>{i === 1 ? 'Olivia' : 'Wazobia'} <Ionicons name="checkmark-circle" size={10} color="#1DA1F2" /></Text>
                  <Text style={styles.timeText}>.5m</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Other events you may like</Text>
        {DISCOVER_EVENTS.map((event) => (
          <TouchableOpacity key={event.id} style={styles.eventCard}>
            <Image source={typeof event.image === 'string' ? { uri: event.image } : event.image} style={styles.eventImage} />
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
  adBanner: { width: '100%', height: 150, borderRadius: 16, overflow: 'hidden', marginBottom: 20 },
  adImage: { ...StyleSheet.absoluteFillObject },
  adOverlay: { flex: 1, padding: 15, justifyContent: 'space-between' },
  adBadge: { backgroundColor: '#FFF', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  adBadgeText: { fontSize: 10, fontWeight: '800', color: '#000' },
  adFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  adTitle: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  adPrice: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  friendsSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionSmallTitle: { fontSize: 12, color: '#666', fontWeight: '600' },
  avatarStack: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#FAFAFA' },
  avatarMore: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center', marginLeft: -10, borderWidth: 2, borderColor: '#FAFAFA' },
  majorEventCard: { width: '100%', borderRadius: 20, backgroundColor: '#FFF', overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, marginBottom: 20 },
  majorImage: { width: '100%', height: 220 },
  aiBtnFloat: { position: 'absolute', right: 15, bottom: 80, width: 36, height: 36, borderRadius: 10, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center' },
  addBtnFloat: { position: 'absolute', right: 15, bottom: 35, width: 44, height: 44, borderRadius: 22, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  majorContent: { padding: 15 },
  majorTitle: { fontSize: 18, fontWeight: '800', color: '#000' },
  majorRow: { flexDirection: 'row', marginTop: 8 },
  majorInfo: { flexDirection: 'row', alignItems: 'center', marginRight: 15 },
  majorInfoText: { fontSize: 10, color: '#666', marginLeft: 4, fontWeight: '600' },
  liveScroll: { marginBottom: 25 },
  liveCard: { width: 180, height: 240, borderRadius: 16, overflow: 'hidden', marginRight: 15, backgroundColor: '#000' },
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
  timeText: { color: '#DDD', fontSize: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 10, marginBottom: 15, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
  eventImage: { width: 100, height: 100, borderRadius: 12 },
  eventContent: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  eventTag: { backgroundColor: '#000', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4 },
  eventTagText: { color: '#FFF', fontSize: 8, fontWeight: '800' },
  eventName: { fontSize: 15, fontWeight: '700', color: '#000' },
  eventLoc: { flexDirection: 'row', alignItems: 'center' },
  eventLocText: { fontSize: 11, color: '#666', marginLeft: 4 },
  eventPrice: { fontSize: 14, fontWeight: '800', color: '#8E2DE2' },
  priceSub: { fontSize: 10, color: '#999', fontWeight: '500' },
});
