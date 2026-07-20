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

export default function CompletedEventsMain() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hostService.getEvents({ status: 'completed', limit: '20' })
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.events || [];
        setEvents(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Completed Events</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {events.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="calendar-blank" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No completed events</Text>
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
                      <View style={[styles.statusBadge, { backgroundColor: '#7B39FD' }]}>
                        <Text style={styles.statusBadgeText}>Completed Event</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* Sticky Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard' as any)}
        >
          <MaterialCommunityIcons name="view-grid-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, styles.tabActive]}
        >
          <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#7B39FD" />
          <Text style={[styles.tabLabel, { color: '#7B39FD', fontWeight: '800' }]}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/ticket-management' as any)}
        >
          <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Tickets</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/wallet' as any)}
        >
          <MaterialCommunityIcons name="wallet-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 15 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  scrollContent: { paddingBottom: 120 },
  emptyState: { paddingVertical: 50, alignItems: 'center' },
  emptyText: { color: '#BBB', fontSize: 14, marginTop: 8 },
  eventCard: { backgroundColor: '#FFF', borderRadius: 24, marginHorizontal: 20, marginBottom: 20, borderWidth: 1, borderColor: '#F0EFF5', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
  categoryTitle: { fontSize: 11, fontWeight: '800', color: '#7B39FD' },
  openLinkContainer: { flexDirection: 'row', alignItems: 'center' },
  openLinkText: { fontSize: 12, fontWeight: '700', color: '#7B39FD', marginRight: 4 },
  eventCardImage: { width: '100%', height: 180 },
  eventCardContent: { padding: 18 },
  eventTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  eventCardTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', flex: 1, marginRight: 10 },
  eventCardPrice: { fontSize: 16, fontWeight: '800', color: '#7B39FD' },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16, borderTopWidth: 1, borderTopColor: '#F0EFF5', paddingTop: 14 },
  statBox: { flex: 1 },
  statValue: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  statLabelRow: { flexDirection: 'row', alignItems: 'center' },
  statLabel: { fontSize: 11, color: '#8F8E9C', fontWeight: '600' },
  statArrowCircle: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#FAF8FF', justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  badgeRow: { flexDirection: 'row' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusBadgeText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0EFF5', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 10 : 0 },
  tabItem: { alignItems: 'center', flex: 1, paddingVertical: 8 },
  tabActive: { borderTopWidth: 2, borderTopColor: '#7B39FD' },
  tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
});
