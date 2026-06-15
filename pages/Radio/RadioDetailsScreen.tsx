import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const FAVORITE_STATIONS = [
  { id: '1', name: 'Agidigbo', freq: '88.7', colors: ['#232526', '#414345'] as [string, string], barColors: ['#FF5F6D', '#FFC371'] },
  { id: '2', name: 'Fresh', freq: '105.9', colors: ['#232526', '#414345'] as [string, string], barColors: ['#ece9e6', '#ffffff'] },
  { id: '3', name: 'Lagelu', freq: '96.7', colors: ['#232526', '#414345'] as [string, string], barColors: ['#f857a6', '#ff5858'] },
  { id: '4', name: 'Splash', freq: '105.5', colors: ['#232526', '#414345'] as [string, string], barColors: ['#f7971e', '#ffd200'] },
];

const RadioDetailsScreen = ({ station, onBack }: { station: any, onBack: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Search */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search Country, City, Station"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            editable={false}
          />
          <TouchableOpacity>
            <Ionicons name="search" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={onBack} style={styles.backLink}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Frequency Display */}
        <View style={styles.freqContainer}>
          <View style={styles.freqRow}>
            <TouchableOpacity style={styles.navBtn}>
              <Ionicons name="chevron-back" size={20} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.freqDisplay}>
              <Text style={styles.freqPrefix}>0</Text>
              <Text style={styles.freqNumber}>{station.freq}</Text>
            </View>
            <TouchableOpacity style={styles.navBtn}>
              <Ionicons name="chevron-forward" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.stationName}>{station.name}</Text>
        </View>

        {/* Large Visualizer/Slider */}
        <View style={styles.visualizerContainer}>
          <View style={styles.barsContainer}>
            {Array.from({ length: 40 }).map((_, i) => (
              <View 
                key={i} 
                style={[
                  styles.vizBar, 
                  { 
                    height: 20 + Math.random() * 60,
                    opacity: i === 20 ? 1 : 0.4,
                    width: i === 20 ? 4 : 2,
                    backgroundColor: i === 20 ? '#8E2DE2' : '#FFF',
                  }
                ]} 
              />
            ))}
          </View>
          <View style={styles.sliderTrack}>
             <View style={styles.sliderThumb} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Favorite Stations</Text>
        <View style={styles.grid}>
          {FAVORITE_STATIONS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card}>
              <LinearGradient colors={item.colors} style={styles.cardGradient}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardFreq}>{item.freq}</Text>
                  <Text style={styles.cardName}>{item.name}</Text>
                </View>
                <View style={styles.miniVisualizer}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.miniVizBar,
                        {
                          height: 5 + Math.random() * 15,
                          backgroundColor: item.barColors[i % 2],
                          opacity: 0.5,
                        },
                      ]}
                    />
                  ))}
                </View>
              </LinearGradient>
            </TouchableOpacity>
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
                <Text style={styles.playingTitle}>{station.name} {station.freq}</Text>
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

export default RadioDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
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
  backLink: {
    marginTop: 10,
  },
  backText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  freqContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  freqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  navBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  freqDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 20,
  },
  freqPrefix: {
    color: '#444',
    fontSize: 64,
    fontWeight: '800',
    lineHeight: 70,
  },
  freqNumber: {
    color: '#FFF',
    fontSize: 72,
    fontWeight: '800',
    lineHeight: 80,
  },
  stationName: {
    color: '#A0A0A0',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -5,
  },
  visualizerContainer: {
    height: 120,
    width: '100%',
    marginBottom: 40,
    justifyContent: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  vizBar: {
    borderRadius: 1,
  },
  sliderTrack: {
    height: 2,
    backgroundColor: '#444',
    width: '100%',
    position: 'absolute',
    bottom: 20,
  },
  sliderThumb: {
    position: 'absolute',
    bottom: -15,
    left: '50%',
    marginLeft: -10,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#8E2DE2',
    borderWidth: 4,
    borderColor: 'rgba(142, 45, 226, 0.3)',
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: COLUMN_WIDTH,
    height: 150,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
  },
  cardGradient: {
    flex: 1,
    padding: 20,
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
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
  miniVisualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 40,
  },
  miniVizBar: {
    width: 3,
    borderRadius: 1.5,
  },
  miniPlayer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 15,
    overflow: 'hidden',
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
