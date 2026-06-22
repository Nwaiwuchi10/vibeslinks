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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

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

export default function TransactionHistoryMain() {
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
        <Image source={item.avatar} style={styles.txAvatar} contentFit="cover" />
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={() => router.push('/dashboard/download-statement')}
        >
          <MaterialCommunityIcons name="cloud-download" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
                style={[styles.tabText, activeTab === tab && styles.tabTextActive]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Summary Row */}
        <View style={styles.summaryRow}>
          <Text style={styles.summaryText}>In ₦11,225.39</Text>
          <Text style={styles.summaryDivider}>   </Text>
          <Text style={styles.summaryText}>Out ₦237,941.10</Text>
        </View>

        {/* Transaction List */}
        <View style={styles.txCard}>
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
                  ]}
                >
                  {item.amount}
                </Text>
                <Text style={styles.txDate}>{item.date}</Text>
              </View>
            </View>
          ))}
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
  scrollContent: {
    paddingBottom: 40,
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
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  downloadBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tabs
  tabsRow: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
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

  // Summary
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  summaryDivider: {
    color: '#8E8E93',
  },

  // Card
  txCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    paddingHorizontal: 20,
    paddingBottom: 8,
    overflow: 'hidden',
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
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
  txDate: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
});
