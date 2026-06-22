import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
      {/* 4 rotated rounded squares create the 8-point star / scallop */}
      {ROTATIONS.map((deg) => (
        <View
          key={deg}
          style={[
            scallopStyles.petal,
            { transform: [{ rotate: `${deg}deg` }] },
          ]}
        />
      ))}
      {/* Checkmark sits on top */}
      <View style={scallopStyles.iconOverlay}>
        <Ionicons name="checkmark" size={28} color="#FFF" strokeWidth={3} />
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

// ─────────────────────────────────────────────
export default function WalletSuccessMain() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F0EFF8" />

      {/* ── Back Button ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color="#5A5A6A" />
        </TouchableOpacity>
      </View>

      {/* ── Center Success Content ── */}
      <View style={styles.centerContent}>
        <View style={styles.badgeWrapper}>
          <ScallopBadge />
        </View>

        <Text style={styles.amountText}>₦300,000.00</Text>
        <Text style={styles.successLabel}>Successful</Text>
      </View>

      {/* ── Bottom White Panel ── */}
      <View style={styles.bottomPanel}>
        <TouchableOpacity
          style={styles.viewReceiptBtn}
          activeOpacity={0.85}
          onPress={() => router.push('/dashboard/truncation-details')}
        >
          <Text style={styles.viewReceiptBtnText}>View Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.walletLink}
          activeOpacity={0.7}
          onPress={() => router.push('/dashboard/wallet')}
        >
          <Text style={styles.walletLinkText}>Wallet</Text>
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
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
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

  // Center
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    // Shift content slightly upward to visually center against the bottom panel
    paddingBottom: 160,
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
    gap: 16,
    // Subtle shadow to lift panel
    shadowColor: '#7B39FD',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  viewReceiptBtn: {
    width: '100%',
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewReceiptBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.2,
  },
  walletLink: {
    paddingVertical: 2,
  },
  walletLinkText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7B39FD',
    textAlign: 'center',
  },
});
