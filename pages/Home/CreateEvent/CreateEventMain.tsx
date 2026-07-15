import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
    updateEventData({ virtualEvent: type === 'livestream' });
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

  // ── Publish — routes to correct API endpoint based on type ─────────────────
  const handlePublish = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      if (eventData.virtualEvent) {
        // POST /live-streams
        await eventService.createLiveStream({
          title: eventData.title,
          coverUrl: eventData.imageUrl,
          category: eventData.category,
          privacy: eventData.liveStreamPrivacy,
          ticketPrice: eventData.liveStreamTicketPrice > 0 ? eventData.liveStreamTicketPrice : undefined,
        });
      } else {
        // POST /events  — map context fields → exact API fields
        const payload = {
          title: eventData.title,
          description: eventData.description,
          category: eventData.category,
          imageUrl: eventData.imageUrl,
          eventPosterUrl: eventData.imageUrl,
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
          artistes: [],
          sponsors: [],
          faqs: [],
        };
        await eventService.createEvent(payload);
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
        <CreateEventPreview onBack={handleBack} onPublish={handlePublish} isPublishing={isPublishing} />
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
