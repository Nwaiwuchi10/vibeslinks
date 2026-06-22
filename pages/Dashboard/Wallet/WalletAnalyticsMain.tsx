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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

// ─────────────────────────────────────────────
//  Bar Chart Data (Mon-Sun)
// ─────────────────────────────────────────────
const BAR_DATA = [
  { day: 'Mon', value: 201 },
  { day: 'Tue', value: 60 },
  { day: 'Wed', value: 9 },
  { day: 'Thu', value: 1200 },
  { day: 'Fri', value: 60 },
  { day: 'Sat', value: 4000 }, // tallest — highlighted purple
  { day: 'Sun', value: 400 },
];
const MAX_BAR = Math.max(...BAR_DATA.map((d) => d.value));
const BAR_MAX_HEIGHT = 130;
const Y_LABELS = ['₦4M', '₦1.2M', '₦201k', '₦60k', '₦9k', '0'];

// ─────────────────────────────────────────────
//  Donut Chart — Pure RN (conic-segment approach)
// ─────────────────────────────────────────────
type DonutSlice = { label: string; percent: number; color: string };
const DONUT_DATA: DonutSlice[] = [
  { label: 'General Ticket', percent: 28, color: '#2A2A2A' },
  { label: 'VVIP', percent: 15, color: '#7B39FD' },
  { label: 'VIP', percent: 22, color: '#F5A623' },
  { label: 'Early Bird', percent: 32, color: '#E91E8C' },
];

const DONUT_SIZE = 200;
const OUTER_R = 90;
const INNER_R = 52;

/** Rotate a half-disc slice via border trick */
function HalfDisc({
  color,
  rotate,
  size,
}: {
  color: string;
  rotate: number;
  size: number;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        width: size,
        height: size / 2,
        borderTopLeftRadius: size / 2,
        borderTopRightRadius: size / 2,
        backgroundColor: color,
        top: size / 2,
        left: 0,
        transformOrigin: `${size / 2}px 0px`,
        transform: [{ rotate: `${rotate}deg` }],
      }}
    />
  );
}

/** Draw one donut slice using two stacked half-disc views. */
function DonutSliceView({
  startDeg,
  endDeg,
  color,
  size,
}: {
  startDeg: number;
  endDeg: number;
  color: string;
  size: number;
}) {
  const span = endDeg - startDeg;
  // For spans > 180° we need two pieces; for ≤ 180° one piece.
  if (span <= 180) {
    return (
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          transform: [{ rotate: `${startDeg}deg` }],
        }}
      >
        <HalfDisc color={color} rotate={0} size={size} />
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size / 2,
            backgroundColor: 'transparent',
            top: size / 2,
            left: 0,
          }}
        />
      </View>
    );
  }
  // Span > 180° — draw full half + remaining piece
  return (
    <>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          transform: [{ rotate: `${startDeg}deg` }],
        }}
      >
        <HalfDisc color={color} rotate={0} size={size} />
      </View>
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          transform: [{ rotate: `${startDeg + 180}deg` }],
        }}
      >
        <HalfDisc color={color} rotate={-(180 - (span - 180))} size={size} />
      </View>
    </>
  );
}

function DonutChart() {
  let current = 0;
  return (
    <View style={{ width: DONUT_SIZE, height: DONUT_SIZE, position: 'relative' }}>
      {DONUT_DATA.map((slice, i) => {
        const sliceDeg = (slice.percent / 100) * 360;
        const start = current;
        current += sliceDeg;
        return (
          <DonutSliceView
            key={i}
            startDeg={start}
            endDeg={start + sliceDeg}
            color={slice.color}
            size={DONUT_SIZE}
          />
        );
      })}
      {/* White centre hole */}
      <View
        style={{
          position: 'absolute',
          width: INNER_R * 2,
          height: INNER_R * 2,
          borderRadius: INNER_R,
          backgroundColor: '#FFF',
          top: DONUT_SIZE / 2 - INNER_R,
          left: DONUT_SIZE / 2 - INNER_R,
        }}
      />
    </View>
  );
}

type EventFilter = 'Upcoming Event' | 'Active Event' | 'Completed Event';
type DateFilter = 'Today' | 'This Month' | 'Last Month';

// ─────────────────────────────────────────────
export default function WalletAnalyticsMain() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'Wallet Statistic' | 'Event Statistic'>(
    'Wallet Statistic'
  );
  const [eventFilter, setEventFilter] = useState<EventFilter>('Upcoming Event');
  const [dateFilter, setDateFilter] = useState<DateFilter>('Today');
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const EVENT_FILTERS: EventFilter[] = [
    'Upcoming Event',
    'Active Event',
    'Completed Event',
  ];
  const DATE_FILTERS: DateFilter[] = ['Today', 'This Month', 'Last Month'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Statistic Toggle ── */}
        <View style={styles.toggleRow}>
          {(['Wallet Statistic', 'Event Statistic'] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.toggleBtn, activeTab === tab && styles.toggleBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.toggleText,
                  activeTab === tab && styles.toggleTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Event Statistic Filter ── */}
        {activeTab === 'Event Statistic' && (
          <View style={styles.eventFilterList}>
            {EVENT_FILTERS.map((ef) => (
              <TouchableOpacity
                key={ef}
                style={[
                  styles.eventFilterItem,
                  eventFilter === ef && styles.eventFilterItemActive,
                ]}
                onPress={() => setEventFilter(ef)}
                activeOpacity={0.85}
              >
                <Text
                  style={[
                    styles.eventFilterText,
                    eventFilter === ef && styles.eventFilterTextActive,
                  ]}
                >
                  {ef}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── Wallet Statistic Content ── */}
        {activeTab === 'Wallet Statistic' && (
          <>
            {/* Sales Analytics Bar Chart Card */}
            <View style={styles.card}>
              <View style={styles.chartHeaderRow}>
                <Text style={styles.chartTitle}>Sales Analytics</Text>
                <TouchableOpacity
                  style={styles.todayRow}
                  onPress={() => setDateModalVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.todayText}>{dateFilter}</Text>
                  <View style={styles.todayDot} />
                  <Text style={styles.todayValue}>₦431,000</Text>
                  <Ionicons name="chevron-down" size={12} color="#7B39FD" />
                </TouchableOpacity>
              </View>

              {/* Y-axis + Bars */}
              <View style={styles.barChartContainer}>
                {/* Y Labels */}
                <View style={styles.yAxis}>
                  {Y_LABELS.map((l) => (
                    <Text key={l} style={styles.yLabel}>
                      {l}
                    </Text>
                  ))}
                </View>

                {/* Bars */}
                <View style={styles.barsArea}>
                  {BAR_DATA.map((item) => {
                    const barH = Math.max(
                      8,
                      (item.value / MAX_BAR) * BAR_MAX_HEIGHT
                    );
                    const isActive = item.day === 'Sat';
                    return (
                      <View key={item.day} style={styles.barCol}>
                        <View style={styles.barTrack}>
                          <View
                            style={[
                              styles.bar,
                              {
                                height: barH,
                                backgroundColor: isActive ? '#7B39FD' : '#DDD6FF',
                              },
                            ]}
                          />
                        </View>
                        <Text style={styles.barLabel}>{item.day}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            </View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>₦31.3M</Text>
                <Text style={styles.statLabel}>Revenue</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[styles.statValue, { color: '#3D9B00' }]}>+18%</Text>
                <Text style={styles.statLabel}>Growth</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statValue}>₦431,000</Text>
                <Text style={styles.statLabel}>Ticket Sales</Text>
              </View>
            </View>

            {/* Revenue Sources Donut */}
            <View style={styles.card}>
              <Text style={styles.chartTitle}>Revenue Sources</Text>

              <View style={styles.donutContainer}>
                <DonutChart />
              </View>

              {/* Legend */}
              <View style={styles.legendGrid}>
                {DONUT_DATA.map((s) => (
                  <View key={s.label} style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: s.color }]} />
                    <Text style={styles.legendText}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* ── Date Filter Modal ── */}
      <Modal
        transparent
        animationType="slide"
        visible={dateModalVisible}
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.dateModalOverlay}>
          <TouchableOpacity
            style={styles.dateModalDismiss}
            activeOpacity={1}
            onPress={() => setDateModalVisible(false)}
          />
          <View style={styles.dateModalSheet}>
            <View style={styles.dateModalHandle} />
            <Text style={styles.dateModalTitle}>Select Period</Text>
            <View style={styles.dateFilterList}>
              {DATE_FILTERS.map((df) => (
                <TouchableOpacity
                  key={df}
                  style={[
                    styles.dateFilterItem,
                    dateFilter === df && styles.dateFilterItemActive,
                  ]}
                  onPress={() => {
                    setDateFilter(df);
                    setDateModalVisible(false);
                  }}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[
                      styles.dateFilterText,
                      dateFilter === df && styles.dateFilterTextActive,
                    ]}
                  >
                    {df}
                  </Text>
                  {dateFilter === df && (
                    <Ionicons name="checkmark" size={18} color="#7B39FD" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 40,
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

  // Toggle
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: '#F2F2F7',
    borderRadius: 50,
    padding: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBtnActive: {
    backgroundColor: '#7B39FD',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  toggleTextActive: {
    color: '#FFF',
  },

  // Generic Card
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 18,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  todayText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '600',
  },
  todayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7B39FD',
  },
  todayValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#7B39FD',
  },

  // Bar Chart
  barChartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: BAR_MAX_HEIGHT + 28,
  },
  yAxis: {
    width: 44,
    height: BAR_MAX_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 6,
    marginBottom: 20,
  },
  yLabel: {
    fontSize: 9,
    color: '#8E8E93',
    fontWeight: '500',
  },
  barsArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + 28,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: BAR_MAX_HEIGHT + 28,
  },
  barTrack: {
    width: '65%',
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
    borderRadius: 6,
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 9,
    color: '#8E8E93',
    fontWeight: '500',
    marginTop: 6,
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 14,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },

  // Donut
  donutContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '45%',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 11,
    color: '#1A1A1A',
    fontWeight: '600',
  },

  // Event Filter
  eventFilterList: {
    gap: 12,
  },
  eventFilterItem: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  eventFilterItemActive: {
    borderColor: '#7B39FD',
    backgroundColor: '#F5F1FF',
  },
  eventFilterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  eventFilterTextActive: {
    color: '#7B39FD',
    fontWeight: '700',
  },

  // Date Filter Modal
  dateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  dateModalDismiss: {
    flex: 1,
  },
  dateModalSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
    paddingTop: 16,
  },
  dateModalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E5',
    alignSelf: 'center',
    marginBottom: 18,
  },
  dateModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  dateFilterList: {
    gap: 12,
  },
  dateFilterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F9',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#EDEDF2',
  },
  dateFilterItemActive: {
    borderColor: '#7B39FD',
    backgroundColor: '#F5F1FF',
  },
  dateFilterText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  dateFilterTextActive: {
    color: '#7B39FD',
    fontWeight: '700',
  },
});
