import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { hostService } from '@/services/hostService';

type DateFilter = 'Today' | 'This Month' | 'Last Month';

const RANGE_MAP: Record<string, string> = {
  'Today': 'today',
  'This Month': 'thisMonth',
  'Last Month': 'lastMonth',
};

export default function PromotionMain() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<DateFilter>('Last Month');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [campaigns, setCampaigns] = useState<any[]>([]);

  const fetchPromotionData = async () => {
    setLoading(true);
    try {
      const range = RANGE_MAP[dateFilter] || 'lastMonth';
      const [overviewData, listData] = await Promise.allSettled([
        hostService.getPromotionOverview(range),
        hostService.getCampaigns({ range, limit: '20' }),
      ]);

      if (overviewData.status === 'fulfilled') {
        setStats(overviewData.value);
      }
      if (listData.status === 'fulfilled') {
        const list = Array.isArray(listData.value) ? listData.value : listData.value?.campaigns || listData.value?.items || [];
        setCampaigns(list);
      }
    } catch (err) {
      console.warn('[Promotion] load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotionData();
  }, [dateFilter]);

  const activeCount = stats.activeCampaigns ?? stats.activeCount ?? 0;
  const reach = stats.campaignsReach ?? stats.reach ?? 0;
  const ticketSales = stats.ticketSales ?? stats.sales ?? 0;
  const conversionRate = stats.conversionRate ?? stats.conversion ?? '0%';

  const STAT_CARDS = [
    {
      id: 'active',
      value: String(activeCount),
      label: 'Active Campaigns',
      highlighted: false,
      hasArrow: true,
    },
    {
      id: 'reach',
      value: Number(reach).toLocaleString(),
      label: 'Campaigns Reach',
      highlighted: true,
      hasArrow: false,
    },
    {
      id: 'ticket',
      value: Number(ticketSales).toLocaleString(),
      label: 'Ticket Sales',
      highlighted: false,
      hasArrow: false,
    },
    {
      id: 'conversion',
      value: typeof conversionRate === 'number' ? `${conversionRate}%` : String(conversionRate),
      label: 'Conversion Rate',
      highlighted: false,
      hasArrow: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Promotion Center</Text>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.circleIconBtn}>
              <Ionicons name="document-text-outline" size={20} color="#FAF9FF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Promotions Banner ── */}
        <View style={styles.promoBanner}>
          <View style={styles.promoTextCol}>
            <Text style={styles.promoBannerTitle}>Promotions</Text>
            <Text style={styles.promoBannerSubtitle}>
              Reach more people, increase ticket{'\n'}sales, and grow event awareness.
            </Text>
            <TouchableOpacity
              style={styles.createCampaignBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/dashboard/choose-event' as any)}
            >
              <Text style={styles.createCampaignBtnText}>Create Campaign</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.megaphoneWrapper}>
            <Text style={styles.megaphoneEmoji}>📣</Text>
          </View>
        </View>

        {/* ── Overview Card ── */}
        {loading ? (
          <ActivityIndicator color="#8E2DE2" style={{ marginTop: 30 }} />
        ) : (
          <View style={styles.overviewCard}>
            <View style={styles.overviewHeader}>
              <Text style={styles.overviewTitle}>Overview</Text>
              <TouchableOpacity
                style={styles.filterChip}
                onPress={() => setFilterModalVisible(true)}
                activeOpacity={0.85}
              >
                <Text style={styles.filterChipText}>{dateFilter}</Text>
                <Ionicons name="chevron-down" size={13} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Stats 2×2 Grid */}
            <View style={styles.statsGrid}>
              {STAT_CARDS.map((card) => (
                <View
                  key={card.id}
                  style={[
                    styles.statCard,
                    card.highlighted && styles.statCardHighlighted,
                  ]}
                >
                  {card.hasArrow && (
                    <View style={styles.arrowTopRight}>
                      <Ionicons name="arrow-forward" size={13} color="#8E8E93" />
                    </View>
                  )}
                  <Text
                    style={[
                      styles.statValue,
                      card.highlighted && styles.statValueHighlighted,
                    ]}
                  >
                    {card.value}
                  </Text>
                  <Text
                    style={[
                      styles.statLabel,
                      card.highlighted && styles.statLabelHighlighted,
                    ]}
                  >
                    {card.label}
                  </Text>
                </View>
              ))}
            </View>

            {/* Campaigns list display */}
            {campaigns.length > 0 && (
              <View style={{ marginTop: 20 }}>
                <Text style={{ fontWeight: '700', fontSize: 14, color: '#333', marginBottom: 12 }}>Active Campaigns</Text>
                {campaigns.map((camp: any, index: number) => (
                  <View key={camp.id || index} style={{ padding: 12, backgroundColor: '#FAF9FF', borderRadius: 12, marginBottom: 8, borderWidth: 1, borderColor: '#F0EFF5', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                      <Text style={{ fontWeight: '700', fontSize: 13, color: '#1A1A1A' }}>{camp.eventTitle || camp.name || 'Campaign'}</Text>
                      <Text style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{camp.campaignType || 'Promotion'} • {camp.durationDays || camp.duration || 0} Days</Text>
                    </View>
                    <Text style={{ fontWeight: '800', fontSize: 13, color: '#7B39FD' }}>₦{Number(camp.budget).toLocaleString()}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* ── Bottom Tab Bar ── */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard' as any)}
        >
          <MaterialCommunityIcons name="view-grid-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/active-events' as any)}
        >
          <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Events</Text>
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
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Wallets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.activeIndicatorDot} />
          <MaterialCommunityIcons
            name="bullhorn"
            size={24}
            color="#1A1A1A"
            style={styles.activeIconOffset}
          />
          <Text style={[styles.tabLabel, { color: '#1A1A1A', fontWeight: '700' }]}>
            Promotion
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── Date Filter Modal ── */}
      <Modal
        transparent
        animationType="fade"
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFilterModalVisible(false)}
        >
          <View style={styles.filterModal}>
            {(['Today', 'This Month', 'Last Month'] as DateFilter[]).map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.filterModalOption}
                onPress={() => {
                  setDateFilter(opt);
                  setFilterModalVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.filterModalOptionText,
                    dateFilter === opt && { color: '#7B39FD', fontWeight: '700' },
                  ]}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  scrollContent: { paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  headerRight: { flexDirection: 'row', gap: 10 },
  circleIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  promoBanner: { marginHorizontal: 20, backgroundColor: '#FAF9FF', borderRadius: 24, padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#F0EFF5', marginTop: 10 },
  promoTextCol: { flex: 1, paddingRight: 10 },
  promoBannerTitle: { fontSize: 22, fontWeight: '900', color: '#7B39FD', marginBottom: 8 },
  promoBannerSubtitle: { fontSize: 13, color: '#5B5A66', lineHeight: 18, marginBottom: 16 },
  createCampaignBtn: { backgroundColor: '#7B39FD', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 20, alignSelf: 'flex-start' },
  createCampaignBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  megaphoneWrapper: { width: 80, height: 80, justifyContent: 'center', alignItems: 'center' },
  megaphoneEmoji: { fontSize: 48 },
  overviewCard: { marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginTop: 20, borderWidth: 1, borderColor: '#F0EFF5', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  overviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 },
  overviewTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B39FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  filterChipText: { fontSize: 11, fontWeight: '700', color: '#FFF', marginRight: 4 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', backgroundColor: '#FAF9FF', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F0EFF5', position: 'relative' },
  statCardHighlighted: { backgroundColor: '#7B39FD', borderColor: '#7B39FD' },
  arrowTopRight: { position: 'absolute', top: 12, right: 12 },
  statValue: { fontSize: 20, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  statValueHighlighted: { color: '#FFF' },
  statLabel: { fontSize: 11, fontWeight: '600', color: '#8F8E9C' },
  statLabelHighlighted: { color: '#EBE4FF' },
  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0EFF5', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 10 : 0 },
  tabItem: { alignItems: 'center', flex: 1, paddingVertical: 8, position: 'relative' },
  activeIndicatorDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#7B39FD', position: 'absolute', top: 0 },
  activeIconOffset: { marginTop: -2 },
  tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  filterModal: { backgroundColor: '#FFF', borderRadius: 20, width: 220, paddingVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  filterModalOption: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0EFF5' },
  filterModalOptionText: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
});
