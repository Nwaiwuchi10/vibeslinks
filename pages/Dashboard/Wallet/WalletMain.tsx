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
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { hostService } from '@/services/hostService';

const { width } = Dimensions.get('window');

type TabKey = 'All' | 'Withdraw' | 'Ticket' | 'Wallet Topup';

export default function WalletMain() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('All');
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<any>({});
  const [transactions, setTransactions] = useState<any[]>([]);

  const tabs: TabKey[] = ['All', 'Withdraw', 'Ticket', 'Wallet Topup'];

  const fetchWalletData = async () => {
    setLoading(true);
    try {
      const [walletData, txData] = await Promise.allSettled([
        hostService.getWalletDetails(),
        hostService.getWalletTransactions({ limit: '20' }),
      ]);
      if (walletData.status === 'fulfilled') {
        setWallet(walletData.value);
      }
      if (txData.status === 'fulfilled') {
        const list = Array.isArray(txData.value) ? txData.value : txData.value?.transactions || txData.value?.items || [];
        setTransactions(list);
      }
    } catch (err) {
      console.warn('[Wallet] load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const displayTransactions = transactions.map((tx: any) => {
    let cat: TabKey = 'All';
    if (tx.type === 'withdrawal' || tx.type?.toLowerCase().includes('withdraw')) cat = 'Withdraw';
    else if (tx.type === 'ticket_sale' || tx.type?.toLowerCase().includes('ticket')) cat = 'Ticket';
    else if (tx.type === 'deposit' || tx.type?.toLowerCase().includes('topup') || tx.type?.toLowerCase().includes('fund')) cat = 'Wallet Topup';

    return {
      id: tx.id || String(Math.random()),
      type: tx.type || 'deposit',
      title: tx.title || tx.narration || (tx.type === 'withdrawal' ? 'Withdrawal' : 'Transaction'),
      subtitle: tx.description || tx.reference || 'Wallet Wallet',
      amount: (tx.flow === 'out' || tx.type === 'withdrawal') ? `-₦${Number(tx.amount).toLocaleString()}` : `+₦${Number(tx.amount).toLocaleString()}`,
      date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : 'Recent',
      isPositive: !(tx.flow === 'out' || tx.type === 'withdrawal'),
      avatar: tx.buyerAvatar || tx.userAvatar || null,
      category: cat,
    };
  });

  const filteredTransactions = activeTab === 'All'
    ? displayTransactions
    : displayTransactions.filter((t) => t.category === activeTab);

  const balance = wallet.balance ?? wallet.availableBalance ?? 0;
  const lifetimeEarnings = wallet.lifetimeEarnings ?? wallet.totalEarnings ?? 0;
  const totalWithdrawn = wallet.totalWithdrawn ?? wallet.withdrawn ?? 0;

  const renderTransactionIcon = (item: any) => {
    if (item.avatar) {
      return (
        <Image
          source={{ uri: item.avatar }}
          style={styles.txAvatar}
          contentFit="cover"
        />
      );
    }
    if (item.isPositive) {
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

      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Wallet</Text>
            <TouchableOpacity
              style={styles.historyBtn}
              onPress={() => router.push('/dashboard/transaction-history' as any)}
            >
              <MaterialCommunityIcons name="history" size={20} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          {/* ── Balance Card ── */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₦ {Number(balance).toLocaleString()}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₦{Number(lifetimeEarnings).toLocaleString()}</Text>
                <Text style={styles.statLabel}>Lifetime earnings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>₦{Number(totalWithdrawn).toLocaleString()}</Text>
                <Text style={styles.statLabel}>Total Withdrawn</Text>
              </View>
            </View>

            {/* ── Action Buttons ── */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push('/dashboard/withdraw' as any)}
              >
                <View style={styles.actionBtnIcon}>
                  <Ionicons name="arrow-down" size={16} color="#FFF" />
                </View>
                <Text style={styles.actionBtnText}>Withdraw</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => router.push('/dashboard/add-fund' as any)}
              >
                <View style={styles.actionBtnIcon}>
                  <Ionicons name="add" size={16} color="#FFF" />
                </View>
                <Text style={styles.actionBtnText}>Add Fund</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Tabs (Filter) ── */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScroll}
          >
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabChip,
                  activeTab === tab && styles.tabChipActive,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabChipText,
                    activeTab === tab && styles.tabChipTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* ── Transactions List ── */}
          <View style={styles.transactionsSection}>
            <View style={styles.txHeaderRow}>
              <Text style={styles.txTitle}>Transactions</Text>
              <TouchableOpacity onPress={() => router.push('/dashboard/transaction-history' as any)}>
                <Text style={styles.seeAllText}>See all</Text>
              </TouchableOpacity>
            </View>

            {filteredTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="receipt" size={40} color="#CCC" />
                <Text style={styles.emptyText}>No transaction records</Text>
              </View>
            ) : (
              filteredTransactions.map((item, index) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.txRow}
                  onPress={() => router.push({ pathname: '/dashboard/wallet/transaction-details', params: { id: item.id } } as any)}
                >
                  <View style={styles.txRowLeft}>
                    {renderTransactionIcon(item)}
                    <View style={styles.txMeta}>
                      <Text style={styles.txMainTitle}>{item.title}</Text>
                      <Text style={styles.txSubTitle} numberOfLines={1}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.txRowRight}>
                    <Text
                      style={[
                        styles.txAmountText,
                        item.isPositive ? styles.amountPos : styles.amountNeg,
                      ]}
                    >
                      {item.amount}
                    </Text>
                    <Text style={styles.txDateText}>{item.date}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      )}

      {/* ── Sticky Bottom Tab Bar ── */}
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

        <TouchableOpacity style={[styles.tabItem, styles.tabActive]}>
          <MaterialCommunityIcons name="wallet-outline" size={24} color="#7B39FD" />
          <Text style={[styles.tabLabel, { color: '#7B39FD', fontWeight: '800' }]}>Wallet</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9FF' },
  scrollContent: { paddingBottom: 110 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  historyBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  balanceCard: { marginHorizontal: 20, backgroundColor: '#1A1A1A', borderRadius: 24, padding: 24, marginTop: 10 },
  balanceLabel: { fontSize: 13, color: '#A0A0A0', marginBottom: 6 },
  balanceAmount: { fontSize: 28, fontWeight: '900', color: '#FFF', marginBottom: 20 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: '#2D2D2D', paddingTop: 16, marginBottom: 20 },
  statItem: { flex: 1 },
  statValue: { fontSize: 14, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  statLabel: { fontSize: 10, color: '#A0A0A0' },
  statDivider: { width: 1, height: '100%', backgroundColor: '#2D2D2D', marginHorizontal: 12 },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3A3A3A', borderRadius: 16, paddingVertical: 14, gap: 8 },
  actionBtnIcon: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#5A5A5A', justifyContent: 'center', alignItems: 'center' },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  tabsScroll: { paddingHorizontal: 20, marginTop: 20, paddingBottom: 4 },
  tabChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', marginRight: 10, borderWidth: 1, borderColor: '#F0EFF5' },
  tabChipActive: { backgroundColor: '#7B39FD', borderColor: '#7B39FD' },
  tabChipText: { fontSize: 13, color: '#666', fontWeight: '600' },
  tabChipTextActive: { color: '#FFF' },
  transactionsSection: { paddingHorizontal: 20, marginTop: 25 },
  txHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  txTitle: { fontSize: 16, fontWeight: '800', color: '#1A1A1A' },
  seeAllText: { fontSize: 12, fontWeight: '700', color: '#7B39FD' },
  emptyState: { paddingVertical: 30, alignItems: 'center' },
  emptyText: { color: '#BBB', fontSize: 13, marginTop: 8 },
  txRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFF', padding: 14, borderRadius: 18, marginBottom: 10, borderWidth: 1, borderColor: '#F0EFF5' },
  txRowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  txAvatar: { width: 40, height: 40, borderRadius: 20 },
  txIconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  txMeta: { marginLeft: 12, flex: 1 },
  txMainTitle: { fontSize: 14, fontWeight: '800', color: '#1A1A1A', marginBottom: 2 },
  txSubTitle: { fontSize: 11, color: '#888' },
  txRowRight: { alignItems: 'flex-end' },
  txAmountText: { fontSize: 14, fontWeight: '800', marginBottom: 2 },
  amountPos: { color: '#4CAF50' },
  amountNeg: { color: '#F44336' },
  txDateText: { fontSize: 10, color: '#B3B2BD' },
  bottomTabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 75, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0EFF5', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: Platform.OS === 'ios' ? 10 : 0 },
  tabItem: { alignItems: 'center', flex: 1, paddingVertical: 8 },
  tabActive: { borderTopWidth: 2, borderTopColor: '#7B39FD' },
  tabLabel: { fontSize: 10, marginTop: 4, fontWeight: '600' },
});
