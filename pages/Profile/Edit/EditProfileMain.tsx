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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { userService } from '@/services/userService';
import { showToast } from '@/store/slices/toastSlice';

/** Renders coloured initials when user has no profile photo */
function AvatarPlaceholder({ name, size = 100 }: { name: string; size?: number }) {
  const initials = (name || '?')
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() || '')
    .join('');
  return (
    <View style={[
      avatarStyles.circle,
      { width: size, height: size, borderRadius: size / 2 }
    ]}>
      <Text style={[avatarStyles.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
    </View>
  );
}

const avatarStyles = StyleSheet.create({
  circle: {
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  initials: {
    color: '#FFF',
    fontWeight: '700',
  },
});

export default function EditProfileMain() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [name, setName] = useState(user?.fullName || user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [phone, setPhone] = useState(user?.contactDetails?.phone || user?.phoneNumber || '');
  const [website, setWebsite] = useState(user?.contactDetails?.website || '');
  const [location, setLocation] = useState(user?.contactDetails?.location || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.profilePictureUrl || user?.avatarUrl || '');
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        dispatch(showToast({ type: 'error', message: 'Permission to access gallery is required.' }));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0].uri) {
        const pickedUri = result.assets[0].uri;
        setAvatarUrl(pickedUri);
        
        // Dynamic upload profile picture using POST /users/me/profile-picture
        try {
          const res = await userService.uploadProfilePicture(pickedUri);
          const newUrl = res?.profilePictureUrl || res?.user?.profilePictureUrl || res?.url;
          if (newUrl) {
            setAvatarUrl(newUrl);
          }
        } catch (uploadErr) {
          console.warn('[EditProfile] Profile picture upload failed, will save in profile update:', uploadErr);
        }
      }
    } catch (err) {
      console.warn('[EditProfile] Pick image error:', err);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await userService.updateProfile({
        name,
        username,
        bio,
        profilePictureUrl: avatarUrl,
        contactDetails: {
          phone,
          website,
          location,
        },
      });
      dispatch(showToast({ type: 'success', message: 'Profile updated successfully!' }));
      router.back();
    } catch (err) {
      console.error('[EditProfile] Failed to update profile:', err);
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <AvatarPlaceholder name={name || username || 'U'} size={100} />
            )}
            <TouchableOpacity style={styles.editBadge} onPress={handlePickImage}>
              <Ionicons name="camera-outline" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          {name ? <Text style={styles.userName}>{name}</Text> : null}
          {username ? <Text style={styles.userUsername}>@{username}</Text> : null}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Full Name"
                placeholderTextColor="#BBB"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Username"
                placeholderTextColor="#BBB"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bio</Text>
            <View style={[styles.inputContainer, styles.bioContainer]}>
              <TextInput 
                style={[styles.input, styles.bioInput]}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself..."
                placeholderTextColor="#BBB"
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone number</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Phone number"
                placeholderTextColor="#BBB"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Website</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                value={website}
                onChangeText={setWebsite}
                placeholder="https://example.com"
                placeholderTextColor="#BBB"
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
                placeholderTextColor="#BBB"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={[styles.inputContainer, styles.disabledInput]}>
              <TextInput 
                style={styles.input}
                value={email}
                editable={false}
                placeholder="Email"
                placeholderTextColor="#BBB"
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdate} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.updateButtonText}>Update Profile</Text>
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
    paddingBottom: 40,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#FFF',
  },
  editBadge: {
    position: 'absolute',
    bottom: 5,
    right: 0,
    backgroundColor: Colors.primary,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  userUsername: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  form: {
    paddingHorizontal: 20,
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
  bioContainer: {
    height: 100,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  bioInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
  },
  bottomContainer: {
    padding: 20,
    backgroundColor: '#FAFAFA',
  },
  updateButton: {
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
  updateButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
