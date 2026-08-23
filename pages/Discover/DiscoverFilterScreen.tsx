import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { eventService } from '@/services/eventService';

const DATES = [
  { day: 'All Time', key: 'all', active: true },
  { day: 'Today', key: 'today' },
  { day: 'This Month', key: 'thisMonth' },
  { day: 'Last Month', key: 'lastMonth' },
];

const DiscoverFilterScreen = ({
  onBack,
  activeFilters,
  onApplyFilters,
}: {
  onBack: () => void;
  activeFilters: { category: string; range: string; minPrice?: number; maxPrice?: number };
  onApplyFilters: (filters: { category: string; range: string; minPrice?: number; maxPrice?: number }) => void;
}) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(activeFilters.category);
  const [selectedRange, setSelectedRange] = useState(activeFilters.range);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    eventService.getCreateEventOptions()
      .then((opts) => {
        if (opts?.categories) {
          const cats = [
            { id: 'all', name: 'All', icon: 'grid' },
            ...opts.categories.map((c: any) => ({
              id: c.value || c.id || c,
              name: c.label || c.name || c,
              icon: 'music-note',
            })),
          ];
          setCategories(cats);
        }
      })
      .catch((err) => console.warn('Error loading options:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleApply = () => {
    onApplyFilters({
      category: selectedCategory,
      range: selectedRange,
    });
    onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filter</Text>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
          <Text style={styles.applyBtnText}>Apply</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, isActive && styles.catChipActive]}
                  onPress={() => setSelectedCategory(cat.name)}
                >
                  {cat.icon && (
                    <MaterialCommunityIcons
                      name={cat.icon as any}
                      size={16}
                      color={isActive ? '#FFF' : '#666'}
                      style={{ marginRight: 6 }}
                    />
                  )}
                  <Text style={[styles.catName, isActive && styles.catNameActive]}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>Event Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
            {DATES.map((d, i) => {
              const isActive = selectedRange === d.key;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.dateChip, isActive && styles.dateChipActive]}
                  onPress={() => setSelectedRange(d.key)}
                >
                  <Text style={[styles.dateDay, isActive && styles.dateTextActive]}>{d.day}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default DiscoverFilterScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  backBtn: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  applyBtn: { backgroundColor: '#8E2DE2', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  applyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  scrollContent: { paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginTop: 30, marginBottom: 15 },
  catScroll: { marginBottom: 10 },
  catChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 25, backgroundColor: '#EEE', marginRight: 10 },
  catChipActive: { backgroundColor: '#8E2DE2' },
  catName: { fontSize: 14, color: '#666', fontWeight: '600' },
  catNameActive: { color: '#FFF' },
  dateScroll: { marginBottom: 20 },
  dateChip: { paddingHorizontal: 25, paddingVertical: 15, borderRadius: 25, backgroundColor: '#FFF', marginRight: 15, alignItems: 'center', elevation: 1 },
  dateChipActive: { backgroundColor: '#8E2DE2' },
  dateDay: { fontSize: 14, color: '#666', fontWeight: '600' },
  dateTextActive: { color: '#FFF' },
});
