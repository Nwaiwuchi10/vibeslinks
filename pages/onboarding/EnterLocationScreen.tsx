import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function EnterLocationScreen() {
  const [search, setSearch] = useState('');

  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [postal, setPostal] = useState('');

  const isFilled = street.length > 0; // simplistic check to show "Confirm Location" instead of "Fill Location"

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Enter your location</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Search Area */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#8A8A8A" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Topaz Avenue"
              placeholderTextColor="#8A8A8A"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity style={styles.clearSearch} onPress={() => setSearch('')}>
                <Ionicons name="close" size={14} color="#333" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.currentLocationRow} activeOpacity={0.7}>
            <Ionicons name="navigate" size={20} color={Colors.primary} style={styles.navigateIcon} />
            <Text style={styles.currentLocationText}>Use my current location</Text>
          </TouchableOpacity>

          {/* Form Card */}
          <View style={styles.cardContainer}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{isFilled ? 'Confirm Location' : 'Fill Location'}</Text>
              <TouchableOpacity style={styles.closeCardButton}>
                <Ionicons name="close" size={18} color="#333" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Enter Address</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Street No"
                placeholderTextColor="#A0A0A0"
                value={street}
                onChangeText={setStreet}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="City"
                placeholderTextColor="#A0A0A0"
                value={city}
                onChangeText={setCity}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="State"
                placeholderTextColor="#A0A0A0"
                value={state}
                onChangeText={setState}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Country"
                placeholderTextColor="#A0A0A0"
                value={country}
                onChangeText={setCountry}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Postal Code"
                placeholderTextColor="#A0A0A0"
                value={postal}
                onChangeText={setPostal}
                keyboardType="numeric"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.confirmButton}
            activeOpacity={0.88}
            onPress={() => {
              router.push('/(onboarding)/location-confirmed' as any);
            }}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30, // For keyboard spacing
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  clearSearch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  currentLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 8,
  },
  navigateIcon: {
    marginRight: 10,
  },
  currentLocationText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  closeCardButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
  },
  confirmButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
