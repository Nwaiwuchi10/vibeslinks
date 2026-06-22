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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const QUICK_AMOUNTS = [
  '₦100,000',
  '₦200,000',
  '₦300,000',
  '₦400,000',
  '₦500,000',
  '₦600,000',
];

export default function AddFundMain() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handleQuickAmount = (val: string) => {
    const numeric = val.replace('₦', '').replace(/,/g, '');
    setAmount(numeric);
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
          <Text style={styles.headerTitle}>Add Funds to Wallet</Text>
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
            {/* Mastercard overlapping circles */}
            <View style={styles.mastercardLogo}>
              <View style={[styles.mcCircle, { backgroundColor: '#EB001B' }]} />
              <View style={[styles.mcCircle, styles.mcCircleRight, { backgroundColor: '#F79E1B' }]} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardName}>Roland Emmanuel Ekpe</Text>
              <Text style={styles.cardNumber}>MasterCard*****9918</Text>
            </View>
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

          {/* ── Continue Button ── */}
          <TouchableOpacity
            style={styles.continueBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/dashboard/payment-method')}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
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
    paddingBottom: 60,
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
    fontSize: 18,
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
    width: 46,
    height: 30,
    position: 'relative',
  },
  mcCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    position: 'absolute',
  },
  mcCircleRight: {
    left: 16,
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

  // Amount Card
  amountCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EBEBF0',
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
    color: '#CCCCCC',
    marginRight: 4,
    lineHeight: 42,
  },
  amountInput: {
    flex: 1,
    fontSize: 28,
    fontWeight: '300',
    color: '#CCCCCC',
    padding: 0,
    margin: 0,
  },
  amountDivider: {
    height: 1.5,
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
    backgroundColor: '#F3F3F8',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8E8EE',
  },
  quickAmountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },

  // Continue Button
  continueBtn: {
    backgroundColor: '#7B39FD',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  continueBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});
