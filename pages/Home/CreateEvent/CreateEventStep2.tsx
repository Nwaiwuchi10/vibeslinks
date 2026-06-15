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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CATEGORIES = ['Afrobeat', 'EDM', 'Gospel', 'Amapiano', 'Nightlife'];

const CreateEventStep2 = ({ onBack, onContinue, onOpenDatePicker }: { onBack: () => void, onContinue: () => void, onOpenDatePicker: () => void }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Category');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Physical Event</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <TextInput placeholder="Event Title" style={styles.input} placeholderTextColor="#999" />
        <TextInput 
          placeholder="Short Description" 
          style={[styles.input, styles.textArea]} 
          multiline 
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity 
          style={[styles.input, styles.dropdown]} 
          onPress={() => setShowDropdown(true)}
        >
          <Text style={[styles.dropdownText, selectedCategory !== 'Category' && { color: '#333' }]}>
            {selectedCategory}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#999" />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownList}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat} 
                style={styles.dropdownItem}
                onPress={() => {
                  setSelectedCategory(cat);
                  setShowDropdown(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Artists (optional)</Text>
            <TouchableOpacity style={styles.addBtn}>
              <Text style={styles.addBtnText}>Add More</Text>
            </TouchableOpacity>
          </View>
          <TextInput placeholder="Artists Name" style={styles.whiteInput} placeholderTextColor="#999" />
          <TouchableOpacity style={[styles.whiteInput, styles.dropdown]}>
            <Text style={styles.dropdownText}>Category</Text>
            <Ionicons name="chevron-down" size={18} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.whiteInput, styles.uploadRow]}>
            <Text style={styles.uploadText}>Upload Artists Image</Text>
            <MaterialCommunityIcons name="cloud-upload-outline" size={20} color="#8E2DE2" />
          </TouchableOpacity>
        </View>

        <View style={styles.timeRow}>
          <TouchableOpacity style={styles.timeItem} onPress={onOpenDatePicker}>
            <Text style={styles.timeLabel}>Start time</Text>
            <Ionicons name="time-outline" size={18} color="#8E2DE2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.timeItem} onPress={onOpenDatePicker}>
            <Text style={styles.timeLabel}>End time</Text>
            <Ionicons name="time-outline" size={18} color="#8E2DE2" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.input, styles.dropdown]}>
          <Text style={styles.dropdownText}>Time Zone</Text>
          <Ionicons name="chevron-down" size={18} color="#999" />
        </TouchableOpacity>

        <Text style={styles.uploadSectionTitle}>Upload Event Cover</Text>
        <TouchableOpacity style={styles.uploadCoverBox}>
          <View style={styles.uploadIconCircle}>
            <MaterialCommunityIcons name="plus-box" size={30} color="#FFF" />
          </View>
          <Text style={styles.uploadCoverText}>Event Cover</Text>
        </TouchableOpacity>
        <Text style={styles.recommendText}>Recommended image size 1080 by 1080</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Venue</Text>
          <TextInput placeholder="Venue name" style={styles.whiteInput} placeholderTextColor="#999" />
          <TextInput placeholder="Address" style={styles.whiteInput} placeholderTextColor="#999" />
          <View style={[styles.whiteInput, styles.uploadRow]}>
            <Text style={styles.uploadText}>Google map pin</Text>
            <Ionicons name="map-outline" size={20} color="#8E2DE2" />
          </View>
          <View style={styles.capacityRow}>
            <Text style={styles.capacityLabel}>Venue capacity</Text>
            <TextInput placeholder="Input No" style={styles.capacityInput} keyboardType="numeric" placeholderTextColor="#999" />
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
         <TouchableOpacity style={styles.continueBtn} onPress={onContinue}>
           <Text style={styles.continueText}>Continue</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventStep2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15, alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2, marginRight: 60 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  input: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 15, height: 55, marginBottom: 15, color: '#333', fontSize: 14, borderWidth: 1, borderColor: '#EEE' },
  textArea: { height: 120, textAlignVertical: 'top', paddingTop: 15 },
  dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 15 },
  dropdownText: { color: '#999', fontSize: 14 },
  section: { backgroundColor: '#F3E8FF', borderRadius: 20, padding: 15, marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: '#333' },
  addBtn: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  addBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  whiteInput: { backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 15, height: 50, marginBottom: 12, justifyContent: 'center' },
  uploadRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  uploadText: { color: '#8E2DE2', fontSize: 13, fontWeight: '600' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  timeItem: { width: '48%', height: 55, backgroundColor: '#F8F8F8', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  timeLabel: { color: '#999', fontSize: 13 },
  uploadSectionTitle: { fontSize: 15, fontWeight: '700', color: '#333', marginBottom: 15, marginTop: 10 },
  uploadCoverBox: { width: '100%', height: 180, borderRadius: 20, backgroundColor: '#FFF', borderStyle: 'dashed', borderWidth: 1, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  uploadIconCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#999', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  uploadCoverText: { fontSize: 12, color: '#999', fontWeight: '600' },
  recommendText: { fontSize: 10, color: '#8E2DE2', textAlign: 'center', marginTop: 10, marginBottom: 20 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12 },
  capacityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  capacityLabel: { fontSize: 14, fontWeight: '700', color: '#333' },
  capacityInput: { backgroundColor: '#FFF', width: '60%', height: 45, borderRadius: 10, paddingHorizontal: 15 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 20, paddingBottom: 30, backgroundColor: 'rgba(255,255,255,1)', paddingTop: 10 },
  continueBtn: { backgroundColor: '#7F36FF', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  continueText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  dropdownList: { backgroundColor: '#FFF', borderRadius: 15, padding: 10, marginBottom: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  dropdownItem: { paddingVertical: 12, paddingHorizontal: 15 },
  dropdownItemText: { fontSize: 16, color: '#333', fontWeight: '500' },
});
