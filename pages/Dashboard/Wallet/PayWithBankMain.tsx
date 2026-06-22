import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PayWithBankMain() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay with Bank</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Timer Notice Card ── */}
        <View style={styles.timerCard}>
          <View style={styles.timerIconCircle}>
            <Ionicons name="time" size={28} color="#FFF" />
          </View>
          <Text style={styles.timerText}>
            Please complete your payment in{'\n'}your banking app within{' '}
            <Text style={styles.timerBold}>30 minutes</Text>
          </Text>
        </View>

        {/* ── Bank Details Card ── */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Account Number</Text>
            <Text style={styles.detailValue}>8159846865</Text>
          </View>
          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bank Name</Text>
            <Text style={[styles.detailValue, styles.detailValueBold]}>
              Moniepoint
            </Text>
          </View>
          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Beneficiary Name</Text>
            <Text style={[styles.detailValue, styles.detailValueBold]}>
              VIBEZLINK
            </Text>
          </View>
          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount to pay</Text>
            <Text style={styles.detailValue}>₦300,000.00</Text>
          </View>

          <Text style={styles.warningText}>
            Transfer exact amount to avoid failure.
          </Text>
        </View>

        {/* ── Already Paid Row ── */}
        <TouchableOpacity style={styles.alreadyPaidRow} activeOpacity={0.7}>
          <Text style={styles.alreadyPaidText}>Already paid? Update</Text>
          <Ionicons name="refresh" size={16} color="#1A1A1A" />
        </TouchableOpacity>
      </ScrollView>

      {/* ── Bottom CTA ── */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.paidBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/dashboard/wallet-success')}
        >
          <Text style={styles.paidBtnText}>I have paid</Text>
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
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 16,
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

  // Timer Card
  timerCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 28,
    alignItems: 'center',
    gap: 16,
  },
  timerIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8675A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 15,
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 22,
    fontWeight: '500',
  },
  timerBold: {
    fontWeight: '800',
  },

  // Bank Details Card
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'right',
    flex: 1,
  },
  detailValueBold: {
    fontSize: 16,
    fontWeight: '800',
  },
  warningText: {
    fontSize: 13,
    color: '#7B39FD',
    fontWeight: '600',
    paddingBottom: 16,
    paddingTop: 4,
  },

  // Already Paid
  alreadyPaidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alreadyPaidText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textDecorationLine: 'underline',
  },

  // Bottom Button
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 36 : 20,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  paidBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
