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
          updateEventData({
            title: evt.title || '',
            description: evt.description || '',
            category: evt.category || '',
            imageUrl: evt.imageUrl || evt.eventPosterUrl || '',
            startsAt: evt.startsAt || '',
            endsAt: evt.endsAt || '',
            timezone: evt.timezone || 'Africa/Lagos',
            venue: evt.venue || '',
            location: evt.location || '',
            venueLocation: evt.venueLocation || { name: '', address: '', mapUrl: '', latitude: 0, longitude: 0 },
            ticketTiers: evt.ticketTiers || [],
            artisteIds: (evt.artistes || []).map((a: any) => a.id || a.userId || a._id),
            virtualEvent: evt.virtualEvent || false,
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
      if (onFinish) onFinish();
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

  const handleSaveDraft = async () => {
    if (isSavingDraft) return;
    setIsSavingDraft(true);
    try {
      const resolvedCoverUrl = await getPayloadImageUrl(eventData.imageUrl);
      const payload = {
        title: eventData.title || 'Untitled Draft',
        description: eventData.description,
        category: eventData.category,
        imageUrl: resolvedCoverUrl,
        eventPosterUrl: resolvedCoverUrl,
        location: eventData.location,
        venue: eventData.venue,
        venueLocation: {
          name: eventData.venueLocation.name || eventData.venue,
          address: eventData.venueLocation.address || eventData.location,
          mapUrl: eventData.venueLocation.mapUrl || '',
          latitude: eventData.venueLocation.latitude,
          longitude: eventData.venueLocation.longitude,
        },
        virtualEvent: false,
        startsAt: eventData.startsAt,
        endsAt: eventData.endsAt,
        timezone: eventData.timezone,
        totalCapacity: eventData.totalCapacity,
        tags: eventData.tags,
        dressCode: eventData.dressCode || undefined,
        ageRestriction: eventData.ageRestriction || undefined,
        refundPolicy: eventData.refundPolicy || undefined,
        ticketTiers: eventData.ticketTiers,
        artistes: (eventData.artisteIds || []).map(id => ({ id })),
        sponsors: [],
        faqs: [],
        publish: false, // Save as draft
      };
      if (params.eventId) {
        await eventService.updateEvent(params.eventId, payload);
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
        const resolvedCoverUrl = await getPayloadImageUrl(eventData.imageUrl);
        const payload = {
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          imageUrl: resolvedCoverUrl,
          eventPosterUrl: resolvedCoverUrl,
          location: eventData.location,
          venue: eventData.venue,
          venueLocation: {
            name: eventData.venueLocation.name || eventData.venue,
            address: eventData.venueLocation.address || eventData.location,
            mapUrl: eventData.venueLocation.mapUrl || '',
            latitude: eventData.venueLocation.latitude,
            longitude: eventData.venueLocation.longitude,
          },
          virtualEvent: false,
          startsAt: eventData.startsAt,
          endsAt: eventData.endsAt,
          timezone: eventData.timezone,
          totalCapacity: eventData.totalCapacity,
          tags: eventData.tags,
          dressCode: eventData.dressCode || undefined,
          ageRestriction: eventData.ageRestriction || undefined,
          refundPolicy: eventData.refundPolicy || undefined,
          ticketTiers: eventData.ticketTiers,
          artistes: (eventData.artisteIds || []).map(id => ({ id })),
          sponsors: [],
          faqs: [],
        };
        if (params.eventId) {
          await eventService.updateEvent(params.eventId, payload);
        } else {
          await eventService.createEvent({
            ...payload,
            imageUrl: eventData.imageUrl, // keep original local URI for createEvent to handle multi-part
          });
        }
      }
      setStep('published');
    } catch (err) {
      // Toast handled by apiClient interceptor
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
