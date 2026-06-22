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
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type DateFilter = 'Today' | 'This Month' | 'Last Month';

const STAT_CARDS = [
  {
    id: 'active',
    value: '4',
    label: 'Active Campaigns',
    highlighted: false,
    hasArrow: true,
  },
  {
    id: 'reach',
    value: '125,000',
    label: 'Campaigns Reach',
    highlighted: true,
    hasArrow: false,
  },
  {
    id: 'ticket',
    value: '860',
    label: 'Ticket Sales',
    highlighted: false,
    hasArrow: false,
  },
  {
    id: 'conversion',
    value: '6.8%',
    label: 'Conversion Rate',
    highlighted: false,
    hasArrow: true,
  },
];

export default function PromotionMain() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<DateFilter>('Last Month');
  const [filterModalVisible, setFilterModalVisible] = useState(false);

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
              <Ionicons name="document-text-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.circleIconBtn}>
              <Ionicons name="notifications-outline" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Promotions Banner ── */}
        <View style={styles.promoBanner}>
          {/* Text side */}
          <View style={styles.promoTextCol}>
            <Text style={styles.promoBannerTitle}>Promotions</Text>
            <Text style={styles.promoBannerSubtitle}>
              Reach more people, increase ticket{'\n'}sales, and grow event awareness.
            </Text>
            <TouchableOpacity
              style={styles.createCampaignBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/dashboard/choose-event')}
            >
              <Text style={styles.createCampaignBtnText}>Create Campaign</Text>
            </TouchableOpacity>
          </View>

          {/* Megaphone Icon (right side) */}
          <View style={styles.megaphoneWrapper}>
            {/* 3D Megaphone approximation using views */}
            <View style={styles.megaphoneBody}>
              <View style={styles.megaphoneHead} />
              <View style={styles.megaphoneCone} />
              <View style={styles.megaphoneHandle} />
              {/* Sound waves */}
              <View style={[styles.soundWave, { right: -8, top: 12, width: 6, height: 6 }]} />
              <View style={[styles.soundWave, { right: -14, top: 6, width: 4, height: 4 }]} />
              <View style={[styles.soundWave, { right: -18, top: 1, width: 3, height: 3 }]} />
            </View>
            {/* Red emoji-like megaphone icon via text */}
            <Text style={styles.megaphoneEmoji}>📣</Text>
          </View>
        </View>

        {/* ── Overview Card ── */}
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
        </View>
      </ScrollView>

      {/* ── Bottom Tab Bar ── */}
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

        {/* Active — Promotion */}
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

const CARD_W = (width - 40 - 36 - 12) / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  scrollContent: {
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  circleIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Promo Banner
  promoBanner: {
    marginHorizontal: 20,
    backgroundColor: '#111',
    borderRadius: 22,
    padding: 22,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  promoTextCol: {
    flex: 1,
    gap: 8,
  },
  promoBannerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
  },
  promoBannerSubtitle: {
    fontSize: 12,
    color: '#AAAAAA',
    lineHeight: 18,
    fontWeight: '400',
  },
  createCampaignBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  createCampaignBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  megaphoneWrapper: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  megaphoneEmoji: {
    fontSize: 52,
    transform: [{ scaleX: -1 }], // flip to match design
  },
  megaphoneBody: { display: 'none' },
  megaphoneHead: { display: 'none' },
  megaphoneCone: { display: 'none' },
  megaphoneHandle: { display: 'none' },
  soundWave: { display: 'none' },

  // Overview Card
  overviewCard: {
    marginHorizontal: 20,
    backgroundColor: '#F5F4FF',
    borderRadius: 22,
    padding: 18,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  overviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6A6A6A',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7B39FD',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    gap: 5,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: CARD_W,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    position: 'relative',
    minHeight: 100,
    justifyContent: 'flex-end',
  },
  statCardHighlighted: {
    backgroundColor: '#EDE3FF',
    borderWidth: 2,
    borderColor: '#7B39FD',
  },
  arrowTopRight: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statValueHighlighted: {
    color: '#1A1A1A',
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  statLabelHighlighted: {
    color: '#5A5A6A',
  },

  // Bottom Tab Bar
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterModal: {
    width: '75%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  filterModalOption: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  filterModalOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
});
