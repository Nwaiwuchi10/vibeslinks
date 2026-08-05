import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { hostService } from '@/services/hostService';

export default function TicketsSoldMain() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [ticketTiers, setTicketTiers] = useState<any[]>([]);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    Promise.allSettled([
      hostService.getEventDetail(eventId),
      hostService.getTickets({ eventId, range: 'allTime', limit: '50' }),
    ]).then(([evtRes, tksRes]) => {
      if (evtRes.status === 'fulfilled') setEvent(evtRes.value);

      const evtTiers =
        evtRes.status === 'fulfilled'
          ? (evtRes.value?.ticketTiers || evtRes.value?.ticketPricingTiers || [])
          : [];

      if (tksRes.status === 'fulfilled') {
        const tData = tksRes.value;
        const tiers =
          tData?.ticketTiers ||
          tData?.ticketCategories?.categories ||
          evtTiers;
        setTicketTiers(tiers.length > 0 ? tiers : evtTiers);
      } else {
        setTicketTiers(evtTiers);
      }
    }).finally(() => setLoading(false));
  }, [eventId]);

  const eventName = event?.title || 'Event Details';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tickets Sold</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Dropdown Selector displaying active event */}
          <View style={styles.dropdown}>
            <Text style={styles.dropdownText}>{eventName}</Text>
          </View>

          {ticketTiers.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
              <Ionicons name="ticket-outline" size={48} color="#CCC" />
              <Text style={{ color: '#999', marginTop: 12 }}>No ticket tiers found</Text>
            </View>
          ) : (
            ticketTiers.map((tier, idx) => {
              const name = tier.tierName || tier.name || tier.title || 'Tier';
              const price = tier.price || 0;
              const sold = tier.soldCount ?? tier.sold ?? 0;
              const capacity = tier.totalTickets ?? tier.capacity ?? 0;
              const remaining = Math.max(0, capacity - sold);
              const revenue = tier.revenue ?? (price * sold);

              return (
                <View key={tier.id || idx} style={styles.tierCard}>
                  <Text style={styles.revenueLabel}>Revenue</Text>
                  <Text style={styles.revenueVal}>₦{Number(revenue).toLocaleString()}</Text>

                  <View style={styles.detailsRow}>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailValue}>{Number(sold).toLocaleString()}</Text>
                      <Text style={styles.detailLabel}>Sold</Text>
                    </View>
                    <View style={styles.detailBox}>
                      <Text style={styles.detailValue}>{Number(remaining).toLocaleString()}</Text>
                      <Text style={styles.detailLabel}>Remaining</Text>
                    </View>
                  </View>

                  {/* Floating tier label at bottom center */}
                  <View style={styles.floatingLabelContainer}>
                    <View style={styles.floatingLabel}>
                      <Text style={styles.floatingLabelText}>{name}</Text>
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
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 15 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40, gap: 25 },
  dropdown: { backgroundColor: '#FFF', borderRadius: 24, paddingHorizontal: 20, paddingVertical: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ECECEC', marginBottom: 5 },
  dropdownText: { fontSize: 15, color: '#1A1A1A', fontWeight: '600', textAlign: 'center' },
  tierCard: { backgroundColor: '#FFF', borderRadius: 28, borderWidth: 1, borderColor: '#E8E8FF', padding: 24, alignItems: 'center', position: 'relative', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 10, elevation: 2 },
  revenueLabel: { fontSize: 12, fontWeight: '600', color: '#8E8E93', marginBottom: 6 },
  revenueVal: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  detailsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  detailBox: { flex: 1, backgroundColor: '#FAF9FF', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#F2F2F7', alignItems: 'center' },
  detailValue: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  detailLabel: { fontSize: 12, fontWeight: '500', color: '#8E8E93', marginTop: 4 },
  floatingLabelContainer: { position: 'absolute', bottom: -12, left: 0, right: 0, alignItems: 'center' },
  floatingLabel: { backgroundColor: '#F3E8FF', paddingHorizontal: 16, paddingVertical: 4, borderRadius: 10, borderWidth: 1.5, borderColor: '#FFF' },
  floatingLabelText: { color: '#7B39FD', fontSize: 11, fontWeight: '700' },
});
