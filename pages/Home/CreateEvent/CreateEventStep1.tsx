import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CreateEventStep1 = ({ onBack, onContinue }: { onBack: () => void, onContinue: (type: 'physical' | 'livestream') => void }) => {
  const [selectedType, setSelectedType] = useState<'physical' | 'livestream'>('physical');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onBack}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.illustrationContainer}>
           <Image 
             source={{ uri: 'https://img.freepik.com/free-vector/date-picker-concept-illustration_114360-1910.jpg' }} 
             style={styles.illustration}
             resizeMode="contain"
           />
        </View>

        <Text style={styles.title}>Create Your Event</Text>
        <Text style={styles.subtitle}>Host concerts, parties, livestreams, festivals, and exclusive experiences.</Text>

        <View style={styles.optionsRow}>
          <TouchableOpacity 
            style={[styles.optionCard, selectedType === 'physical' && styles.optionCardActive]}
            onPress={() => setSelectedType('physical')}
          >
            <View style={[styles.iconContainer, selectedType === 'physical' && styles.iconContainerActive]}>
              <MaterialCommunityIcons name="ticket-confirmation-outline" size={32} color={selectedType === 'physical' ? "#8E2DE2" : "#999"} />
            </View>
            <Text style={styles.optionTitle}>Physical Event</Text>
            <Text style={styles.optionDesc}>Host fans in person at a venue</Text>
            <View style={styles.radioOutter}>
              {selectedType === 'physical' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.optionCard, selectedType === 'livestream' && styles.optionCardActive]}
            onPress={() => setSelectedType('livestream')}
          >
            <View style={[styles.iconContainer, selectedType === 'livestream' && styles.iconContainerActive]}>
              <MaterialCommunityIcons name="television-play" size={32} color={selectedType === 'livestream' ? "#8E2DE2" : "#999"} />
            </View>
            <Text style={styles.optionTitle}>Livestream Event</Text>
            <Text style={styles.optionDesc}>Host fans online in real time.</Text>
            <View style={styles.radioOutter}>
              {selectedType === 'livestream' && <View style={styles.radioInner} />}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.continueBtn} onPress={() => onContinue(selectedType)}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventStep1;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { paddingHorizontal: 20, paddingTop: 10, alignItems: 'flex-end' },
  closeBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, paddingHorizontal: 25, alignItems: 'center' },
  illustrationContainer: { width: '100%', height: 220, marginBottom: 40, marginTop: 20 },
  illustration: { width: '100%', height: '100%' },
  title: { fontSize: 24, fontWeight: '800', color: '#333', marginBottom: 12 },
  subtitle: { fontSize: 13, color: '#999', textAlign: 'center', lineHeight: 20, marginBottom: 40, paddingHorizontal: 20 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  optionCard: { width: (width - 70) / 2, padding: 15, borderRadius: 20, borderWidth: 1, borderColor: '#EEE', backgroundColor: '#FFF' },
  optionCardActive: { borderColor: '#8E2DE2', backgroundColor: '#FBF8FF' },
  iconContainer: { width: 50, height: 50, borderRadius: 12, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  iconContainerActive: { backgroundColor: '#F3E8FF' },
  optionTitle: { fontSize: 14, fontWeight: '800', color: '#1E1E1E', marginBottom: 8 },
  optionDesc: { fontSize: 11, color: '#666', lineHeight: 16, marginBottom: 15 },
  radioOutter: { position: 'absolute', top: 15, right: 15, width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#8E2DE2' },
  footer: { paddingHorizontal: 25, paddingBottom: 30 },
  continueBtn: { backgroundColor: '#7F36FF', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  continueText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
