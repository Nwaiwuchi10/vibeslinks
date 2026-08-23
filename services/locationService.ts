import * as Location from 'expo-location';
import { apiClient } from './apiClient';

export const locationService = {
  /**
   * Request location permissions and sync the device coordinates with the backend.
   * This updates the onboardingLocation for nearby-event discovery.
   */
  async syncDeviceLocation(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('[locationService] Permission to access location was denied');
        return false;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;

      await apiClient.patch('/users/me/location', {
        latitude,
        longitude,
      });

      console.log(`[locationService] Synced location to backend: lat ${latitude}, lng ${longitude}`);
      return true;
    } catch (error) {
      console.warn('[locationService] Failed to sync device location:', error);
      return false;
    }
  },
};
