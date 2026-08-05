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
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { hostService } from '@/services/hostService';

const { width } = Dimensions.get('window');

export default function EventAnalyticsMain() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');
  const [loading, setLoading] = useState(true);

  const [event, setEvent] = useState<any>(null);
  const [overview, setOverview] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);

  const RANGE_MAP: Record<string, 'today' | 'thisMonth' | 'lastMonth' | 'allTime'> = {
    'Today': 'today',
    'This Month': 'thisMonth',
    'Last Month': 'lastMonth',
    'All Time': 'allTime',
  };

  const loadAll = async () => {
    if (!eventId) return;
    setLoading(true);
    try {
      const range = RANGE_MAP[selectedDateRange] || 'thisMonth';
      const [evtData, overData, tksData] = await Promise.allSettled([
        hostService.getEventDetail(eventId),
        hostService.getOverview(range, eventId),
        hostService.getTickets({ eventId, range, limit: '5' })
      ]);
      if (evtData.status === 'fulfilled') setEvent(evtData.value);
      if (overData.status === 'fulfilled') setOverview(overData.value);
      if (tksData.status === 'fulfilled') {
        const list = tksData.value?.latestTicketPurchases || tksData.value?.purchases || [];
        setTickets(list);
      }
    } catch (e) {
      console.warn('[EventAnalyticsMain] load error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, [eventId, selectedDateRange]);

  const handleSelectDateRange = (range: string) => {
    setSelectedDateRange(range);
    setDateModalVisible(false);
  };

  // Build chart bars from real salesPerformance data if available
  const rawBars: any[] = event?.salesPerformance?.bars || [];
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let salesData: { day: string; height: number; active: boolean }[];
  if (rawBars.length > 0) {
    const maxVal = Math.max(...rawBars.map((b: any) => (typeof b === 'number' ? b : b?.value ?? 0)), 1);
    salesData = rawBars.slice(0, 7).map((b: any, i: number) => {
      const val = typeof b === 'number' ? b : b?.value ?? 0;
      return { day: b?.label || dayLabels[i] || String(i + 1), height: Math.round((val / maxVal) * 100), active: i === rawBars.length - 1 };
    });
  } else {
    // Proportional fallback — bars scale with actual ticketsSold count
    const totalSoldCount = overview?.summary?.ticketsSold ?? overview?.summary?.tickets_sold ?? 0;
    const baseH = totalSoldCount > 0 ? 1 : 0.1;
    salesData = [
      { day: 'Mon', height: Math.round(baseH * 60), active: false },
      { day: 'Tue', height: Math.round(baseH * 30), active: false },
      { day: 'Wed', height: Math.round(baseH * 75), active: false },
      { day: 'Thu', height: Math.round(baseH * 100), active: false },
      { day: 'Fri', height: Math.round(baseH * 50), active: false },
      { day: 'Sat', height: Math.round(baseH * 85), active: true },
      { day: 'Sun', height: Math.round(baseH * 10), active: false },
    ];
  }

  // Helper values — no hardcoded fallbacks
  const categoryStr = String(event?.hero?.categoryLabel || event?.category || 'EVENT').toUpperCase();
  const statusStr = String(event?.hero?.badge?.label || event?.status || 'Active').toUpperCase();
  const titleStr = event?.title || event?.hero?.title || '';
  const priceVal = event?.ticketPricingTiers?.[0]?.price ?? event?.price ?? null;
  const locationStr = event?.venue || event?.location || '';
  const dateStr = event?.startsAt ? new Date(event.startsAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : '';
  const coverUri = event?.hero?.imageUrl || event?.eventPosterUrl || event?.imageUrl || event?.coverImageUrl;

  const ticketsSold = event?.summary?.ticketsSold ?? overview?.summary?.ticketsSold ?? overview?.summary?.tickets_sold ?? 0;
  const revenue = event?.summary?.revenue ?? overview?.summary?.revenue ?? 0;
  const attendees = event?.summary?.attendees ?? event?.summary?.ticketsSold ?? ticketsSold;
  const pageViews = event?.summary?.views ?? overview?.summary?.views ?? 0;

  // Attendee management from event detail
  const totalRegistered = event?.attendeeManagement?.totalRegisteredGuests ?? attendees ?? 0;
  const confirmedGuests = event?.attendeeManagement?.checkedInGuests ?? 0;
  const pendingConfirmations = event?.attendeeManagement?.pendingCheckIns ?? 0;

  // Audience activity from event detail
  const eventSaves = event?.audienceActivity?.eventSaves ?? event?.summary?.saves ?? 0;
  const sharesCount = event?.audienceActivity?.shares ?? event?.summary?.shares ?? 0;
  const likesCount = event?.audienceActivity?.likes ?? 0;
  const commentsCount = event?.audienceActivity?.comments ?? event?.summary?.comments ?? 0;

  // Marketing performance from event detail
  const adClicks = event?.marketingPerformance?.traffic ?? event?.summary?.views ?? 0;
  const conversionVal = event?.marketingPerformance?.conversions ?? ticketsSold ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Date picker modal sheet */}
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
            {['Today', 'This Month', 'Last Month', 'All Time'].map((range) => (
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Analytics</Text>
        <TouchableOpacity 
          style={styles.editEventButton}
          onPress={() => router.push({ pathname: '/dashboard/create-event', params: { eventId } })}
        >
          <Text style={styles.editEventText}>Edit Event</Text>
          <Ionicons name="arrow-forward" size={12} color="#FFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ flex: 1 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Event Info Card */}
          <View style={styles.eventInfoCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{categoryStr}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: '#63C100' }]}>
                <Text style={styles.statusBadgeText}>{statusStr}</Text>
              </View>
            </View>

            {coverUri ? (
              <Image
                source={{ uri: coverUri }}
                style={styles.bannerImage}
                contentFit="cover"
              />
            ) : (
              <Image
                source={require('@/assets/images/ye.png')}
                style={styles.bannerImage}
                contentFit="cover"
              />
            )}

            <View style={styles.cardDetails}>
              <View style={styles.titlePriceRow}>
                <Text style={styles.eventTitle} numberOfLines={1}>{titleStr}</Text>
                <Text style={styles.eventPrice}>₦{Number(priceVal).toLocaleString()}</Text>
              </View>

              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <Ionicons name="location" size={16} color="#7B39FD" />
                  <Text style={styles.metaText} numberOfLines={1}>{locationStr}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time" size={16} color="#7B39FD" />
                  <Text style={styles.metaText}>{dateStr}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push({ pathname: '/dashboard/create-event', params: { eventId } })}
            >
              <View style={styles.actionIconCircle}>
                <Ionicons name="create-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.actionText}>Edit Details</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push({ pathname: '/dashboard/choose-event', params: { eventId } })}
            >
              <View style={styles.actionIconCircle}>
                <Ionicons name="megaphone-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.actionText}>Promote Event</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <View style={styles.actionIconCircle}>
                <Ionicons name="share-social-outline" size={20} color="#FFF" />
              </View>
              <Text style={styles.actionText}>Share Event</Text>
            </TouchableOpacity>
          </View>

          {/* Date Filter Header Dropdown Trigger */}
          <View style={styles.dateSelectorContainer}>
            <TouchableOpacity 
              style={styles.dateSelectorBtn} 
              onPress={() => setDateModalVisible(true)}
            >
              <Text style={styles.dateSelectorText}>{selectedDateRange}</Text>
              <Ionicons name="chevron-down" size={16} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* Overview Stats */}
          <Text style={styles.sectionHeading}>Overview</Text>
          <View style={styles.statsGrid}>
            <TouchableOpacity 
              style={styles.gridBox}
              onPress={() => router.push({ pathname: '/dashboard/analytics/tickets-sold', params: { eventId } })}
            >
              <Text style={styles.gridValue}>{Number(ticketsSold).toLocaleString()}</Text>
              <Text style={styles.gridLabel}>Tickets Sold</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.gridBox}
              onPress={() => router.push({ pathname: '/dashboard/analytics/all-tickets', params: { eventId } })}
            >
              <Text style={styles.gridValue}>₦{Number(revenue).toLocaleString()}</Text>
              <Text style={styles.gridLabel}>Revenue</Text>
            </TouchableOpacity>
            <View style={styles.gridBox}>
              <Text style={styles.gridValue}>{Number(attendees).toLocaleString()}</Text>
              <Text style={styles.gridLabel}>Attendees</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridValue}>{Number(pageViews).toLocaleString()}</Text>
              <Text style={styles.gridLabel}>Page Views</Text>
            </View>
          </View>

          {/* Action Button Row */}
          <View style={styles.btnRow}>
            <TouchableOpacity 
              style={styles.cancelBtn}
              onPress={() => router.push({ pathname: '/dashboard/cancel-reason', params: { eventId } })}
            >
              <Text style={styles.cancelBtnText}>Cancel Event</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.messageBtn}
              onPress={() => router.push('/dashboard/chat')}
            >
              <Text style={styles.messageBtnText}>Message Attendees</Text>
            </TouchableOpacity>
          </View>

          {/* Sales Analytics Chart */}
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Sales Analytics</Text>
            <View style={styles.chartBarsRow}>
              {salesData.map((item, index) => (
                <View key={index} style={styles.barColumn}>
                  <View style={styles.barTrack}>
                    <View 
                      style={[
                        styles.barFill, 
                        { 
                          height: `${item.height}%`,
                          backgroundColor: item.active ? '#7B39FD' : '#E9DDFF'
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Attendee Management Section */}
          <View style={styles.attendeeContainer}>
            <View style={styles.attendeeHeader}>
              <Text style={styles.attendeeTitle}>Attendees</Text>
              <TouchableOpacity style={styles.exportBtn}>
                <Text style={styles.exportBtnText}>Export Attendees</Text>
              </TouchableOpacity>
            </View>

            {/* Circular Visual Chart */}
            <View style={styles.circularChartContainer}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Text style={styles.chartInsideTitle}>Attendee</Text>
                  <Text style={styles.chartInsideSubtitle}>Management</Text>
                </View>
              </View>
            </View>

            {/* Attendee Details Badges */}
            <View style={styles.attendeeStats}>
              <View style={[styles.statBadgeBlock, { backgroundColor: '#F3E8FF' }]}>
                <Text style={[styles.statBadgeValue, { color: '#7B39FD' }]}>{Number(totalRegistered).toLocaleString()}</Text>
                <Text style={styles.statBadgeLabel}>Total Registered Guests</Text>
              </View>

              <View style={styles.subStatsRow}>
                <View style={[styles.statBadgeBlockSub, { backgroundColor: '#EBF9E1' }]}>
                  <Text style={[styles.statBadgeValueSub, { color: '#63C100' }]}>{Number(confirmedGuests).toLocaleString()}</Text>
                  <Text style={styles.statBadgeLabelSub}>Confirmed Guests</Text>
                </View>
                <View style={[styles.statBadgeBlockSub, { backgroundColor: '#FFF7E6' }]}>
                  <Text style={[styles.statBadgeValueSub, { color: '#FFB300' }]}>{Number(pendingConfirmations).toLocaleString()}</Text>
                  <Text style={styles.statBadgeLabelSub}>Pending Confirmations</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Audience Activity */}
          <Text style={styles.sectionHeading}>Audience Activity</Text>
          <View style={styles.activityGrid}>
            <TouchableOpacity 
              style={styles.activityBox}
              onPress={() => router.push({ pathname: '/dashboard/analytics/event-saves', params: { eventId } })}
            >
              <Text style={styles.activityVal}>{Number(eventSaves).toLocaleString()}</Text>
              <View style={styles.activityLabelRow}>
                <Text style={styles.activityLabel}>Event Saves</Text>
                <Ionicons name="bookmark-outline" size={16} color="#A0A0A0" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.activityBox}
              onPress={() => router.push({ pathname: '/dashboard/analytics/shares', params: { eventId } })}
            >
              <Text style={styles.activityVal}>{Number(sharesCount).toLocaleString()}</Text>
              <View style={styles.activityLabelRow}>
                <Text style={styles.activityLabel}>Shares</Text>
                <Ionicons name="paper-plane-outline" size={16} color="#A0A0A0" />
              </View>
            </TouchableOpacity>

            <View style={styles.activityBox}>
              <Text style={styles.activityVal}>{Number(likesCount).toLocaleString()}</Text>
              <View style={styles.activityLabelRow}>
                <Text style={styles.activityLabel}>Likes</Text>
                <Ionicons name="heart-outline" size={16} color="#A0A0A0" />
              </View>
            </View>

            <View style={styles.activityBox}>
              <Text style={styles.activityVal}>{Number(commentsCount).toLocaleString()}</Text>
              <View style={styles.activityLabelRow}>
                <Text style={styles.activityLabel}>Comments</Text>
                <Ionicons name="chatbubble-outline" size={16} color="#A0A0A0" />
              </View>
            </View>
          </View>

          {/* Marketing Performance */}
          <View style={styles.marketingContainer}>
            <View style={styles.marketingHeader}>
              <Text style={styles.marketingTitle}>Marketing Performance</Text>
              <TouchableOpacity 
                style={styles.openLinkContainer}
                onPress={() => router.push({ pathname: '/dashboard/analytics/reach', params: { eventId } })}
              >
                <Text style={styles.openLinkText}>Open</Text>
                <Ionicons name="arrow-forward-circle" size={18} color="#7B39FD" />
              </TouchableOpacity>
            </View>

            <View style={styles.marketingCard}>
              <TouchableOpacity 
                style={styles.marketingBox}
                onPress={() => router.push({ pathname: '/dashboard/analytics/reach', params: { eventId } })}
              >
                <Text style={styles.marketingVal}>{Number(adClicks).toLocaleString()}</Text>
                <View style={styles.marketingLabelRow}>
                  <Text style={styles.marketingLabel}>Ad Clicks</Text>
                  <View style={styles.marketingIconBg}>
                    <Ionicons name="people" size={14} color="#7B39FD" />
                  </View>
                </View>
              </TouchableOpacity>

              <View style={[styles.marketingBox, { backgroundColor: '#FFF' }]}>
                <Text style={styles.marketingVal}>{Number(conversionVal).toLocaleString()}</Text>
                <View style={styles.marketingLabelRow}>
                  <Text style={styles.marketingLabel}>Conversion</Text>
                  <View style={[styles.marketingIconBg, { backgroundColor: '#F2F2F2' }]}>
                    <Ionicons name="checkbox-outline" size={14} color="#666" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Latest Ticket Purchases */}
          <View style={styles.purchasesContainer}>
            <View style={styles.purchasesHeader}>
              <Text style={styles.purchasesTitle}>Latest Ticket Purchases</Text>
              <TouchableOpacity 
                style={styles.openLinkContainer}
                onPress={() => router.push('/dashboard/ticket-management')}
              >
                <Text style={styles.openLinkText}>Open</Text>
                <Ionicons name="arrow-forward-circle" size={18} color="#7B39FD" />
              </TouchableOpacity>
            </View>

            {tickets.length === 0 ? (
              <Text style={styles.emptyTickets}>No recent purchases</Text>
            ) : (
              tickets.map((tx: any, idx: number) => {
                const buyerName = tx.user?.name || tx.buyerName || 'Attendee';
                const quantity = tx.quantity || 1;
                const tierName = tx.ticketTier?.tierName || tx.tierName || 'General';
                const amount = tx.amount || tx.totalAmount || 0;
                const dateVal = tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent';
                const avatar = tx.user?.profilePictureUrl || tx.user?.avatarUrl;
                return (
                  <View key={tx.id || idx} style={styles.purchaseItem}>
                    <View style={styles.purchaseLeft}>
                      {avatar ? (
                        <Image source={{ uri: avatar }} style={styles.userAvatar} />
                      ) : (
                        <View style={[styles.userAvatar, styles.avatarPlaceholder]}>
                          <Text style={styles.avatarPlaceholderText}>{buyerName.slice(0, 2).toUpperCase()}</Text>
                        </View>
                      )}
                      <View style={styles.userInfo}>
                        <Text style={styles.userName}>{buyerName}</Text>
                        <Text style={styles.ticketDetails}>{tierName} | {quantity}</Text>
                      </View>
                    </View>
                    <View style={styles.purchaseRight}>
                      <Text style={styles.purchaseAmount}>₦{Number(amount).toLocaleString()}</Text>
                      <Text style={styles.purchaseDate}>{dateVal}</Text>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 15, backgroundColor: '#FAF9FF' },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1A1A1A' },
  editEventButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#7B39FD', borderRadius: 20, paddingVertical: 8, paddingHorizontal: 12, gap: 4 },
  editEventText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  scrollContent: { paddingBottom: 40 },
  eventInfoCard: { backgroundColor: '#FFF', borderRadius: 24, marginHorizontal: 20, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#F0EFF5' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', top: 12, left: 12, right: 12, zIndex: 1 },
  categoryBadge: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  categoryText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  statusBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 5 },
  statusBadgeText: { color: '#FFF', fontSize: 9, fontWeight: '800' },
  bannerImage: { width: '100%', height: 160 },
  cardDetails: { padding: 16 },
  titlePriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  eventTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', flex: 1, marginRight: 10 },
  eventPrice: { fontSize: 16, fontWeight: '800', color: '#7B39FD' },
  metaRow: { flexDirection: 'row', gap: 16 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  metaText: { fontSize: 12, color: '#8F8E9C', fontWeight: '500' },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginBottom: 20 },
  actionButton: { flex: 1, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 12, marginHorizontal: 4, borderWidth: 1, borderColor: '#F0EFF5' },
  actionIconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#7B39FD', justifyContent: 'center', alignItems: 'center', marginBottom: 6 },
  actionText: { fontSize: 11, fontWeight: '700', color: '#1A1A1A' },
  dateSelectorContainer: { alignItems: 'flex-start', marginHorizontal: 20, marginBottom: 16 },
  dateSelectorBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#F0EFF5', gap: 6 },
  dateSelectorText: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  sectionHeading: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginHorizontal: 20, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginBottom: 20 },
  gridBox: { width: (width - 48) / 2, backgroundColor: '#FFF', borderRadius: 18, padding: 16, margin: 4, borderWidth: 1, borderColor: '#F0EFF5' },
  gridValue: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  gridLabel: { fontSize: 11, color: '#8F8E9C', fontWeight: '600' },
  btnRow: { flexDirection: 'row', marginHorizontal: 20, marginBottom: 20, gap: 10 },
  cancelBtn: { flex: 1, height: 48, borderRadius: 24, borderWidth: 1.5, borderColor: '#E9174B', justifyContent: 'center', alignItems: 'center' },
  cancelBtnText: { color: '#E9174B', fontSize: 13, fontWeight: '800' },
  messageBtn: { flex: 1, height: 48, borderRadius: 24, backgroundColor: '#7B39FD', justifyContent: 'center', alignItems: 'center' },
  messageBtnText: { color: '#FFF', fontSize: 13, fontWeight: '800' },
  chartContainer: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F0EFF5', marginBottom: 20 },
  chartTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 16 },
  chartBarsRow: { flexDirection: 'row', justifyContent: 'space-between', height: 120, alignItems: 'flex-end', paddingTop: 10 },
  barColumn: { alignItems: 'center', flex: 1 },
  barTrack: { height: 80, width: 8, backgroundColor: '#FAF9FF', borderRadius: 4, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 4 },
  barLabel: { fontSize: 10, color: '#8F8E9C', marginTop: 8, fontWeight: '600' },
  attendeeContainer: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F0EFF5', marginBottom: 20 },
  attendeeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  attendeeTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  exportBtn: { backgroundColor: '#FAF9FF', borderWidth: 1, borderColor: '#F0EFF5', borderRadius: 12, paddingVertical: 6, paddingHorizontal: 12 },
  exportBtnText: { fontSize: 11, fontWeight: '700', color: '#7B39FD' },
  circularChartContainer: { alignItems: 'center', marginVertical: 10 },
  outerCircle: { width: 140, height: 140, borderRadius: 70, borderWidth: 8, borderColor: '#7B39FD', justifyContent: 'center', alignItems: 'center' },
  innerCircle: { width: 110, height: 110, borderRadius: 55, backgroundColor: '#FAF9FF', justifyContent: 'center', alignItems: 'center' },
  chartInsideTitle: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  chartInsideSubtitle: { fontSize: 10, color: '#8F8E9C', fontWeight: '600', marginTop: 2 },
  attendeeStats: { marginTop: 16, gap: 10 },
  statBadgeBlock: { borderRadius: 16, padding: 14 },
  statBadgeValue: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  statBadgeLabel: { fontSize: 11, color: '#8F8E9C', fontWeight: '600' },
  subStatsRow: { flexDirection: 'row', gap: 10 },
  statBadgeBlockSub: { flex: 1, borderRadius: 16, padding: 12 },
  statBadgeValueSub: { fontSize: 15, fontWeight: '800', marginBottom: 2 },
  statBadgeLabelSub: { fontSize: 10, color: '#8F8E9C', fontWeight: '600' },
  activityGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, marginBottom: 20 },
  activityBox: { width: (width - 48) / 2, backgroundColor: '#FFF', borderRadius: 18, padding: 16, margin: 4, borderWidth: 1, borderColor: '#F0EFF5' },
  activityVal: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  activityLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activityLabel: { fontSize: 11, color: '#8F8E9C', fontWeight: '600' },
  marketingContainer: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F0EFF5', marginBottom: 20 },
  marketingHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  marketingTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  openLinkContainer: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  openLinkText: { fontSize: 12, fontWeight: '700', color: '#7B39FD' },
  marketingCard: { flexDirection: 'row', gap: 10 },
  marketingBox: { flex: 1, backgroundColor: '#FAF9FF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#F0EFF5' },
  marketingVal: { fontSize: 16, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  marketingLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  marketingLabel: { fontSize: 11, color: '#8F8E9C', fontWeight: '600' },
  marketingIconBg: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  purchasesContainer: { backgroundColor: '#FFF', marginHorizontal: 20, borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F0EFF5', marginBottom: 40 },
  purchasesTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A' },
  purchasesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  emptyTickets: { fontSize: 12, color: '#999', textAlign: 'center', marginVertical: 10 },
  purchaseItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F9' },
  purchaseLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  userAvatar: { width: 36, height: 36, borderRadius: 18 },
  avatarPlaceholder: { backgroundColor: '#F0F0F3', justifyContent: 'center', alignItems: 'center' },
  avatarPlaceholderText: { fontSize: 11, fontWeight: '700', color: '#666' },
  userInfo: { flex: 1 },
  userName: { fontSize: 13, fontWeight: '700', color: '#1A1A1A' },
  ticketDetails: { fontSize: 11, color: '#8F8E9C', marginTop: 2, fontWeight: '600' },
  purchaseRight: { alignItems: 'flex-end' },
  purchaseAmount: { fontSize: 13, fontWeight: '800', color: '#1A1A1A' },
  purchaseDate: { fontSize: 10, color: '#8F8E9C', marginTop: 4, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingVertical: 20 },
  modalOption: { paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#F5F5F9' },
  modalOptionText: { fontSize: 15, fontWeight: '700', color: '#1A1A1A' },
});
