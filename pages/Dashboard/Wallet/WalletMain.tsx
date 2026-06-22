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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

type TabKey = 'All' | 'Withdraw' | 'Ticket' | 'Wallet Topup';

const TRANSACTIONS = [
  {
    id: '1',
    type: 'deposit',
    title: 'Deposit',
    subtitle: 'MasterCard*****9918',
    amount: '+₦50,000',
    date: 'Thu Jun 11, 2026',
    isPositive: true,
    avatar: null,
    category: 'Wallet Topup',
  },
  {
    id: '2',
    type: 'withdraw',
    title: 'Withdraw',
    subtitle: 'MasterCard*****9918',
    amount: '-₦721,000',
    date: 'Thu Jun 11, 2026',
    isPositive: false,
    avatar: null,
    category: 'Withdraw',
  },
  {
    id: '3',
    type: 'ticket',
    title: 'Sophia',
    subtitle: 'General | 2',
    amount: '₦431,000',
    date: 'Thu Jun 11, 2026',
    isPositive: null,
    avatar: require('@/assets/images/davido.png'),
    category: 'Ticket',
  },
  {
    id: '4',
    type: 'ticket',
    title: 'Titus',
    subtitle: 'General | 2, VVIP | 2',
    amount: '₦935,000',
    date: 'Thu Jun 11, 2026',
    isPositive: null,
    avatar: require('@/assets/images/skibi.png'),
    category: 'Ticket',
  },
];

export default function WalletMain() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('All');

  const tabs: TabKey[] = ['All', 'Withdraw', 'Ticket', 'Wallet Topup'];

  const filteredTransactions =
    activeTab === 'All'
      ? TRANSACTIONS
      : TRANSACTIONS.filter((t) => t.category === activeTab);

  const renderTransactionIcon = (item: (typeof TRANSACTIONS)[0]) => {
    if (item.avatar) {
      return (
        <Image
          source={item.avatar}
          style={styles.txAvatar}
          contentFit="cover"
        />
      );
    }
    if (item.type === 'deposit') {
      return (
        <View style={[styles.txIconCircle, { backgroundColor: '#2A2A2A' }]}>
          <Ionicons name="add" size={20} color="#FFF" />
        </View>
      );
    }
    return (
      <View style={[styles.txIconCircle, { backgroundColor: '#2A2A2A' }]}>
        <Ionicons name="arrow-down" size={20} color="#FFF" />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity
            style={styles.historyBtn}
            onPress={() => router.push('/dashboard/transaction-history')}
          >
            <MaterialCommunityIcons name="history" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        {/* ── Balance Card ── */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceAmount}>₦ 19,040,164.10</Text>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₦962,540,000</Text>
              <Text style={styles.statLabel}>Lifetime earnings</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>₦2,540,321</Text>
              <Text style={styles.statLabel}>Total Withdrawn</Text>
            </View>
          </View>

          {/* ── Action Buttons ── */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/dashboard/withdraw')}
            >
              <View style={styles.actionBtnIcon}>
                <Ionicons name="arrow-down" size={16} color="#FFF" />
              </View>
              <Text style={styles.actionBtnText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => router.push('/dashboard/add-fund')}
            >
              <View style={styles.actionBtnIcon}>
                <Ionicons name="add" size={16} color="#FFF" />
              </View>
              <Text style={styles.actionBtnText}>Add Fund</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.actionBtnIcon2]}
              onPress={() => router.push('/dashboard/wallet-analytics')}
            >
              <FontAwesome5 name="chart-bar" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Transactions Section ── */}
        <View style={styles.transactionsSection}>
          <View style={styles.txHeaderRow}>
            <Text style={styles.txSectionTitle}>Tranactions</Text>
            <TouchableOpacity
              style={styles.seeAllRow}
              onPress={() => router.push('/dashboard/transaction-history')}
            >
              <Text style={styles.seeAllText}>See All</Text>
              <View style={styles.seeAllCircle}>
                <Ionicons name="arrow-forward" size={12} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsRow}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab && styles.tabActive]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.tabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Transaction List */}
          <View style={styles.txList}>
            {filteredTransactions.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.txRow,
                  index === filteredTransactions.length - 1 && styles.txRowLast,
                ]}
              >
                {renderTransactionIcon(item)}
                <View style={styles.txTextCol}>
                  <Text style={styles.txTitle}>{item.title}</Text>
                  <Text style={styles.txSubtitle}>{item.subtitle}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text
                    style={[
                      styles.txAmount,
                      item.isPositive === true && styles.txAmountPositive,
                      item.isPositive === false && styles.txAmountNegative,
                    ]}
                  >
                    {item.amount}
                  </Text>
                  <Text style={styles.txDate}>{item.date}</Text>
                </View>
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
          <MaterialCommunityIcons
            name="calendar-month-outline"
            size={24}
            color="#A0A0A0"
          />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Events</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/ticket-management')}
        >
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={24}
            color="#A0A0A0"
          />
          <Text style={[styles.tabLabel, { color: '#A0A0A0' }]}>Tickets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.activeIndicatorDot} />
          <MaterialCommunityIcons
            name="wallet"
            size={24}
            color="#1A1A1A"
            style={styles.activeIconOffset}
          />
          <Text style={[styles.tabLabel, { color: '#1A1A1A', fontWeight: '700' }]}>
            Wallets
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => router.push('/dashboard/promotion')}
        >
          <MaterialCommunityIcons
            name="bullhorn-outline"
            size={24}
            color="#A0A0A0"
          />
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
  scrollContent: {
    paddingBottom: 110,
  },

  // ── Header ──
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
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  historyBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ── Balance Card ──
  balanceCard: {
    backgroundColor: '#1A1A1A',
    marginHorizontal: 20,
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 13,
    color: '#A0A0A0',
    fontWeight: '500',
    marginBottom: 6,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 24,
    letterSpacing: -0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: '#3A3A3A',
    marginHorizontal: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    fontWeight: '500',
  },

  // ── Action Buttons ──
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    borderRadius: 50,
    paddingVertical: 11,
    paddingHorizontal: 16,
    gap: 8,
  },
  actionBtnIcon: {
    // used as the icon wrapper part of action btn
  },
  actionBtnIcon2: {
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },

  // ── Transactions ──
  transactionsSection: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    overflow: 'hidden',
  },
  txHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 4,
  },
  txSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  seeAllRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7B39FD',
  },
  seeAllCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabsRow: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
    backgroundColor: '#F2F2F7',
  },
  tabActive: {
    backgroundColor: '#7B39FD',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#FFF',
  },

  // List
  txList: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
    gap: 12,
  },
  txRowLast: {
    borderBottomWidth: 0,
  },
  txAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  txIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txTextCol: {
    flex: 1,
  },
  txTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  txSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#7B39FD',
  },
  txRight: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  txAmountPositive: {
    color: '#3D9B00',
  },
  txAmountNegative: {
    color: '#1A1A1A',
  },
  txDate: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // ── Bottom Tab Bar ──
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
