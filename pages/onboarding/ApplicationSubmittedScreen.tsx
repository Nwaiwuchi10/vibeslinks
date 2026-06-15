import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function ApplicationSubmittedScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <MaterialIcons name="verified" size={80} color={Colors.primary} style={styles.icon} />
        
        <Text style={styles.title}>Application Submitted</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.homeButton}
          activeOpacity={0.88}
          onPress={() => router.replace('/(tabs)' as any)}
        >
          <Text style={styles.homeButtonText}>Go to Home</Text>
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80, // Offset for visual vertical centering
  },
  icon: {
    marginBottom: 20,
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
  homeButton: {
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
  homeButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
