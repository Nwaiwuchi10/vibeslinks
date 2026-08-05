import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AuthHeader from '../components/AuthHeader';
import Input from '../components/Input';
import SocialButton from '../components/SocialButton';

import { useSocialAuth } from '@/hooks/useSocialAuth';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'social' | 'form'>('social');
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');

  // form states
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  // Real Google + Facebook OAuth hooks (login mode)
  const {
    promptGoogleSignIn,
    promptFacebookSignIn,
    loading: ssoLoading,
  } = useSocialAuth({ mode: 'login' });

  const handleLogin = async () => {
    try {
      setFormLoading(true);
      if (authMode === 'email') {
        if (!email || !password) {
          dispatch(showToast({ type: 'warning', message: 'Please fill in email and password.' }));
          return;
        }
        await authService.signIn(email, password);
      } else {
        if (!phone || !password) {
          dispatch(showToast({ type: 'warning', message: 'Please fill in phone and password.' }));
          return;
        }
        await authService.signInWithPhone(phone, '+234', password);
      }

      // Route to Home Tabs after successful login
      router.replace('/(tabs)');
    } catch (err) {
      // Errors are toasted by apiClient globally
    } finally {
      setFormLoading(false);
    }
  };

  const isLoading = ssoLoading || formLoading;

  const renderSocial = () => (
    <View style={styles.contentContainer}>
      <AuthHeader type="logo" />

      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>Welcome back, we have missed you</Text>

      <View style={styles.socialButtonsContainer}>
        <SocialButton
          iconType="person"
          title="Use phone or email"
          onPress={() => setStep('form')}
          disabled={isLoading}
        />
        <SocialButton
          iconType="google"
          title="Continue with Google"
          onPress={promptGoogleSignIn}
          disabled={isLoading}
        />
        <SocialButton
          iconType="facebook"
          title="Continue with Facebook"
          onPress={promptFacebookSignIn}
          disabled={isLoading}
        />
        <SocialButton
          iconType="apple"
          title="Continue with Apple"
          onPress={() =>
            dispatch(showToast({ type: 'info', message: 'Apple sign-in coming soon.' }))
          }
          disabled={isLoading}
        />
      </View>

      {isLoading && (
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={{ marginBottom: 12 }}
        />
      )}

      <TouchableOpacity
        style={[styles.loginButton, isLoading && styles.buttonDisabled]}
        activeOpacity={0.88}
        onPress={() => setStep('form')}
        disabled={isLoading}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForm = () => (
    <View style={styles.contentContainer}>
      <AuthHeader type="avatar" />

      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>Welcome back, we have missed you</Text>

      <View style={styles.formContainer}>

        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>{authMode === 'email' ? 'Email' : 'Phone'}</Text>
          <TouchableOpacity onPress={() => setAuthMode(authMode === 'email' ? 'phone' : 'email')}>
            <Text style={styles.toggleLink}>
              Log in with {authMode === 'email' ? 'phone' : 'email'}
            </Text>
          </TouchableOpacity>
        </View>

        {authMode === 'email' ? (
          <Input
            placeholder="Email Address"
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

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          isPassword
        />

        <TouchableOpacity
          style={styles.forgotPassword}
          onPress={() => router.push('/(auth)/reset-password')}
        >
          <Text style={styles.forgotPasswordText}>Forget password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, formLoading && styles.buttonDisabled]}
          activeOpacity={0.88}
          onPress={handleLogin}
          disabled={formLoading}
        >
          {formLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
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

          {step === 'social' ? renderSocial() : renderForm()}

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
  subtitle: {
    fontSize: 15,
    color: '#6B6B80',
    marginBottom: 32,
    textAlign: 'center',
  },
  socialButtonsContainer: {
    width: '100%',
    marginBottom: 20,
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
  loginButton: {
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
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
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
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
});
