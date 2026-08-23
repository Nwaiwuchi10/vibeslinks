import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Text,
} from 'react-native';

const { height, width } = Dimensions.get('window');

const HEART_ICONS = ['❤️', '💖', '🔥', '😍', '✨', '💜', '🌟', '🎉'];
const HEART_COLORS = ['#FF2E93', '#FF4343', '#FFD700', '#7C3AED', '#00F2FE', '#FF6B6B', '#A855F7'];

export type FloatingHeartRef = {
  addHeart: (fromX?: number, fromY?: number) => void;
  addBurst: (count?: number) => void;
};

interface HeartItem {
  id: string;
  icon: string;
  color: string;
  startX: number;
  startY: number;
  size: number;
  animY: Animated.Value;
  animX: Animated.Value;
  animScale: Animated.Value;
  animOpacity: Animated.Value;
}

export const FloatingHeartsOverlay = forwardRef<FloatingHeartRef, { disabled?: boolean }>(
  ({ disabled = false }, ref) => {
    const [hearts, setHearts] = useState<HeartItem[]>([]);
    const countRef = useRef(0);

    const spawnHeart = (customX?: number, customY?: number) => {
      if (disabled) return;

      countRef.current += 1;
      const id = `${Date.now()}_${countRef.current}`;
      const icon = HEART_ICONS[Math.floor(Math.random() * HEART_ICONS.length)];
      const color = HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)];
      const size = Math.floor(Math.random() * 16) + 24; // 24 to 40 px

      const startX = customX !== undefined ? customX : width - 60 + (Math.random() * 40 - 20);
      const startY = customY !== undefined ? customY : height - 160;

      const animY = new Animated.Value(0);
      const animX = new Animated.Value(0);
      const animScale = new Animated.Value(0);
      const animOpacity = new Animated.Value(1);

      const newHeart: HeartItem = {
        id,
        icon,
        color,
        startX,
        startY,
        size,
        animY,
        animX,
        animScale,
        animOpacity,
      };

      setHearts((prev) => [...prev.slice(-25), newHeart]);

      const swayDirection = Math.random() > 0.5 ? 1 : -1;
      const swayDistance = Math.random() * 40 + 20;

      Animated.parallel([
        // Rise up
        Animated.timing(animY, {
          toValue: -320 - Math.random() * 100,
          duration: 2200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        // Sway sideways
        Animated.sequence([
          Animated.timing(animX, {
            toValue: swayDirection * swayDistance,
            duration: 1100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(animX, {
            toValue: -swayDirection * (swayDistance * 0.7),
            duration: 1100,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // Scale in & pop
        Animated.sequence([
          Animated.spring(animScale, {
            toValue: 1.3,
            friction: 4,
            useNativeDriver: true,
          }),
          Animated.timing(animScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        // Fade out near end
        Animated.sequence([
          Animated.delay(1400),
          Animated.timing(animOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      });
    };

    useImperativeHandle(ref, () => ({
      addHeart: (fromX, fromY) => spawnHeart(fromX, fromY),
      addBurst: (count = 5) => {
        for (let i = 0; i < count; i++) {
          setTimeout(() => {
            spawnHeart();
          }, i * 100);
        }
      },
    }));

    return (
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        {hearts.map((h) => (
          <Animated.View
            key={h.id}
            style={[
              styles.heartContainer,
              {
                left: h.startX,
                top: h.startY,
                transform: [
                  { translateY: h.animY },
                  { translateX: h.animX },
                  { scale: h.animScale },
                ],
                opacity: h.animOpacity,
              },
            ]}
          >
            <Text style={{ fontSize: h.size }}>{h.icon}</Text>
          </Animated.View>
        ))}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  heartContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
});
