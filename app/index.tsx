import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useAppSelector } from '@/store/hooks';

import {
  OnboardingScreen,
  SplashScreen,
  TaglineScreen,
  WelcomeScreen,
} from '@/components/onboarding';

const TOKEN_KEY = 'vibezlink_access_token';
const ONBOARDING_KEY = 'vibezlink_has_onboarded';

type Stage = 'splash' | 'tagline' | 'welcome' | 'slides';

export default function OnboardingRoute() {
  const [stage, setStage] = useState<Stage>('splash');

  // Also watch Redux – if _layout.tsx restores credentials while splash is running,
  // the isAuthenticated flag will flip and we can react immediately.
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  // If auth state flips to true at any point during the splash/onboarding flow, go to home
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)' as any);
    }
  }, [isAuthenticated]);

  const handleSplashFinish = async () => {
    try {
      // 1. Check for an existing access token first
      const savedToken = await SecureStore.getItemAsync(TOKEN_KEY);
      if (savedToken) {
        // Token exists → user is already logged in → go straight to home
        console.log('[OnboardingRoute] Token found, redirecting to Home.');
        router.replace('/(tabs)' as any);
        return;
      }

      // 2. No token – check if they've seen onboarding before
      const onboarded = await SecureStore.getItemAsync(ONBOARDING_KEY);
      if (onboarded === 'true') {
        // Seen onboarding but not logged in → go to login
        console.log('[OnboardingRoute] Already onboarded, redirecting to Login.');
        router.replace('/(auth)/login' as any);
      } else {
        // Brand new user → show tagline → welcome → slides
        setStage('tagline');
      }
    } catch (error) {
      console.error('[OnboardingRoute] Redirection error:', error);
      setStage('tagline');
    }
  };

  const handleTaglineFinish = () => {
    setStage('welcome');
  };

  const handleWelcomeGetStarted = () => {
    setStage('slides');
  };

  const handleWelcomeSignIn = () => {
    router.replace('/(auth)/login' as any);
  };

  const handleOnboardingDone = async () => {
    try {
      await SecureStore.setItemAsync(ONBOARDING_KEY, 'true');
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.replace('/(auth)/signup' as any);
    } catch (error) {
      console.error('[OnboardingRoute] Transition error:', error);
      router.replace('/(auth)/signup' as any);
    }
  };

  return (
    <View style={styles.container}>
      {stage === 'splash' && <SplashScreen onFinish={handleSplashFinish} />}
      {stage === 'tagline' && <TaglineScreen onFinish={handleTaglineFinish} />}
      {stage === 'welcome' && (
        <WelcomeScreen
          onGetStarted={handleWelcomeGetStarted}
          onSignIn={handleWelcomeSignIn}
        />
      )}
      {stage === 'slides' && <OnboardingScreen onDone={handleOnboardingDone} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111218',
  },
});
