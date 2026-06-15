import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/Input';
import AuthHeader from '../components/AuthHeader';

export default function ResetPasswordScreen() {
  const [step, setStep] = useState<'forgot' | 'reset'>('forgot');
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  
  // form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendCode = () => {
    // Transition to the reset step to enter OTP and new password
    setStep('reset');
  };

  const renderForgot = () => (
    <View style={styles.contentContainer}>
      <AuthHeader type="avatar" />
      
      <Text style={styles.title}>Forgot password</Text>
      <View style={{ height: 16 }} />

      <View style={styles.formContainer}>
        
        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>
            {authMode === 'email' ? 'Enter email address' : 'Enter phone number'}
          </Text>
          <TouchableOpacity onPress={() => setAuthMode(authMode === 'email' ? 'phone' : 'email')}>
            <Text style={styles.toggleLink}>
              Reset with {authMode === 'email' ? 'phone number' : 'email'}
            </Text>
          </TouchableOpacity>
        </View>

        {authMode === 'email' ? (
          <Input 
            placeholder="Email address" 
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address" 
          />
        ) : (
          <View style={styles.phoneInputRow}>
            <View style={styles.countryPicker}>
              <Text style={styles.countryCode}>NGN +234</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </View>
            <View style={{ flex: 1 }}>
              <Input 
                placeholder="Phone Number" 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
              />
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.actionButton} onPress={handleSendCode} activeOpacity={0.88}>
          <Text style={styles.actionButtonText}>Send Code</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderReset = () => (
    <View style={styles.contentContainer}>
      <AuthHeader type="avatar" />
      
      <Text style={styles.title}>Reset password</Text>
      <View style={{ height: 16 }} />

      <View style={styles.formContainer}>
        <Input 
          placeholder="Enter 6 digit code" 
          value={code} 
          onChangeText={setCode} 
          keyboardType="number-pad"
          rightElement={
            <TouchableOpacity onPress={() => {}}>
              <Text style={styles.sendCodeText}>Resend</Text>
            </TouchableOpacity>
          }
        />

        <Input 
          placeholder="New Password" 
          value={password} 
          onChangeText={setPassword} 
          isPassword 
        />
        
        <Input 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
          isPassword 
        />

        <TouchableOpacity style={styles.actionButton} onPress={() => router.replace('/(auth)/login' as any)} activeOpacity={0.88}>
          <Text style={styles.actionButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.skipContainer}>
            <TouchableOpacity onPress={() => router.replace('/')}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          </View>

          {step === 'forgot' ? renderForgot() : renderReset()}
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  skipContainer: {
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
  },
  skipText: {
    color: '#E0E0E0', 
    fontSize: 16,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '500',
  },
  footerLink: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '700',
  },
  formContainer: {
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  toggleLink: {
    fontSize: 13,
    color: Colors.primary,
  },
  sendCodeText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
    paddingRight: 8,
  },
  actionButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  countryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 12,
    height: 56,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  countryCode: {
    fontSize: 14,
    color: '#6B6B80',
    marginRight: 4,
  },
});
