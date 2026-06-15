import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Home from './HomePage/Home';
import StreamScreen from './Stream/StreamScreen';
import CreateEventMain from './CreateEvent/CreateEventMain';

type HomeState = 'home' | 'stream' | 'create_event';

const HomeMain = () => {
  const [state, setState] = useState<HomeState>('home');

  const handleOpenStream = () => setState('stream');
  const handleBackToHome = () => setState('home');
  const handleOpenCreateEvent = () => setState('create_event');
  const handleFinishCreateEvent = () => setState('stream');

  return (
    <View style={styles.container}>
      {state === 'home' && (
        <Home onOpenStream={handleOpenStream} />
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
