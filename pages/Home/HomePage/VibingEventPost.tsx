import { Colors } from '../../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VibingEvent {
  id?: string;
  title?: string;
  imageUrl?: string;
  eventPosterUrl?: string;
  location?: string;
  venue?: string;
  startsAt?: string;
  ticketTiers?: { price: number }[];
  attendingFriends?: string[]; // avatar URLs of friends attending
}

interface VibingEventPostProps {
  event?: VibingEvent | null;
}

const MOCK_EVENT: VibingEvent = {
  id: 'mock',
  title: 'Afro Summer Festival',
  imageUrl: undefined,
  location: 'Lekki Ikata, Lagos Nigeria',
  startsAt: '2026-05-15T21:00:00Z',
  ticketTiers: [{ price: 80000 }],
  attendingFriends: [
    'https://i.pravatar.cc/150?img=11',
    'https://i.pravatar.cc/150?img=12',
    'https://i.pravatar.cc/150?img=13',
    'https://i.pravatar.cc/150?img=15',
  ],
};

export default function VibingEventPost({ event }: VibingEventPostProps) {
  const e = event || MOCK_EVENT;

  const imageUri = e.imageUrl || e.eventPosterUrl;
  const locationText = e.location || e.venue || 'Lagos, Nigeria';
  const price = e.ticketTiers?.[0]?.price
    ? `₦${e.ticketTiers[0].price.toLocaleString()}`
    : '₦80,000';
  const dateText = e.startsAt
    ? new Date(e.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'May 15 - 9:00 PM';
  const friends = e.attendingFriends?.length
    ? e.attendingFriends
    : ['https://i.pravatar.cc/150?img=11', 'https://i.pravatar.cc/150?img=12', 'https://i.pravatar.cc/150?img=13', 'https://i.pravatar.cc/150?img=15'];

  return (
    <View style={styles.feedPostCard}>
      <View style={styles.feedTopBadgeRow}>
        <Text style={styles.feedBadgeText}>See where your friends are vibing</Text>
        <TouchableOpacity style={styles.vibingBadge} onPress={() => router.push('/friends-vibing')} activeOpacity={0.8}>
          <View style={styles.vibingStack}>
            {friends.slice(0, 4).map((uri, i) => (
              <Image key={i} source={{ uri }} style={[styles.vibingAvatar, { marginLeft: i === 0 ? 0 : -10 }]} />
            ))}
          </View>
          <View style={styles.arrowCircle}>
            <Ionicons name="chevron-forward" size={12} color="#8E2DE2" />
          </View>
        </TouchableOpacity>
      </View>

      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.feedMainImage} />
      ) : (
        <Image source={require('../../../assets/images/dav.png')} style={styles.feedMainImage} />
      )}

      <Text style={styles.feedTitle}>{e.title || 'Afro Summer Festival'}</Text>

      <View style={styles.nearYouInfoRow}>
        <View style={styles.nearYouInfoItem}>
          <Ionicons name="location" size={16} color="#8E2DE2" />
          <Text style={styles.nearYouInfoText}>{locationText}</Text>
        </View>
        <View style={styles.nearYouInfoItem}>
          <Ionicons name="alarm" size={16} color="#8E2DE2" />
          <Text style={styles.nearYouInfoText}>{dateText}</Text>
        </View>
      </View>

      <View style={styles.nearYouFooter}>
        <Text style={styles.priceHighlight}>{price} <Text style={styles.priceSub}>/Person</Text></Text>
        <TouchableOpacity
          style={styles.viewEventButton}
          onPress={() => e.id && e.id !== 'mock'
            ? router.push({ pathname: '/event-details', params: { id: e.id } })
            : router.push('/event-details')
          }
          activeOpacity={0.8}
        >
          <Text style={styles.viewEventText}>View Event</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  feedPostCard: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 16,
  },
  feedTopBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  feedBadgeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  vibingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8E2DE2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 24,
  },
  vibingStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vibingAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FFF',
  },
  arrowCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  feedMainImage: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    marginBottom: 16,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A2E',
    marginBottom: 12,
  },
  nearYouInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingRight: 10,
  },
  nearYouInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nearYouInfoText: {
    fontSize: 13,
    color: '#8A8A8A',
    marginLeft: 6,
    fontWeight: '500',
  },
  nearYouFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceHighlight: {
    fontSize: 16,
    color: '#8E2DE2',
    fontWeight: '800',
  },
  priceSub: {
    fontSize: 13,
    color: '#8A8A8A',
    fontWeight: '500',
  },
  viewEventButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  viewEventText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
