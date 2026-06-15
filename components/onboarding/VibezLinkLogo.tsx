import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface LogoProps {
  size?: number;
  showCircle?: boolean;
  circleColor?: string;
}

export default function VibezLinkLogo({
  size = 72,
  showCircle = true,
  circleColor = '#FFFFFF',
}: LogoProps) {
  const iconW = size * 0.7; // Make the image slightly smaller than the circle
  const iconH = size * 0.7;

  return (
    <View
      style={[
        styles.circle,
        showCircle && {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: circleColor,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 6,
        },
      ]}
    >
      <Image
        source={require('@/assets/images/onboarding/logo.png')}
        style={{ width: iconW, height: iconH }}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
