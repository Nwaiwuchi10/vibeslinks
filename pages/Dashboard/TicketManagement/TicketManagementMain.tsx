import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { hostService } from '@/services/hostService';

const { width } = Dimensions.get('window');

const RANGE_MAP: Record<string, 'today' | 'thisMonth' | 'lastMonth' | 'allTime'> = {
  'Today': 'today',
  'This Month': 'thisMonth',
  'Last Month': 'lastMonth',
  'All Time': 'allTime',
};

export default function TicketManagementMain() {
  const router = useRouter();
  
  // Dynamic Events list from host dashboard
  const [events, setEvents] = useState<any[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [selectedEventTitle, setSelectedEventTitle] = useState<string>('All Events');
  const [eventModalVisible, setEventModalVisible] = useState(false);

  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last Month');
  const [loading, setLoading] = useState(true);

  // Stats & purchases from endpoint
  const [stats, setStats] = useState<any>({});
  const [ticketPurchases, setTicketPurchases] = useState<any[]>([]);
  const [ticketTiers, setTicketTiers] = useState<any[]>([]);

  useEffect(() => {
    // Load event selector options first
    hostService.getEvents({ limit: '50' })
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.events || [];
        setEvents(list);
      })
      .catch(() => {});
  }, []);

  const loadTicketData = async () => {
    setLoading(true);
    try {
      const range = RANGE_MAP[selectedDateRange] || 'lastMonth';
      const eventId = selectedEventId === 'all' ? undefined : selectedEventId;
      
      const [overviewData, ticketsData] = await Promise.allSettled([
        hostService.getOverview(range, eventId),
        hostService.getTickets({
          eventId: eventId || '',
          range,
          limit: '20',
        }),
      ]);

      if (overviewData.status === 'fulfilled') {
        const s = overviewData.value?.summary || overviewData.value?.stats || {};
        setStats(s);
        
        // Populate ticket tiers dynamically from upcoming event details or categories
        const upcoming = overviewData.value?.upcomingEvents || [];
        const activeEvt = upcoming.find((e: any) => eventId ? e.id === eventId : true);
        if (activeEvt?.ticketPricingTiers) {
          setTicketTiers(activeEvt.ticketPricingTiers);
        } else {
          setTicketTiers([
            { id: 'vip', name: 'VIP', price: 150000, soldCount: 450, totalTickets: 500 },
            { id: 'vvip', name: 'VVIP', price: 350000, soldCount: 450, totalTickets: 459 }
          ]);
        }
      }

      if (ticketsData.status === 'fulfilled') {
        const list = ticketsData.value?.latestTicketPurchases || ticketsData.value?.purchases || [];
        setTicketPurchases(list);
      }
    } catch (err) {
      console.warn('[TicketManagement] load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTicketData();
  }, [selectedEventId, selectedDateRange]);

  const handleSelectEvent = (id: string, title: string) => {
    setSelectedEventId(id);
    setSelectedEventTitle(title);
    setEventModalVisible(false);
  };

  const handleSelectDateRange = (range: string) => {
    setSelectedDateRange(range);
    setDateModalVisible(false);
  };

  // Safe variables mapping from stats
  const ticketsSold = stats.ticketsSold ?? stats.tickets_sold ?? 0;
  const revenue = stats.revenue ?? 0;
  const refunds = stats.refunds ?? 0;
  const available = stats.availableTickets ?? stats.available_tickets ?? stats.audienceReach ?? '—';

  // Format chart dynamically using purchases over time or simple heights
  const chartHeightMap = [20, 45, 15, 60, 85, 40, 75];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Management</Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Selector dropdown menu */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownBtn}
          onPress={() => setEventModalVisible(true)}
        >
          <Text style={styles.dropdownText} numberOfLines={1}>{selectedEventTitle}</Text>
          <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ marginTop: 40, flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Overview Container */}
          <View style={styles.overviewSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderTitle}>Overview</Text>
              <TouchableOpacity 
                style={styles.dateSelector}
                onPress={() => setDateModalVisible(true)}
              >
                <Text style={styles.dateSelectorText}>{selectedDateRange}</Text>
                <Ionicons name="chevron-down" size={14} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.overviewGrid}>
              <View style={styles.gridBox}>
                <Text style={styles.gridValue}>{Number(ticketsSold).toLocaleString()}</Text>
                <Text style={styles.gridLabel}>Total Tickets Sold</Text>
              </View>
              <View style={[styles.gridBox, styles.purpleBorder]}>
                <Text style={styles.gridValue}>₦{Number(revenue).toLocaleString()}</Text>
                <Text style={styles.gridLabel}>Revenue</Text>
              </View>
              <View style={[styles.gridBox, styles.yellowBorder, { backgroundColor: '#FCF9F2' }]}>
                <Text style={styles.gridValue}>₦{Number(refunds).toLocaleString()}</Text>
                <Text style={styles.gridLabel}>Refunds</Text>
              </View>
              <View style={styles.gridBox}>
                <Text style={styles.gridValue}>{typeof available === 'number' ? available.toLocaleString() : available}</Text>
                <Text style={styles.gridLabel}>Available</Text>
              </View>
            </View>
          </View>

          {/* Sales Performance Chart */}
          <View style={styles.chartSection}>
            <View style={styles.chartHeaderRow}>
              <Text style={styles.chartTitle}>Sales Performance</Text>
              <Text style={styles.chartSubtitle}>
                {selectedDateRange} <Text style={styles.chartValColor}>₦{Number(revenue).toLocaleString()}</Text>
              </Text>
            </View>

            {/* Graphical Bars */}
            <View style={styles.chartContainer}>
              <View style={styles.yAxisLabels}>
                <Text style={styles.axisLabel}>₦4M</Text>
                <Text style={styles.axisLabel}>₦1.2M</Text>
                <Text style={styles.axisLabel}>₦201k</Text>
                <Text style={styles.axisLabel}>₦60k</Text>
                <Text style={styles.axisLabel}>₦9k</Text>
              </View>

              <View style={styles.barsArea}>
                {chartHeightMap.map((h, index) => (
                  <View key={index} style={styles.barTrack}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          height: `${h}%`,
                          backgroundColor: index === 6 ? '#7B39FD' : '#EBE4FF'
                        }
                      ]} 
                    />
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Ticket Categories Swipe View Carousel */}
          <View style={styles.carouselSection}>
            <View style={styles.carouselHeader}>
              <Text style={styles.carouselTitle}>Ticket Categories</Text>
              <TouchableOpacity 
                style={styles.detailsBtn}
                onPress={() => router.push('/dashboard/analytics/all-tickets' as any)}
              >
                <Text style={styles.detailsBtnText}>Details</Text>
                <Ionicons name="arrow-forward-circle" size={16} color="#7B39FD" />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent}>
              {ticketTiers.map((tier: any, idx: number) => {
                const sold = tier.soldCount ?? tier.sold ?? 0;
                const total = tier.totalTickets ?? tier.capacity ?? 500;
                const remaining = Math.max(0, total - sold);
                return (
                  <View key={tier.id || idx} style={styles.categoryCard}>
                    <View style={styles.categoryCardHeader}>
                      <View style={styles.cardIconBox}>
                        <Ionicons name="phone-portrait-outline" size={18} color="#7B39FD" />
                      </View>
                      <Text style={styles.cardPrice}>₦{Number(tier.price).toLocaleString()}<Text style={styles.perPerson}>/Person</Text></Text>
                    </View>
                    <Text style={styles.cardCategoryName}>{tier.name || tier.title || 'General'}</Text>
                    <View style={styles.featuresList}>
                      <Text style={styles.featureItem}>• Lounge access</Text>
                      <Text style={styles.featureItem}>• Priority entry</Text>
                    </View>
                    <View style={styles.cardBottomRow}>
                      <View style={styles.statMiniBox}>
                        <Text style={styles.statMiniVal}>{Number(sold).toLocaleString()}</Text>
                        <Text style={styles.statMiniLabel}>Sold</Text>
                      </View>
                      <View style={styles.statMiniBox}>
                        <Text style={styles.statMiniVal}>{Number(remaining).toLocaleString()}</Text>
                        <Text style={styles.statMiniLabel}>Remaining</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          </View>

          {/* Latest Ticket Purchases */}
          <View style={styles.purchasesSection}>
            <View style={styles.purchasesHeader}>
              <Text style={styles.purchasesTitle}>Latest Ticket Purchases</Text>
              <TouchableOpacity 
                style={styles.openLinkContainer}
                onPress={() => router.push('/dashboard/analytics/tickets-sold' as any)}
              >
                <Text style={styles.openLinkText}>Open</Text>
                <Ionicons name="arrow-forward-circle" size={16} color="#7B39FD" />
              </TouchableOpacity>
            </View>

            {ticketPurchases.length === 0 ? (
              <View style={{ paddingVertical: 20, alignItems: 'center' }}>
                <Text style={{ color: '#BBB', fontSize: 13 }}>No recent purchases</Text>
              </View>
            ) : (
              ticketPurchases.slice(0, 5).map((item: any, idx: number) => {
                const buyerName = item.buyer?.fullName || item.buyerName || 'Buyer';
                const ticketsText = item.ticketTierName || `${item.quantity} x Tickets`;
                const amt = item.totalAmount ?? item.amount ?? 0;
                const dt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent';
                const initial = buyerName.substring(0, 2).toUpperCase();
                return (
                  <View key={item.id || idx} style={styles.purchaseRow}>
                    <View style={styles.purchaseLeft}>
                      <View style={[styles.avatar, styles.placeholderAvatar, { backgroundColor: '#7B39FD' }]}>
                        <Text style={styles.placeholderText}>{initial}</Text>
                      </View>
                      <View style={styles.infoCol}>
                        <Text style={styles.purchaserName}>{buyerName}</Text>
                        <Text style={styles.purchaseDetails}>{ticketsText}</Text>
                      </View>
                    </View>
                    <View style={styles.purchaseRight}>
                      <Text style={styles.purchaseAmount}>₦{Number(amt).toLocaleString()}</Text>
                      <Text style={styles.purchaseDate}>{dt}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}

      {/* MODAL FOR EVENT SELECTOR */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={eventModalVisible}
        onRequestClose={() => setEventModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setEventModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectEvent('all', 'All Events')}
            >
              <Text style={styles.modalOptionText}>All Events</Text>
            </TouchableOpacity>
            {events.map((evt) => (
              <TouchableOpacity 
                key={evt.id}
                style={styles.modalOption} 
                onPress={() => handleSelectEvent(evt.id, evt.title)}
              >
                <Text style={styles.modalOptionText} numberOfLines={1}>{evt.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL FOR DATE FILTER */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setDateModalVisible(false)}
        >
          <View style={styles.modalContent}>
            {Object.keys(RANGE_MAP).map((range) => (
              <TouchableOpacity 
                key={range}
                style={styles.modalOption} 
                onPress={() => handleSelectDateRange(range)}
              >
                <Text style={styles.modalOptionText}>{range}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

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
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/active-events' as any)}
        >
          <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, styles.tabActive]}
        >
          <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color="#7B39FD" />
          <Text style={[styles.tabLabel, { color: '#7B39FD', fontWeight: '800' }]}>Tickets</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/wallet' as any)}
        >
          <Ionicons name="wallet-outline" size={24} color="#A0A0A0" />
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
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1D1D2D' },
  dropdownContainer: { paddingHorizontal: 20, marginBottom: 12 },
  dropdownBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  dropdownText: { fontSize: 14, fontWeight: '700', color: '#1D1D2D', flex: 1, marginRight: 10 },
  scrollContent: { paddingBottom: 120 },
  overviewSection: { paddingHorizontal: 20, marginTop: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#1D1D2D' },
  dateSelector: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B39FD', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dateSelectorText: { fontSize: 11, fontWeight: '700', color: '#FFF', marginRight: 4 },
  overviewGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridBox: { width: '48%', backgroundColor: '#FFF', borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#F0EFF5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  purpleBorder: { borderColor: '#EBE4FF', backgroundColor: '#FAF8FF' },
  yellowBorder: { borderColor: '#FFF1E0' },
  gridValue: { fontSize: 18, fontWeight: '800', color: '#1D1D2D', marginBottom: 4 },
  gridLabel: { fontSize: 11, fontWeight: '600', color: '#8F8E9C' },
  chartSection: { marginHorizontal: 20, marginTop: 10, padding: 20, backgroundColor: '#FFF', borderRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1, borderWidth: 1, borderColor: '#F0EFF5' },
  chartHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  chartTitle: { fontSize: 14, fontWeight: '800', color: '#1D1D2D' },
  chartSubtitle: { fontSize: 11, fontWeight: '600', color: '#8F8E9C' },
  chartValColor: { color: '#7B39FD', fontWeight: '800' },
  chartContainer: { flexDirection: 'row', height: 160, alignItems: 'flex-end' },
  yAxisLabels: { width: 45, height: '100%', justifyContent: 'space-between', paddingBottom: 4 },
  axisLabel: { fontSize: 10, fontWeight: '700', color: '#B3B2BD' },
  barsArea: { flex: 1, height: '100%', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', paddingBottom: 4 },
  barTrack: { width: 14, height: '100%', justifyContent: 'flex-end' },
  barFill: { width: 14, borderRadius: 10 },
  carouselSection: { marginTop: 25 },
  carouselHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 12 },
  carouselTitle: { fontSize: 16, fontWeight: '800', color: '#1D1D2D' },
  detailsBtn: { flexDirection: 'row', alignItems: 'center' },
  detailsBtnText: { fontSize: 12, fontWeight: '700', color: '#7B39FD', marginRight: 4 },
  carouselContent: { paddingLeft: 20, paddingRight: 10 },
  categoryCard: { width: width * 0.65, backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginRight: 15, borderWidth: 1, borderColor: '#F0EFF5', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  categoryCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardIconBox: { width: 36, height: 36, borderRadius: 12, backgroundColor: '#FAF8FF', justifyContent: 'center', alignItems: 'center' },
  cardPrice: { fontSize: 15, fontWeight: '800', color: '#1D1D2D' },
  perPerson: { fontSize: 10, fontWeight: '600', color: '#8F8E9C' },
  cardCategoryName: { fontSize: 18, fontWeight: '800', color: '#1D1D2D', marginBottom: 12 },
  featuresList: { marginBottom: 16 },
  featureItem: { fontSize: 12, fontWeight: '600', color: '#5B5A66', marginBottom: 4 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#F0EFF5', paddingTop: 14 },
  statMiniBox: { flex: 1 },
  statMiniVal: { fontSize: 13, fontWeight: '800', color: '#1D1D2D' },
  statMiniLabel: { fontSize: 10, fontWeight: '600', color: '#8F8E9C' },
  dotIndicatorRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 15 },
  dotIndicator: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#E3E2E6', marginHorizontal: 3 },
  dotActive: { backgroundColor: '#7B39FD', width: 14 },
  purchasesSection: { paddingHorizontal: 20, marginTop: 25 },
  purchasesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  purchasesTitle: { fontSize: 16, fontWeight: '800', color: '#1D1D2D' },
  openLinkContainer: { flexDirection: 'row', alignItems: 'center' },
  openLinkText: { fontSize: 12, fontWeight: '700', color: '#7B39FD', marginRight: 4 },
  purchaseRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: '#F0EFF5' },
  purchaseLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  placeholderAvatar: { justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  infoCol: { marginLeft: 12, justifyContent: 'center' },
  purchaserName: { fontSize: 14, fontWeight: '800', color: '#1D1D2D', marginBottom: 2 },
  purchaseDetails: { fontSize: 11, fontWeight: '600', color: '#8F8E9C' },
  purchaseRight: { alignItems: 'flex-end', justifyContent: 'center' },
  purchaseAmount: { fontSize: 14, fontWeight: '800', color: '#1D1D2D', marginBottom: 2 },
  purchaseDate: { fontSize: 10, fontWeight: '600', color: '#B3B2BD' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#FFF', borderRadius: 20, width: width * 0.8, paddingVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  modalOption: { paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#F0EFF5' },
  modalOptionText: { fontSize: 14, fontWeight: '700', color: '#1D1D2D' },
  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0EFF5', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 10 : 0 },
  tabItem: { alignItems: 'center', flex: 1, paddingVertical: 8 },
  tabActive: { borderTopWidth: 2, borderTopColor: '#7B39FD' },
  tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
});
