import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CancelReasonMain() {
  const router = useRouter();
  const [selectedReason, setSelectedReason] = useState('Artist Unavailable');
  const [details, setDetails] = useState('');

  const reasons = [
    'Venue Issues',
    'Artist Unavailable',
    'Low Ticket Sales',
    'Weather Conditions',
    'Scheduling Conflict',
    'Safety Concerns',
    'Other',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reason for Cancellation</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Reasons Radio Group */}
        <View style={styles.reasonsBox}>
          {reasons.map((reason) => {
            const isChecked = selectedReason === reason;
            return (
              <TouchableOpacity
                key={reason}
                style={styles.reasonRow}
                onPress={() => setSelectedReason(reason)}
              >
                <Text style={[styles.reasonText, isChecked && styles.activeReasonText]}>
                  {reason}
                </Text>
                <Ionicons
                  name={isChecked ? 'checkmark-circle' : 'ellipse-outline'}
                  size={22}
                  color={isChecked ? '#7B39FD' : '#D1D1D6'}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Add Details Review */}
        <Text style={styles.reviewLabel}>Add details review</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter here"
            placeholderTextColor="#A0A0A0"
            multiline={true}
            style={styles.reviewInput}
            value={details}
            onChangeText={setDetails}
          />
        </View>

        {/* Continue Button */}
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push('/dashboard/cancel-impact')}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
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
  },
  reasonsBox: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginBottom: 25,
  },
  reasonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F9',
  },
  reasonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  activeReasonText: {
    color: '#1A1A1A',
  },
  reviewLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    height: 120,
    marginBottom: 35,
  },
  reviewInput: {
    fontSize: 14,
    color: '#1A1A1A',
    textAlignVertical: 'top',
    height: '100%',
  },
  continueButton: {
    backgroundColor: '#7B39FD',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
