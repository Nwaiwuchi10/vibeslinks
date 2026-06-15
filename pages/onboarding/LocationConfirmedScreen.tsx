import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function LocationConfirmedScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressText}>2/3</Text>
        </View>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.iconCircleOuter}>
          <View style={styles.iconCircleInner}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </View>
        </View>

        <Text style={styles.title}>Location Confirmed</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.88}
          onPress={() => router.push('/(onboarding)/follow-artists' as any)}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
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
    width: '66%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80, // Offset to push content up slightly
  },
  iconCircleOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircleInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A2E',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#FAFAFA',
  },
  nextButton: {
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
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
