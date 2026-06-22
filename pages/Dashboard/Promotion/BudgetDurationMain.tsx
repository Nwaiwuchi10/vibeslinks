import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  Dimensions,
  PanResponder,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 40; // width padding

export default function BudgetDurationMain() {
  const router = useRouter();

  // State values matching screenshots
  const [dailyBudget, setDailyBudget] = useState(431000);
  const [duration, setDuration] = useState(15);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');

  // Sliders max-min ranges
  const minBudget = 1000;
  const maxBudget = 1000000;
  const minDuration = 1;
  const maxDuration = 30;

  // Slider refs for dimensions
  const budgetTrackRef = useRef<View>(null);
  const durationTrackRef = useRef<View>(null);

  // Dynamic calculations
  const totalAdBudget = dailyBudget * duration;
  // Scale estimation values proportionally
  const estReached = Math.round((dailyBudget / 5000) * 139 * duration);
  const conversionRate = 12; // fixed percentage matching design
  const estClicked = Math.round(estReached * (conversionRate / 100));
  const fees = Math.round(totalAdBudget * 0.01) || 4500; // 1% or default 4,500

  // PanResponder for Budget Slider
  const budgetPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleBudgetTouch(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        handleBudgetTouch(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const handleBudgetTouch = (clientX: number) => {
    let pct = clientX / SLIDER_WIDTH;
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    const value = Math.round(minBudget + pct * (maxBudget - minBudget));
    setDailyBudget(value);
  };

  // PanResponder for Duration Slider
  const durationPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        handleDurationTouch(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        handleDurationTouch(evt.nativeEvent.locationX);
      },
    })
  ).current;

  const handleDurationTouch = (clientX: number) => {
    let pct = clientX / SLIDER_WIDTH;
    if (pct < 0) pct = 0;
    if (pct > 1) pct = 1;
    const value = Math.round(minDuration + pct * (maxDuration - minDuration));
    setDuration(value);
  };

  // Percentages for rendering slider fills
  const budgetPct = (dailyBudget - minBudget) / (maxBudget - minBudget);
  const durationPct = (duration - minDuration) / (maxDuration - minDuration);

  const formatCurrency = (num: number) => {
    return `₦${num.toLocaleString('en-NG')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Budget and Duration</Text>
          <Text style={styles.headerSubtitle}>What is your ad budget?</Text>
        </View>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Daily Budget Slider Section ── */}
        <View style={styles.sliderSection}>
          <View style={styles.labelRow}>
            <Text style={styles.sliderLabel}>Daily budget</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencyPrefix}>₦</Text>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={dailyBudget.toLocaleString('en-NG')}
                onChangeText={(t) => {
                  const val = parseInt(t.replace(/[^0-9]/g, '')) || 0;
                  setDailyBudget(val > maxBudget ? maxBudget : val);
                }}
              />
            </View>
          </View>

          {/* Budget Slider Track */}
          <View
            ref={budgetTrackRef}
            style={styles.sliderTrackContainer}
            {...budgetPanResponder.panHandlers}
          >
            <View style={styles.sliderTrackBg} />
            <View style={[styles.sliderTrackFill, { width: `${budgetPct * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${budgetPct * 100}%` }]} />
          </View>
        </View>

        {/* ── Duration Slider Section ── */}
        <View style={styles.sliderSection}>
          <View style={styles.labelRow}>
            <Text style={styles.sliderLabel}>Duration</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                keyboardType="numeric"
                value={duration.toString()}
                onChangeText={(t) => {
                  const val = parseInt(t.replace(/[^0-9]/g, '')) || 0;
                  setDuration(val > maxDuration ? maxDuration : val);
                }}
              />
            </View>
          </View>

          {/* Duration Slider Track */}
          <View
            ref={durationTrackRef}
            style={styles.sliderTrackContainer}
            {...durationPanResponder.panHandlers}
          >
            <View style={styles.sliderTrackBg} />
            <View style={[styles.sliderTrackFill, { width: `${durationPct * 100}%` }]} />
            <View style={[styles.sliderThumb, { left: `${durationPct * 100}%` }]} />
          </View>
        </View>
      </ScrollView>

      {/* ── Bottom Estimate Summary Panel ── */}
      <View style={styles.bottomSummaryPanel}>
        <View style={styles.summaryTable}>
          <View style={styles.summaryTableRow}>
            <Text style={styles.summaryTableLabel}>Ad budget</Text>
            <Text style={styles.summaryTableValue}>
              {formatCurrency(dailyBudget)} over {duration} days
            </Text>
          </View>

          <View style={styles.summaryTableRow}>
            <Text style={styles.summaryTableLabel}>Estimated Reached</Text>
            <Text style={styles.summaryTableValue}>{estReached.toLocaleString('en-NG')}</Text>
          </View>

          <View style={styles.summaryTableRow}>
            <Text style={styles.summaryTableLabel}>Conversion Rate</Text>
            <Text style={styles.summaryTableValue}>{conversionRate}%</Text>
          </View>

          <View style={styles.summaryTableRow}>
            <Text style={styles.summaryTableLabel}>Estimated Event Clicked</Text>
            <Text style={styles.summaryTableValue}>{estClicked.toLocaleString('en-NG')}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.makePaymentBtn}
          activeOpacity={0.85}
          onPress={() => setPaymentVisible(true)}
        >
          <Text style={styles.makePaymentBtnText}>Make Payment</Text>
        </TouchableOpacity>
      </View>

      {/* ── Payment Bottom Sheet Modal ── */}
      <Modal
        transparent
        animationType="slide"
        visible={paymentVisible}
        onRequestClose={() => setPaymentVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayDismiss}
            activeOpacity={1}
            onPress={() => setPaymentVisible(false)}
          />
          <View style={styles.bottomSheet}>
            {/* Close Button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setPaymentVisible(false)}
            >
              <Ionicons name="close" size={20} color="#1A1A1A" />
            </TouchableOpacity>

            {/* Total Budget Title */}
            <Text style={styles.sheetAmount}>{formatCurrency(totalAdBudget)}</Text>

            {/* Table Details */}
            <View style={styles.sheetTable}>
              <View style={styles.sheetTableRow}>
                <Text style={styles.sheetTableLabel}>Ad budget</Text>
                <Text style={styles.sheetTableValue}>
                  {formatCurrency(dailyBudget)} over {duration} days
                </Text>
              </View>

              <View style={styles.sheetTableRow}>
                <Text style={styles.sheetTableLabel}>Estimated Reached</Text>
                <Text style={styles.sheetTableValue}>{estReached.toLocaleString('en-NG')}</Text>
              </View>

              <View style={styles.sheetTableRow}>
                <Text style={styles.sheetTableLabel}>Conversion Rate</Text>
                <Text style={styles.sheetTableValue}>{conversionRate}%</Text>
              </View>

              <View style={styles.sheetTableRow}>
                <Text style={styles.sheetTableLabel}>Estimated Event Clicked</Text>
                <Text style={styles.sheetTableValue}>{estClicked.toLocaleString('en-NG')}</Text>
              </View>

              <View style={styles.sheetTableRow}>
                <Text style={styles.sheetTableLabel}>Fees</Text>
                <Text style={styles.sheetTableValue}>{formatCurrency(fees)}</Text>
              </View>
            </View>

            {/* Payment Method header */}
            <TouchableOpacity style={styles.paymentMethodHeader} activeOpacity={0.8}>
              <Text style={styles.paymentMethodTitle}>Payment Method</Text>
              <View style={styles.arrowCircle}>
                <Ionicons name="chevron-forward" size={10} color="#FFF" />
              </View>
            </TouchableOpacity>

            {/* Payment Options */}
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setPaymentMethod('card')}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>Debit Card</Text>
                <View style={[styles.radioOuter, paymentMethod === 'card' && styles.radioOuterActive]}>
                  {paymentMethod === 'card' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={() => setPaymentMethod('transfer')}
                activeOpacity={0.7}
              >
                <Text style={styles.optionText}>Transfer</Text>
                <View style={[styles.radioOuter, paymentMethod === 'transfer' && styles.radioOuterActive]}>
                  {paymentMethod === 'transfer' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              style={styles.payBtn}
              activeOpacity={0.85}
              onPress={() => {
                setPaymentVisible(false);
                router.push({
                  pathname: '/dashboard/campaign-success',
                  params: {
                    eventTitle: 'Can You see my cute face',
                    totalCost: totalAdBudget.toString(),
                    dailyBudget: dailyBudget.toString(),
                    duration: duration.toString(),
                  },
                });
              }}
            >
              <Text style={styles.payBtnText}>Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F5F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 32,
    gap: 36,
  },

  // Slider Section
  sliderSection: {
    gap: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
    borderWidth: 1,
    borderColor: '#E8E8EE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 100,
    justifyContent: 'flex-end',
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginRight: 4,
  },
  textInput: {
    fontSize: 15,
    fontWeight: '700',
    color: '#5A5A6A',
    textAlign: 'right',
    padding: 0,
    margin: 0,
  },

  // Slider Track Custom Drawing
  sliderTrackContainer: {
    height: 30,
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  sliderTrackBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F0EFF5',
    width: '100%',
  },
  sliderTrackFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7B39FD',
    position: 'absolute',
    left: 0,
  },
  sliderThumb: {
    width: 32,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E2EA',
    position: 'absolute',
    marginTop: -9,
    top: '50%',
    marginLeft: -16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  // Bottom Summary Panel
  bottomSummaryPanel: {
    backgroundColor: '#FAFAFC',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    gap: 20,
    borderWidth: 1,
    borderColor: '#F0EFF5',
  },
  summaryTable: {
    gap: 12,
  },
  summaryTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTableLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  summaryTableValue: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  makePaymentBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makePaymentBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  // Modal styling
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalOverlayDismiss: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: Platform.OS === 'ios' ? 44 : 28,
  },
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F5F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: '#7B39FD',
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  sheetTable: {
    backgroundColor: '#FAFAFC',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  sheetTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTableLabel: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  sheetTableValue: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '700',
  },

  // Payment Method Section inside Bottom Sheet
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B39FD',
  },
  arrowCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FAFAFC',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D2D2D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#7B39FD',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#7B39FD',
  },
  payBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
