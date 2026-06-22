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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function DashboardMain() {
  const router = useRouter();
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last Month');
  const [engagementModalVisible, setEngagementModalVisible] = useState(false);
  const [engagementDateRange, setEngagementDateRange] = useState('Today');

  const handleSelectDateRange = (range: string) => {
    setSelectedDateRange(range);
    setDateModalVisible(false);
  };

  const handleSelectEngagementDate = (range: string) => {
    setEngagementDateRange(range);
    setEngagementModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />
      
      {/* Scrollable Content */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile / Host Header */}
        <View style={styles.hostHeader}>
          <View style={styles.hostInfo}>
            <TouchableOpacity style={styles.backBtnCircle} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <Image 
              source={require('@/assets/images/dav.png')} 
              style={styles.hostAvatar} 
            />
            <View style={styles.hostTextCol}>
              <Text style={styles.hostName}>Roland Emmanuel</Text>
              <Text style={styles.hostWelcome}>Welcome Back</Text>
            </View>
          </View>
          <View style={styles.headerRightActions}>
            <TouchableOpacity style={styles.circleIconBtn}>
              <Ionicons name="document-text-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleIconBtn}>
              <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Overview section box */}
        <View style={styles.overviewSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <TouchableOpacity 
              style={styles.dateSelector}
              onPress={() => setDateModalVisible(true)}
            >
              <Text style={styles.dateSelectorText}>{selectedDateRange}</Text>
              <Ionicons name="chevron-down" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsGrid}>
            {/* Tickets Sold */}
            <TouchableOpacity 
              style={styles.gridBox}
              onPress={() => router.push('/dashboard/analytics/tickets-sold')}
            >
              <View style={styles.gridTop}>
                <Text style={styles.gridValue}>2,540</Text>
                <View style={styles.arrowCircle}>
                  <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
                </View>
              </View>
              <Text style={styles.gridLabel}>Tickets Sold</Text>
            </TouchableOpacity>

            {/* Revenue */}
            <TouchableOpacity 
              style={[styles.gridBox, styles.purpleBorder]}
              onPress={() => router.push('/dashboard/analytics/all-tickets')}
            >
              <View style={styles.gridTop}>
                <Text style={styles.gridValue}>₦12,540,000</Text>
              </View>
              <Text style={styles.gridLabel}>Revenue</Text>
            </TouchableOpacity>

            {/* Audience Reach */}
            <TouchableOpacity 
              style={styles.gridBox}
              onPress={() => router.push('/dashboard/analytics/reach')}
            >
              <View style={styles.gridTop}>
                <Text style={styles.gridValue}>45,000</Text>
              </View>
              <Text style={styles.gridLabel}>Audience Reach</Text>
            </TouchableOpacity>

            {/* Active Campaigns */}
            <TouchableOpacity style={styles.gridBox}>
              <View style={styles.gridTop}>
                <Text style={styles.gridValue}>4 Active</Text>
                <View style={styles.arrowCircle}>
                  <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
                </View>
              </View>
              <Text style={styles.gridLabel}>Campaigns</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Create Event Promo Card */}
        <View style={styles.createEventCard}>
          <View style={styles.createEventLeft}>
            <Text style={styles.createEventTitle}>Create event</Text>
            <Text style={styles.createEventSubtitle}>
              Host concerts, parties, livestreams, festivals, and exclusive experiences.
            </Text>
            <TouchableOpacity 
              style={styles.createEventBtn}
              onPress={() => router.push('/dashboard/create-event')}
            >
              <Text style={styles.createEventBtnText}>Create Event</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.calendarIconContainer}>
            <View style={styles.calendarHeader} />
            <View style={styles.calendarBody}>
              <Text style={styles.calendarDayText}>11</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Events Horizontal Slider */}
        <View style={styles.upcomingHeaderRow}>
          <Text style={styles.upcomingTitle}>Upcoming Events</Text>
          <TouchableOpacity 
            style={styles.openLinkContainer}
            onPress={() => router.push('/dashboard/upcoming-events')}
          >
            <Text style={styles.openLinkText}>Open</Text>
            <Ionicons name="arrow-forward-circle" size={16} color="#7B39FD" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={styles.upcomingSliderContent}
        >
          <TouchableOpacity 
            style={styles.upcomingCard}
            onPress={() => router.push('/dashboard/analytics')}
          >
            <Image 
              source={require('@/assets/images/ye.png')} 
              style={styles.upcomingCardImage}
              contentFit="cover"
            />
            <View style={styles.upcomingCardDetails}>
              <View style={styles.miniStatsRow}>
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatVal}>45,000</Text>
                  <View style={styles.miniLabelRow}>
                    <Text style={styles.miniLabel}>Tickets Sold</Text>
                    <Ionicons name="arrow-up-outline" size={10} color="#1A1A1A" />
                  </View>
                </View>
                <View style={styles.miniStatBox}>
                  <Text style={styles.miniStatVal}>₦431,000</Text>
                  <Text style={styles.miniLabel}>Revenue</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.dotIndicatorRow}>
          <View style={[styles.dotIndicator, styles.dotActive]} />
          <View style={styles.dotIndicator} />
          <View style={styles.dotIndicator} />
        </View>

        {/* Audience Engagement Metrics */}
        <View style={styles.engagementContainer}>
          <View style={styles.engagementHeaderRow}>
            <Text style={styles.engagementTitle}>Audience Engagement</Text>
            <TouchableOpacity 
              style={styles.engagementDateBtn}
              onPress={() => setEngagementModalVisible(true)}
            >
              <Text style={styles.engagementDateText}>{engagementDateRange}</Text>
              <Ionicons name="chevron-down" size={14} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* New Followers */}
          <TouchableOpacity 
            style={styles.engagementRow}
            onPress={() => router.push('/profile/following')}
          >
            <View style={styles.engagementLeft}>
              <View style={styles.iconCircleBg}>
                <Ionicons name="people-outline" size={18} color="#1A1A1A" />
              </View>
              <View style={styles.engagementTextCol}>
                <Text style={styles.engagementVal}>291</Text>
                <Text style={styles.engagementLabel}>New Followers</Text>
              </View>
            </View>
            <View style={styles.arrowCircle}>
              <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
            </View>
          </TouchableOpacity>

          {/* Event Saves */}
          <TouchableOpacity 
            style={styles.engagementRow}
            onPress={() => router.push('/dashboard/analytics/event-saves')}
          >
            <View style={styles.engagementLeft}>
              <View style={styles.iconCircleBg}>
                <Ionicons name="bookmark-outline" size={18} color="#1A1A1A" />
              </View>
              <View style={styles.engagementTextCol}>
                <Text style={styles.engagementVal}>82</Text>
                <Text style={styles.engagementLabel}>Event Saves</Text>
              </View>
            </View>
            <View style={styles.arrowCircle}>
              <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
            </View>
          </TouchableOpacity>

          {/* Shares */}
          <TouchableOpacity 
            style={styles.engagementRow}
            onPress={() => router.push('/dashboard/analytics/shares')}
          >
            <View style={styles.engagementLeft}>
              <View style={styles.iconCircleBg}>
                <Ionicons name="paper-plane-outline" size={18} color="#1A1A1A" />
              </View>
              <View style={styles.engagementTextCol}>
                <Text style={styles.engagementVal}>12</Text>
                <Text style={styles.engagementLabel}>Shares</Text>
              </View>
            </View>
            <View style={styles.arrowCircle}>
              <MaterialCommunityIcons name="arrow-up-right" size={14} color="#1A1A1A" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.activeIndicatorDot} />
          <MaterialCommunityIcons name="view-grid" size={24} color="#1A1A1A" style={styles.activeIconOffset} />
          <Text style={[styles.tabLabel, { color: '#1A1A1A', fontWeight: '700' }]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/active-events')}
        >
          <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/ticket-management')}
        >
          <MaterialCommunityIcons name="ticket-confirmation-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Tickets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/wallet')}
        >
          <MaterialCommunityIcons name="wallet-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Wallets</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/promotion')}
        >
          <MaterialCommunityIcons name="bullhorn-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Promotion</Text>
        </TouchableOpacity>
      </View>

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

      {/* MODAL FOR ENGAGEMENT FILTER */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={engagementModalVisible}
        onRequestClose={() => setEngagementModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setEngagementModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectEngagementDate('Today')}
            >
              <Text style={styles.modalOptionText}>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectEngagementDate('This Month')}
            >
              <Text style={styles.modalOptionText}>This Month</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectEngagementDate('Last Month')}
            >
              <Text style={styles.modalOptionText}>Last Month</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  scrollContent: {
    paddingBottom: 110,
  },
  hostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 15,
    paddingBottom: 20,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtnCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  hostTextCol: {
    justifyContent: 'center',
  },
  hostName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  hostWelcome: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  circleIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
  },
  overviewSection: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B39FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  dateSelectorText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridBox: {
    width: (width - 52) / 2,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  purpleBorder: {
    borderColor: '#C3B0FF',
    backgroundColor: '#FAF7FF',
  },
  gridTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  createEventCard: {
    backgroundColor: '#000',
    marginHorizontal: 20,
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    position: 'relative',
    overflow: 'hidden',
  },
  createEventLeft: {
    flex: 1,
    paddingRight: 15,
  },
  createEventTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  createEventSubtitle: {
    color: '#D0D0D0',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  createEventBtn: {
    backgroundColor: '#7B39FD',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  createEventBtnText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  calendarIconContainer: {
    width: 75,
    height: 75,
    backgroundColor: '#FFF',
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#FFF',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarHeader: {
    width: '100%',
    height: 18,
    backgroundColor: '#FF5C5C',
    position: 'absolute',
    top: 0,
  },
  calendarBody: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
  },
  calendarDayText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  upcomingHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
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
  upcomingSliderContent: {
    paddingHorizontal: 20,
  },
  upcomingCard: {
    width: width - 40,
    backgroundColor: '#FFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    overflow: 'hidden',
  },
  upcomingCardImage: {
    width: '100%',
    height: 160,
  },
  upcomingCardDetails: {
    padding: 20,
  },
  miniStatsRow: {
    flexDirection: 'row',
    gap: 15,
  },
  miniStatBox: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  miniStatVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  miniLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  miniLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#8E8E93',
  },
  dotIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 15,
    marginBottom: 25,
  },
  dotIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E5EA',
  },
  dotActive: {
    width: 14,
    backgroundColor: '#7B39FD',
  },
  engagementContainer: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 20,
  },
  engagementHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  engagementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  engagementDateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B39FD',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  engagementDateText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  engagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  engagementLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconCircleBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  engagementTextCol: {
    justifyContent: 'center',
  },
  engagementVal: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  engagementLabel: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  bottomTabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  activeIndicatorDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1A1A1A',
    position: 'absolute',
    top: -8,
  },
  activeIconOffset: {
    marginTop: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
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
