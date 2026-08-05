import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Image } from 'expo-image';
import { resolveImageUrl } from '@/services/apiClient';

interface UserAvatarProps {
  avatarUrl?: string | null;
  name?: string | null;
  size?: number;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  textStyle?: StyleProp<TextStyle>;
  backgroundColor?: string;
  textColor?: string;
}

export function getInitials(name?: string | null): string {
  if (!name || typeof name !== 'string' || !name.trim()) return 'VL';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'VL';
  return parts.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'VL';
}

export default function UserAvatar({
  avatarUrl,
  name,
  size = 40,
  style,
  imageStyle,
  textStyle,
  backgroundColor = '#8E2DE2',
  textColor = '#FFFFFF',
}: UserAvatarProps) {
  const resolved = resolveImageUrl(avatarUrl);
  const initials = getInitials(name);

  if (resolved) {
    return (
      <Image
        source={{ uri: resolved }}
        style={[
          { width: size, height: size, borderRadius: size / 2 },
          imageStyle,
        ]}
        contentFit="cover"
      />
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor,
          justifyContent: 'center',
          alignItems: 'center',
        },
        style,
      ]}
    >
      <Text style={[{ color: textColor, fontWeight: '700', fontSize: Math.max(10, size * 0.38) }, textStyle]}>
        {initials}
      </Text>
    </View>
  );
}
