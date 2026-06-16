import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

export default function SearchMain() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('type text');
  const [recentSearches, setRecentSearches] = useState([
    'Music Event',
    'Dance Event',
    'Business Event',
  ]);

  const removeRecent = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header Search Input Row */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search your events"
            placeholderTextColor="#8E8E93"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
          />
        </View>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Recent Search Section */}
        {recentSearches.length > 0 && (
          <>
            <Text style={styles.sectionHeading}>Recent Search</Text>
            <View style={styles.recentList}>
              {recentSearches.map((item) => (
                <View key={item} style={styles.recentItem}>
                  <Text style={styles.recentText}>{item}</Text>
                  <TouchableOpacity onPress={() => removeRecent(item)}>
                    <Ionicons name="close" size={18} color="#A0A0A0" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Recent View Section */}
        <Text style={styles.sectionHeading}>Recent View</Text>
        <View style={styles.eventCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.categoryTitle}>AFROBEATS</Text>
            <TouchableOpacity style={styles.openLinkContainer}>
              <Text style={styles.openLinkText}>Open</Text>
              <Ionicons name="arrow-forward-circle" size={18} color="#7B39FD" />
            </TouchableOpacity>
          </View>

          <Image 
            source={require('@/assets/images/paint.png')} 
            style={styles.eventCardImage} 
            contentFit="cover"
          />

          <View style={styles.eventCardContent}>
            <View style={styles.eventTitleRow}>
              <Text style={styles.eventCardTitle}>Afro Summer Festival</Text>
              <Text style={styles.eventCardPrice}>₦80,000</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
    gap: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  searchButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 12,
  },
  recentList: {
    gap: 5,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  recentText: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '600',
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginTop: 5,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  openLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7B39FD',
  },
  eventCardImage: {
    width: '100%',
    height: 160,
  },
  eventCardContent: {
    padding: 20,
  },
  eventTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  eventCardPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7B39FD',
  },
});
