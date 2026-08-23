import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { userService } from '@/services/userService';
import { authService } from '@/services/authService';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';

export default function SettingsMain() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  // Settings states
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [inAppNotifications, setInAppNotifications] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [loadingSettings, setLoadingSettings] = useState(true);

  // Password change states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submittingPassword, setSubmittingPassword] = useState(false);

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await userService.getSettings();
        if (data) {
          // Map backend notifications structure
          const notifs = data.notifications || data;
          setEmailNotifications(notifs.email ?? notifs.emailNotifications ?? true);
          setInAppNotifications(notifs.push ?? notifs.inAppNotifications ?? notifs.inApp ?? true);
          setProfileVisibility(data.privacy?.profileVisibility || 'public');
        }
      } catch (err) {
        console.warn('[SettingsMain] Error loading settings:', err);
      } finally {
        setLoadingSettings(false);
      }
    }
    loadSettings();
  }, []);

  const toggleVisibility = (key: keyof typeof showPassword) => {
    setShowPassword(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleUpdateSettings = async (key: string, value: any) => {
    try {
      let updatedEmail = emailNotifications;
      let updatedPush = inAppNotifications;
      let updatedVisibility = profileVisibility;

      if (key === 'email') {
        updatedEmail = value;
        setEmailNotifications(value);
      } else if (key === 'push') {
        updatedPush = value;
        setInAppNotifications(value);
      } else if (key === 'privacy') {
        updatedVisibility = value;
        setProfileVisibility(value);
      }

      await userService.updateSettings({
        emailNotifications: updatedEmail,
        inAppNotifications: updatedPush,
        notifications: {
          email: updatedEmail,
          push: updatedPush,
        },
        privacy: {
          profileVisibility: updatedVisibility,
        },
      });
    } catch (err) {
      console.error('[SettingsMain] Failed to update settings:', err);
    }
  };

  const handleConfirmPasswordChange = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      dispatch(showToast({ type: 'error', message: 'All password fields are required.' }));
      return;
    }
    if (newPassword !== confirmPassword) {
      dispatch(showToast({ type: 'error', message: 'Passwords do not match.' }));
      return;
    }

    setSubmittingPassword(true);
    try {
      // Hitting POST /auth/reset-password with empty token to update password for logged-in user
      await authService.resetPassword('', oldPassword, newPassword);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('[SettingsMain] Password change failed:', err);
    } finally {
      setSubmittingPassword(false);
    }
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {loadingSettings ? (
          <ActivityIndicator color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Notifications & Privacy</Text>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Email Notifications</Text>
              <Switch 
                value={emailNotifications} 
                onValueChange={(val) => handleUpdateSettings('email', val)}
                trackColor={{ true: Colors.primary }}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>In-App Push Notifications</Text>
              <Switch 
                value={inAppNotifications} 
                onValueChange={(val) => handleUpdateSettings('push', val)}
                trackColor={{ true: Colors.primary }}
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Private Profile</Text>
              <Switch 
                value={profileVisibility === 'private'} 
                onValueChange={(val) => handleUpdateSettings('privacy', val ? 'private' : 'public')}
                trackColor={{ true: Colors.primary }}
              />
            </View>
          </View>
        )}

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Update Password</Text>

          {/* Change Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Current Password</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                secureTextEntry={!showPassword.current}
                value={oldPassword}
                onChangeText={setOldPassword}
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
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                secureTextEntry={!showPassword.new}
                value={newPassword}
                onChangeText={setNewPassword}
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
                value={confirmPassword}
                onChangeText={setConfirmPassword}
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
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPasswordChange} disabled={submittingPassword}>
          {submittingPassword ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Update Password</Text>
          )}
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
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  switchLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    height: 56,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
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
