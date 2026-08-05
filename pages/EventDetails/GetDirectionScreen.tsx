import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eventService } from '@/services/eventService';

const { width, height } = Dimensions.get('window');

// Default Center Coordinates (Lagos Nigeria)
const DEFAULT_LAT = 6.4474;
const DEFAULT_LNG = 3.4553;
const MAP_ZOOM = 13;

export default function GetDirectionScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    eventService.getEventById(eventId)
      .then((res) => {
        setEvent(res?.event || res);
      })
      .catch((err) => console.warn('Error loading event details for map directions:', err))
      .finally(() => setLoading(false));
  }, [eventId]);

  const handleStart = () => {
    setStarted(true);
    // Simulate navigation — after 1.5s, navigate to arrived screen
    setTimeout(() => {
      router.push({
        pathname: '/you-have-arrived',
        params: { eventId },
      });
    }, 1500);
  };

  const venueLat = event?.venueLocation?.latitude ?? DEFAULT_LAT;
  const venueLng = event?.venueLocation?.longitude ?? DEFAULT_LNG;
  const address = event?.venueLocation?.address ?? event?.location ?? 'Lekki, Lagos';

  // Construct dynamic static map image from OpenStreetMap
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${venueLat},${venueLng}&zoom=${MAP_ZOOM}&size=600x900`;

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : (
        <>
          {/* Full-screen Map */}
          <Image source={{ uri: mapUrl }} style={styles.mapImage} resizeMode="cover" />

          {/* Dark overlay for readability */}
          <View style={styles.overlay} />

          {/* Header */}
          <SafeAreaView style={styles.headerSafe} edges={['top']}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={20} color="#333" />
              </TouchableOpacity>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {event?.title || 'Get Direction'}
              </Text>
              <View style={{ width: 44 }} />
            </View>
          </SafeAreaView>

          {/* Pins Overlay */}
          <View style={styles.routeContainer}>
            {/* Origin Pin (A) */}
            <View style={[styles.pinWrapper, { bottom: '35%', left: '25%' }]}>
              <View style={styles.pinOuter}>
                <Ionicons name="navigate" size={16} color="#8E2DE2" />
              </View>
            </View>
            {/* Destination Pin (B) */}
            <View style={[styles.pinWrapper, { top: '22%', right: '20%' }]}>
              <View style={styles.destinationPin}>
                <Ionicons name="location" size={18} color="#8E2DE2" />
              </View>
            </View>
          </View>

          {/* Bottom Start Button & Address Info */}
          <SafeAreaView style={styles.bottomSafe} edges={['bottom']}>
            <View style={styles.bottomBar}>
              <View style={styles.addressBox}>
                <Ionicons name="location" size={18} color="#8E2DE2" style={{ marginRight: 6 }} />
                <Text style={styles.addressText} numberOfLines={2}>
                  {address}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.startBtn, started && styles.startBtnActive]}
                onPress={handleStart}
                activeOpacity={0.85}
                disabled={started}
              >
                <Text style={styles.startBtnText}>
                  {started ? 'Navigating...' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E8E8E8' },
  mapImage: { ...StyleSheet.absoluteFillObject, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.05)' },
  headerSafe: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#EBEBEB', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#222', backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, maxWidth: width * 0.6 },
  routeContainer: { ...StyleSheet.absoluteFillObject },
  pinWrapper: { position: 'absolute', alignItems: 'center' },
  pinOuter: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  destinationPin: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFF', borderWidth: 2, borderColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  bottomSafe: { position: 'absolute', bottom: 0, left: 0, right: 0 },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 32, paddingTop: 16, gap: 12 },
  addressBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: '#EBEBEB', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  addressText: { flex: 1, fontSize: 13, fontWeight: '600', color: '#333' },
  startBtn: { backgroundColor: '#8E2DE2', borderRadius: 32, paddingVertical: 18, alignItems: 'center', shadowColor: '#8E2DE2', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  startBtnActive: { backgroundColor: '#6A1FAE' },
  startBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
});
