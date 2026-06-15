import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import VibezLinkLogo from '@/components/onboarding/VibezLinkLogo';

interface AuthHeaderProps {
  type: 'logo' | 'avatar';
}

export default function AuthHeader({ type }: AuthHeaderProps) {
  return (
    <View style={styles.container}>
      {type === 'logo' ? (
        <VibezLinkLogo size={90} showCircle circleColor="#FFFFFF" />
      ) : (
        <View style={styles.avatarCircle}>
          <Ionicons name="person" size={40} color={Colors.primary} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
});
