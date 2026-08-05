import { resolveImageUrl } from '@/services/apiClient';
import { eventService } from '@/services/eventService';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface VibingEvent {
  id?: string;
  title?: string;
  imageUrl?: string;
  eventPosterUrl?: string;
  coverImageUrl?: string;
  location?: string;
  venue?: string;
  startsAt?: string;
  ticketTiers?: { price: number }[];
  attendingFriends?: string[];
  attendees?: any[];
}

interface VibingEventPostProps {
  event?: VibingEvent | null;
  refreshKey?: number;
}

export default function VibingEventPost({ event, refreshKey }: VibingEventPostProps) {
  const [fetchedEvent, setFetchedEvent] = useState<any>(null);
  const [attendees, setAttendees] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function loadEventAndAttendees() {
      try {
        let currentEvent = event;
        if (!currentEvent) {
          const events = await eventService.getAllEvents();
          if (events && events.length > 0) {
            currentEvent = events[0];
          }
        }

        if (currentEvent && isMounted) {
          setFetchedEvent(currentEvent);
          const eventId = currentEvent.id || (currentEvent as any)._id;
          if (eventId) {
            const atts = await eventService.getEventAttendees(eventId);
            if (isMounted && atts && atts.length > 0) {
              const avatarUrls = atts
                .map((a: any) => resolveImageUrl(a.profilePictureUrl || a.avatarUrl || a.user?.profilePictureUrl || a.user?.avatarUrl || null))
                .filter(Boolean);
              if (avatarUrls.length > 0) {
                setAttendees(avatarUrls);
              }
            }
          }
        }
      } catch (err) {
        console.error('[VibingEventPost] Error loading event & attendees:', err);
      }
    }

    loadEventAndAttendees();
    return () => { isMounted = false; };
  }, [event, refreshKey]);

  const e = fetchedEvent || event;
  if (!e) return null;

  const rawImage = e.imageUrl || e.eventPosterUrl || e.coverImageUrl || null;
  const imageUri = resolveImageUrl(rawImage);
  const locationText = e.location || e.venue || 'Lagos, Nigeria';
  const price = e.ticketTiers?.[0]?.price
    ? `$${Number(e.ticketTiers[0].price).toLocaleString()}`
    : e.price !== undefined ? (Number(e.price) > 0 ? `₦${Number(e.price).toLocaleString()}` : 'Free') : 'Free';
  const dateText = e.startsAt
    ? new Date(e.startsAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Upcoming Event';
  const friends = attendees;

  return (
    <View style={styles.feedPostCard}>
      <View style={styles.feedTopBadgeRow}>
        <Text style={styles.feedBadgeText}>See where your friends are vibing</Text>
        <TouchableOpacity style={styles.vibingBadge} onPress={() => router.push({ pathname: '/friends-vibing', params: { eventId: e.id } })} activeOpacity={0.8}>
          <View style={styles.vibingStack}>
            {friends.slice(0, 4).map((uri: string, i: number) => (
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
