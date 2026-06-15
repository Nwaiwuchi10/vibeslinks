import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Colors } from '@/constants/Colors';

interface OnboardingDotsProps {
  total: number;
  currentIndex: number;
}

export default function OnboardingDots({ total, currentIndex }: OnboardingDotsProps) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === currentIndex ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    borderRadius: 4,
    height: 8,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: '#D0D0E0',
  },
});
