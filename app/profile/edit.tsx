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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

export default function EditProfileScreen() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#666" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
             <Image
              source={require('@/assets/images/artist_event.png')}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera-outline" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Roland Emmanuel</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#BBB"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone number</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                defaultValue="08159846865"
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputContainer}>
              <TextInput 
                style={styles.input}
                defaultValue="rolandemmanuel103@gmail.com"
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <TouchableOpacity style={styles.inputContainer}>
              <Text style={styles.inputText}>Male</Text>
              <Ionicons name="chevron-down" size={18} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.updateButton} onPress={() => router.back()}>
          <Text style={styles.updateButtonText}>Update</Text>
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
  form: {
    paddingHorizontal: 20,
    gap: 25,
  },
  inputGroup: {
    gap: 10,
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
  inputText: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  changeText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
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
