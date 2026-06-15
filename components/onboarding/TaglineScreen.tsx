import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '@/constants/Colors';

const { width, height } = Dimensions.get('window');

interface TaglineScreenProps {
  onFinish: () => void;
}

export default function TaglineScreen({ onFinish }: TaglineScreenProps) {
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;
  const subFade = useRef(new Animated.Value(0)).current;
  const subY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    // Title slides up + fades in
    Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(titleY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Subtitle follows
      Animated.parallel([
        Animated.timing(subFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(subY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Auto-advance after 2.4 s
    const timer = setTimeout(() => {
      Animated.timing(titleFade, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <View style={styles.textBlock}>
        <Animated.Text
          style={[
            styles.title,
            { opacity: titleFade, transform: [{ translateY: titleY }] },
          ]}
        >
          Moments We Live For
        </Animated.Text>
        <Animated.Text
          style={[
            styles.subtitle,
            { opacity: subFade, transform: [{ translateY: subY }] },
          ]}
        >
          Discover events, connect with people,{'\n'}experience nightlife.
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width,
    height,
    backgroundColor: Colors.splashBg,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 36,
  },
  textBlock: {
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontSize: Platform.select({ ios: 26, android: 24 }),
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 14,
  },
  subtitle: {
    color: Colors.textLight,
    fontSize: Platform.select({ ios: 16, android: 15 }),
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 24,
    letterSpacing: 0.2,
  },
});
