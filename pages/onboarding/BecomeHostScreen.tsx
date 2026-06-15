import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function BecomeHostScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Placeholder for the illustration */}
        <View style={styles.illustrationContainer}>
          <MaterialCommunityIcons name="calendar-edit" size={140} color={Colors.primary} style={{ opacity: 0.8 }} />
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotInactive]} />
        </View>

        <Text style={styles.title}>
          Become a <Text style={styles.titleHighlight}>Host</Text>
        </Text>

        {/* Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Why?</Text>
          <Text style={styles.cardText}>
            Create and manage unlimited events, reach thousands of people, track your event performance with easy analytics, scan tickets and manage check-ins smoothly, while growing your brand and community all in one place.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.homeButton} 
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Text style={styles.homeButtonText}>Go to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          activeOpacity={0.88}
          onPress={() => router.push('/(onboarding)/host-application' as any)}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: 10,
    alignItems: 'center',
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  illustrationContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginBottom: 20,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
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
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 24,
    textAlign: 'center',
  },
  titleHighlight: {
    color: Colors.primary,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
    marginBottom: 20,
  },
  cardHeading: {
    fontSize: 18,
    fontWeight: '700',
    fontStyle: 'italic',
    color: Colors.primary,
    marginBottom: 12,
  },
  cardText: {
    fontSize: 14,
    color: '#6B6B80',
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
  },
  homeButton: {
    flex: 1,
    paddingVertical: 18,
    alignItems: 'center',
  },
  homeButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 1.5,
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginLeft: 10,
  },
  continueButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
