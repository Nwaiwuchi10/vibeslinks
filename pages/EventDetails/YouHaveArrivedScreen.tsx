import React from 'react';
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function YouHaveArrivedScreen() {
  const router = useRouter();
  const { eventId } = useLocalSearchParams<{ eventId?: string }>();

  const handleOkPress = () => {
    if (eventId) {
      router.replace({
        pathname: '/e-ticket',
        params: { eventId, view: 'all' },
      });
    } else {
      router.replace('/e-ticket');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Centered Arrival Badge & Message (Screenshot 2) */}
      <View style={styles.content}>
        {/* Purple Scalloped Verified Badge */}
        <View style={styles.badgeContainer}>
          <MaterialCommunityIcons name="decagram" size={88} color="#7C3AED" />
          <Ionicons name="checkmark" size={38} color="#FFF" style={styles.checkIcon} />
        </View>

        {/* Title */}
        <Text style={styles.title}>You have arrived</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          You have arrived in the event location.
        </Text>
      </View>

      {/* Bottom OK Button (Screenshot 2) */}
      <View style={styles.bottomCard}>
        <TouchableOpacity
          style={styles.okBtn}
          onPress={handleOkPress}
          activeOpacity={0.88}
        >
          <Text style={styles.okBtnText}>OK</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -40,
  },
  badgeContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    ...Platform.select({
      ios: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16 },
      android: { elevation: 8 },
    }),
  },
  checkIcon: {
    position: 'absolute',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E2026',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomCard: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
  },
  okBtn: {
    backgroundColor: '#7C3AED',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 10 },
      android: { elevation: 6 },
    }),
  },
  okBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});
