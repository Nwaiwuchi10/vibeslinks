import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
  Image,
  Modal,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const MOCK_ARTISTS = [
  { id: '1', name: 'Sophia Carter', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Malik Johnson', avatar: 'https://i.pravatar.cc/150?img=11' },
  { id: '3', name: 'Elena Rossi', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: '4', name: 'Hiroshi Tanaka', avatar: 'https://i.pravatar.cc/150?img=8' },
  { id: '5', name: 'Amina Yusuf', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: '6', name: 'Diego Morales', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: '7', name: 'Priya Sharma', avatar: 'https://i.pravatar.cc/150?img=20' },
];

export default function FollowArtistsScreen() {
  const [selected, setSelected] = useState<string[]>(['2', '6', '7']);
  const [showModal, setShowModal] = useState(false);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((item) => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const handleFollow = () => {
    setShowModal(true);
  };

  const handleDone = () => {
    setShowModal(false);
    router.push('/(onboarding)/account-confirmed' as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressText}>3/3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Follow Artists</Text>
        <Text style={styles.subtitle}>Follow creators you love or people you may know.</Text>

        <View style={styles.listContainer}>
          {MOCK_ARTISTS.map((artist) => {
            const isSelected = selected.includes(artist.id);
            return (
              <TouchableOpacity
                key={artist.id}
                style={styles.artistRow}
                activeOpacity={0.7}
                onPress={() => toggleSelect(artist.id)}
              >
                <Image source={{ uri: artist.avatar }} style={styles.avatar} />
                <Text style={[styles.artistName, isSelected && styles.artistNameSelected]}>
                  {artist.name}
                </Text>
                
                <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
                  {isSelected && <Ionicons name="checkmark" size={12} color="#FFF" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.followButton}
          activeOpacity={0.88}
          onPress={handleFollow}
        >
          <Text style={styles.followButtonText}>Follow</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={() => router.push('/(onboarding)/account-confirmed' as any)}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <MaterialIcons name="verified" size={60} color={Colors.primary} style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Follow Successful</Text>
            <Text style={styles.modalSubtitle}>Update will appear in your feed.</Text>
            
            <TouchableOpacity style={styles.doneButton} onPress={handleDone} activeOpacity={0.88}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
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
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    width: 140,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#8A8A8A',
    marginBottom: 30,
    textAlign: 'center',
  },
  listContainer: {
    flex: 1,
  },
  artistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: '#EFEFEF',
  },
  artistName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#8A8A8A',
  },
  artistNameSelected: {
    color: '#1A1A2E',
    fontWeight: '700',
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkCircleSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
  },
  followButton: {
    flex: 1,
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
  followButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  skipButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(250, 250, 250, 0.85)',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    marginBottom: 40,
  },
  modalIcon: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A2E',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 15,
    color: '#8A8A8A',
    marginBottom: 30,
  },
  doneButton: {
    width: '100%',
    backgroundColor: '#222222',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
