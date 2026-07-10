import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CreateEventStep1 from './CreateEventStep1';
import CreateEventStep2 from './CreateEventStep2';
import CreateEventStep3 from './CreateEventStep3';
import CreateEventPreview from './CreateEventPreview';
import CreateEventStep4 from './CreateEventStep4';
import CreateEventDatePicker from './CreateEventDatePicker';

import { eventService } from '@/services/eventService';

type CreateEventState = 'type_selection' | 'details' | 'tickets' | 'preview' | 'published' | 'date_picker';

const CreateEventMain = ({ onFinish }: { onFinish: () => void }) => {
  const [state, setState] = useState<CreateEventState>('type_selection');
  const [prevState, setPrevState] = useState<CreateEventState>('type_selection');


  const handleBack = () => {
    if (state === 'type_selection') {
      onFinish();
    } else if (state === 'details') {
      setState('type_selection');
    } else if (state === 'tickets') {
      setState('details');
    } else if (state === 'preview') {
      setState('tickets');
    } else if (state === 'date_picker') {
      setState(prevState);
    }
  };

  const handleContinueFromStep1 = (type: 'physical' | 'livestream') => {
    setState('details');
  };

  const handleContinueFromStep2 = () => {
    setState('tickets');
  };

  const handleOpenDatePicker = () => {
    setPrevState(state);
    setState('date_picker');
  };

  const handleConfirmDate = () => {
    setState(prevState);
  };

  const handleContinueFromStep3 = () => {
    setState('preview');
  };

  const handlePublish = async () => {
    try {
      await eventService.createEvent({
        title: 'AFRO VIBES FESTIVAL 2026',
        imageUrl: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600',
        description: 'Experience the biggest Afrobeat nightlife event with live DJs, celebrity appearances, and exclusive performances.',
        category: 'concert',
        virtualEvent: false,
        location: 'Awoyaya, Ibeju Lekki Lagos Nigeria',
        venue: 'Jafa Hotel',
        venueLocation: {
          address: 'Awoyaya, Ibeju Lekki',
          city: 'Lagos',
          country: 'Nigeria',
          latitude: 6.4474,
          longitude: 3.4553,
        },
        startDateTime: new Date('2026-05-29T21:00:00.000Z').toISOString(),
        endDateTime: new Date('2026-05-30T04:00:00.000Z').toISOString(),
        timezone: 'Africa/Lagos',
        totalCapacity: 5000,
        ticketPricingTiers: [
          {
            tierName: 'VIP',
            currency: 'NGN',
            price: 20, // ₦20,000 represented in backend base or normal price format
            description: 'Lounge access, Free drinks, Priority entry',
            capacity: 500,
          }
        ],
        publish: true,
      });
      setState('published');
    } catch (err) {
      // apiClient handles toasts
    }
  };


  return (
    <View style={styles.container}>
      {state === 'type_selection' && (
        <CreateEventStep1 onBack={handleBack} onContinue={handleContinueFromStep1} />
      )}
      {state === 'details' && (
        <CreateEventStep2 onBack={handleBack} onContinue={handleContinueFromStep2} onOpenDatePicker={handleOpenDatePicker} />
      )}
      {state === 'tickets' && (
        <CreateEventStep3 onBack={handleBack} onContinue={handleContinueFromStep3} />
      )}
      {state === 'preview' && (
        <CreateEventPreview onBack={handleBack} onPublish={handlePublish} />
      )}
      {state === 'published' && (
        <CreateEventStep4 onHome={onFinish} />
      )}
      {state === 'date_picker' && (
        <CreateEventDatePicker onBack={handleBack} onConfirm={handleConfirmDate} />
      )}
    </View>
  );
};

export default CreateEventMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
