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
import { useRouter, useLocalSearchParams } from 'expo-router';

// ─────────────────────────────────────────────
//  Scalloped Badge — 8 overlapping rotated
//  rounded squares to create the verified-seal
//  shape without SVG.
// ─────────────────────────────────────────────
const BADGE_SIZE = 70;
const PETAL_SIZE = 48;
const PETAL_RADIUS = 14;
const ROTATIONS = [0, 22.5, 45, 67.5];

function ScallopBadge() {
  return (
    <View style={scallopStyles.container}>
      {ROTATIONS.map((deg) => (
        <View
          key={deg}
          style={[
            scallopStyles.petal,
            { transform: [{ rotate: `${deg}deg` }] },
          ]}
        />
      ))}
      <View style={scallopStyles.iconOverlay}>
        <Ionicons name="checkmark" size={28} color="#FFF" />
      </View>
    </View>
  );
}

const scallopStyles = StyleSheet.create({
  container: {
    width: BADGE_SIZE,
    height: BADGE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  petal: {
    position: 'absolute',
    width: PETAL_SIZE,
    height: PETAL_SIZE,
    borderRadius: PETAL_RADIUS,
    backgroundColor: '#7B39FD',
  },
  iconOverlay: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default function CampaignSuccessMain() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const totalCostRaw = parseFloat(params.totalCost as string) || 35000;
  const dailyBudgetRaw = parseFloat(params.dailyBudget as string) || 5000;
  const durationRaw = params.duration ? parseInt(params.duration as string) : 7;
  const eventTitle = (params.eventTitle as string) || 'Can You see my cute face';

  const formatCurrency = (num: number) => {
    return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const randomRef = 'REF' + Math.floor(100000000000 + Math.random() * 900000000000);

  const DETAILS = [
    { label: 'Event', value: eventTitle, bold: true },
    { label: 'Channels', value: 'Push Notifications, Social Feeds', bold: false },
    { label: 'Daily Budget', value: `${formatCurrency(dailyBudgetRaw)} / Day`, bold: false },
    { label: 'Duration', value: `${durationRaw} Days`, bold: false },
    { label: 'Transaction Ref', value: randomRef, bold: false, small: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0EFF8" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push('/dashboard/promotion')}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={20} color="#5A5A6A" />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable content ── */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Center Success Content ── */}
        <View style={styles.centerContent}>
          <View style={styles.badgeWrapper}>
            <ScallopBadge />
          </View>

          <Text style={styles.amountText}>{formatCurrency(totalCostRaw)}</Text>
          <Text style={styles.successLabel}>Campaign Launched Successfully</Text>
        </View>

        {/* ── Details Card ── */}
        <View style={styles.detailsCard}>
          <Text style={styles.detailsCardLabel}>Campaign Details</Text>

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
                >
                  {item.value}
                </Text>
              </View>
              {index < DETAILS.length - 1 && <View style={styles.detailDivider} />}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* ── Bottom Button Panel ── */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={styles.doneBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/dashboard/promotion')}
        >
          <Text style={styles.doneBtnText}>Go to Promotion Center</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0EFF8',
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8E7F2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollContent: {
    paddingBottom: 160,
  },

  // Center Content
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 24,
  },
  badgeWrapper: {
    marginBottom: 22,
  },
  amountText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#2A2A3A',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  successLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7B39FD',
    textAlign: 'center',
  },

  // Details Card
  detailsCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginHorizontal: 20,
    paddingHorizontal: 18,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E8E7F2',
  },
  detailsCardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    paddingVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#EDEDF2',
  },
  detailLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
    flex: 1,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'right',
    flex: 1.4,
  },
  detailValueBold: {
    fontWeight: '800',
  },
  detailValueSmall: {
    fontSize: 11,
  },

  // Bottom Panel
  bottomPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    alignItems: 'center',
    shadowColor: '#7B39FD',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
});
