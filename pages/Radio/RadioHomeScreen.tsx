import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const STATIONS_LAGOS = [
  { id: '1', name: 'Wazobia FM', freq: '95.1', colors: ['#8E2DE2', '#4A00E0'] as [string, string], barColors: ['#FFF', '#DDD'] },
  { id: '2', name: 'Brila FM', freq: '88.9', colors: ['#232526', '#414345'] as [string, string], barColors: ['#f857a6', '#ff5858'] },
  { id: '3', name: 'Lagos Talks FM', freq: '91.3', colors: ['#232526', '#414345'] as [string, string], barColors: ['#ff8235', '#ff5858'] },
  { id: '4', name: 'Yanga FM', freq: '89.9', colors: ['#232526', '#414345'] as [string, string], barColors: ['#4b6cb7', '#182848'] },
];

const POPULAR_LAGOS = [
  { id: 'p1', name: 'Lasgidi FM', freq: '90.1', colors: ['#232526', '#414345'] as [string, string], barColors: ['#f857a6', '#ff5858'] },
  { id: 'p2', name: 'Adamimogo', freq: '93.1', colors: ['#232526', '#414345'] as [string, string], barColors: ['#ad5389', '#3d105b'] },
];

const POPULAR_NIGERIA = [
  { id: '5', name: 'Agidigbo', freq: '88.7', colors: ['#434343', '#000000'] as [string, string], barColors: ['#FF5F6D', '#FFC371'] },
  { id: '6', name: 'Fresh', freq: '105.9', colors: ['#434343', '#000000'] as [string, string], barColors: ['#ece9e6', '#ffffff'] },
  { id: '7', name: 'Lagelu', freq: '96.7', colors: ['#434343', '#000000'] as [string, string], barColors: ['#f857a6', '#ff5858'] },
  { id: '8', name: 'Splash', freq: '105.5', colors: ['#434343', '#000000'] as [string, string], barColors: ['#f7971e', '#ffd200'] },
];

const RadioHomeScreen = ({ onSearchPress, onStationClick }: { onSearchPress: () => void, onStationClick: (station: any) => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search Country, City, Station"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            editable={false}
          />
          <TouchableOpacity onPress={onSearchPress}>
            <Ionicons name="search" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Ad */}
        <TouchableOpacity style={styles.adBanner}>
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
            style={styles.adGradient}
          >
            <View style={styles.adBadgeRow}>
              <View style={styles.nightlifeBadge}>
                <Text style={styles.badgeText}>NIGHTLIFE</Text>
              </View>
              <View style={styles.adBadge}>
                <Text style={styles.badgeText}>Ad</Text>
              </View>
            </View>
            <View style={styles.adFooter}>
              <View>
                <Text style={styles.adTitle}>Worship De King</Text>
                <Ionicons name="arrow-forward-circle" size={18} color="#FFF" style={{ marginTop: 4 }} />
              </View>
              <Text style={styles.adPrice}>₦15,000</Text>
            </View>
          </LinearGradient>
          <Image
             source={{ uri: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop' }}
            style={styles.adImage}
          />
        </TouchableOpacity>

        <SectionHeader title="Stations in Lagos" />
        <View style={styles.grid}>
          {STATIONS_LAGOS.map((item) => (
            <StationCard key={item.id} station={item} onPress={() => onStationClick(item)} />
          ))}
        </View>

        <SectionHeader title="Popular in Lagos" />
        <View style={styles.grid}>
          {POPULAR_LAGOS.map((item) => (
            <StationCard key={item.id} station={item} onPress={() => onStationClick(item)} />
          ))}
        </View>

        <SectionHeader title="Popular in Nigeria" />
        <View style={styles.grid}>
          {POPULAR_NIGERIA.map((item) => (
            <StationCard key={item.id} station={item} onPress={() => onStationClick(item)} />
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Mini Player */}
      <View style={styles.miniPlayer}>
        <LinearGradient
          colors={['#6A11CB', '#2575FC']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.miniPlayerGradient}
        >
          <View style={styles.playerInfo}>
            <MaterialCommunityIcons name="waveform" size={24} color="#FFF" />
            <View style={{ marginLeft: 10 }}>
              <View style={styles.row}>
                <Text style={styles.playingTitle}>Wazobia FM 95.1</Text>
                <Ionicons name="arrow-forward-circle-outline" size={14} color="#FFF" style={{ marginLeft: 5 }} />
              </View>
              <Text style={styles.playingSub}>Lagos, Nigeria</Text>
            </View>
          </View>
          <View style={styles.playerControls}>
            <TouchableOpacity style={styles.playBtn}>
              <Ionicons name="stop" size={20} color="#6A11CB" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 15 }}>
              <Ionicons name="play-skip-forward" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TouchableOpacity style={styles.seeAllRow}>
      <Text style={styles.seeAllText}>See all</Text>
      <Ionicons name="arrow-forward-circle" size={16} color="#A0A0A0" style={{ marginLeft: 4 }} />
    </TouchableOpacity>
  </View>
);

const StationCard = ({ station, onPress }: { station: any, onPress?: () => void }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <LinearGradient colors={station.colors} style={styles.cardGradient}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardFreq}>{station.freq}</Text>
        <Text style={styles.cardName}>{station.name}</Text>
      </View>
      <View style={styles.visualizer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((i) => (
          <View
            key={i}
            style={[
              styles.vizBar,
              {
                height: 10 + Math.random() * 20,
                backgroundColor: station.barColors[i % 2],
                opacity: 0.6 + Math.random() * 0.4,
              },
            ]}
          />
        ))}
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

export default RadioHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 15,
  },
  searchBar: {
    backgroundColor: '#333',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
    borderWidth: 1,
    borderColor: '#444',
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  adBanner: {
    width: '100%',
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 25,
    position: 'relative',
  },
  adImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  adGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  adBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nightlifeBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adBadge: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#000',
  },
  adFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  adTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  adPrice: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: '#A0A0A0',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    width: COLUMN_WIDTH,
    height: 130,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 15,
  },
  cardGradient: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  cardHeader: {
    alignItems: 'flex-start',
  },
  cardFreq: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  cardName: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
    marginTop: 2,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
  },
  vizBar: {
    width: 2,
    borderRadius: 1,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  miniPlayerGradient: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playingTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  playingSub: {
    color: '#FFF',
    fontSize: 10,
    opacity: 0.8,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playBtn: {
    backgroundColor: '#FFF',
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
