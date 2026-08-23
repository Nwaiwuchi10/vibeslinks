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
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { userService } from '@/services/userService';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

const BUSINESS_TYPES = [
  'Event Promoter',
  'Nightclub / Venue Owner',
  'Concert Organizer',
  'Music Festival Organizer',
  'Corporate Events',
  'Private Party Organizer',
  'Sports Events',
  'Community Events',
  'Other',
];

export default function HostApplicationScreen() {
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [experience, setExperience] = useState('');
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBusinessTypePicker, setShowBusinessTypePicker] = useState(false);

  const handleSubmit = async () => {
    if (!businessName.trim()) {
      store.dispatch(showToast({ type: 'error', message: 'Business/Organization Name is required.' }));
      return;
    }
    if (!experience.trim()) {
      store.dispatch(showToast({ type: 'error', message: 'Please describe your event experience.' }));
      return;
    }

    setIsLoading(true);
    try {
      // Build reason string — the API only takes requestedRole + reason
      const reasonParts = [
        `Business Name: ${businessName.trim()}`,
        `Business Type: ${businessType || 'N/A'}`,
        `Experience: ${experience.trim()}`,
      ];
      if (instagram.trim()) reasonParts.push(`Instagram: @${instagram.trim()}`);
      if (tiktok.trim()) reasonParts.push(`TikTok: @${tiktok.trim()}`);
      if (twitter.trim()) reasonParts.push(`X (Twitter): @${twitter.trim()}`);

      const reason = reasonParts.join('\n');

      await userService.applyForHostRole(reason);
      router.push('/application-submitted' as any);
    } catch (error) {
      console.error('[HostApplicationScreen] Failed to submit host application:', error);
      // Toast is handled by apiClient interceptor
    } finally {
      setIsLoading(false);
    }
  };

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
          <Text style={styles.subtitle}>Tell us about yourself and your events.</Text>

          {/* Form */}
          <View style={styles.formContainer}>

            {/* Business Name */}
            <Text style={styles.fieldLabel}>Business / Organization Name <Text style={styles.required}>*</Text></Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business-outline" size={18} color="#999" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. AfroVibes Entertainment"
                placeholderTextColor="#A0A0A0"
                value={businessName}
                onChangeText={setBusinessName}
              />
            </View>

            {/* Business Type Picker */}
            <Text style={styles.fieldLabel}>Business Type</Text>
            <TouchableOpacity
              style={styles.pickerWrapper}
              activeOpacity={0.7}
              onPress={() => setShowBusinessTypePicker(true)}
            >
              <Ionicons name="briefcase-outline" size={18} color="#999" style={styles.inputIcon} />
              <Text style={[styles.pickerText, !businessType && styles.pickerPlaceholder]}>
                {businessType || 'Select business type...'}
              </Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>

            {/* Experience */}
            <Text style={styles.fieldLabel}>Event Experience <Text style={styles.required}>*</Text></Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Tell us about your experience organizing events, how many events you've hosted, the types of events, expected audience size, etc."
                placeholderTextColor="#A0A0A0"
                value={experience}
                onChangeText={setExperience}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Social Handles */}
            <Text style={styles.fieldLabel}>Social Media Handles <Text style={styles.optional}>(optional)</Text></Text>

            <View style={styles.inputWrapper}>
              <FontAwesome5 name="instagram" size={16} color="#C13584" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Instagram username"
                placeholderTextColor="#A0A0A0"
                value={instagram}
                onChangeText={setInstagram}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <FontAwesome5 name="tiktok" size={16} color="#010101" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="TikTok username"
                placeholderTextColor="#A0A0A0"
                value={tiktok}
                onChangeText={setTiktok}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputWrapper}>
              <FontAwesome5 name="twitter" size={16} color="#1DA1F2" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="X (Twitter) username"
                placeholderTextColor="#A0A0A0"
                value={twitter}
                onChangeText={setTwitter}
                autoCapitalize="none"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
            activeOpacity={0.88}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Application</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Business Type Picker Modal */}
      <Modal
        visible={showBusinessTypePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBusinessTypePicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBusinessTypePicker(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Business Type</Text>
            <ScrollView>
              {BUSINESS_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.modalOption,
                    businessType === type && styles.modalOptionSelected,
                  ]}
                  onPress={() => {
                    setBusinessType(type);
                    setShowBusinessTypePicker(false);
                  }}
                >
                  <Text style={[
                    styles.modalOptionText,
                    businessType === type && styles.modalOptionTextSelected,
                  ]}>
                    {type}
                  </Text>
                  {businessType === type && (
                    <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 28,
  },
  formContainer: {
    width: '100%',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
    marginLeft: 2,
  },
  required: {
    color: Colors.primary,
  },
  optional: {
    fontWeight: '400',
    color: '#AAA',
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 10,
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
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pickerText: {
    flex: 1,
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
    minHeight: 130,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
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
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    maxHeight: '70%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A2E',
    textAlign: 'center',
    marginBottom: 12,
    paddingHorizontal: 24,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  modalOptionSelected: {
    backgroundColor: '#F8F3FF',
  },
  modalOptionText: {
    fontSize: 15,
    color: '#333',
  },
  modalOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
