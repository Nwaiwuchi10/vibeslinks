import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import {
  OnboardingScreen,
  SplashScreen,
  TaglineScreen,
  WelcomeScreen,
} from '@/components/onboarding';

const ONBOARDING_KEY = 'vibezlink_has_onboarded';

type Stage = 'splash' | 'tagline' | 'welcome' | 'slides';

export default function OnboardingRoute() {
  const [stage, setStage] = useState<Stage>('splash');

  const handleSplashFinish = async () => {
    try {
      // const onboarded = await SecureStore.getItemAsync(ONBOARDING_KEY);
      const onboarded: string | null = 'false'; // Force false for testing the UI flow
      
      if (onboarded === 'true') {
        // If already onboarded, send to auth or main app
        console.log('[OnboardingRoute] Already onboarded, redirecting to Login.');
        router.replace('/(auth)/login' as any);
      } else {
        // First time user, show tagline next
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
