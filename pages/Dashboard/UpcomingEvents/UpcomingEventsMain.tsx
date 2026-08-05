import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { hostService } from '@/services/hostService';

export default function UpcomingEventsMain() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hostService.getEvents({ status: 'upcoming', limit: '20' })
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.events || [];
        setEvents(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7E6" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="calendar-blank" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No upcoming events</Text>
            </View>
          ) : (
            events.map((evt: any) => {
              const ticketsSold = evt.ticketsSold ?? evt.soldCount ?? 0;
              const revenue = evt.revenue ?? evt.totalRevenue ?? 0;
              const price = evt.ticketPricingTiers?.[0]?.price ?? evt.price ?? 0;
              const coverUri = evt.imageUrl || evt.coverImageUrl || evt.eventPosterUrl;
              return (
                <View key={evt.id} style={styles.eventCard}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.categoryTitle}>{String(evt.category || 'EVENT').toUpperCase()}</Text>
                    <TouchableOpacity 
                      style={styles.openLinkContainer}
                      onPress={() => router.push({ pathname: '/dashboard/analytics', params: { eventId: evt.id } })}
                    >
                      <Text style={styles.openLinkText}>Open</Text>
                      <Ionicons name="arrow-forward-circle" size={18} color="#7B39FD" />
                    </TouchableOpacity>
                  </View>

                  {coverUri ? (
                    <Image 
                      source={{ uri: coverUri }} 
                      style={styles.eventCardImage} 
                      contentFit="cover"
                    />
                  ) : (
                    <Image 
                      source={require('@/assets/images/paint.png')} 
                      style={styles.eventCardImage} 
                      contentFit="cover"
                    />
                  )}

                  <View style={styles.eventCardContent}>
                    <View style={styles.eventTitleRow}>
                      <Text style={styles.eventCardTitle} numberOfLines={1}>{evt.title}</Text>
                      <Text style={styles.eventCardPrice}>₦{Number(price).toLocaleString()}</Text>
                    </View>

                    <View style={styles.statsContainer}>
                      <View style={styles.statBox}>
                        <Text style={styles.statValue}>{Number(ticketsSold).toLocaleString()}</Text>
                        <View style={styles.statLabelRow}>
                          <Text style={styles.statLabel}>Tickets Sold</Text>
                          <View style={styles.statArrowCircle}>
                            <MaterialCommunityIcons name="arrow-up-right" size={10} color="#1A1A1A" />
                          </View>
                        </View>
                      </View>
                      <View style={styles.statBox}>
                        <Text style={styles.statValue}>₦{Number(revenue).toLocaleString()}</Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                      </View>
                    </View>

                    <View style={styles.badgeRow}>
                      <View style={[styles.statusBadge, { backgroundColor: '#FFB300' }]}>
                        <Text style={styles.statusBadgeText}>Upcoming Event</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF7E6' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 15 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { paddingBottom: 40, paddingTop: 10 },
  emptyState: { paddingVertical: 50, alignItems: 'center' },
  emptyText: { color: '#BBB', fontSize: 14, marginTop: 8 },
  eventCard: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 28, borderWidth: 1, borderColor: '#F2F2F7', marginBottom: 25, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  categoryTitle: { fontSize: 13, fontWeight: '700', color: '#8E8E93', letterSpacing: 0.5 },
  openLinkContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  openLinkText: { fontSize: 13, fontWeight: '700', color: '#7B39FD' },
  eventCardImage: { width: '100%', height: 160 },
  eventCardContent: { padding: 20 },
  eventTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  eventCardTitle: { fontSize: 18, fontWeight: '700', color: '#1A1A1A', flex: 1, marginRight: 10 },
  eventCardPrice: { fontSize: 16, fontWeight: '700', color: '#7B39FD' },
  statsContainer: { flexDirection: 'row', gap: 15, marginBottom: 15 },
  statBox: { flex: 1, backgroundColor: '#FAFAFC', borderRadius: 18, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: '#F2F2F7' },
  statValue: { fontSize: 17, fontWeight: '700', color: '#1A1A1A' },
  statLabelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  statLabel: { fontSize: 11, fontWeight: '500', color: '#999' },
  statArrowCircle: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#F0F0F3', justifyContent: 'center', alignItems: 'center' },
  badgeRow: { alignItems: 'center' },
  statusBadge: { alignSelf: 'center', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 14, marginTop: 5 },
  statusBadgeText: { color: '#1A1A1A', fontSize: 12, fontWeight: '700' },
});
