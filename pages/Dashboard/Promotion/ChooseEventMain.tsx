import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const EVENTS = [
  {
    id: '1',
    image: require('@/assets/images/tiger_event.png'),
    title: 'Can You see my cute face',
    location: 'Lekki Ikata, Lagos Nigeria',
    datetime: 'May 15 – 9:00 PM',
    price: '₦130,000',
    avatars: ['dav', 'djv', 'modu', 'skibi', 'ye'],
  },
  {
    id: '2',
    image: require('@/assets/images/odumodu.png'),
    title: 'When i Wake Up In The M.',
    location: 'Lekki Ikata, Lagos Nigeria',
    datetime: 'May 15 – 9:00 PM',
    price: '₦10,000',
    avatars: ['dav', 'djv', 'modu', 'skibi', 'ye'],
  },
];

// Avatar colours for the stacked pile (since we reuse the same avatars)
const AVATAR_COLORS = ['#7B39FD', '#E91E8C', '#F5A623', '#2A2A2A', '#3D9B00'];

export default function ChooseEventMain() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F4FF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Choose Event</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/dashboard')}>
          <Ionicons name="home-outline" size={20} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {EVENTS.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={styles.eventCard}
            activeOpacity={0.92}
            onPress={() => router.push('/dashboard/campaign-types')}
          >
            {/* Event Image */}
            <View style={styles.imageContainer}>
              <Image
                source={event.image}
                style={styles.eventImage}
                contentFit="cover"
              />
              {/* Boost Badge */}
              <View style={styles.boostBadge}>
                <Text style={styles.boostBadgeText}>Boost Event</Text>
              </View>
            </View>

            {/* Event Details */}
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>{event.title}</Text>

              <View style={styles.eventMeta}>
                <View style={styles.metaItem}>
                  <Ionicons name="location-sharp" size={13} color="#7B39FD" />
                  <Text style={styles.metaText}>{event.location}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Ionicons name="time-outline" size={13} color="#7B39FD" />
                  <Text style={styles.metaText}>{event.datetime}</Text>
                </View>
              </View>

              <View style={styles.priceAvatarRow}>
                <Text style={styles.priceText}>
                  {event.price}
                  <Text style={styles.perPerson}> /Person</Text>
                </Text>

                {/* Stacked Avatar Circles */}
                <View style={styles.avatarStack}>
                  {AVATAR_COLORS.slice(0, 5).map((color, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.avatarCircle,
                        { backgroundColor: color, left: idx * 18 },
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F4FF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop:
      Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 16,
    paddingBottom: 16,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EBEBF0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1A1A1A',
  },

  // Event Card
  eventCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    width: '100%',
  },
  eventImage: {
    width: '100%',
    height: '100%',
  },
  boostBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: '#7B39FD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  boostBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },

  // Event Details
  eventDetails: {
    padding: 16,
    gap: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  eventMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#5A5A6A',
    fontWeight: '500',
  },
  priceAvatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  priceText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#7B39FD',
  },
  perPerson: {
    fontSize: 12,
    fontWeight: '400',
    color: '#8E8E93',
  },

  // Avatar Stack
  avatarStack: {
    flexDirection: 'row',
    position: 'relative',
    height: 28,
    width: 5 * 18 + 10,
  },
  avatarCircle: {
    position: 'absolute',
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: '#FFF',
    top: 0,
  },
});
