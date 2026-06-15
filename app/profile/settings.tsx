import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function SettingsScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const toggleVisibility = (key: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.form}>
          {/* Change Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Change Password</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                secureTextEntry={!showPassword.current}
                placeholder="****************"
                placeholderTextColor="#BBB"
              />
              <TouchableOpacity onPress={() => toggleVisibility('current')}>
                <Ionicons 
                  name={showPassword.current ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.forgetContainer}>
              <Text style={styles.forgetText}>Forget password?</Text>
            </TouchableOpacity>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                secureTextEntry={!showPassword.new}
                placeholder="****************"
                placeholderTextColor="#BBB"
              />
              <TouchableOpacity onPress={() => toggleVisibility('new')}>
                <Ionicons 
                  name={showPassword.new ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Confirm Password</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                secureTextEntry={!showPassword.confirm}
                placeholder="****************"
                placeholderTextColor="#BBB"
              />
              <TouchableOpacity onPress={() => toggleVisibility('confirm')}>
                <Ionicons 
                  name={showPassword.confirm ? 'eye-outline' : 'eye-off-outline'} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.confirmButton} onPress={() => router.back()}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  form: {
    gap: 30,
  },
  inputGroup: {
    gap: 12,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    height: 60,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  forgetContainer: {
    alignSelf: 'flex-end',
  },
  forgetText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  confirmButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
