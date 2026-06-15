import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CATEGORIES = [
  { id: '1', name: 'All', icon: null, active: true },
  { id: '2', name: 'Amapiano', icon: 'music-note' },
  { id: '3', name: 'EDM', icon: 'music' },
  { id: '4', name: 'Festivals', icon: 'umbrella' },
];

const DATES = [
  { day: 'Today', date: '26 May', active: true },
  { day: 'Wed', date: '27 May' },
  { day: 'Thu', date: '28 May' },
];

const DiscoverFilterScreen = ({ onBack }: { onBack: () => void }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity style={styles.searchBtn}>
          <Ionicons name="search" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Location</Text>
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selectorText}>Ibeju Lekki Lagos</Text>
          <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={[styles.catChip, cat.active && styles.catChipActive]}>
              {cat.icon && <MaterialCommunityIcons name={cat.icon as any} size={16} color={cat.active ? "#FFF" : "#666"} style={{ marginRight: 6 }} />}
              <Text style={[styles.catName, cat.active && styles.catNameActive]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Price Range</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderFill} />
            <View style={[styles.sliderThumb, { left: '20%' }]} />
            <View style={[styles.sliderThumb, { left: '70%' }]} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.label}>₦10,000</Text>
            <Text style={styles.labelActive}>₦25,000</Text>
            <Text style={styles.label}>₦40,000</Text>
            <Text style={styles.label}>₦60,000</Text>
            <Text style={styles.labelActive}>₦75,000</Text>
            <Text style={styles.label}>₦105,500</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Distance</Text>
        <View style={styles.sliderContainer}>
          <View style={styles.sliderTrack}>
            <View style={styles.sliderFill} />
            <View style={[styles.sliderThumb, { left: '20%' }]} />
            <View style={[styles.sliderThumb, { left: '70%' }]} />
          </View>
          <View style={styles.sliderLabels}>
            <Text style={styles.label}>0 km</Text>
            <Text style={styles.labelActive}>5 km</Text>
            <Text style={styles.label}>10 km</Text>
            <Text style={styles.label}>15 km</Text>
            <Text style={styles.labelActive}>20 km</Text>
            <Text style={styles.label}>25 km</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Event Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
          {DATES.map((d, i) => (
            <TouchableOpacity key={i} style={[styles.dateChip, d.active && styles.dateChipActive]}>
              <Text style={[styles.dateDay, d.active && styles.dateTextActive]}>{d.day}</Text>
              <Text style={[styles.dateVal, d.active && styles.dateTextActive]}>{d.date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DiscoverFilterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  searchBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  scrollContent: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 30, marginBottom: 15 },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#FFF', borderRadius: 25, elevation: 1 },
  selectorText: { color: '#666', fontSize: 15 },
  catScroll: { marginBottom: 10 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 25, backgroundColor: '#EEE', marginRight: 10 },
  catChipActive: { backgroundColor: '#8E2DE2' },
  catName: { fontSize: 14, color: '#666', fontWeight: '600' },
  catNameActive: { color: '#FFF' },
  sliderContainer: { marginTop: 10, marginBottom: 20 },
  sliderTrack: { height: 10, backgroundColor: '#EEE', borderRadius: 5, position: 'relative', justifyContent: 'center' },
  sliderFill: { position: 'absolute', left: '20%', right: '30%', height: '100%', backgroundColor: '#D1B2FF' },
  sliderThumb: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: '#8E2DE2', borderWidth: 4, borderColor: '#FFF', elevation: 3 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 },
  label: { fontSize: 9, color: '#999', fontWeight: '600' },
  labelActive: { fontSize: 9, color: '#333', fontWeight: '800' },
  dateScroll: { marginBottom: 20 },
  dateChip: { paddingHorizontal: 25, paddingVertical: 15, borderRadius: 25, backgroundColor: '#FFF', marginRight: 15, alignItems: 'center', elevation: 1 },
  dateChipActive: { backgroundColor: '#8E2DE2' },
  dateDay: { fontSize: 12, color: '#666', fontWeight: '600' },
  dateVal: { fontSize: 16, fontWeight: '800', color: '#333', marginTop: 2 },
  dateTextActive: { color: '#FFF' },
});
