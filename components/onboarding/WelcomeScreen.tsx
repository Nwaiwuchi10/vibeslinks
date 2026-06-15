import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import VibezLinkLogo from './VibezLinkLogo';

const { width, height } = Dimensions.get('window');

// Avatar images data
const AVATARS = [
  { id: 'a1', image: require('@/assets/images/onboarding/avatar1.png'), angle: 190, radius: 0.42 },
  { id: 'a2', image: require('@/assets/images/onboarding/avatar2.png'), angle: 350, radius: 0.4 },
  { id: 'a3', image: require('@/assets/images/onboarding/avatar3.png'), angle: 250, radius: 0.38 },
];

// Floating icon badges
const BADGES = [
  { id: 'b1', icon: '♥', bg: Colors.primary, angle: 180, radius: 0.36 },
  { id: 'b2', icon: '♪', bg: Colors.primary, angle: 30, radius: 0.35 },
  { id: 'b3', icon: '⬛', bg: '#222', angle: 155, radius: 0.28 },
];

function polarToXY(cx: number, cy: number, angle: number, r: number) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

export default function WelcomeScreen({ onGetStarted, onSignIn }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 550,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Hub area dimensions
  const hubSize = width * 0.74;
  const cx = hubSize / 2;
  const cy = hubSize / 2;

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* ── Hub Illustration ── */}
      <Animated.View
        style={[
          styles.hubWrapper,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.hubCircle, { width: hubSize, height: hubSize, borderRadius: hubSize / 2 }]}>
          {/* Center logo */}
          <View style={styles.hubCenter}>
            <VibezLinkLogo size={68} showCircle circleColor="#FFFFFF" />
          </View>

          {/* Floating avatars */}
          {AVATARS.map((av) => {
            const pos = polarToXY(cx, cy, av.angle, hubSize * av.radius);
            return (
              <Image
                key={av.id}
                source={av.image}
                style={[
                  styles.avatarBubble,
                  {
                    left: pos.x - 22,
                    top: pos.y - 22,
                  },
                ]}
              />
            );
          })}

          {/* Icon badges */}
          {BADGES.map((bd) => {
            const pos = polarToXY(cx, cy, bd.angle, hubSize * bd.radius);
            return (
              <View
                key={bd.id}
                style={[
                  styles.badge,
                  {
                    backgroundColor: bd.bg,
                    left: pos.x - 18,
                    top: pos.y - 18,
                  },
                ]}
              >
                <Text style={styles.badgeIcon}>{bd.icon}</Text>
              </View>
            );
          })}
        </View>
      </Animated.View>

      {/* ── Text + CTAs ── */}
      <Animated.View
        style={[
          styles.bottomSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            paddingBottom: insets.bottom + 24,
          },
        ]}
      >
        <Text style={styles.title}>
          Discover The{' '}
          <Text style={styles.titleAccent}>Best{'\n'}Events</Text>
          {'  '}Around You
        </Text>

        <Text style={styles.subtitle}>
          Concerts, festivals, nightlife, creators, and{'\n'}unforgettable experiences.
        </Text>

        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onGetStarted}
          activeOpacity={0.88}
        >
          <Text style={styles.ctaText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.signInRow}>
          <Text style={styles.signInGray}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignIn} activeOpacity={0.7}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.slideBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hubWrapper: {
    marginTop: 16,
    marginBottom: 0,
  },
  hubCircle: {
    backgroundColor: '#EAEAF0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubCenter: {
    position: 'absolute',
    zIndex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBubble: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  badge: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  badgeIcon: {
    color: '#FFF',
    fontSize: 15,
  },
  bottomSection: {
    width: '100%',
    paddingHorizontal: 28,
    alignItems: 'center',
    marginTop: 8,
  },
  title: {
    fontSize: Platform.select({ ios: 28, android: 26 }),
    fontWeight: '800',
    color: Colors.textDark,
    textAlign: 'center',
    lineHeight: Platform.select({ ios: 38, android: 36 }),
    marginBottom: 12,
  },
  titleAccent: {
    color: Colors.primary,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: Platform.select({ ios: 15, android: 14 }),
    color: Colors.textGray,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
  },
  ctaButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: Platform.select({ ios: 17, android: 15 }),
    alignItems: 'center',
    marginBottom: 18,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  ctaText: {
    color: Colors.white,
    fontSize: Platform.select({ ios: 17, android: 16 }),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  signInRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signInGray: {
    color: Colors.textDark,
    fontSize: Platform.select({ ios: 14, android: 13 }),
    fontWeight: '500',
  },
  signInLink: {
    color: Colors.primary,
    fontSize: Platform.select({ ios: 14, android: 13 }),
    fontWeight: '700',
  },
});
