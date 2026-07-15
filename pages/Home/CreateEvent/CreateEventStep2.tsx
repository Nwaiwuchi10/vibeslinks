import React, { useState, useEffect } from 'react';
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
  FlatList,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useCreateEvent } from './CreateEventContext';
import { eventService } from '@/services/eventService';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

const CATEGORIES = ['club', 'concert', 'conference', 'festival', 'workshop', 'other'];
const TIMEZONES = ['Africa/Lagos', 'UTC', 'GMT+1', 'EST', 'PST'];

interface ArtistOption {
  id: string;
  name: string;
  avatarUrl?: string;
  avatar?: string;
}

const CreateEventStep2 = ({
  onBack,
  onContinue,
  onOpenDatePicker,
}: {
  onBack: () => void;
  onContinue: () => void;
  onOpenDatePicker: () => void;
}) => {
  const { eventData, updateEventData } = useCreateEvent();
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);
  const [showArtistSelector, setShowArtistSelector] = useState(false);
  const [showImageSourcePicker, setShowImageSourcePicker] = useState(false);
  
  const [availableArtists, setAvailableArtists] = useState<ArtistOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customCoverUrl, setCustomCoverUrl] = useState(eventData.imageUrl);

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
        setCustomCoverUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('[CreateEventStep2] Image pick failed:', err);
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
        setCustomCoverUrl(result.assets[0].uri);
      }
    } catch (err) {
      console.warn('[CreateEventStep2] Camera launch failed:', err);
    }
  };

  useEffect(() => {
    async function fetchArtists() {
      try {
        const res = await eventService.getArtistOptions();
        const list = Array.isArray(res) ? res : res.artists || [];
        setAvailableArtists(list.map((a: any) => ({
          id: a.id || String(a.userId),
          name: a.name || a.fullName || 'Artist',
          avatarUrl: a.avatarUrl || a.profilePictureUrl || `https://i.pravatar.cc/150?img=${a.id || Math.floor(Math.random() * 50)}`,
        })));
      } catch (err) {
        console.warn('[CreateEventStep2] Failed to fetch artist options:', err);
      }
    }
    fetchArtists();
  }, []);

  const formatDate = (isoStr: string) => {
    if (!isoStr) return 'Select Date';
    const d = new Date(isoStr);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const handleToggleArtist = (artistId: string) => {
    const currentIds = eventData.artisteIds || [];
    if (currentIds.includes(artistId)) {
      updateEventData({ artisteIds: currentIds.filter(id => id !== artistId) });
    } else {
      updateEventData({ artisteIds: [...currentIds, artistId] });
    }
  };

  const getSelectedArtists = () => {
    const ids = eventData.artisteIds || [];
    return availableArtists.filter(a => ids.includes(a.id));
  };

  const filteredArtists = availableArtists.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRandomCover = () => {
    const randomCovers = [
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
      'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    ];
    const chosen = randomCovers[Math.floor(Math.random() * randomCovers.length)];
    updateEventData({ imageUrl: chosen });
    setCustomCoverUrl(chosen);
  };

  const isFormValid = eventData.title.trim() && eventData.startsAt && eventData.venue.trim() && eventData.location.trim() && eventData.imageUrl;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Physical Event Details</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Title */}
        <Text style={styles.label}>Event Title <Text style={styles.required}>*</Text></Text>
        <TextInput 
          placeholder="e.g. Burna Boy Live in Lagos" 
          style={styles.input} 
          placeholderTextColor="#999" 
          value={eventData.title}
          onChangeText={(text) => updateEventData({ title: text })}
        />

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput 
          placeholder="Describe your event..." 
          style={[styles.input, styles.textArea]} 
          multiline 
          placeholderTextColor="#999"
          value={eventData.description}
          onChangeText={(text) => updateEventData({ description: text })}
        />
        
        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <TouchableOpacity 
          style={[styles.input, styles.dropdown]} 
          onPress={() => setShowCategoryDropdown(true)}
        >
          <Text style={[styles.dropdownText, eventData.category && { color: '#333' }]}>
            {eventData.category ? eventData.category.toUpperCase() : 'Category'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#999" />
        </TouchableOpacity>

        {/* Featured Artists section */}
        <View style={styles.artistSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Artists</Text>
            <TouchableOpacity style={styles.addBtn} onPress={() => setShowArtistSelector(true)}>
              <Text style={styles.addBtnText}>Manage Artists</Text>
            </TouchableOpacity>
          </View>
          
          {getSelectedArtists().length > 0 ? (
            <View style={styles.selectedArtistsRow}>
              {getSelectedArtists().map(artist => (
                <View key={artist.id} style={styles.artistChip}>
                  <Image source={{ uri: artist.avatarUrl }} style={styles.chipAvatar} />
                  <Text style={styles.chipName} numberOfLines={1}>{artist.name}</Text>
                  <TouchableOpacity onPress={() => handleToggleArtist(artist.id)}>
                    <Ionicons name="close-circle" size={16} color="#8E2DE2" style={{ marginLeft: 4 }} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noArtistsText}>No featured artists selected.</Text>
          )}
        </View>

        {/* Time and Date */}
        <Text style={styles.label}>Time & Date <Text style={styles.required}>*</Text></Text>
        <View style={styles.timeRow}>
          <TouchableOpacity style={styles.timeItem} onPress={onOpenDatePicker}>
            <Text style={styles.timeLabel}>Start time</Text>
            <Text style={styles.timeValue} numberOfLines={1}>
              {eventData.startsAt ? formatDate(eventData.startsAt) : 'Select Date'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeItem} onPress={onOpenDatePicker}>
            <Text style={styles.timeLabel}>End time</Text>
            <Text style={styles.timeValue} numberOfLines={1}>
              {eventData.endsAt ? formatDate(eventData.endsAt) : 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Time Zone */}
        <Text style={styles.label}>Time Zone</Text>
        <TouchableOpacity 
          style={[styles.input, styles.dropdown]} 
          onPress={() => setShowTimezoneDropdown(true)}
        >
          <Text style={[styles.dropdownText, eventData.timezone && { color: '#333' }]}>
            {eventData.timezone || 'Select timezone...'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#999" />
        </TouchableOpacity>

        {/* Cover Image */}
        <Text style={styles.label}>Event Cover Image <Text style={styles.required}>*</Text></Text>
        
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

        {/* Venue Info */}
        <View style={styles.venueSection}>
          <Text style={styles.sectionLabel}>Venue Details</Text>
          
          <Text style={styles.label}>Venue Name <Text style={styles.required}>*</Text></Text>
          <TextInput 
            placeholder="e.g. Eko Hotel Convention Centre" 
            style={styles.whiteInput} 
            placeholderTextColor="#999" 
            value={eventData.venue}
            onChangeText={(text) => updateEventData({ venue: text })}
          />

          <Text style={styles.label}>Address / Location <Text style={styles.required}>*</Text></Text>
          <TextInput 
            placeholder="e.g. Victoria Island, Lagos" 
            style={styles.whiteInput} 
            placeholderTextColor="#999" 
            value={eventData.location}
            onChangeText={(text) => updateEventData({ location: text })}
          />

          <View style={styles.capacityRow}>
            <Text style={styles.capacityLabel}>Venue capacity</Text>
            <TextInput 
              placeholder="e.g. 5000" 
              style={styles.capacityInput} 
              keyboardType="numeric" 
              placeholderTextColor="#999" 
              value={eventData.totalCapacity > 0 ? eventData.totalCapacity.toString() : ''}
              onChangeText={(text) => updateEventData({ totalCapacity: parseInt(text, 10) || 0 })}
            />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
         <TouchableOpacity 
           style={[styles.continueBtn, !isFormValid && styles.continueBtnDisabled]} 
           onPress={onContinue}
           disabled={!isFormValid}
         >
           <Text style={styles.continueText}>Continue</Text>
         </TouchableOpacity>
      </View>

      {/* Category Modal */}
      <Modal visible={showCategoryDropdown} transparent animationType="slide" onRequestClose={() => setShowCategoryDropdown(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowCategoryDropdown(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Category</Text>
            <ScrollView>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.modalOption, eventData.category === cat && styles.modalOptionSelected]}
                  onPress={() => {
                    updateEventData({ category: cat });
                    setShowCategoryDropdown(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, eventData.category === cat && styles.modalOptionTextSelected]}>
                    {cat.toUpperCase()}
                  </Text>
                  {eventData.category === cat && <Ionicons name="checkmark-circle" size={20} color="#8E2DE2" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Timezone Modal */}
      <Modal visible={showTimezoneDropdown} transparent animationType="slide" onRequestClose={() => setShowTimezoneDropdown(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowTimezoneDropdown(false)}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Timezone</Text>
            <ScrollView>
              {TIMEZONES.map((tz) => (
                <TouchableOpacity
                  key={tz}
                  style={[styles.modalOption, eventData.timezone === tz && styles.modalOptionSelected]}
                  onPress={() => {
                    updateEventData({ timezone: tz });
                    setShowTimezoneDropdown(false);
                  }}
                >
                  <Text style={[styles.modalOptionText, eventData.timezone === tz && styles.modalOptionTextSelected]}>
                    {tz}
                  </Text>
                  {eventData.timezone === tz && <Ionicons name="checkmark-circle" size={20} color="#8E2DE2" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Artist Selection Modal */}
      <Modal visible={showArtistSelector} transparent animationType="slide" onRequestClose={() => setShowArtistSelector(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { height: '80%', maxHeight: '80%' }]}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>Select Featured Artists</Text>
            
            <View style={styles.searchBarWrapper}>
              <Ionicons name="search-outline" size={18} color="#999" style={{ marginRight: 8 }} />
              <TextInput
                placeholder="Search artists..."
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={filteredArtists}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingHorizontal: 20 }}
              renderItem={({ item }) => {
                const isSelected = (eventData.artisteIds || []).includes(item.id);
                return (
                  <TouchableOpacity
                    style={[styles.artistSelectItem, isSelected && styles.artistSelectItemActive]}
                    onPress={() => handleToggleArtist(item.id)}
                  >
                    <Image source={{ uri: item.avatarUrl }} style={styles.artistSelectAvatar} />
                    <Text style={styles.artistSelectName}>{item.name}</Text>
                    <Ionicons 
                      name={isSelected ? "checkmark-circle" : "ellipse-outline"} 
                      size={24} 
                      color={isSelected ? "#8E2DE2" : "#DDD"} 
                    />
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyArtistsText}>No artists found. Make sure they are registered on the platform.</Text>
              }
            />

            <TouchableOpacity 
              style={styles.closeModalBtn}
              onPress={() => setShowArtistSelector(false)}
            >
              <Text style={styles.closeModalBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default CreateEventStep2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginRight: 20 },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#333' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  label: { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 10 },
  required: { color: '#8E2DE2' },
  input: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15, color: '#333', fontSize: 14, borderWidth: 1, borderColor: '#EEE' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 15 },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15 },
  dropdownText: { color: '#999', fontSize: 14 },
  artistSection: { backgroundColor: '#F8F5FF', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EFEAFF' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333' },
  addBtn: { backgroundColor: '#8E2DE2', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  noArtistsText: { color: '#999', fontSize: 13, fontStyle: 'italic' },
  selectedArtistsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 },
  artistChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, marginRight: 8, marginBottom: 8, borderWidth: 1, borderColor: '#EFEFEF' },
  chipAvatar: { width: 20, height: 20, borderRadius: 10, marginRight: 6 },
  chipName: { fontSize: 12, color: '#333', fontWeight: '600', maxWidth: 80 },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  timeItem: { width: '48%', height: 60, backgroundColor: '#FFF', borderRadius: 12, justifyContent: 'center', paddingHorizontal: 15, borderWidth: 1, borderColor: '#EEE' },
  timeLabel: { color: '#999', fontSize: 11, fontWeight: '600', marginBottom: 4 },
  timeValue: { fontSize: 13, color: '#333', fontWeight: '700' },
  randomCoverBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginBottom: 20 },
  randomCoverBtnText: { fontSize: 13, color: '#8E2DE2', fontWeight: '700' },
  venueSection: { backgroundColor: '#FFF', borderRadius: 20, padding: 16, marginBottom: 20, borderWidth: 1, borderColor: '#EFEFEF' },
  sectionLabel: { fontSize: 15, fontWeight: '800', color: '#333', marginBottom: 16 },
  whiteInput: { backgroundColor: '#FAFAFA', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 12, justifyContent: 'center', borderWidth: 1, borderColor: '#EFEFEF' },
  capacityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  capacityLabel: { fontSize: 14, fontWeight: '700', color: '#555' },
  capacityInput: { backgroundColor: '#FAFAFA', width: '50%', height: 50, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#EFEFEF', textAlign: 'right' },
  footer: { paddingHorizontal: 20, paddingBottom: 30, paddingTop: 10, backgroundColor: '#FAFAFA' },
  continueBtn: { backgroundColor: '#7F36FF', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  continueBtnDisabled: { opacity: 0.5 },
  continueText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  
  // Modal layout
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 30, maxHeight: '60%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#DDD', alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: '#1A1A2E', textAlign: 'center', marginBottom: 12, paddingHorizontal: 24 },
  modalOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, paddingHorizontal: 24, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  modalOptionSelected: { backgroundColor: '#F8F3FF' },
  modalOptionText: { fontSize: 15, color: '#333' },
  modalOptionTextSelected: { color: '#8E2DE2', fontWeight: '600' },
  
  // Search bar
  searchBarWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: 12, marginHorizontal: 20, height: 46, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 14, color: '#333' },
  artistSelectItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F5F5F5' },
  artistSelectItemActive: { backgroundColor: '#FAF6FF' },
  artistSelectAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  artistSelectName: { flex: 1, fontSize: 15, color: '#333', fontWeight: '600' },
  emptyArtistsText: { color: '#999', fontSize: 13, textAlign: 'center', padding: 20 },
  closeModalBtn: { backgroundColor: '#7F36FF', height: 50, borderRadius: 25, marginHorizontal: 20, justifyContent: 'center', alignItems: 'center', marginTop: 15 },
  closeModalBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  
  // Image Preview & Upload Cover Styles
  coverPreviewContainer: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 15, position: 'relative' },
  coverPreview: { width: '100%', height: '100%' },
  changeCoverBtn: { position: 'absolute', bottom: 12, right: 12, backgroundColor: 'rgba(0, 0, 0, 0.6)', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  changeCoverBtnText: { color: '#FFF', fontSize: 12, fontWeight: '700', marginLeft: 4 },
  uploadCoverBox: { width: '100%', height: 180, borderRadius: 20, backgroundColor: '#FFF', borderStyle: 'dashed', borderWidth: 2, borderColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  uploadCoverText: { fontSize: 14, color: '#8E2DE2', fontWeight: '700', marginBottom: 4 },
  uploadCoverSub: { fontSize: 11, color: '#999', fontWeight: '500' },
});
