import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

export default function PaymentMethodMain() {
  const router = useRouter();
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [ccv, setCcv] = useState('');
  const [saveCard, setSaveCard] = useState(false);

  const formatCardNumber = (text: string) => {
    // Remove non-digits, max 16 digits, group in 4s
    const digits = text.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5FA" />

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
          <Text style={styles.headerTitle}>Payment Method</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
            <Ionicons name="home-outline" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Amount Card ── */}
          <View style={styles.amountCard}>
            {/* Wallet download icon */}
            <View style={styles.walletIconBg}>
              <Ionicons name="wallet" size={24} color="#7B39FD" />
              {/* small arrow-down badge */}
              <View style={styles.arrowBadge}>
                <Ionicons name="arrow-down" size={9} color="#7B39FD" />
              </View>
            </View>
            <Text style={styles.amountValue}>₦300,000.00</Text>
            <Text style={styles.amountSubLabel}>Transaction Amount</Text>
          </View>

          {/* ── Pay with Bank Transfer Section ── */}
          <View style={styles.bankSection}>
            <Text style={styles.bankSectionLabel}>Pay with Bank Transfer</Text>
            <TouchableOpacity
              style={styles.payWithBankBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/dashboard/pay-with-bank')}
            >
              <Text style={styles.payWithBankBtnText}>Pay with Bank</Text>
            </TouchableOpacity>
          </View>

          {/* ── OR Divider ── */}
          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>or</Text>
            <View style={styles.orLine} />
          </View>

          {/* ── Card Brand Logos ── */}
          <View style={styles.cardBrandsRow}>
            {/* Verve */}
            <View style={styles.verveLogo}>
              <Text style={styles.verveText}>Verve</Text>
            </View>

            {/* VISA */}
            <View style={styles.visaLogo}>
              <Text style={styles.visaText}>VISA</Text>
            </View>

            {/* Mastercard */}
            <View style={styles.mastercardLogo}>
              <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.mcCircle, styles.mcCircleRight, { backgroundColor: '#F79E1B' }]} />
            </View>
          </View>

          {/* ── Card Form ── */}
          <View style={styles.formCard}>
            {/* Card Holder Name */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Card Holder Name"
                placeholderTextColor="#B0B0BB"
                value={cardHolderName}
                onChangeText={setCardHolderName}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            {/* Card Number */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.textInput}
                placeholder="Card Number"
                placeholderTextColor="#B0B0BB"
                value={cardNumber}
                onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                keyboardType="numeric"
                returnKeyType="next"
                maxLength={19}
              />
            </View>

            {/* Expire Date + CCV */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Expire Date"
                  placeholderTextColor="#B0B0BB"
                  value={expireDate}
                  onChangeText={(t) => setExpireDate(formatExpiry(t))}
                  keyboardType="numeric"
                  returnKeyType="next"
                  maxLength={5}
                />
              </View>
              <View style={[styles.inputWrapper, styles.halfInput]}>
                <TextInput
                  style={styles.textInput}
                  placeholder="CCV"
                  placeholderTextColor="#B0B0BB"
                  value={ccv}
                  onChangeText={setCcv}
                  keyboardType="numeric"
                  returnKeyType="done"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Save Card */}
            <TouchableOpacity
              style={styles.saveCardRow}
              onPress={() => setSaveCard(!saveCard)}
              activeOpacity={0.7}
            >
              <View style={[styles.radioOuter, saveCard && styles.radioOuterActive]}>
                {saveCard && <View style={styles.radioInner} />}
              </View>
              <Text style={styles.saveCardLabel}>Save Card</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ── Pay Button ── */}
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.payBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/dashboard/wallet-success')}
          >
            <Text style={styles.payBtnText}>Pay</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#F5F5FA',
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
    backgroundColor: '#EBEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  // Amount Card
  amountCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  walletIconBg: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#EDE3FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    position: 'relative',
  },
  arrowBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  amountValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  amountSubLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#7B39FD',
  },

  // Bank Section
  bankSection: {
    gap: 12,
  },
  bankSectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#8E8E93',
  },
  payWithBankBtn: {
    backgroundColor: '#3A3A3A',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payWithBankBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },

  // OR divider
  orRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E8E8EE',
  },
  orText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B0B0BB',
  },

  // Card Brand Logos
  cardBrandsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  verveLogo: {
    backgroundColor: '#CC0000',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  verveText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  visaLogo: {
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  visaText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1A1A7E',
    letterSpacing: 1,
    fontStyle: 'italic',
  },
  mastercardLogo: {
    flexDirection: 'row',
    width: 46,
    height: 30,
    position: 'relative',
  },
  mcCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    position: 'absolute',
    top: 1,
  },
  mcCircleRight: {
    left: 16,
    opacity: 0.85,
  },

  // Form Card
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#E8E8EE',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 14 : 12,
    backgroundColor: '#FAFAFA',
  },
  textInput: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },

  // Save Card
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
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
  saveCardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },

  // Pay Button
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    backgroundColor: '#F5F5FA',
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
