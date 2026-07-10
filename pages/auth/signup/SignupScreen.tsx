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
import SocialButton from '../components/SocialButton';
import Input from '../components/Input';
import AuthHeader from '../components/AuthHeader';

import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

export default function SignupScreen() {
  const dispatch = useAppDispatch();
  const [step, setStep] = useState<'social' | 'form'>('social');
  const [authMode, setAuthMode] = useState<'email' | 'phone'>('email');
  
  const [agreed, setAgreed] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  
  // form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');

  const handleSendCode = async () => {
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      if (!firstName || !lastName || !username || !password) {
        dispatch(showToast({ type: 'warning', message: 'Please fill in all profile details and password.' }));
        return;
      }

      if (authMode === 'email') {
        if (!email) {
          dispatch(showToast({ type: 'warning', message: 'Please enter your email.' }));
          return;
        }
        await userService.register({
          method: 'email',
          fullName,
          username,
          email,
          password,
          acceptedTerms: agreed,
        });
      } else {
        if (!phone) {
          dispatch(showToast({ type: 'warning', message: 'Please enter your phone number.' }));
          return;
        }
        await userService.register({
          method: 'phone',
          fullName,
          username,
          phoneNumber: phone,
          password,
          acceptedTerms: agreed,
        });
      }
    } catch (err) {
      // Errors handled globally by apiClient
    }
  };

  const handleVerify = async () => {
    try {
      if (password !== confirmPassword) {
        dispatch(showToast({ type: 'warning', message: 'Passwords do not match.' }));
        return;
      }
      if (!code) {
        dispatch(showToast({ type: 'warning', message: 'Please enter the 6-digit verification code.' }));
        return;
      }

      if (authMode === 'email') {
        await userService.verifyRegistration({
          method: 'email',
          email,
          code,
        });
      } else {
        await userService.verifyRegistration({
          method: 'phone',
          phoneNumber: phone,
          code,
        });
      }

      // Check if newsletter registration should be sent
      if (newsletter) {
        try {
          await userService.updateSettings({
            notifications: { email: true, push: true },
            receivesNewsletter: true,
          });
        } catch (settingsError) {
          console.warn('[SignupScreen] Newsletter subscription failed, continuing navigation:', settingsError);
        }
      }

      // Route to login screen
      router.replace('/(auth)/login' as any);
    } catch (err) {
      // Errors handled globally by apiClient
    }
  };


  const handleSocialRegister = async (provider: 'google' | 'facebook' | 'apple') => {
    try {
      if (!agreed) {
        dispatch(showToast({ type: 'warning', message: 'You must agree to the Terms and Privacy Policy.' }));
        return;
      }
      dispatch(showToast({ type: 'info', message: `Registering with ${provider}...` }));
      await userService.register({
        method: provider,
        fullName: 'Vibez User',
        username: `user_${provider}_${Math.floor(Math.random() * 1000)}`,
        email: `user.${provider}@example.com`,
        acceptedTerms: agreed,
        providerUserId: `mock-${provider}-id`,
      });
      router.replace('/(onboarding)/interests' as any);
    } catch (err) {
      // Errors toasted by apiClient
    }
  };


  const renderSocial = () => (
    <View style={styles.contentContainer}>
      <AuthHeader type="logo" />
      
      <Text style={styles.title}>Welcome To Vibezlink</Text>
      <Text style={styles.subtitle}>Join the entertainment community.</Text>

      <View style={styles.socialButtonsContainer}>
        <SocialButton
          iconType="person"
          title="Use phone or email"
          onPress={() => setStep('form')}
        />
        <SocialButton
          iconType="google"
          title="Continue with Google"
          onPress={() => handleSocialRegister('google')}
        />
        <SocialButton
          iconType="facebook"
          title="Continue with Facebook"
          onPress={() => handleSocialRegister('facebook')}
        />
        <SocialButton
          iconType="apple"
          title="Continue with Apple"
          onPress={() => handleSocialRegister('apple')}
        />
      </View>

      <TouchableOpacity
        style={styles.checkboxContainer}
        onPress={() => setAgreed(!agreed)}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, agreed && styles.checkboxActive]}>
          {agreed && <Ionicons name="checkmark" size={14} color="#FFF" />}
        </View>
        <Text style={styles.checkboxText}>
          By continuing, you agree to our Terms & Privacy Policy.
        </Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.footerLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderForm = () => (
    <View style={styles.contentContainer}>
      <AuthHeader type="avatar" />
      
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Fill your information below</Text>

      <View style={styles.formContainer}>
        <Input placeholder="Enter First Name" value={firstName} onChangeText={setFirstName} />
        <Input placeholder="Enter Last Name" value={lastName} onChangeText={setLastName} />
        <Input placeholder="Enter Username" value={username} onChangeText={setUsername} />
        
        <View style={styles.labelRow}>
          <Text style={styles.inputLabel}>{authMode === 'email' ? 'Email' : 'Phone'}</Text>
          <TouchableOpacity onPress={() => setAuthMode(authMode === 'email' ? 'phone' : 'email')}>
            <Text style={styles.toggleLink}>
              Sign up with {authMode === 'email' ? 'phone' : 'email'}
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
        
        <Input 
          placeholder="Confirm Password" 
          value={confirmPassword} 
          onChangeText={setConfirmPassword} 
          isPassword 
        />

        <Input 
          placeholder="Enter 6 digit code" 
          value={code} 
          onChangeText={setCode} 
          keyboardType="number-pad"
          rightElement={
            <TouchableOpacity onPress={handleSendCode}>
              <Text style={styles.sendCodeText}>Send code</Text>
            </TouchableOpacity>
          }
        />

        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setNewsletter(!newsletter)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, newsletter && styles.checkboxActive]}>
            {newsletter && <Ionicons name="checkmark" size={14} color="#FFF" />}
          </View>
          <Text style={styles.checkboxText}>
            Get trending content, newsletters, promotions, recommendations, and account updates sent to your email
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.verifyButton} 
          activeOpacity={0.88}
          onPress={handleVerify}
        >
          <Text style={styles.verifyButtonText}>Verify</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.footerLink}>Sign In</Text>
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
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 30,
    paddingRight: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    marginRight: 12,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    color: '#6B6B80',
    lineHeight: 18,
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
  verifyButton: {
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
  verifyButtonText: {
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
