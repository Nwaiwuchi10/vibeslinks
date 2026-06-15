import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  isPassword?: boolean;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'number-pad';
  rightElement?: React.ReactNode;
}

export default function Input({
  value,
  onChangeText,
  placeholder,
  isPassword,
  keyboardType = 'default',
  rightElement,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#A0A0A0"
        secureTextEntry={isPassword && !showPassword}
        keyboardType={keyboardType}
      />
      {isPassword ? (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.rightIcon}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#888" />
        </TouchableOpacity>
      ) : rightElement ? (
        <View style={styles.rightIcon}>
          {rightElement}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#333',
  },
  rightIcon: {
    paddingLeft: 10,
  },
});
