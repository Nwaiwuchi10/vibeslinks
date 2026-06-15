import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function LeaveReviewScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Leave Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Event Card Thumbnail */}
        <View style={styles.eventCard}>
          <Image source={require('@/assets/images/davido.png')} style={styles.eventImage} />
          <View style={styles.eventInfo}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>COMEDY</Text>
            </View>
            <Text style={styles.eventTitle}>Paint With Mimi, &...</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.locationText}>Lekki Ikata, Lagos</Text>
            </View>
            <Text style={styles.priceText}>
              <Text style={styles.priceValue}>₦80,000</Text> /Person
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>How was your experience?</Text>
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingLabel}>Your overall rating</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons 
                  name={star <= rating ? "star" : "star-outline"} 
                  size={42} 
                  color={star <= rating ? "#FFD700" : "#EEE"} 
                  style={styles.starIcon}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.reviewInputSection}>
          <Text style={styles.reviewLabel}>Add details review</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter here"
              placeholderTextColor="#999"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addPhotoBtn}>
          <Ionicons name="camera-outline" size={24} color={Colors.primary} />
          <Text style={styles.addPhotoText}>add photo</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.sendButton} onPress={() => router.back()}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 100,
  },
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,
    flexDirection: 'row',
    gap: 15,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
  },
  eventImage: {
    width: 120,
    height: 120,
    borderRadius: 15,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#000',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  priceText: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  priceValue: {
    color: Colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  ratingLabel: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  starIcon: {
    marginHorizontal: 2,
  },
  reviewInputSection: {
    marginBottom: 20,
  },
  reviewLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    height: 150,
    padding: 15,
    borderWidth: 1,
    borderColor: '#F0F0F5',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#1A1A1A',
  },
  addPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  addPhotoText: {
    fontSize: 14,
    color: '#999',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  sendButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
