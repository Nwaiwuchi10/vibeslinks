import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function PaymentMethodScreen() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('paypal');

  const paymentOptions = [
    { id: 'paypal', title: 'Paypal', icon: 'google-play' }, // Using close enough icons
    { id: 'google', title: 'Google', icon: 'google' },
    { id: 'apple', title: 'Apple Pay', icon: 'apple' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Credit & Debit Card</Text>
        
        <TouchableOpacity 
          style={styles.cardContainer}
          onPress={() => router.push('/profile/add-card')}
        >
          <View style={styles.cardLeft}>
            <MaterialCommunityIcons name="credit-card-outline" size={24} color={Colors.primary} />
            <Text style={styles.cardLabel}>Card</Text>
          </View>
          <Ionicons name="arrow-forward" size={20} color="#BBB" />
        </TouchableOpacity>

        <View style={styles.moreOptionsContainer}>
          <Text style={styles.sectionTitle}>More Payment Options</Text>
          
          <View style={styles.optionsList}>
            {paymentOptions.map((option) => (
              <TouchableOpacity 
                key={option.id}
                style={styles.optionItem}
                onPress={() => setSelectedMethod(option.id)}
              >
                <View style={styles.optionLeft}>
                  {option.id === 'paypal' ? (
                     <MaterialCommunityIcons name="google-play" size={20} color="#003087" /> // Close enough for Paypal if literal missing
                  ) : option.id === 'google' ? (
                    <MaterialCommunityIcons name="google" size={20} color="#EA4335" />
                  ) : (
                    <MaterialCommunityIcons name="apple" size={20} color="#000" />
                  )}
                  <Text style={styles.optionText}>{option.title}</Text>
                </View>
                <View style={[
                  styles.radioButton,
                  selectedMethod === option.id && styles.radioButtonSelected
                ]}>
                  {selectedMethod === option.id && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  moreOptionsContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 15,
    elevation: 1,
  },
  optionsList: {
    marginTop: 5,
    gap: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  confirmButton: {
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
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
