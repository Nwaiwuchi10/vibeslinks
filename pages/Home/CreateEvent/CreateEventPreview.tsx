import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useCreateEvent } from './CreateEventContext';
import { eventService } from '@/services/eventService';
import { resolveImageUrl } from '@/services/apiClient';

const { width } = Dimensions.get('window');

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  NGN: '₦',
  GBP: '£',
  EUR: '€',
  CAD: 'CA$',
  GHS: 'GH₵',
  KES: 'KSh',
  ZAR: 'R',
};

const CreateEventPreview = ({
  onBack,
  onPublish,
  isPublishing,
  onSaveDraft,
  isSavingDraft,
}: {
  onBack: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
  onSaveDraft?: () => void;
  isSavingDraft?: boolean;
}) => {
  const { eventData, options } = useCreateEvent();
  const [availableArtists, setAvailableArtists] = useState<any[]>([]);

  useEffect(() => {
    if (options?.artists && options.artists.length > 0) {
      setAvailableArtists(
        options.artists.map((a: any) => ({
          id: a.id || String(a.userId),
          name: a.name || a.fullName || 'Artist',
          avatarUrl: resolveImageUrl(a.profilePictureUrl || a.avatarUrl) || `https://i.pravatar.cc/150?img=12`,
        }))
      );
    } else {
      async function fetchArtists() {
        try {
          const res = await eventService.getArtistOptions();
          const list = Array.isArray(res) ? res : res.artists || [];
          setAvailableArtists(
            list.map((a: any) => ({
              id: a.id || String(a.userId),
              name: a.name || a.fullName || 'Artist',
              avatarUrl: resolveImageUrl(a.avatarUrl || a.profilePictureUrl) || `https://i.pravatar.cc/150?img=12`,
            }))
          );
        } catch (err) {
          console.warn('[CreateEventPreview] Failed to fetch artist options:', err);
        }
      }
      fetchArtists();
    }
  }, [options]);

  const getSelectedRegisteredArtists = () => {
    const ids = eventData.artisteIds || [];
    return availableArtists.filter((a) => ids.includes(a.id));
  };

  const customArtists = eventData.featuredArtists || [];

  // Format date helper
  const formatDate = (isoStr: string) => {
    if (!isoStr) return 'TBD';
    const d = new Date(isoStr);
    return `${d.getDate()} / ${d.getMonth() + 1} / ${d.getFullYear()}`;
  };

  const formatTime = (isoStr: string) => {
    if (!isoStr) return 'TBD';
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const fullVenueText = useMemo(() => {
    const parts = [
      eventData.venue,
      eventData.location,
      eventData.city,
      eventData.country,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : 'No Venue specified';
  }, [eventData.venue, eventData.location, eventData.city, eventData.country]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Preview</Text>
        <TouchableOpacity style={styles.editBtn} onPress={onBack}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Event Format</Text>
          <View style={styles.typeCard}>
            <View style={styles.typeIconContainer}>
              <MaterialCommunityIcons
                name={eventData.virtualEvent ? 'video-outline' : 'ticket-confirmation-outline'}
                size={24}
                color="#8E2DE2"
              />
            </View>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.typeTitle}>
                {eventData.virtualEvent ? 'Livestream Event' : 'Physical Event'}
              </Text>
              <Text style={styles.typeDesc}>
                {eventData.virtualEvent
                  ? 'Host fans online in real time'
                  : 'Host fans in person at a venue'}
              </Text>
            </View>
            <View style={styles.radioOutter}>
              <View style={styles.radioInner} />
            </View>
          </View>
        </View>

        {/* Cover */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Event Cover</Text>
          {eventData.imageUrl ? (
            <Image source={{ uri: eventData.imageUrl }} style={styles.coverImage} />
          ) : (
            <View style={[styles.coverImage, styles.placeholderCover]}>
              <Ionicons name="image-outline" size={48} color="#999" />
              <Text style={{ color: '#999', marginTop: 8 }}>No cover image selected</Text>
            </View>
          )}
        </View>

        {/* Event Title */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Event Title & Category</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoTitleText}>{eventData.title || 'Untitled Event'}</Text>
            {eventData.category ? (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>{eventData.category.toUpperCase()}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Description */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Description</Text>
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              {eventData.description || 'No description provided.'}
            </Text>
          </View>
        </View>

        {/* Featured Artists */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Featured Artists</Text>
          {getSelectedRegisteredArtists().length > 0 || customArtists.length > 0 ? (
            <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
              {/* Registered platform artists */}
              {getSelectedRegisteredArtists().map((artist) => (
                <View key={artist.id} style={{ alignItems: 'center', width: 75 }}>
                  <Image
                    source={{ uri: artist.avatarUrl }}
                    style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE' }}
                  />
                  <Text style={styles.artistNameText} numberOfLines={1}>
                    {artist.name}
                  </Text>
                  <Text style={styles.artistTagText}>Verified</Text>
                </View>
              ))}

              {/* Custom guest artists */}
              {customArtists.map((artist, idx) => (
                <View key={artist.id || `custom_${idx}`} style={{ alignItems: 'center', width: 75 }}>
                  {artist.imageUrl || artist.profilePictureUrl ? (
                    <Image
                      source={{ uri: artist.imageUrl || artist.profilePictureUrl }}
                      style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#EEE' }}
                    />
                  ) : (
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: '#F3E8FF',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Ionicons name="person" size={20} color="#8E2DE2" />
                    </View>
                  )}
                  <Text style={styles.artistNameText} numberOfLines={1}>
                    {artist.name}
                  </Text>
                  <Text style={styles.artistTagText}>Guest</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>No featured artists selected.</Text>
            </View>
          )}
        </View>

        {/* Time and Date */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Time and Date</Text>
          <View style={styles.dateTimeBox}>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Date: {formatDate(eventData.startsAt)}</Text>
            </View>
            <View style={styles.timeRow}>
              <View style={styles.timeBox}>
                <Text style={styles.infoText}>Start: {formatTime(eventData.startsAt)}</Text>
                <Ionicons name="time-outline" size={18} color="#8E2DE2" />
              </View>
              <View style={styles.timeBox}>
                <Text style={styles.infoText}>End: {formatTime(eventData.endsAt)}</Text>
                <Ionicons name="time-outline" size={18} color="#8E2DE2" />
              </View>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>Timezone: {eventData.timezone || 'Africa/Lagos'}</Text>
            </View>
          </View>
        </View>

        {/* Venue */}
        {!eventData.virtualEvent && (
          <View style={styles.previewSection}>
            <Text style={styles.sectionTitle}>Event Venue & Location</Text>
            <View style={styles.venueBox}>
              <View style={styles.infoBox}>
                <Text style={styles.venueTitle}>{eventData.venue || 'No Venue specified'}</Text>
                <Text style={styles.infoText}>{fullVenueText}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Ticket Types */}
        <View style={styles.previewSection}>
          <Text style={styles.sectionTitle}>Ticket Types & Pricing</Text>
          <View style={styles.ticketTypeBox}>
            {eventData.ticketTiers.length > 0 ? (
              eventData.ticketTiers.map((tier, idx) => {
                const sym = CURRENCY_SYMBOLS[tier.currency] || tier.currency;
                return (
                  <View key={idx} style={styles.ticketInfoBox}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={[styles.infoTitleText, { fontSize: 15 }]}>{tier.tierName}</Text>
                      <Text style={styles.ticketPriceBadge}>
                        {tier.freeEntry || tier.price === 0
                          ? 'FREE'
                          : `${sym}${tier.price} ${tier.currency}`}
                      </Text>
                    </View>
                    <Text style={[styles.infoText, { marginTop: 4 }]}>
                      Capacity: {tier.capacity} tickets
                    </Text>
                    {tier.description ? (
                      <Text style={[styles.infoText, { marginTop: 2, color: '#666' }]}>
                        Perks: {tier.description}
                      </Text>
                    ) : null}
                  </View>
                );
              })
            ) : eventData.virtualEvent ? (
              <View style={styles.ticketInfoBox}>
                <Text style={styles.infoText}>
                  {eventData.liveStreamPrivacy === 'ticket-holders-only'
                    ? `Stream Ticket Price: ₦${eventData.liveStreamTicketPrice.toLocaleString()}`
                    : eventData.liveStreamPrivacy === 'all'
                    ? 'Public Stream — Free to watch'
                    : 'Invite Only Stream'}
                </Text>
              </View>
            ) : (
              <View style={styles.ticketInfoBox}>
                <Text style={styles.infoText}>No tickets added.</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.draftBtn, isSavingDraft && { opacity: 0.6 }]}
          onPress={onSaveDraft}
          disabled={isSavingDraft || isPublishing}
        >
          {isSavingDraft ? (
            <ActivityIndicator color="#8E2DE2" size="small" />
          ) : (
            <Text style={[styles.btnText, { color: '#8E2DE2' }]}>Save Draft</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.publishBtn, isPublishing && { opacity: 0.7 }]}
          onPress={onPublish}
          disabled={isPublishing || isSavingDraft}
        >
          {isPublishing ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={[styles.btnText, { color: '#FFF' }]}>
              {eventData.virtualEvent ? 'Go Live' : 'Publish Event'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreateEventPreview;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 10,
    paddingBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#333' },
  editBtn: { backgroundColor: '#000', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
  editBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  previewSection: { marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#333', marginBottom: 12 },
  typeCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#8E2DE2', alignItems: 'center' },
  typeIconContainer: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#F3E8FF', justifyContent: 'center', alignItems: 'center' },
  typeTitle: { fontSize: 15, fontWeight: '800', color: '#1E1E1E' },
  typeDesc: { fontSize: 11, color: '#666', marginTop: 4 },
  radioOutter: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#DDD', justifyContent: 'center', alignItems: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#8E2DE2' },
  infoBox: { backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 14, marginBottom: 10 },
  infoTitleText: { fontSize: 15, color: '#222', fontWeight: '700' },
  infoText: { fontSize: 13, color: '#555', fontWeight: '500' },
  categoryBadge: { alignSelf: 'flex-start', backgroundColor: '#F3E8FF', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 6 },
  categoryBadgeText: { color: '#8E2DE2', fontSize: 11, fontWeight: '700' },
  artistNameText: { fontSize: 11, color: '#333', textAlign: 'center', marginTop: 4, fontWeight: '600' },
  artistTagText: { fontSize: 9, color: '#8E2DE2', textAlign: 'center' },
  dateTimeBox: { width: '100%' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  timeBox: { width: '48%', height: 50, backgroundColor: '#F8F8F8', borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15 },
  coverImage: { width: '100%', height: 200, borderRadius: 20 },
  placeholderCover: { backgroundColor: '#EEE', justifyContent: 'center', alignItems: 'center' },
  venueBox: { width: '100%' },
  venueTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 4 },
  ticketTypeBox: { width: '100%' },
  ticketInfoBox: { backgroundColor: '#F8F8F8', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 12, marginBottom: 8 },
  ticketPriceBadge: { color: '#8E2DE2', fontWeight: '800', fontSize: 14 },
  bottomBar: { position: 'absolute', bottom: 30, left: 20, right: 20, height: 75, backgroundColor: '#FFF', borderRadius: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10 },
  draftBtn: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  publishBtn: { flex: 1.5, height: 55, backgroundColor: '#7F36FF', borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  btnText: { fontSize: 16, fontWeight: '700' },
});
