import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function FilterMain() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('Today');

  const categories = [
    { name: 'All', icon: null },
    { name: 'Amapiano', icon: 'music' },
    { name: 'EDM', icon: 'music' },
    { name: 'Festivals', icon: 'tent' },
  ];

  const dates = [
    { id: 'Today', label: 'Today', date: '26 May' },
    { id: 'Wed', label: 'Wed', date: '27 May' },
    { id: 'Thu', label: 'Thu', date: '28 May' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Location Section */}
        <Text style={styles.sectionHeading}>Location</Text>
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Ibeju Lekki Lagos</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {/* Category Section */}
        <Text style={styles.sectionHeading}>Category</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.pillsRow}
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.name;
            return (
              <TouchableOpacity
                key={cat.name}
                style={[styles.pill, isActive && styles.activePill]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                {cat.icon === 'music' && (
                  <Ionicons 
                    name="musical-notes-outline" 
                    size={16} 
                    color={isActive ? '#FFF' : '#1A1A1A'} 
                    style={styles.pillIcon} 
                  />
                )}
                {cat.icon === 'tent' && (
                  <MaterialCommunityIcons 
                    name="tent" 
                    size={16} 
                    color={isActive ? '#FFF' : '#1A1A1A'} 
                    style={styles.pillIcon} 
                  />
                )}
                <Text style={[styles.pillText, isActive && styles.activePillText]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Price Range Section */}
        <Text style={styles.sectionHeading}>Price Range</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrackBackground} />
          {/* Active track from 25k handle to 75k handle */}
          <View style={[styles.sliderTrackActive, { left: '25%', width: '50%' }]} />
          
          {/* Handles */}
          <View style={[styles.sliderHandle, { left: '25%' }]} />
          <View style={[styles.sliderHandle, { left: '75%' }]} />

          {/* Labels row */}
          <View style={styles.labelsRow}>
            <Text style={styles.labelText}>₦10,000</Text>
            <Text style={[styles.labelText, styles.labelTextActive]}>₦25,000</Text>
            <Text style={styles.labelText}>₦40,000</Text>
            <Text style={styles.labelText}>₦60,000</Text>
            <Text style={[styles.labelText, styles.labelTextActive]}>₦75,000</Text>
            <Text style={styles.labelText}>₦105,500</Text>
          </View>
        </View>

        {/* Distance Section */}
        <Text style={styles.sectionHeading}>Distance</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrackBackground} />
          {/* Active track from 5km handle to 20km handle */}
          <View style={[styles.sliderTrackActive, { left: '20%', width: '60%' }]} />
          
          {/* Handles */}
          <View style={[styles.sliderHandle, { left: '20%' }]} />
          <View style={[styles.sliderHandle, { left: '80%' }]} />

          {/* Labels row */}
          <View style={styles.labelsRow}>
            <Text style={styles.labelText}>0 km</Text>
            <Text style={[styles.labelText, styles.labelTextActive]}>5 km</Text>
            <Text style={styles.labelText}>10 km</Text>
            <Text style={styles.labelText}>15 km</Text>
            <Text style={[styles.labelText, styles.labelTextActive]}>20 km</Text>
            <Text style={styles.labelText}>25 km</Text>
          </View>
        </View>

        {/* Event Date Section */}
        <Text style={styles.sectionHeading}>Event Date</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.pillsRow}
        >
          {dates.map((d) => {
            const isActive = selectedDate === d.id;
            return (
              <TouchableOpacity
                key={d.id}
                style={[styles.datePill, isActive && styles.activeDatePill]}
                onPress={() => setSelectedDate(d.id)}
              >
                <Text style={[styles.datePillLabel, isActive && styles.activeDatePillText]}>
                  {d.label}
                </Text>
                <Text style={[styles.datePillSublabel, isActive && styles.activeDatePillText]}>
                  {d.date}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Footer Search Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.searchButton}
          onPress={() => router.back()}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 20,
    marginBottom: 12,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  dropdownText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  pillsRow: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 4,
  },
  pill: {
    backgroundColor: '#F0F0F2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  activePill: {
    backgroundColor: '#7B39FD',
  },
  pillIcon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  activePillText: {
    color: '#FFF',
  },
  sliderContainer: {
    height: 70,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 10,
  },
  sliderTrackBackground: {
    height: 6,
    backgroundColor: '#E8E8FF',
    borderRadius: 3,
    position: 'absolute',
    left: 0,
    right: 0,
  },
  sliderTrackActive: {
    height: 6,
    backgroundColor: '#7B39FD',
    borderRadius: 3,
    position: 'absolute',
  },
  sliderHandle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7B39FD',
    position: 'absolute',
    top: 24,
    transform: [{ translateX: -11 }],
    shadowColor: '#7B39FD',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: -10,
    right: -10,
  },
  labelText: {
    fontSize: 10,
    color: '#A0A0A0',
    fontWeight: '600',
  },
  labelTextActive: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  datePill: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    minWidth: 100,
  },
  activeDatePill: {
    backgroundColor: '#7B39FD',
    borderColor: '#7B39FD',
  },
  datePillLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  datePillSublabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 4,
  },
  activeDatePillText: {
    color: '#FFF',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 25 : 20,
    backgroundColor: '#FAF9FF',
  },
  searchButton: {
    backgroundColor: '#7B39FD',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
