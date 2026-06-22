import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Share,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

/**
 * TruncationDetailsMain — used for both Withdraw and Add Fund receipts.
 * Pass `type` via route params (future) — hardcoded "Withdraw" here to match design.
 */
const DETAILS = [
  { label: 'Beneficiary', value: 'ROLAND EMMANUEL EKPE', bold: true },
  { label: 'Card No', value: '39482948459918', bold: false },
  { label: 'Card Type', value: 'MasterCard', bold: true },
  { label: 'Transaction Amount', value: '₦300,000.00', bold: false },
  {
    label: 'Transaction Reference',
    value: '69490594940505940940503',
    bold: false,
    small: true,
  },
  { label: 'Payment Type', value: 'Withdraw', bold: true },
  { label: 'Fees', value: '₦4,500.00', bold: false },
];

export default function TruncationDetailsMain() {
  const router = useRouter();

  const handleDownload = async () => {
    try {
      await Share.share({
        message:
          'Transaction Receipt\n\nBeneficiary: ROLAND EMMANUEL EKPE\nCard No: 39482948459918\nCard Type: MasterCard\nAmount: ₦300,000.00\nReference: 69490594940505940940503\nType: Withdraw\nFees: ₦4,500.00',
        title: 'Transaction Receipt',
      });
    } catch (e) {
      Alert.alert('Error', 'Unable to share receipt.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5FA" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Truncation Details</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Big White Card (success + details combined) ── */}
        <View style={styles.mainCard}>
          {/* Success badge */}
          <View style={styles.successSection}>
            <View style={styles.badgeWrapper}>
              <View style={styles.badge}>
                <Ionicons name="checkmark" size={26} color="#FFF" />
              </View>
            </View>
            <Text style={styles.amountText}>₦300,000.00</Text>
            <Text style={styles.successLabel}>Successful</Text>
          </View>

          <View style={styles.cardDivider} />

          {/* Transaction Details rows */}
          {DETAILS.map((item, index) => (
            <View key={item.label}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>{item.label}</Text>
                <Text
                  style={[
                    styles.detailValue,
                    item.bold && styles.detailValueBold,
                    item.small && styles.detailValueSmall,
                  ]}
                  numberOfLines={2}
                  adjustsFontSizeToFit={item.small}
                >
                  {item.value}
                </Text>
              </View>
              {index < DETAILS.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── Download Receipt Button ── */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.downloadBtn}
          activeOpacity={0.85}
          onPress={handleDownload}
        >
          <Text style={styles.downloadBtnText}>Download Receipt</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5FA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    gap: 20,
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
    backgroundColor: '#EBEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  // Main Card
  mainCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    paddingBottom: 4,
  },

  // Success section inside card
  successSection: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  badgeWrapper: {
    marginBottom: 16,
    // Scalloped badge via rotating two overlapping rounded squares
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
    // Eight-pointed star approximation: stack two rotated rounded squares
  },
  amountText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2A2A2A',
    marginBottom: 4,
  },
  successLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B39FD',
  },

  cardDivider: {
    height: 8,
    backgroundColor: '#F5F5FA',
  },

  // Detail rows
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    gap: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#F5F5FA',
    marginHorizontal: 20,
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'right',
    flex: 1.4,
  },
  detailValueBold: {
    fontSize: 14,
    fontWeight: '800',
  },
  detailValueSmall: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Bottom Button
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F5F5FA',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  downloadBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
