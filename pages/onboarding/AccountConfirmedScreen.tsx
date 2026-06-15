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
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function AccountConfirmedScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.contentContainer}>
        <View style={styles.iconCircleOuter}>
          <View style={styles.iconCircleInner}>
            <MaterialCommunityIcons name="account-check" size={40} color={Colors.primary} style={{ marginTop: 4 }} />
          </View>
        </View>

        <Text style={styles.title}>Account Confirm</Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          activeOpacity={0.88}
          onPress={() => {
            router.push('/(onboarding)/become-host' as any);
          }}
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
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80, // Offset
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
