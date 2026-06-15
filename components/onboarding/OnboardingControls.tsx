import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import OnboardingDots from './OnboardingDots';

interface OnboardingControlsProps {
  total: number;
  currentIndex: number;
  isLastSlide: boolean;
  onSkip: () => void;
  onPrev: () => void;
  onNext: () => void;
  onGetStarted: () => void;
}

export default function OnboardingControls({
  total,
  currentIndex,
  isLastSlide,
  onSkip,
  onPrev,
  onNext,
  onGetStarted,
}: OnboardingControlsProps) {
  const insets = useSafeAreaInsets();

  return (
    <>
      {/* Skip — top right, hidden on last slide */}
      {!isLastSlide && (
        <View style={[styles.skipWrapper, { top: insets.top + 16 }]}>
          <TouchableOpacity
            onPress={onSkip}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Last slide: full-width CTA */}
      {isLastSlide ? (
        <View style={[styles.lastSlideControls, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.getStartedBtn}
            onPress={onGetStarted}
            activeOpacity={0.88}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* Normal slide: prev ← · dots · → next */
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity
            style={styles.circleBtn}
            onPress={onPrev}
            activeOpacity={0.8}
          >
            <Text style={styles.arrowText}>←</Text>
          </TouchableOpacity>

          <OnboardingDots total={total} currentIndex={currentIndex} />

          <TouchableOpacity
            style={[styles.circleBtn, styles.circleBtnPrimary]}
            onPress={onNext}
            activeOpacity={0.8}
          >
            <Text style={[styles.arrowText, { color: Colors.white }]}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  skipWrapper: {
    position: 'absolute',
    right: 24,
    zIndex: 20,
  },
  skipText: {
    color: Colors.primary,
    fontSize: Platform.select({ ios: 16, android: 15 }),
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  circleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F7',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  circleBtnPrimary: {
    backgroundColor: Colors.primary,
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  arrowText: {
    fontSize: 20,
    color: Colors.textDark,
    fontWeight: '700',
    lineHeight: 24,
  },
  lastSlideControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 28,
    paddingTop: 12,
  },
  getStartedBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: Platform.select({ ios: 17, android: 15 }),
    alignItems: 'center',
    elevation: 6,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  getStartedText: {
    color: Colors.white,
    fontSize: Platform.select({ ios: 17, android: 16 }),
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
