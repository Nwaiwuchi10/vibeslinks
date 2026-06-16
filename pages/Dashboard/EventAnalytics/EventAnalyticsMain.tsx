import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function EventAnalyticsMain() {
  const router = useRouter();
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('This Month');

  // Mock data for sales analytics chart
  const salesData = [
    { day: 'Mon', height: 60, active: false },
    { day: 'Tue', height: 30, active: false },
    { day: 'Wed', height: 75, active: false },
    { day: 'Thu', height: 100, active: false },
    { day: 'Fri', height: 50, active: false },
    { day: 'Sat', height: 85, active: true },
    { day: 'Sun', height: 10, active: false },
  ];

  const handleSelectDateRange = (range: string) => {
    setSelectedDateRange(range);
    setDateModalVisible(false);
  };

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
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectDateRange('Today')}
            >
              <Text style={styles.modalOptionText}>Today</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectDateRange('This Month')}
            >
              <Text style={styles.modalOptionText}>This Month</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectDateRange('Last Month')}
            >
              <Text style={styles.modalOptionText}>Last Month</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Analytics</Text>
        <TouchableOpacity style={styles.editEventButton}>
          <Text style={styles.editEventText}>Edit Event</Text>
          <Ionicons name="arrow-forward" size={12} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Event Info Card */}
        <View style={styles.eventInfoCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>NIGHTLIFE</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: '#63C100' }]}>
              <Text style={styles.statusBadgeText}>Active Event</Text>
            </View>
          </View>

          <Image
            source={require('@/assets/images/ye.png')}
            style={styles.bannerImage}
            contentFit="cover"
          />

          <View style={styles.cardDetails}>
            <View style={styles.titlePriceRow}>
              <Text style={styles.eventTitle}>Afro Summer Festival</Text>
              <Text style={styles.eventPrice}>₦80,000</Text>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="location" size={16} color="#7B39FD" />
                <Text style={styles.metaText}>Lekki Ikata, Lagos Nigeria</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="time" size={16} color="#7B39FD" />
                <Text style={styles.metaText}>May 15 - 9:00 PM</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIconCircle}>
              <Ionicons name="create-outline" size={20} color="#FFF" />
            </View>
            <Text style={styles.actionText}>Edit Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
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
            onPress={() => router.push('/dashboard/analytics/tickets-sold')}
          >
            <Text style={styles.gridValue}>45,000</Text>
            <Text style={styles.gridLabel}>Tickets Sold</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.gridBox}
            onPress={() => router.push('/dashboard/analytics/all-tickets')}
          >
            <Text style={styles.gridValue}>₦597,000</Text>
            <Text style={styles.gridLabel}>Revenue</Text>
          </TouchableOpacity>
          <View style={styles.gridBox}>
            <Text style={styles.gridValue}>1,180</Text>
            <Text style={styles.gridLabel}>Attendees</Text>
          </View>
          <View style={styles.gridBox}>
            <Text style={styles.gridValue}>25,000</Text>
            <Text style={styles.gridLabel}>Page Views</Text>
          </View>
        </View>

        {/* Action Button Row */}
        <View style={styles.btnRow}>
          <TouchableOpacity 
            style={styles.cancelBtn}
            onPress={() => router.push('/dashboard/cancel-reason')}
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

        {/* Countdown Banner */}
        <View style={styles.countdownContainer}>
          <Image
            source={require('@/assets/images/ye.png')}
            style={styles.countdownBg}
            contentFit="cover"
          />
          <View style={styles.countdownOverlay} />
          <View style={styles.countdownContent}>
            <Text style={styles.countdownTitle}>Countdown</Text>
            <View style={styles.timerRow}>
              <View style={styles.timeBox}>
                <Text style={styles.timeVal}>05</Text>
                <Text style={styles.timeUnit}>DAYS</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeVal}>22</Text>
                <Text style={styles.timeUnit}>HOURS</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeVal}>05</Text>
                <Text style={styles.timeUnit}>MINUTES</Text>
              </View>
              <Text style={styles.timerColon}>:</Text>
              <View style={styles.timeBox}>
                <Text style={styles.timeVal}>01</Text>
                <Text style={styles.timeUnit}>SECONDS</Text>
              </View>
            </View>
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
              <Text style={[styles.statBadgeValue, { color: '#7B39FD' }]}>25,002</Text>
              <Text style={styles.statBadgeLabel}>Total Registered Guests</Text>
            </View>

            <View style={styles.subStatsRow}>
              <View style={[styles.statBadgeBlockSub, { backgroundColor: '#EBF9E1' }]}>
                <Text style={[styles.statBadgeValueSub, { color: '#63C100' }]}>24,400</Text>
                <Text style={styles.statBadgeLabelSub}>Confirmed Guests</Text>
              </View>
              <View style={[styles.statBadgeBlockSub, { backgroundColor: '#FFF7E6' }]}>
                <Text style={[styles.statBadgeValueSub, { color: '#FFB300' }]}>1,300</Text>
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
            onPress={() => router.push('/dashboard/analytics/event-saves')}
          >
            <Text style={styles.activityVal}>9023</Text>
            <View style={styles.activityLabelRow}>
              <Text style={styles.activityLabel}>Event Saves</Text>
              <Ionicons name="bookmark-outline" size={16} color="#A0A0A0" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.activityBox}
            onPress={() => router.push('/dashboard/analytics/shares')}
          >
            <Text style={styles.activityVal}>391</Text>
            <View style={styles.activityLabelRow}>
              <Text style={styles.activityLabel}>Shares</Text>
              <Ionicons name="paper-plane-outline" size={16} color="#A0A0A0" />
            </View>
          </TouchableOpacity>

          <View style={styles.activityBox}>
            <Text style={styles.activityVal}>3301</Text>
            <View style={styles.activityLabelRow}>
              <Text style={styles.activityLabel}>Likes</Text>
              <Ionicons name="heart-outline" size={16} color="#A0A0A0" />
            </View>
          </View>

          <View style={styles.activityBox}>
            <Text style={styles.activityVal}>39,402</Text>
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
            <TouchableOpacity style={styles.openLinkContainer}>
              <Text style={styles.openLinkText}>Open</Text>
              <Ionicons name="arrow-forward-circle" size={18} color="#7B39FD" />
            </TouchableOpacity>
          </View>

          <View style={styles.marketingCard}>
            <TouchableOpacity 
              style={styles.marketingBox}
              onPress={() => router.push('/dashboard/analytics/reach')}
            >
              <Text style={styles.marketingVal}>3301</Text>
              <View style={styles.marketingLabelRow}>
                <Text style={styles.marketingLabel}>Ad Clicks</Text>
                <View style={styles.marketingIconBg}>
                  <Ionicons name="people" size={14} color="#7B39FD" />
                </View>
              </View>
            </TouchableOpacity>

            <View style={[styles.marketingBox, { backgroundColor: '#FFF' }]}>
              <Text style={styles.marketingVal}>2124</Text>
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
            <TouchableOpacity style={styles.openLinkContainer}>
              <Text style={styles.openLinkText}>Open</Text>
              <Ionicons name="arrow-forward-circle" size={18} color="#7B39FD" />
            </TouchableOpacity>
          </View>

          {/* User 1 */}
          <View style={styles.purchaseItem}>
            <View style={styles.purchaseLeft}>
              <Image
                source={require('@/assets/images/artist_event.png')}
                style={styles.userAvatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Sophia</Text>
                <Text style={styles.ticketDetails}>General | 2</Text>
              </View>
            </View>
            <View style={styles.purchaseRight}>
              <Text style={styles.purchaseAmount}>₦431,000</Text>
              <Text style={styles.purchaseDate}>Thu Jun 11, 2026</Text>
            </View>
          </View>

          {/* User 2 */}
          <View style={styles.purchaseItem}>
            <View style={styles.purchaseLeft}>
              <View style={[styles.userAvatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarPlaceholderText}>RE</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>Roland</Text>
                <Text style={styles.ticketDetails}>General | 2, VIP | 3</Text>
              </View>
            </View>
            <View style={styles.purchaseRight}>
              <Text style={styles.purchaseAmount}>₦741,000</Text>
              <Text style={styles.purchaseDate}>Thu Jun 11, 2026</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    backgroundColor: '#FAF9FF',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  editEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B39FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  editEventText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 50,
  },
  eventInfoCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    marginBottom: 20,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bannerImage: {
    width: '100%',
    height: 150,
    borderRadius: 20,
    marginBottom: 16,
  },
  cardDetails: {
    paddingHorizontal: 4,
  },
  titlePriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  eventPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#7B39FD',
  },
  metaRow: {
    flexDirection: 'column',
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  actionsContainer: {
    backgroundColor: '#2E2E35',
    marginHorizontal: 20,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 25,
  },
  actionButton: {
    alignItems: 'center',
    gap: 8,
  },
  actionIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  gridBox: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#999',
    marginTop: 4,
  },
  btnRow: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
    marginBottom: 25,
  },
  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: '#FF4D4D',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  cancelBtnText: {
    color: '#FF4D4D',
    fontSize: 14,
    fontWeight: '700',
  },
  messageBtn: {
    flex: 2,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  chartContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginBottom: 25,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 5,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 100,
    width: 20,
    backgroundColor: '#FAF9FF',
    borderRadius: 10,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 10,
  },
  barLabel: {
    fontSize: 10,
    color: '#999',
    fontWeight: '600',
    marginTop: 8,
  },
  countdownContainer: {
    marginHorizontal: 20,
    height: 160,
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 25,
    justifyContent: 'center',
  },
  countdownBg: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  countdownContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  countdownTitle: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 15,
    letterSpacing: 0.5,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeBox: {
    alignItems: 'center',
    minWidth: 45,
  },
  timeVal: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
  },
  timeUnit: {
    fontSize: 8,
    fontWeight: '700',
    color: '#A0A0A0',
    marginTop: 2,
  },
  timerColon: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    paddingBottom: 12,
  },
  attendeeContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginBottom: 25,
  },
  attendeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  attendeeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  exportBtn: {
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  exportBtnText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  circularChartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  outerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 10,
    borderColor: '#7B39FD',
    borderTopColor: '#63C100',
    borderRightColor: '#63C100',
    borderBottomColor: '#FFB300',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartInsideTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  chartInsideSubtitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 2,
  },
  attendeeStats: {
    gap: 10,
  },
  statBadgeBlock: {
    width: '100%',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadgeValue: {
    fontSize: 18,
    fontWeight: '800',
  },
  statBadgeLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
  },
  subStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBadgeBlockSub: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statBadgeValueSub: {
    fontSize: 16,
    fontWeight: '800',
  },
  statBadgeLabelSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#666',
    marginTop: 2,
  },
  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  activityBox: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  activityVal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  activityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  activityLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#999',
  },
  marketingContainer: {
    marginHorizontal: 20,
    marginBottom: 25,
  },
  marketingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  marketingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  openLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7B39FD',
  },
  marketingCard: {
    backgroundColor: '#7B39FD',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
  },
  marketingBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
  },
  marketingVal: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  marketingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  marketingLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#FFF',
  },
  marketingIconBg: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  purchasesContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginBottom: 20,
  },
  purchasesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  purchasesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  purchaseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F6F6F6',
  },
  purchaseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    backgroundColor: '#E8E8FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPlaceholderText: {
    color: '#7B39FD',
    fontWeight: '700',
    fontSize: 12,
  },
  userInfo: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  ticketDetails: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    fontWeight: '500',
  },
  purchaseRight: {
    alignItems: 'flex-end',
  },
  purchaseAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  purchaseDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
  },
  dateSelectorContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dateSelectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  dateSelectorText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalOption: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
