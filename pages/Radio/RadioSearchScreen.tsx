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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const RECENT_SEARCH = ['Wazobia FM', 'Lagos', 'Yanga FM'];

const RECENT_VIEW = [
  { id: '1', name: 'Agidigbo', freq: '88.7', colors: ['#232526', '#414345'] as [string, string], barColors: ['#FF5F6D', '#FFC371'] },
  { id: '2', name: 'Fresh', freq: '105.9', colors: ['#232526', '#414345'] as [string, string], barColors: ['#ece9e6', '#ffffff'] },
  { id: '3', name: 'Lagelu', freq: '96.7', colors: ['#232526', '#414345'] as [string, string], barColors: ['#f857a6', '#ff5858'] },
  { id: '4', name: 'Splash', freq: '105.5', colors: ['#232526', '#414345'] as [string, string], barColors: ['#f7971e', '#ffd200'] },
];

const RadioSearchScreen = ({ onBack, onStationClick }: { onBack: () => void, onStationClick: (station: any) => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="type text"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            autoFocus
          />
          <TouchableOpacity>
            <Ionicons name="search" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Recent Search</Text>
        {RECENT_SEARCH.map((item, idx) => (
          <View key={idx} style={styles.recentItem}>
            <Text style={styles.recentText}>{item}</Text>
            <TouchableOpacity>
              <Ionicons name="close" size={18} color="#8A8A8A" />
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Recent View</Text>
        <View style={styles.grid}>
          {RECENT_VIEW.map((item) => (
            <TouchableOpacity key={item.id} style={styles.card} onPress={() => onStationClick(item)}>
              <LinearGradient colors={item.colors} style={styles.cardGradient}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardFreq}>{item.freq}</Text>
                  <Text style={styles.cardName}>{item.name}</Text>
                </View>
                <View style={styles.visualizer}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.vizBar,
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default RadioSearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 45,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0,
  },
  recentText: {
    color: '#CCC',
    fontSize: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: COLUMN_WIDTH,
    height: 120,
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
    fontSize: 14,
    fontWeight: '800',
  },
  cardName: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.8,
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 30,
  },
  vizBar: {
    width: 3,
    borderRadius: 1.5,
  },
});
