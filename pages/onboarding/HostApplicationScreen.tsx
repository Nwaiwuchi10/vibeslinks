import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function HostApplicationScreen() {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [experience, setExperience] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');

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
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Small Illustration & Pagination */}
          <View style={styles.topSection}>
            <View style={styles.paginationContainer}>
              <View style={[styles.dot, styles.dotInactive]} />
              <View style={[styles.dot, styles.dotActive]} />
            </View>
            <View style={styles.smallIllustration}>
              <MaterialCommunityIcons name="calendar-edit" size={60} color={Colors.primary} style={{ opacity: 0.8 }} />
            </View>
          </View>

          <Text style={styles.title}>Host Application</Text>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Business/Organization Name"
                placeholderTextColor="#A0A0A0"
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            <TouchableOpacity style={styles.pickerWrapper} activeOpacity={0.7}>
              <Text style={[styles.pickerText, !businessType && styles.pickerPlaceholder]}>
                {businessType || 'Business Type'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>

            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us about your experience organizing events..."
                placeholderTextColor="#A0A0A0"
                value={experience}
                onChangeText={setExperience}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Note: The UI design explicitly shows "Enter email address" as a label immediately above Instagram, Tiktok, X */}
            <Text style={styles.sectionLabel}>Enter email address</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Instagram"
                placeholderTextColor="#A0A0A0"
                value={instagram}
                onChangeText={setInstagram}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Tiktok"
                placeholderTextColor="#A0A0A0"
                value={tiktok}
                onChangeText={setTiktok}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="X(twiter)"
                placeholderTextColor="#A0A0A0"
                value={twitter}
                onChangeText={setTwitter}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.submitButton}
            activeOpacity={0.88}
            onPress={() => router.push('/(onboarding)/application-submitted' as any)}
          >
            <Text style={styles.submitButtonText}>Submit Application</Text>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    flexDirection: 'row',
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
    marginBottom: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 16,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    backgroundColor: '#E0E0E0',
  },
  smallIllustration: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pickerText: {
    fontSize: 15,
    color: '#333',
  },
  pickerPlaceholder: {
    color: '#A0A0A0',
  },
  textAreaWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    minHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 24,
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
  },
  submitButton: {
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
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
