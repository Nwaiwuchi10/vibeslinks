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
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function AddCardScreen() {
  const router = useRouter();
  const [saveCard, setSaveCard] = useState(false);

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

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
              placeholder="Card Holder Name"
              placeholderTextColor="#BBB"
            />
          </View>

          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.input}
              placeholder="Card Number"
              placeholderTextColor="#BBB"
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <TextInput 
                style={styles.input}
                placeholder="Expire Date"
                placeholderTextColor="#BBB"
              />
            </View>
            <View style={[styles.inputContainer, { flex: 1, marginLeft: 15 }]}>
              <TextInput 
                style={styles.input}
                placeholder="CCV"
                placeholderTextColor="#BBB"
                keyboardType="number-pad"
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
            <Text style={styles.saveCardText}>Save Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/profile/card-success')}>
          <Text style={styles.addButtonText}>Add Card</Text>
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
