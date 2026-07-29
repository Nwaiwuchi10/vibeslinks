import React, { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { Provider } from 'react-redux';
import * as SecureStore from 'expo-secure-store';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { store } from '@/store';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { restoredCredentials } from '@/store/slices/authSlice';
import { socketService } from '@/services/socketService';
import { Audio } from 'expo-av';
import ToastContainer from '@/components/ui/Toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const TOKEN_KEY = 'vibezlink_access_token';
const USER_KEY = 'vibezlink_user_info';

function AppContent() {
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();
  const { token, isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Configure audio mode for iOS silent switch bypass & background audio support
  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      allowsRecordingIOS: false,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    }).catch((err) => console.warn('[RootLayout] Error configuring Audio mode:', err));
  }, []);

  // Restore session token on app launch
  useEffect(() => {
    async function restoreSession() {
      try {
        const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const savedUserJson = await SecureStore.getItemAsync(USER_KEY);
        const savedUser = savedUserJson ? JSON.parse(savedUserJson) : null;
        
        dispatch(restoredCredentials({ token: savedToken, user: savedUser }));
      } catch (err) {
        console.error('[RootLayout] Error restoring authentication state:', err);
        dispatch(restoredCredentials({ token: null, user: null }));
      }
    }
    restoreSession();
  }, [dispatch]);

  // Handle WebSocket gateway connection based on auth token
  useEffect(() => {
    if (isAuthenticated && token) {
      socketService.connect(token, user?.id);
    } else {
      socketService.disconnect();
    }
    return () => {
      socketService.disconnect();
    };
  }, [token, isAuthenticated, user]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
      <ToastContainer />
      <LoadingSpinner />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

