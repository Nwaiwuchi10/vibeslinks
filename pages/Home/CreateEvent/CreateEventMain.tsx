import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import CreateEventStep1 from './CreateEventStep1';
import CreateEventStep2Physical from './CreateEventStep2';

import { eventService } from '@/services/eventService';
import { CreateEventProvider, useCreateEvent } from './CreateEventContext';
import CreateEventDatePicker from './CreateEventDatePicker';
import CreateEventPreview from './CreateEventPreview';
import CreateEventStep2Livestream from './CreateEventStep2Livestream';
import CreateEventStep3 from './CreateEventStep3';
import CreateEventStep4 from './CreateEventStep4';

type WizardStep = 'type_selection' | 'details' | 'tickets' | 'preview' | 'published' | 'date_picker';

const CreateEventInner = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState<WizardStep>('type_selection');
  const [prevStep, setPrevStep] = useState<WizardStep>('type_selection');
  const [isPublishing, setIsPublishing] = useState(false);

  const { eventData, updateEventData } = useCreateEvent();
  const params = useLocalSearchParams<{ eventId?: string }>();

  useEffect(() => {
    if (params.eventId) {
      async function loadEvent() {
        try {
          const res = await eventService.getEventById(params.eventId!);
          const evt = res?.event || res;
          const registeredIds: string[] = [];
          const customArtists: any[] = [];

          (evt.artistes || []).forEach((a: any) => {
            const id = a.id || a.userId || a._id;
            if (id && !String(id).startsWith('custom_')) {
              registeredIds.push(String(id));
            } else {
              customArtists.push({
                id: id || `custom_${Date.now()}`,
                name: a.name || 'Artist',
                imageUrl: a.profilePictureUrl || a.imageUrl || a.avatarUrl,
                category: a.category,
                isCustom: true,
              });
            }
          });

          if (Array.isArray(evt.featuredArtists)) {
            evt.featuredArtists.forEach((fa: any) => {
              if (!customArtists.some(c => c.name === fa.name)) {
                customArtists.push({
                  id: fa.id || `custom_${Date.now()}`,
                  name: fa.name,
                  imageUrl: fa.profilePictureUrl || fa.imageUrl,
                  category: fa.category,
                  isCustom: true,
                });
              }
            });
          }

          updateEventData({
            title: evt.title || '',
            description: evt.description || '',
            category: evt.category || '',
            imageUrl: evt.imageUrl || evt.eventPosterUrl || '',
            eventPosterUrl: evt.eventPosterUrl || evt.imageUrl || '',
            startsAt: evt.startsAt || evt.startDateTime || '',
            endsAt: evt.endsAt || evt.endDateTime || '',
            timezone: evt.timezone || 'Africa/Lagos',
            venue: evt.venue || '',
            location: evt.location || '',
            venueLocation: evt.venueLocation || { name: '', address: '', mapUrl: '', latitude: 0, longitude: 0 },
            ticketTiers: evt.ticketTiers || evt.ticketPricingTiers || [],
            artisteIds: registeredIds,
            featuredArtists: customArtists,
            virtualEvent: Boolean(evt.virtualEvent),
          });
          setStep('details');
        } catch (err) {
          console.warn('Failed to load event for editing:', err);
        }
      }
      loadEvent();
    }
  }, [params.eventId]);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const handleBack = () => {
    if (step === 'type_selection') {
      onFinish();
    } else if (step === 'details') {
      setStep('type_selection');
    } else if (step === 'tickets') {
      setStep('details');
    } else if (step === 'preview') {
      // Livestreams skip tickets → go back to details
      setStep(eventData.virtualEvent ? 'details' : 'tickets');
    } else if (step === 'date_picker') {
      setStep(prevStep);
    }
  };

  const handleContinueFromStep1 = (type: 'physical' | 'livestream') => {
    if (type === 'livestream') {
      router.push('/go-live');
      return;
    }
    updateEventData({ virtualEvent: false });
    setStep('details');
  };

  const handleContinueFromStep2 = () => {
    // Livestreams don't need ticket-tier setup — go straight to preview
    if (eventData.virtualEvent) {
      setStep('preview');
    } else {
      setStep('tickets');
    }
  };

  const handleOpenDatePicker = () => {
    setPrevStep(step);
    setStep('date_picker');
  };

  const handleConfirmDate = () => {
    setStep(prevStep);
  };

  const handleContinueFromStep3 = () => {
    setStep('preview');
  };

  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const getPayloadImageUrl = async (url?: string) => {
    if (!url) return '';
    if (url.startsWith('file://') || url.startsWith('content://') || url.startsWith('ph://')) {
      try {
        const uploadedUrl = await eventService.uploadImage(url);
        return uploadedUrl;
      } catch (err) {
        console.warn('Failed to upload image before save:', err);
        return url;
      }
    }
    return url;
  };

  const buildEventPayload = async (isDraft: boolean) => {
    const resolvedCoverUrl = await getPayloadImageUrl(eventData.imageUrl);
    const venueName = eventData.venue?.trim() || eventData.location?.trim() || 'Venue TBA';
    const fullLocation = [eventData.venue, eventData.location, eventData.city, eventData.country]
      .filter(Boolean)
      .join(', ');

    const registeredArtistIds = (eventData.artisteIds || []).filter(
      (id) => !id.startsWith('custom_')
    );

    const customFeaturedArtists = (eventData.featuredArtists || []).map((a) => ({
      name: a.name,
      category: a.category || undefined,
      imageUrl: a.imageUrl || a.profilePictureUrl || undefined,
      profilePictureUrl: a.profilePictureUrl || a.imageUrl || undefined,
    }));

    const normalizedTiers = (eventData.ticketTiers || []).map((t) => {
      const name = t.tierName || t.ticketName || 'General';
      const isFree = t.freeEntry === true || t.price === 0;
      const price = isFree ? 0 : Number(t.price) || 0;
      const capacity = Number(t.capacity || t.quantity) || 100;
      const currency = (t.currency || 'USD').toUpperCase();
      const benefits = t.benefits || (t.description ? t.description.split(', ').filter(Boolean) : []);
      return {
        id: t.id || undefined,
        ticketName: name,
        tierName: name,
        price,
        currency,
        quantity: capacity,
        capacity,
        description: t.description || benefits.join('\n') || 'Entry ticket',
        benefits,
        freeEntry: isFree,
      };
    });

    const totalCapacity =
      eventData.totalCapacity > 0
        ? eventData.totalCapacity
        : normalizedTiers.reduce((sum, tier) => sum + tier.capacity, 0);

    return {
      title: eventData.title?.trim() || (isDraft ? 'Untitled event draft' : ''),
      description: eventData.description?.trim() || undefined,
      category: eventData.category?.trim() || (isDraft ? undefined : 'concert'),
      imageUrl: resolvedCoverUrl || undefined,
      eventPosterUrl: resolvedCoverUrl || undefined,
      venue: venueName,
      location: fullLocation || venueName,
      venueLocation: {
        name: eventData.venueLocation?.name || venueName,
        address: eventData.venueLocation?.address || fullLocation || venueName,
        city: eventData.city || undefined,
        country: eventData.country || undefined,
        mapUrl: eventData.venueLocation?.mapUrl || '',
        latitude: eventData.venueLocation?.latitude || 0,
        longitude: eventData.venueLocation?.longitude || 0,
      },
      virtualEvent: Boolean(eventData.virtualEvent),
      startDateTime: eventData.startsAt || undefined,
      startsAt: eventData.startsAt || undefined,
      endDateTime: eventData.endsAt || undefined,
      endsAt: eventData.endsAt || undefined,
      timezone: eventData.timezone || 'Africa/Lagos',
      totalCapacity: totalCapacity > 0 ? totalCapacity : undefined,
      tags: eventData.tags?.length ? eventData.tags : undefined,
      dressCode: eventData.dressCode || undefined,
      ageRestriction: eventData.ageRestriction || undefined,
      refundPolicy: eventData.refundPolicy || undefined,
      artisteIds: registeredArtistIds.length > 0 ? registeredArtistIds : undefined,
      featuredArtists: customFeaturedArtists.length > 0 ? customFeaturedArtists : undefined,
      artists: customFeaturedArtists.length > 0 ? customFeaturedArtists : undefined,
      ticketPricingTiers: normalizedTiers,
      ticketTiers: normalizedTiers,
      sponsors: [],
      faqs: [],
      saveAsDraft: isDraft,
      publish: !isDraft,
      status: isDraft ? 'draft' : 'published',
    };
  };

  const handleSaveDraft = async () => {
    if (isSavingDraft) return;
    setIsSavingDraft(true);
    try {
      const payload = await buildEventPayload(true);
      if (params.eventId) {
        await eventService.saveAndContinueEvent(params.eventId, payload);
      } else {
        await eventService.createEvent(payload);
      }
      router.push('/dashboard');
    } catch (err) {
      console.warn('Save draft failed:', err);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // ── Publish — routes to correct API endpoint based on type ─────────────────
  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      if (eventData.virtualEvent) {
        // POST /live-streams
        const res = await eventService.createLiveStream({
          title: eventData.title,
          coverUrl: eventData.imageUrl,
          category: eventData.category,
          privacy: eventData.liveStreamPrivacy,
          ticketPrice: eventData.liveStreamTicketPrice > 0 ? eventData.liveStreamTicketPrice : undefined,
        });
        const streamId = res?.liveStream?.id || res?.id || res?.stream?.id || res?.data?.liveStream?.id;
        router.push({ pathname: '/go-live-preview', params: streamId ? { id: streamId } : undefined });
        return;
      } else {
        const payload = await buildEventPayload(false);
        if (params.eventId) {
          await eventService.updateEvent(params.eventId, payload);
        } else {
          await eventService.createEvent({
            ...payload,
            imageUrl: eventData.imageUrl, // keep original local URI for createEvent to handle multi-part if needed
          });
        }
      }
      setStep('published');
    } catch (err) {
      console.warn('Publish failed:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      {step === 'type_selection' && (
        <CreateEventStep1 onBack={handleBack} onContinue={handleContinueFromStep1} />
      )}
      {step === 'details' && !eventData.virtualEvent && (
        <CreateEventStep2Physical onBack={handleBack} onContinue={handleContinueFromStep2} onOpenDatePicker={handleOpenDatePicker} />
      )}
      {step === 'details' && eventData.virtualEvent && (
        <CreateEventStep2Livestream onBack={handleBack} onContinue={handleContinueFromStep2} />
      )}
      {step === 'tickets' && (
        <CreateEventStep3 onBack={handleBack} onContinue={handleContinueFromStep3} />
      )}
      {step === 'preview' && (
        <CreateEventPreview
          onBack={handleBack}
          onPublish={handlePublish}
          isPublishing={isPublishing}
          onSaveDraft={handleSaveDraft}
          isSavingDraft={isSavingDraft}
        />
      )}
      {step === 'published' && (
        <CreateEventStep4 onHome={onFinish} />
      )}
      {step === 'date_picker' && (
        <CreateEventDatePicker onBack={handleBack} onConfirm={handleConfirmDate} />
      )}
    </View>
  );
};

const CreateEventMain = ({ onFinish }: { onFinish: () => void }) => {
  return (
    <CreateEventProvider>
      <CreateEventInner onFinish={onFinish} />
    </CreateEventProvider>
  );
};

export default CreateEventMain;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
