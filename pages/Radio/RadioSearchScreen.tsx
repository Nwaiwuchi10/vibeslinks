import React, { useState, useEffect } from 'react';
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
import { searchStations, RadioStation } from '../../services/radioClient';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 60) / 2;

const getFallbackColors = (index: number): [string, string] => {
  const colors = [
    ['#8E2DE2', '#4A00E0'],
    ['#f857a6', '#ff5858'],
    ['#ff8235', '#ff5858'],
    ['#4b6cb7', '#182848'],
    ['#ad5389', '#3d105b']
  ];
  return colors[index % colors.length] as [string, string];
};

const RadioSearchScreen = ({ onBack, onStationClick, radioPlayer }: { onBack: () => void, onStationClick: (station: any) => void, radioPlayer: any }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        setIsLoading(true);
        const data = await searchStations(query);
        setResults(data);
        setIsLoading(false);
      } else {
        setResults([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Type to search stations..."
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            autoFocus
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity>
            {isLoading ? (
              <Ionicons name="sync" size={20} color="#FFF" />
            ) : (
              <Ionicons name="search" size={20} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Search Results</Text>
        <View style={styles.grid}>
          {results.map((item, index) => (
            <TouchableOpacity key={item.stationuuid} style={styles.card} onPress={() => onStationClick(item)}>
              <LinearGradient colors={getFallbackColors(index)} style={styles.cardGradient}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardFreq} numberOfLines={1}>{item.tags?.split(',')[0] || item.countrycode || 'FM'}</Text>
                  <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                </View>
                <View style={styles.visualizer}>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <View
                      key={i}
                      style={[
                        styles.vizBar,
                        {
                          height: 5 + Math.random() * 15,
                          backgroundColor: 'rgba(255,255,255,0.7)',
                          opacity: 0.5,
                        },
                      ]}
                    />
                  ))}
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
          {query.length > 2 && !isLoading && results.length === 0 && (
            <Text style={{ color: '#8A8A8A', marginTop: 20 }}>No stations found for "{query}"</Text>
          )}
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
