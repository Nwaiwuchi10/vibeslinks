import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function CardSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color={Colors.primary} />
        </View>
        
        <Text style={styles.title}>Debit Card Added</Text>
        <Text style={styles.subtitle}>You have successful add card to the wallet</Text>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.replace('/profile/payment')}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 30,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
