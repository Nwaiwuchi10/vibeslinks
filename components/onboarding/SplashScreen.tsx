import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import VibezLinkLogo from './VibezLinkLogo';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const textFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Logo pops in
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 55,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 2. Brand name fades in below logo
      Animated.timing(textFade, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    });

    // 3. Auto-advance after 2.8 s
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 420,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <VibezLinkLogo size={96} showCircle circleColor="#FFFFFF" />
      </Animated.View>

      <Animated.Text style={[styles.brandName, { opacity: textFade }]}>
        VIBEZLINK
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.splashBg,
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    marginTop: 20,
    color: Colors.white,
    fontSize: Platform.select({ ios: 20, android: 19 }),
    fontWeight: '700',
    letterSpacing: 4,
  },
});
