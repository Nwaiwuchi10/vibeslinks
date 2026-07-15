import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCreateEvent } from './CreateEventContext';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

const CATEGORIES = ['music', 'comedy', 'gospel', 'afrobeat', 'EDM', 'talk show', 'sports', 'lifestyle', 'other'];

const PRIVACY_OPTIONS: { value: 'all' | 'ticket-holders-only' | 'invite-only'; label: string; desc: string; icon: string }[] = [
  { value: 'all', label: 'Public', desc: 'Anyone can watch for free', icon: 'globe-outline' },
  { value: 'ticket-holders-only', label: 'Ticket Holders Only', desc: 'Viewers must pay to watch', icon: 'ticket-outline' },
  { value: 'invite-only', label: 'Invite Only', desc: 'Only people you invite can watch', icon: 'lock-closed-outline' },
];

const CreateEventStep2Livestream = ({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) => {
  const { eventData, updateEventData } = useCreateEvent();
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [showImageSourcePicker, setShowImageSourcePicker] = useState(false);

  const isTicketed = eventData.liveStreamPrivacy === 'ticket-holders-only';

  const handleSelectImage = async () => {
    setShowImageSourcePicker(false);
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        store.dispatch(showToast({ type: 'error', message: 'Permission to access gallery is required.' }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        updateEventData({ imageUrl: result.assets[0].uri });
      }
    } catch (err) {
      console.warn('[CreateEventStep2Livestream] Image pick failed:', err);
    }
  };

  const handleTakePhoto = async () => {
    setShowImageSourcePicker(false);
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        store.dispatch(showToast({ type: 'error', message: 'Permission to use camera is required.' }));
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        updateEventData({ imageUrl: result.assets[0].uri });
      }
    } catch (err) {
      console.warn('[CreateEventStep2Livestream] Camera launch failed:', err);
    }
  };

  const handleAddRandomCover = () => {
    const randomCovers = [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    ];
    const chosen = randomCovers[Math.floor(Math.random() * randomCovers.length)];
    updateEventData({ imageUrl: chosen });
  };

  const handleContinue = () => {
    if (!eventData.title.trim() || !eventData.imageUrl) return;
    onContinue();
  };

  const isFormValid = eventData.title.trim() && eventData.imageUrl;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Livestream Details</Text>
          <Text style={styles.headerSub}>Set up your stream info</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Stream Title */}
        <Text style={styles.label}>Stream Title <Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder="e.g. Sunday Worship Night Live"
          style={styles.input}
          placeholderTextColor="#999"
          value={eventData.title}
          onChangeText={(text) => updateEventData({ title: text })}
        />

        {/* Cover Image */}
        <Text style={styles.label}>Stream Cover Image <Text style={styles.required}>*</Text></Text>
        {eventData.imageUrl ? (
          <View style={styles.coverPreviewContainer}>
            <Image source={{ uri: eventData.imageUrl }} style={styles.coverPreview} />
            <TouchableOpacity style={styles.changeCoverBtn} onPress={() => setShowImageSourcePicker(true)}>
              <Ionicons name="camera-outline" size={18} color="#FFF" />
              <Text style={styles.changeCoverBtnText}>Change Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.uploadCoverBox} onPress={() => setShowImageSourcePicker(true)}>
            <Ionicons name="image-outline" size={36} color="#8E2DE2" style={{ marginBottom: 8 }} />
            <Text style={styles.uploadCoverText}>Upload Cover Image</Text>
            <Text style={styles.uploadCoverSub}>Select from Library or Take Photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.randomCoverBtn} onPress={handleAddRandomCover}>
          <Ionicons name="image-outline" size={18} color="#8E2DE2" style={{ marginRight: 6 }} />
          <Text style={styles.randomCoverBtnText}>Generate Random Beautiful Cover</Text>
        </TouchableOpacity>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity style={[styles.input, styles.pickerRow]} onPress={() => setShowCategoryPicker(true)}>
          <Text style={[styles.pickerText, !eventData.category && { color: '#999' }]}>
            {eventData.category || 'Select category...'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#999" />
        </TouchableOpacity>

        {/* Privacy */}
        <Text style={styles.label}>Who can watch?</Text>
        {PRIVACY_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[styles.privacyCard, eventData.liveStreamPrivacy === opt.value && styles.privacyCardActive]}
            onPress={() => updateEventData({ liveStreamPrivacy: opt.value })}
            activeOpacity={0.8}
          >
            <Ionicons
              name={opt.icon as any}
              size={22}
              color={eventData.liveStreamPrivacy === opt.value ? '#8E2DE2' : '#999'}
              style={{ marginRight: 14 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.privacyLabel, eventData.liveStreamPrivacy === opt.value && styles.privacyLabelActive]}>
                {opt.label}
              </Text>
              <Text style={styles.privacyDesc}>{opt.desc}</Text>
            </View>
            <View style={styles.radioOutter}>
              {eventData.liveStreamPrivacy === opt.value && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        ))}

        {/* Ticket Price — only shown when ticket-holders-only */}
        {isTicketed && (
          <>
            <Text style={styles.label}>Ticket Price (NGN)</Text>
            <View style={styles.priceRow}>
              <Text style={styles.currencyLabel}>₦</Text>
              <TextInput
                placeholder="0"
                style={[styles.input, styles.priceInput]}
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={eventData.liveStreamTicketPrice > 0 ? eventData.liveStreamTicketPrice.toString() : ''}
                onChangeText={(text) => updateEventData({ liveStreamTicketPrice: parseFloat(text) || 0 })}
              />
            </View>
          </>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.continueBtn, !isFormValid && styles.continueBtnDisabled]}
          onPress={handleContinue}
          disabled={!isFormValid}
          activeOpacity={0.88}
        >
          <Text style={styles.continueText}>Continue to Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} transparent animationType="slide" onRequestClose={() => setShowCategoryPicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryPicker(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Category</Text>
            <ScrollView>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.modalOption, eventData.category === cat && styles.modalOptionSelected]}
                  onPress={() => { updateEventData({ category: cat }); setShowCategoryPicker(false); }}
                >
                  <Text style={[styles.modalOptionText, eventData.category === cat && styles.modalOptionTextSelected]}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </Text>
                  {eventData.category === cat && <Ionicons name="checkmark-circle" size={20} color="#8E2DE2" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Image Source Picker Modal */}
      <Modal visible={showImageSourcePicker} transparent animationType="slide" onRequestClose={() => setShowImageSourcePicker(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowImageSourcePicker(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Choose Image Source</Text>
            <TouchableOpacity style={styles.modalOption} onPress={handleSelectImage}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="images-outline" size={22} color="#333" style={{ marginRight: 12 }} />
                <Text style={styles.modalOptionText}>Choose from Gallery</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOption} onPress={handleTakePhoto}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="camera-outline" size={22} color="#333" style={{ marginRight: 12 }} />
                <Text style={styles.modalOptionText}>Take a Photo</Text>
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default CreateEventStep2Livestream;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginRight: 14 },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  headerSub: { fontSize: 11, color: '#999', marginTop: 3 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 4 },
  required: { color: '#8E2DE2' },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 56,
    marginBottom: 16,
    fontSize: 15,
    color: '#333',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
  },
  pickerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pickerText: { fontSize: 15, color: '#333', flex: 1 },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#EFEFEF',
    elevation: 1,
  },
  privacyCardActive: { borderColor: '#8E2DE2', backgroundColor: '#FBF8FF' },
  privacyLabel: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 3 },
  privacyLabelActive: { color: '#8E2DE2' },
  privacyDesc: { fontSize: 12, color: '#999' },
  radioOutter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#8E2DE2' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  currencyLabel: { fontSize: 20, fontWeight: '700', color: '#333', marginRight: 8 },
  priceInput: { flex: 1, marginBottom: 0 },
  randomCoverBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginBottom: 20 },
  randomCoverBtnText: { fontSize: 13, color: '#8E2DE2', fontWeight: '700' },
  footer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10, backgroundColor: '#FAFAFA' },
  continueBtn: { backgroundColor: '#7F36FF', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  continueBtnDisabled: { opacity: 0.5 },
  continueText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 30, maxHeight: '60%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#DDD', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', textAlign: 'center', marginBottom: 12, paddingHorizontal: 24 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  modalOptionSelected: { backgroundColor: '#F8F3FF' },
  modalOptionText: { fontSize: 15, color: '#333' },
  modalOptionTextSelected: { color: '#8E2DE2', fontWeight: '600' },

  // Image Preview & Upload Cover Styles
  coverPreviewContainer: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 15, position: 'relative' },
  coverPreview: { width: '100%', height: '100%' },
  changeCoverBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0, 0, 0, 0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  changeCoverBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  uploadCoverBox: { width: '100%', height: 180, borderRadius: 20, backgroundColor: '#FFF', borderStyle: 'dashed', borderWidth: 2, borderColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  uploadCoverText: { fontSize: 14, color: '#8E2DE2', fontWeight: '700', marginBottom: 4 },
  uploadCoverSub: { fontSize: 11, color: '#999', fontWeight: '500' },
});
