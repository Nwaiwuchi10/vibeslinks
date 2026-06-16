import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TicketsSoldMain() {
  const router = useRouter();

  const ticketTiers = [
    {
      tier: 'General',
      revenue: '₦12,540,000',
      sold: '45,000',
      remaining: '6,000',
    },
    {
      tier: 'VIP',
      revenue: '₦48,040,000',
      sold: '1031',
      remaining: '421',
    },
    {
      tier: 'VVIP',
      revenue: '₦19,040,000',
      sold: '201',
      remaining: '9',
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
        <Text style={styles.headerTitle}>Tickets Sold</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Dropdown Selector */}
        <TouchableOpacity style={styles.dropdown}>
          <Text style={styles.dropdownText}>Afro Summer Festival</Text>
          <Ionicons name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>

        {ticketTiers.map((tier) => (
          <View key={tier.tier} style={styles.tierCard}>
            <Text style={styles.revenueLabel}>Revenue</Text>
            <Text style={styles.revenueVal}>{tier.revenue}</Text>

            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{tier.sold}</Text>
                <Text style={styles.detailLabel}>Sold</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailValue}>{tier.remaining}</Text>
                <Text style={styles.detailLabel}>Remaining</Text>
              </View>
            </View>

            {/* Floating tier label at bottom center */}
            <View style={styles.floatingLabelContainer}>
              <View style={styles.floatingLabel}>
                <Text style={styles.floatingLabelText}>{tier.tier}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
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
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
    gap: 25,
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ECECEC',
    marginBottom: 5,
  },
  dropdownText: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  tierCard: {
    backgroundColor: '#FFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#E8E8FF',
    padding: 24,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  revenueLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 6,
  },
  revenueVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  detailBox: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
    marginTop: 4,
  },
  floatingLabelContainer: {
    position: 'absolute',
    bottom: -12,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  floatingLabel: {
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  floatingLabelText: {
    color: '#7B39FD',
    fontSize: 11,
    fontWeight: '700',
  },
});
