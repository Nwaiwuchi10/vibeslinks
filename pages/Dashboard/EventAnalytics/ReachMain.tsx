import React, { useState, useEffect } from 'react';
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

export default function ReachMain() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [loading, setLoading] = useState(true);
  const [reachData, setReachData] = useState<any>(null);

  useEffect(() => {
    hostService.getReach(eventId, 'allTime')
      .then((data) => setReachData(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [eventId]);

  // Build tier cards from reach data
  const tiers: any[] = reachData?.tiers || reachData?.ticketTiers || reachData?.categories || [];
  const totalReach = reachData?.total ?? reachData?.summary?.reach ?? reachData?.reach ?? null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="close" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reach</Text>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <ActivityIndicator color="#7B39FD" style={{ flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Total Reach summary */}
          {totalReach !== null && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Reach</Text>
              <Text style={styles.summaryVal}>{Number(totalReach).toLocaleString()}</Text>
            </View>
          )}

          {tiers.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No reach data available</Text>
            </View>
          ) : (
            tiers.map((tier: any, idx: number) => {
              const tierName = tier.tierName || tier.name || tier.tier || `Tier ${idx + 1}`;
              const tierRevenue = tier.revenue ?? 0;
              const sold = tier.sold ?? tier.soldCount ?? 0;
              const remaining = tier.remaining ?? Math.max(0, (tier.capacity ?? tier.totalTickets ?? 0) - sold);
              return (
                <View key={tier.id || idx} style={styles.tierCard}>
                  <Text style={styles.revenueLabel}>Revenue</Text>
                  <Text style={styles.revenueVal}>₦{Number(tierRevenue).toLocaleString()}</Text>

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

                  {/* Floating tier label */}
                  <View style={styles.floatingLabelContainer}>
                    <View style={styles.floatingLabel}>
                      <Text style={styles.floatingLabelText}>{tierName}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 10,
    paddingBottom: 15,
  },
  closeButton: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1A1A1A' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40, gap: 25 },
  summaryCard: {
    backgroundColor: '#F3E8FF', borderRadius: 20, padding: 20,
    alignItems: 'center', marginBottom: 10,
  },
  summaryLabel: { fontSize: 12, fontWeight: '600', color: '#7B39FD', marginBottom: 6 },
  summaryVal: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  emptyState: { paddingVertical: 50, alignItems: 'center' },
  emptyText: { color: '#BBB', fontSize: 14, marginTop: 8 },
  tierCard: {
    backgroundColor: '#FFF', borderRadius: 28, borderWidth: 1, borderColor: '#E8E8FF',
    padding: 24, alignItems: 'center', position: 'relative',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02, shadowRadius: 10, elevation: 2,
  },
  revenueLabel: { fontSize: 12, fontWeight: '600', color: '#8E8E93', marginBottom: 6 },
  revenueVal: { fontSize: 22, fontWeight: '800', color: '#1A1A1A', marginBottom: 20 },
  detailsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  detailBox: {
    flex: 1, backgroundColor: '#FAF9FF', borderRadius: 20, padding: 16,
    borderWidth: 1, borderColor: '#F2F2F7', alignItems: 'center',
  },
  detailValue: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  detailLabel: { fontSize: 12, fontWeight: '500', color: '#8E8E93', marginTop: 4 },
  floatingLabelContainer: { position: 'absolute', bottom: -12, left: 0, right: 0, alignItems: 'center' },
  floatingLabel: {
    backgroundColor: '#F3E8FF', paddingHorizontal: 16, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1.5, borderColor: '#FFF',
  },
  floatingLabelText: { color: '#7B39FD', fontSize: 11, fontWeight: '700' },
});
