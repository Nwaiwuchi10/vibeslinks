import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from 'expo-router';
import Home from './HomePage/Home';
import StreamScreen from './Stream/StreamScreen';
import CreateEventMain from './CreateEvent/CreateEventMain';

type HomeState = 'home' | 'stream' | 'create_event';

const HomeMain = () => {
  const [state, setState] = useState<HomeState>('home');
  const [refreshKey, setRefreshKey] = useState(0);
  const navigation = useNavigation();

  // Listen for tab press event on the Home tab to ensure clicking Home always resets to home screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress' as any, () => {
      setState('home');
      setRefreshKey((k) => k + 1);
    });
    return unsubscribe;
  }, [navigation]);

  // Refresh and ensure home view is shown every time the Home tab comes into focus
  useFocusEffect(
    useCallback(() => {
      setState('home');
      setRefreshKey((k) => k + 1);
    }, [])
  );

  const handleOpenStream = () => setState('stream');
  const handleBackToHome = () => setState('home');
  const handleOpenCreateEvent = () => setState('create_event');
  const handleFinishCreateEvent = () => setState('home');

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
