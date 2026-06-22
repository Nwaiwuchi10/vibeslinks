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

export default function TicketManagementMain() {
  const router = useRouter();
  const [eventModalVisible, setEventModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('Afro Summer Festival');
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState('Last Month');

  // Chart data matching UI mockup design exactly
  const salesPerformanceData = [
    { label: '₦9k', height: 10 },
    { label: '₦60k', height: 60 },
    { label: '₦201k', height: 20 },
    { label: '₦1.2M', height: 65 },
    { label: '₦4M', height: 80 },
    { label: '₦4M+', height: 40 },
    { label: '₦4M++', height: 70, active: true },
  ];

  const handleSelectEvent = (event: string) => {
    setSelectedEvent(event);
    setEventModalVisible(false);
  };

  const handleSelectDateRange = (range: string) => {
    setSelectedDateRange(range);
    setDateModalVisible(false);
  };

  const latestPurchases = [
    {
      id: '1',
      name: 'Sophia',
      tickets: 'General | 2',
      amount: '₦431,000',
      date: 'Thu Jun 11, 2026',
      image: require('@/assets/images/artist_event.png'),
    },
    {
      id: '2',
      name: 'Favour',
      tickets: 'VIP | 3',
      amount: '₦741,000',
      date: 'Thu Jun 11, 2026',
      placeholder: 'CF',
      bg: '#E29A86',
    },
    {
      id: '3',
      name: 'Roland',
      tickets: 'General | 2, VIP | 3',
      amount: '₦653,000',
      date: 'Thu Jun 11, 2026',
      placeholder: 'RE',
      bg: '#7B39FD',
    },
    {
      id: '4',
      name: 'Emmanuella',
      tickets: 'General | 2, VIP | 3, VVIP | 6',
      amount: '₦832,000',
      date: 'Thu Jun 11, 2026',
      image: require('@/assets/images/dav.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ticket Management</Text>
        <TouchableOpacity style={styles.headerIconButton}>
          <Ionicons name="document-text-outline" size={20} color="#FAF9FF" />
        </TouchableOpacity>
      </View>

      {/* Selector dropdown menu */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownBtn}
          onPress={() => setEventModalVisible(true)}
        >
          <Text style={styles.dropdownText}>{selectedEvent}</Text>
          <Ionicons name="chevron-down" size={18} color="#666" />
        </TouchableOpacity>
      </View>

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
              <Text style={styles.gridValue}>2,540</Text>
              <Text style={styles.gridLabel}>Total Tickets Sold</Text>
            </View>
            <View style={[styles.gridBox, styles.purpleBorder]}>
              <Text style={styles.gridValue}>₦12,540,000</Text>
              <Text style={styles.gridLabel}>Revenue</Text>
            </View>
            <View style={[styles.gridBox, styles.yellowBorder, { backgroundColor: '#FCF9F2' }]}>
              <Text style={styles.gridValue}>N0</Text>
              <Text style={styles.gridLabel}>Refunds</Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridValue}>45,000</Text>
              <Text style={styles.gridLabel}>Available</Text>
            </View>
          </View>
        </View>

        {/* Sales Performance Chart */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeaderRow}>
            <Text style={styles.chartTitle}>Sales Performance</Text>
            <Text style={styles.chartSubtitle}>
              Last Month <Text style={styles.chartValColor}>₦431,000</Text>
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
              {salesPerformanceData.map((item, index) => (
                <View key={index} style={styles.barTrack}>
                  <View 
                    style={[
                      styles.barFill, 
                      { 
                        height: `${item.height}%`,
                        backgroundColor: item.active ? '#7B39FD' : '#EBE4FF'
                      }
                    ]} 
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Ticket Categories Swipe View Carousel (Static Preview) */}
        <View style={styles.carouselSection}>
          <View style={styles.carouselHeader}>
            <Text style={styles.carouselTitle}>Ticket Categories</Text>
            <TouchableOpacity 
              style={styles.detailsBtn}
              onPress={() => router.push('/dashboard/analytics/all-tickets')}
            >
              <Text style={styles.detailsBtnText}>Details</Text>
              <Ionicons name="arrow-forward-circle" size={16} color="#7B39FD" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carouselContent}>
            <View style={styles.categoryCard}>
              <View style={styles.categoryCardHeader}>
                <View style={styles.cardIconBox}>
                  <Ionicons name="phone-portrait-outline" size={18} color="#7B39FD" />
                </View>
                <Text style={styles.cardPrice}>₦150,000<Text style={styles.perPerson}>/Person</Text></Text>
              </View>

              <Text style={styles.cardCategoryName}>VIP</Text>

              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• Lounge access</Text>
                <Text style={styles.featureItem}>• Free drinks</Text>
                <Text style={styles.featureItem}>• Priority entry</Text>
              </View>

              <View style={styles.cardBottomRow}>
                <View style={styles.statMiniBox}>
                  <Text style={styles.statMiniVal}>45,000</Text>
                  <Text style={styles.statMiniLabel}>Sold</Text>
                </View>
                <View style={styles.statMiniBox}>
                  <Text style={styles.statMiniVal}>354</Text>
                  <Text style={styles.statMiniLabel}>Remaining</Text>
                </View>
              </View>
            </View>

            <View style={styles.categoryCard}>
              <View style={styles.categoryCardHeader}>
                <View style={styles.cardIconBox}>
                  <Ionicons name="phone-portrait-outline" size={18} color="#7B39FD" />
                </View>
                <Text style={styles.cardPrice}>₦350,000<Text style={styles.perPerson}>/Person</Text></Text>
              </View>

              <Text style={styles.cardCategoryName}>VVIP</Text>

              <View style={styles.featuresList}>
                <Text style={styles.featureItem}>• Backstage Pass</Text>
                <Text style={styles.featureItem}>• Meet & Greet</Text>
                <Text style={styles.featureItem}>• Premium Buffet</Text>
              </View>

              <View style={styles.cardBottomRow}>
                <View style={styles.statMiniBox}>
                  <Text style={styles.statMiniVal}>45,000</Text>
                  <Text style={styles.statMiniLabel}>Sold</Text>
                </View>
                <View style={styles.statMiniBox}>
                  <Text style={styles.statMiniVal}>9</Text>
                  <Text style={styles.statMiniLabel}>Remaining</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          <View style={styles.dotIndicatorRow}>
            <View style={[styles.dotIndicator, styles.dotActive]} />
            <View style={styles.dotIndicator} />
            <View style={styles.dotIndicator} />
          </View>
        </View>

        {/* Latest Ticket Purchases */}
        <View style={styles.purchasesSection}>
          <View style={styles.purchasesHeader}>
            <Text style={styles.purchasesTitle}>Latest Ticket Purchases</Text>
            <TouchableOpacity 
              style={styles.openLinkContainer}
              onPress={() => router.push('/dashboard/analytics/tickets-sold')}
            >
              <Text style={styles.openLinkText}>Open</Text>
              <Ionicons name="arrow-forward-circle" size={16} color="#7B39FD" />
            </TouchableOpacity>
          </View>

          {latestPurchases.map((item) => (
            <View key={item.id} style={styles.purchaseRow}>
              <View style={styles.purchaseLeft}>
                {item.image ? (
                  <Image source={item.image} style={styles.avatar} />
                ) : (
                  <View style={[styles.avatar, styles.placeholderAvatar, { backgroundColor: item.bg }]}>
                    <Text style={styles.placeholderText}>{item.placeholder}</Text>
                  </View>
                )}
                <View style={styles.infoCol}>
                  <Text style={styles.purchaserName}>{item.name}</Text>
                  <Text style={styles.purchaseDetails}>{item.tickets}</Text>
                </View>
              </View>
              <View style={styles.purchaseRight}>
                <Text style={styles.purchaseAmount}>{item.amount}</Text>
                <Text style={styles.purchaseDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

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
              onPress={() => handleSelectEvent('All')}
            >
              <Text style={styles.modalOptionText}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectEvent('Afro Summer Festival')}
            >
              <Text style={styles.modalOptionText}>Afro Summer Festival</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.modalOption} 
              onPress={() => handleSelectEvent('Deejay Coded Showcase')}
            >
              <Text style={styles.modalOptionText}>Deejay Coded Showcase</Text>
            </TouchableOpacity>
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
      {/* Sticky Bottom Tab Bar */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard')}
        >
          <MaterialCommunityIcons name="view-grid-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Overview</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/active-events')}
        >
          <MaterialCommunityIcons name="calendar-month-outline" size={24} color="#A0A0A0" />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.activeIndicatorDot} />
          <MaterialCommunityIcons name="ticket-confirmation" size={24} color="#1A1A1A" style={styles.activeIconOffset} />
          <Text style={[styles.tabLabel, { color: '#1A1A1A', fontWeight: '700' }]}>Tickets</Text>
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
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
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
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContainer: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 24,
    height: 48,
    paddingHorizontal: 20,
  },
  dropdownText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  overviewSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionHeaderTitle: {
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
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridBox: {
    width: (width - 92) / 2,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  purpleBorder: {
    borderColor: '#C3B0FF',
  },
  yellowBorder: {
    borderColor: '#FFE0A3',
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 6,
  },
  chartSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 20,
    marginBottom: 20,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  chartSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  chartValColor: {
    color: '#7B39FD',
    fontWeight: '700',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingRight: 15,
  },
  axisLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '600',
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#F5F5F9',
    paddingLeft: 10,
  },
  barTrack: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 4,
  },
  barFill: {
    width: 22,
    borderRadius: 11,
  },
  carouselSection: {
    marginBottom: 20,
  },
  carouselHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  carouselTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailsBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7B39FD',
  },
  carouselContent: {
    paddingHorizontal: 20,
    gap: 15,
  },
  categoryCard: {
    width: width * 0.7,
    backgroundColor: '#FFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 20,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FAF7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#7B39FD',
  },
  perPerson: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
  cardCategoryName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  featuresList: {
    backgroundColor: '#FAFAFC',
    borderRadius: 18,
    padding: 14,
    gap: 8,
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  cardBottomRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statMiniBox: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    borderRadius: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  statMiniVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  statMiniLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 2,
  },
  dotIndicatorRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 15,
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
  purchasesSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 20,
  },
  purchasesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  purchasesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
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
  purchaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  purchaseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 12,
  },
  infoCol: {
    justifyContent: 'center',
  },
  purchaserName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  purchaseDetails: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    marginTop: 2,
  },
  purchaseRight: {
    alignItems: 'flex-end',
  },
  purchaseAmount: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  purchaseDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 2,
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
});
