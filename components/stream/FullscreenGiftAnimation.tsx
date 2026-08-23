import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Easing,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export interface GiftEventPayload {
  id: string;
  senderName: string;
  senderAvatar?: string;
  giftName: string;
  giftIcon: string;
  coinAmount: number;
  count: number;
  animationType: string;
}

export type FullscreenGiftRef = {
  triggerGift: (event: GiftEventPayload) => void;
};

export const FullscreenGiftAnimation = forwardRef<FullscreenGiftRef, {}>((_, ref) => {
  const [currentGift, setCurrentGift] = useState<GiftEventPayload | null>(null);

  // Animations
  const bannerSlideX = useRef(new Animated.Value(-width)).current;
  const iconScale = useRef(new Animated.Value(0)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const flashOpacity = useRef(new Animated.Value(0)).current;

  const trigger = (event: GiftEventPayload) => {
    setCurrentGift(event);

    bannerSlideX.setValue(-width);
    iconScale.setValue(0);
    iconRotate.setValue(0);
    flashOpacity.setValue(0);

    const isEpic = event.coinAmount >= 99;

    Animated.parallel([
      // Banner slide in
      Animated.sequence([
        Animated.spring(bannerSlideX, {
          toValue: 16,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.delay(2200),
        Animated.timing(bannerSlideX, {
          toValue: -width,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),

      // Flash effect if epic
      ...(isEpic
        ? [
            Animated.sequence([
              Animated.timing(flashOpacity, {
                toValue: 0.6,
                duration: 200,
                useNativeDriver: true,
              }),
              Animated.timing(flashOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
              }),
            ]),
          ]
        : []),

      // Center Big Gift FX
      Animated.sequence([
        Animated.spring(iconScale, {
          toValue: isEpic ? 1.6 : 1.1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 1600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      setCurrentGift(null);
    });
  };

  useImperativeHandle(ref, () => ({
    triggerGift: (event) => trigger(event),
  }));

  if (!currentGift) return null;

  const spin = iconRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '15deg', '-15deg'],
  });

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Background Flash Glow */}
      <Animated.View
        style={[
          styles.flashOverlay,
          {
            opacity: flashOpacity,
          },
        ]}
      />

      {/* Top Banner Notification (TikTok style banner) */}
      <Animated.View
        style={[
          styles.bannerContainer,
          {
            transform: [{ translateX: bannerSlideX }],
          },
        ]}
      >
        <Image
          source={{
            uri:
              currentGift.senderAvatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          }}
          style={styles.bannerAvatar}
        />
        <View style={styles.bannerTextCol}>
          <Text style={styles.bannerSender} numberOfLines={1}>
            {currentGift.senderName}
          </Text>
          <Text style={styles.bannerGiftText}>
            sent {currentGift.giftName} {currentGift.count > 1 ? `x${currentGift.count}` : ''}
          </Text>
        </View>
        <Text style={styles.bannerGiftIcon}>{currentGift.giftIcon}</Text>
      </Animated.View>

      {/* Center 3D/Zoom Gift FX */}
      <View style={styles.centerFxContainer}>
        <Animated.View
          style={[
            styles.centerIconBox,
            {
              transform: [{ scale: iconScale }, { rotate: spin }],
            },
          ]}
        >
          <Text style={styles.centerGiftEmoji}>{currentGift.giftIcon}</Text>
          <Text style={styles.centerComboLabel}>
            {currentGift.giftName} {currentGift.count > 1 ? `x${currentGift.count}` : ''}
          </Text>
        </Animated.View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  flashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF2E93',
  },
  bannerContainer: {
    position: 'absolute',
    top: 90,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(24, 26, 32, 0.92)',
    borderWidth: 1.5,
    borderColor: '#FFD700',
    borderRadius: 28,
    paddingLeft: 4,
    paddingRight: 16,
    paddingVertical: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    zIndex: 9999,
    maxWidth: width * 0.85,
  },
  bannerAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFD700',
  },
  bannerTextCol: {
    marginLeft: 10,
    marginRight: 8,
  },
  bannerSender: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 13,
  },
  bannerGiftText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  bannerGiftIcon: {
    fontSize: 26,
  },
  centerFxContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  centerGiftEmoji: {
    fontSize: 90,
  },
  centerComboLabel: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
});
