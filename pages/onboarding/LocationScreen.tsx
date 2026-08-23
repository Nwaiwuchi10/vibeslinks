import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';
import { apiClient } from '@/services/apiClient';
import { userService } from '@/services/userService';

export default function LocationScreen() {
  const dispatch = useAppDispatch();
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);

  const handleUseCurrentLocation = async () => {
    if (isDetectingLocation) return;
    setIsDetectingLocation(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        dispatch(
          showToast({
            type: 'warning',
            message: 'Location permission is required to detect your location. Please grant permission or enter your location manually.',
          })
        );
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = position.coords;

      // 1. Reverse geocode to resolve city, region, and country name
      let resolvedAddress = '';
      try {
        const [geo] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (geo) {
          const parts = [
            geo.city || geo.subregion || geo.district,
            geo.region,
            geo.country,
          ].filter(Boolean);
          resolvedAddress = parts.join(', ');
        }
      } catch (geoErr) {
        console.warn('[LocationScreen] Reverse geocoding failed:', geoErr);
      }

      // 2. Sync GPS coordinates with backend for 20km event filtering
      try {
        await apiClient.patch('/users/me/location', {
          latitude,
          longitude,
        });
      } catch (patchErr) {
        console.warn('[LocationScreen] Location coordinate sync failed:', patchErr);
      }

      // 3. Update user profile contactDetails if resolved address exists
      if (resolvedAddress) {
        try {
          await userService.updateProfile({
            contactDetails: {
              location: resolvedAddress,
            },
          });
        } catch (profileErr) {
          console.warn('[LocationScreen] Profile location update failed:', profileErr);
        }
      }

      router.push('/(onboarding)/location-confirmed' as any);
    } catch (err: any) {
      console.error('[LocationScreen] Location detection error:', err);
      dispatch(
        showToast({
          type: 'error',
          message: err?.message || 'Failed to detect current location. Please enter manually.',
        })
      );
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
          <Text style={styles.progressText}>2/3</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Ionicons name="location" size={40} color={Colors.primary} />
          </View>
        </View>

        <Text style={styles.title}>What is your location?</Text>
        <Text style={styles.subtitle}>Find events happening near you.</Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isDetectingLocation && { opacity: 0.8 }]}
            activeOpacity={0.88}
            onPress={handleUseCurrentLocation}
            disabled={isDetectingLocation}
          >
            {isDetectingLocation ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator color="#FFF" size="small" />
                <Text style={styles.primaryButtonText}>Detecting Location...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Use My Current Location</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.88}
            onPress={() => router.push('/(onboarding)/enter-location' as any)}
            disabled={isDetectingLocation}
          >
            <Text style={styles.secondaryButtonText}>Enter Location Manually</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.skipContainer}
          activeOpacity={0.8}
          onPress={handleSkip}
          disabled={isDetectingLocation}
        >
          <Text style={styles.skipText}>Skip For Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    paddingBottom: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    width: 140,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    width: '66%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  iconWrapper: {
    marginBottom: 30,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#8A8A8A',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 30,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#EAEAEA',
    borderRadius: 50,
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  skipContainer: {
    padding: 10,
  },
  skipText: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
});
