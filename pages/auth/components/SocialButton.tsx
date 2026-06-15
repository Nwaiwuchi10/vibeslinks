import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface SocialButtonProps {
  iconType: 'person' | 'google' | 'facebook' | 'apple';
  title: string;
  onPress: () => void;
}

export default function SocialButton({ iconType, title, onPress }: SocialButtonProps) {
  const renderIcon = () => {
    switch (iconType) {
      case 'person':
        return <Ionicons name="person" size={20} color="#000" />;
      case 'google':
        // A simple multicolor approximation or just an image if available. For now we use the icon
        // Usually people use an image for Google to get the exact G colors. Let's use an image if we want exact, but Ionicons provides a logo.
        return <Ionicons name="logo-google" size={20} color="#DB4437" />;
      case 'facebook':
        return <Ionicons name="logo-facebook" size={20} color="#1877F2" />;
      case 'apple':
        return <Ionicons name="logo-apple" size={20} color="#000" />;
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 24,
    alignItems: 'center',
    marginRight: 20,
  },
  text: {
    fontSize: 16,
    color: '#333333',
    fontWeight: '500',
  },
});
