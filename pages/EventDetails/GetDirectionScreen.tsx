import React, { useEffect, useState, useRef } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { eventService } from '@/services/eventService';

const { width, height } = Dimensions.get('window');

// Default Center Coordinates (Lagos Nigeria)
const DEFAULT_VENUE_LAT = 6.4714;
const DEFAULT_VENUE_LNG = 3.3653;
const DEFAULT_USER_LAT = 6.4524;
const DEFAULT_USER_LNG = 3.3423;

export default function GetDirectionScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: DEFAULT_USER_LAT,
    longitude: DEFAULT_USER_LNG,
  });
  const [navigating, setNavigating] = useState(false);
  const [distanceKm, setDistanceKm] = useState<string>('2.4');

  const locationWatcherRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    // 1. Fetch Event Details
    if (eventId) {
      eventService.getEventById(eventId)
        .then((res) => {
          setEvent(res?.event || res);
        })
        .catch((err) => console.warn('Error loading event for directions:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // 2. Request Live GPS Location
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (loc?.coords) {
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        }
      } catch (err) {
        console.log('[GetDirectionScreen] Location permission error:', err);
      }
    })();

    return () => {
      if (locationWatcherRef.current) {
        locationWatcherRef.current.remove();
      }
    };
  }, [eventId]);

  const venueLat = event?.venueLocation?.latitude ?? DEFAULT_VENUE_LAT;
  const venueLng = event?.venueLocation?.longitude ?? DEFAULT_VENUE_LNG;

  const handleStartNavigation = async () => {
    setNavigating(true);

    try {
      // Start watching live position
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000,
          distanceInterval: 10,
        },
        (loc) => {
          if (loc?.coords) {
            setUserLocation({
              latitude: loc.coords.latitude,
              longitude: loc.coords.longitude,
            });
          }
        }
      );
      locationWatcherRef.current = sub;
    } catch {}

    // Simulated / live arrival transition
    setTimeout(() => {
      router.push({
        pathname: '/you-have-arrived',
        params: { eventId },
      });
    }, 2000);
  };

  const centerLat = (userLocation.latitude + venueLat) / 2;
  const centerLng = (userLocation.longitude + venueLng) / 2;

  // Real-time styled static map image from OpenStreetMap / Google Maps static provider
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLng}&zoom=14&size=650x1000&maptype=mapnik`;

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#7C3AED" />
        </View>
      ) : (
        <>
          {/* Map Base Layer */}
          <Image source={{ uri: mapUrl }} style={styles.mapImage} resizeMode="cover" />

          {/* Light overlay for clean contrast */}
          <View style={styles.mapOverlay} pointerEvents="none" />

          {/* Simulated Real-Time Route Polyline */}
          <View style={styles.routeSvgLayer} pointerEvents="none">
            {/* SVG style polyline curve indicator */}
            <View style={styles.polylineTrack} />
          </View>

          {/* Header (Screenshot 1) */}
          <SafeAreaView style={styles.headerSafe} edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
                activeOpacity={0.8}
              >
                <Ionicons name="arrow-back" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Get Direction</Text>
              <View style={{ width: 44 }} />
            </View>
          </SafeAreaView>

          {/* User Location Origin Pin (A) */}
          <View style={[styles.originPinWrapper, { bottom: '42%', left: '32%' }]}>
            <View style={styles.originPin}>
              <Ionicons name="navigate" size={16} color="#FFF" />
            </View>
          </View>

          {/* Event Venue Destination Pin (Purple Pin with icon) */}
          <View style={[styles.destinationPinWrapper, { top: '21%', right: '28%' }]}>
            <View style={styles.destinationPin}>
              <Ionicons name="location" size={18} color="#FFF" />
            </View>
          </View>

          {/* Bottom Card with Start Button (Screenshot 1) */}
          <SafeAreaView style={styles.bottomSafe} edges={['bottom']}>
            <View style={styles.bottomCard}>
              <TouchableOpacity
                style={[styles.startBtn, navigating && styles.startBtnActive]}
                onPress={handleStartNavigation}
                activeOpacity={0.88}
                disabled={navigating}
              >
                {navigating ? (
                  <View style={styles.navigatingRow}>
                    <ActivityIndicator size="small" color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.startBtnText}>Starting Navigation...</Text>
                  </View>
                ) : (
                  <Text style={styles.startBtnText}>Start</Text>
                )}
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8ECF2',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  mapOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  routeSvgLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  polylineTrack: {
    position: 'absolute',
    width: 4,
    height: height * 0.36,
    backgroundColor: '#1E2026',
    borderRadius: 2,
    top: '25%',
    left: '48%',
    transform: [{ rotate: '-32deg' }],
  },
  headerSafe: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 3 },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E2026',
  },
  originPinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  originPin: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#7C3AED',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  destinationPinWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 5,
  },
  destinationPin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7C3AED',
    borderWidth: 3,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8 },
      android: { elevation: 6 },
    }),
  },
  bottomSafe: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 24 : 20,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12 },
      android: { elevation: 8 },
    }),
  },
  startBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 10 },
      android: { elevation: 6 },
    }),
  },
  startBtnActive: {
    backgroundColor: '#6D28D9',
  },
  startBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  navigatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
