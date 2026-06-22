import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  TextInput,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const QUICK_AMOUNTS = [
  '₦100,000',
  '₦200,000',
  '₦300,000',
  '₦400,000',
  '₦500,000',
  '₦600,000',
];

type PaymentMethod = 'Debit Card' | 'Transfer';

export default function WithdrawMain() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Modal states
  const [reminderVisible, setReminderVisible] = useState(false);
  const [paymentVisible, setPaymentVisible] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Debit Card');

  const handleQuickAmount = (val: string) => {
    const numeric = val.replace('₦', '').replace(/,/g, '');
    setAmount(numeric);
  };

  const formatAmount = (raw: string) => {
    const num = parseFloat(raw.replace(/,/g, ''));
    if (isNaN(num)) return '₦0.00';
    return `₦${num.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
  };

  const displayAmount = amount
    ? formatAmount(amount)
    : '₦300,000.00';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9FF" />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdraw</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
            <Ionicons name="home-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Card Selector ── */}
          <View style={styles.cardSelector}>
            <View style={styles.mastercardLogo}>
              <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.mcCircle, styles.mcCircleRight, { backgroundColor: '#F79E1B' }]} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Roland Emmanuel Ekpe</Text>
              <Text style={styles.cardNumber}>MasterCard*****9918</Text>
            </View>
            <TouchableOpacity style={styles.changeRow}>
              <Text style={styles.changeText}>Change</Text>
              <View style={styles.changeCircle}>
                <Ionicons name="arrow-forward" size={10} color="#FFF" />
              </View>
            </TouchableOpacity>
          </View>

          {/* ── Amount Input Card ── */}
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Amount</Text>

            <TouchableOpacity
              style={styles.amountInputRow}
              onPress={() => inputRef.current?.focus()}
              activeOpacity={1}
            >
              <Text style={styles.nairaSign}>₦</Text>
              <TextInput
                ref={inputRef}
                style={styles.amountInput}
                placeholder="100.00-5,000,000"
                placeholderTextColor="#D0D0D5"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                returnKeyType="done"
              />
            </TouchableOpacity>

            <View style={styles.amountDivider} />

            {/* Quick Amount Grid */}
            <View style={styles.quickAmountGrid}>
              {QUICK_AMOUNTS.map((qa) => (
                <TouchableOpacity
                  key={qa}
                  style={styles.quickAmountBtn}
                  onPress={() => handleQuickAmount(qa)}
                >
                  <Text style={styles.quickAmountText}>{qa}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* ── Confirm Button ── */}
          <TouchableOpacity
            style={styles.confirmBtn}
            activeOpacity={0.85}
            onPress={() => setReminderVisible(true)}
          >
            <Text style={styles.confirmBtnText}>Confirm</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ════════════════════════════════════════
          REMINDER BOTTOM SHEET
      ════════════════════════════════════════ */}
      <Modal
        transparent
        animationType="slide"
        visible={reminderVisible}
        onRequestClose={() => setReminderVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetDismiss}
            activeOpacity={1}
            onPress={() => setReminderVisible(false)}
          />
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            <Text style={styles.sheetTitle}>Reminder</Text>
            <Text style={styles.sheetSubtitle}>Double check the Card Details</Text>

            {/* Transaction Details Card */}
            <View style={styles.detailsCard}>
              <Text style={styles.detailsCardLabel}>Transaction Details</Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>ROLAND EMMANUEL EKPE</Text>
              </View>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card No</Text>
                <Text style={styles.detailValue}>39482948459918</Text>
              </View>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card Type</Text>
                <Text style={[styles.detailValue, { fontWeight: '800' }]}>MasterCard</Text>
              </View>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>₦300,000.00</Text>
              </View>
            </View>

            {/* Recheck / Continue Buttons */}
            <View style={styles.sheetBtnRow}>
              <TouchableOpacity
                style={styles.recheckBtn}
                onPress={() => setReminderVisible(false)}
                activeOpacity={0.85}
              >
                <Text style={styles.recheckBtnText}>Recheck</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.continueBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setReminderVisible(false);
                  setPaymentVisible(true);
                }}
              >
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ════════════════════════════════════════
          PAYMENT METHOD BOTTOM SHEET
      ════════════════════════════════════════ */}
      <Modal
        transparent
        animationType="slide"
        visible={paymentVisible}
        onRequestClose={() => setPaymentVisible(false)}
      >
        <View style={styles.sheetOverlay}>
          <TouchableOpacity
            style={styles.sheetDismiss}
            activeOpacity={1}
            onPress={() => setPaymentVisible(false)}
          />
          <View style={[styles.sheet, styles.paymentSheet]}>
            <View style={styles.sheetHandle} />

            {/* Close X */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setPaymentVisible(false)}
            >
              <Ionicons name="close" size={18} color="#1A1A1A" />
            </TouchableOpacity>

            {/* Amount */}
            <Text style={styles.paymentAmount}>{displayAmount}</Text>

            {/* Transaction Details */}
            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Name</Text>
                <Text style={styles.detailValue}>ROLAND EMMANUEL EKPE</Text>
              </View>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card No</Text>
                <Text style={styles.detailValue}>39482948459918</Text>
              </View>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Card Type</Text>
                <Text style={[styles.detailValue, { fontWeight: '800' }]}>MasterCard</Text>
              </View>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Amount</Text>
                <Text style={styles.detailValue}>₦300,000.00</Text>
              </View>
              <View style={styles.detailDivider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fees</Text>
                <Text style={styles.detailValue}>₦4,500.00</Text>
              </View>
            </View>

            {/* Payment Method */}
            <View style={styles.paymentMethodSection}>
              <View style={styles.paymentMethodHeader}>
                <Text style={styles.paymentMethodTitle}>Payment Method</Text>
                <View style={styles.pmArrowCircle}>
                  <Ionicons name="arrow-forward" size={10} color="#FFF" />
                </View>
              </View>

              <TouchableOpacity
                style={styles.pmOption}
                onPress={() => setPaymentMethod('Debit Card')}
              >
                <Text style={styles.pmLabel}>Debit Card</Text>
                <View style={[
                  styles.radioOuter,
                  paymentMethod === 'Debit Card' && styles.radioOuterActive,
                ]}>
                  {paymentMethod === 'Debit Card' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pmOption}
                onPress={() => setPaymentMethod('Transfer')}
              >
                <Text style={styles.pmLabel}>Transfer</Text>
                <View style={[
                  styles.radioOuter,
                  paymentMethod === 'Transfer' && styles.radioOuterActive,
                ]}>
                  {paymentMethod === 'Transfer' && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            </View>

            {/* Pay Button */}
            <TouchableOpacity
              style={styles.payBtn}
              activeOpacity={0.85}
              onPress={() => {
                setPaymentVisible(false);
                router.push('/dashboard/truncation-details');
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
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    gap: 16,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
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

  // Card Selector
  cardSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  mastercardLogo: {
    flexDirection: 'row',
    width: 42,
    height: 28,
    position: 'relative',
  },
  mcCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
  },
  mcCircleRight: {
    left: 14,
    opacity: 0.85,
  },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#7B39FD',
  },
  changeCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Amount Card
  amountCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    padding: 20,
  },
  amountLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 12,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 8,
  },
  nairaSign: {
    fontSize: 28,
    fontWeight: '300',
    color: '#C0C0C8',
    marginRight: 4,
    lineHeight: 42,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '300',
    color: '#C0C0C8',
    padding: 0,
    margin: 0,
  },
  amountDivider: {
    height: 1,
    backgroundColor: '#7B39FD',
    marginBottom: 20,
    marginTop: 2,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  quickAmountBtn: {
    width: (width - 80) / 3,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F5F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EAE8FF',
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  // Confirm Button
  confirmBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  // ── Bottom Sheets ──
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  sheetDismiss: {
    flex: 1,
  },
  sheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 28,
    paddingTop: 16,
  },
  paymentSheet: {
    paddingTop: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E5',
    alignSelf: 'center',
    marginBottom: 20,
  },

  // Reminder sheet
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 4,
  },
  sheetSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Details Card inside sheet
  detailsCard: {
    backgroundColor: '#F8F8FC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0F0F5',
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 20,
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
    flex: 1,
  },

  // Recheck / Continue
  sheetBtnRow: {
    flexDirection: 'row',
    gap: 12,
  },
  recheckBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#7B39FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  recheckBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#7B39FD',
  },
  continueBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 50,
    backgroundColor: '#7B39FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },

  // Payment Sheet
  closeBtn: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentAmount: {
    fontSize: 28,
    fontWeight: '800',
    color: '#7B39FD',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 8,
  },

  // Payment Method section
  paymentMethodSection: {
    marginBottom: 20,
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  paymentMethodTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#7B39FD',
  },
  pmArrowCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#7B39FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pmOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  pmLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D0D0D8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: '#7B39FD',
  },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#7B39FD',
  },

  // Pay button
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
