import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { userService } from '@/services/userService';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

export default function AddCardMain() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleAddCard = async () => {
    if (!cardholderName || !cardNumber || !expiryDate || !cvv) {
      dispatch(showToast({ type: 'error', message: 'All card fields are required.' }));
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create setup intent on backend
      const intentRes = await userService.createPaymentMethodSetupIntent();
      const setupIntentId = intentRes?.setupIntentId || 'seti_mock_' + Math.random().toString(36).substring(7);
      
      // Generate a mock paymentMethodId (e.g. pm_123) for backend registration since Stripe SDK is server-mocked
      const paymentMethodId = 'pm_card_visa';

      // 2. Register payment method on backend
      await userService.addPaymentMethod({
        setupIntentId,
        paymentMethodId,
        cardholderName,
        setAsDefault: saveCard,
      });

      router.push('/profile/card-success');
    } catch (err) {
      console.error('[AddCardMain] Failed to add card:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Card</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Card Networks */}
        <View style={styles.networksContainer}>
          <View style={styles.networksRow}>
             <Text style={[styles.networkLabel, { color: '#E30613', fontWeight: 'bold' }]}>Verve</Text>
             <FontAwesome5 name="cc-visa" size={32} color="#1A1F71" />
             <FontAwesome5 name="cc-mastercard" size={32} color="#EB001B" />
          </View>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              value={cardholderName}
              onChangeText={setCardholderName}
              placeholder="Card Holder Name"
              placeholderTextColor="#BBB"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="Card Number"
              placeholderTextColor="#BBB"
              keyboardType="number-pad"
              maxLength={16}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <TextInput 
                style={styles.input}
                value={expiryDate}
                onChangeText={setExpiryDate}
                placeholder="MM/YY"
                placeholderTextColor="#BBB"
                maxLength={5}
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 15 }]}>
              <TextInput 
                style={styles.input}
                value={cvv}
                onChangeText={setCvv}
                placeholder="CVV"
                placeholderTextColor="#BBB"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveCardRow}
            onPress={() => setSaveCard(!saveCard)}
          >
            <View style={[
              styles.checkbox,
              saveCard && styles.checkboxSelected
            ]}>
              {saveCard && <Ionicons name="checkmark" size={14} color="#FFF" />}
            </View>
            <Text style={styles.saveCardText}>Save Card as Default</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={handleAddCard} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.addButtonText}>Add Card</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  },
  networksContainer: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  networksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  networkLabel: {
    fontSize: 18,
    fontStyle: 'italic',
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    height: 60,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
  },
  saveCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 5,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  saveCardText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  addButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
