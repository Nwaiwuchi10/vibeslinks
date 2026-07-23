import React, { useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect } from 'expo-router';
import Home from './HomePage/Home';
import StreamScreen from './Stream/StreamScreen';
import CreateEventMain from './CreateEvent/CreateEventMain';

type HomeState = 'home' | 'stream' | 'create_event';

const HomeMain = () => {
  const [state, setState] = useState<HomeState>('home');
  const [refreshKey, setRefreshKey] = useState(0);

  // Silently refresh home feed data every time this tab comes into focus
  useFocusEffect(
    useCallback(() => {
      // Only bump key when we're on the home view (not mid-stream / mid-create-event)
      if (state === 'home') {
        setRefreshKey((k) => k + 1);
      }
    }, [state])
  );

  const handleOpenStream = () => setState('stream');
  const handleBackToHome = () => setState('home');
  const handleOpenCreateEvent = () => setState('create_event');
  const handleFinishCreateEvent = () => setState('stream');

  return (
    <View style={styles.container}>
      {state === 'home' && (
        <Home onOpenStream={handleOpenStream} refreshKey={refreshKey} />
      )}
      {state === 'stream' && (
        <StreamScreen
          onBack={handleBackToHome}
          onCreateEventPress={handleOpenCreateEvent}
        />
      )}
      {state === 'create_event' && (
        <CreateEventMain onFinish={handleFinishCreateEvent} />
      )}
    </View>
  );
};

export default HomeMain;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
