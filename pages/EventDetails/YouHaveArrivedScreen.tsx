import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { eventService } from '@/services/eventService';

export default function YouHaveArrivedScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();
  const [loading, setLoading] = useState(true);
  const [event, setEvent] = useState<any>(null);

  useEffect(() => {
    if (!eventId) {
      setLoading(false);
      return;
    }
    eventService.getEventById(eventId)
      .then((res) => {
        setEvent(res?.event || res);
      })
      .catch((err) => console.warn('Error loading event in YouHaveArrivedScreen:', err))
      .finally(() => setLoading(false));
  }, [eventId]);

  const eventTitle = event?.title || 'the event';
  const address = event?.venueLocation?.address ?? event?.location ?? 'the venue';

  return (
    <SafeAreaView style={styles.safeArea}>
      {loading ? (
        <ActivityIndicator color="#8E2DE2" style={{ flex: 1 }} />
      ) : (
        <>
          <View style={styles.content}>
            {/* Badge Icon */}
            <View style={styles.badgeOuter}>
              <Ionicons name="checkmark" size={44} color="#FFF" />
            </View>

            <Text style={styles.title}>You have arrived</Text>
            <Text style={styles.subtitle}>
              You have arrived at the location for{'\n'}
              <Text style={styles.eventHighlight}>{eventTitle}</Text>
              {'\n'}
              ({address})
            </Text>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.okBtn}
              onPress={() => {
                if (eventId) {
                  router.replace({
                    pathname: '/event-details',
                    params: { id: eventId },
                  });
                } else {
                  router.replace('/');
                }
              }}
              activeOpacity={0.85}
            >
              <Text style={styles.okBtnText}>OK</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F5F5F7' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  badgeOuter: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#8E2DE2', justifyContent: 'center', alignItems: 'center', marginBottom: 32, shadowColor: '#8E2DE2', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 10 },
  title: { fontSize: 24, fontWeight: '800', color: '#222', marginBottom: 12, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#888', textAlign: 'center', lineHeight: 22 },
  eventHighlight: { color: '#8E2DE2', fontWeight: '700' },
  bottomBar: { paddingHorizontal: 24, paddingBottom: 40 },
  okBtn: { backgroundColor: '#8E2DE2', borderRadius: 32, paddingVertical: 18, alignItems: 'center' },
  okBtnText: { color: '#FFF', fontSize: 17, fontWeight: '600' },
});
