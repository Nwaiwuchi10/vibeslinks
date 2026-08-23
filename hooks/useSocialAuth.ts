import { useState, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { router } from 'expo-router';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';
import { ssoService, SsoProfileData } from '@/services/ssoService';
import { APP_CONFIG } from '@/services/apiClient';

// Required so the in-app browser closes properly after redirect.
WebBrowser.maybeCompleteAuthSession();

// ─── Direct App Config from apiClient (Embedded for Native Builds) ───────────
const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  APP_CONFIG.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  APP_CONFIG.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  GOOGLE_WEB_CLIENT_ID;
const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
  APP_CONFIG.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ||
  GOOGLE_WEB_CLIENT_ID;
const FACEBOOK_APP_ID =
  process.env.EXPO_PUBLIC_FACEBOOK_APP_ID ||
  APP_CONFIG.EXPO_PUBLIC_FACEBOOK_APP_ID;
const APPLE_SERVICE_ID =
  process.env.EXPO_PUBLIC_APPLE_SERVICE_ID ||
  APP_CONFIG.EXPO_PUBLIC_APPLE_SERVICE_ID;

/** Redirect URI derived from the app scheme in app.json ("myapp"). */
const REDIRECT_URI = makeRedirectUri({ scheme: 'myapp' });

type AuthMode = 'signup' | 'login';

interface UseSocialAuthOptions {
  mode: AuthMode;
}

export function useSocialAuth({ mode }: UseSocialAuthOptions) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  // ─── Google ───────────────────────────────────────────────────────────────
  const [_googleRequest, _googleResponse, promptGoogleAsync] =
    Google.useIdTokenAuthRequest({
      clientId: GOOGLE_WEB_CLIENT_ID,
      webClientId: GOOGLE_WEB_CLIENT_ID,
      iosClientId: GOOGLE_IOS_CLIENT_ID,
      androidClientId: GOOGLE_ANDROID_CLIENT_ID,
      redirectUri: REDIRECT_URI,
    });

  const handleGoogleAuth = useCallback(async () => {
    if (!GOOGLE_WEB_CLIENT_ID || GOOGLE_WEB_CLIENT_ID.startsWith('YOUR_')) {
      dispatch(
        showToast({
          type: 'error',
          message:
            'Google OAuth client ID is not configured.',
        }),
      );
      return;
    }

    try {
      setLoading(true);
      const result = await promptGoogleAsync();

      if (result?.type === 'dismiss' || result?.type === 'cancel') {
        return;
      }

      if (result?.type !== 'success') {
        dispatch(
          showToast({ type: 'error', message: 'Google sign-in failed. Please try again.' }),
        );
        return;
      }

      const idToken = (result as any).params?.id_token;

      if (!idToken) {
        dispatch(
          showToast({
            type: 'error',
            message:
              'Google did not return an ID token. Check client ID and scopes.',
          }),
        );
        return;
      }

      if (mode === 'signup') {
        await ssoService.signUpWithSso('google', idToken, undefined, true);
        router.replace('/(onboarding)/interests' as any);
      } else {
        await ssoService.signInWithSso('google', idToken);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('[useSocialAuth] Google error:', err);
      dispatch(
        showToast({
          type: 'error',
          message: err?.response?.data?.message || 'Google sign-in encountered an error.',
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [promptGoogleAsync, mode, dispatch]);

  // ─── Facebook ─────────────────────────────────────────────────────────────
  const [_fbRequest, _fbResponse, promptFacebookAsync] =
    Facebook.useAuthRequest({
      clientId: FACEBOOK_APP_ID,
      redirectUri: REDIRECT_URI,
    });

  const handleFacebookAuth = useCallback(async () => {
    if (!FACEBOOK_APP_ID || FACEBOOK_APP_ID.startsWith('YOUR_')) {
      dispatch(
        showToast({
          type: 'error',
          message: 'Facebook App ID is not configured.',
        }),
      );
      return;
    }

    try {
      setLoading(true);
      const result = await promptFacebookAsync();

      if (result?.type === 'dismiss' || result?.type === 'cancel') {
        return;
      }

      if (result?.type !== 'success') {
        dispatch(
          showToast({ type: 'error', message: 'Facebook sign-in failed. Please try again.' }),
        );
        return;
      }

      const accessToken = (result as any).params?.access_token;

      if (!accessToken) {
        dispatch(
          showToast({
            type: 'error',
            message: 'Facebook did not return an access token.',
          }),
        );
        return;
      }

      if (mode === 'signup') {
        await ssoService.signUpWithSso('facebook', accessToken, undefined, true);
        router.replace('/(onboarding)/interests' as any);
      } else {
        await ssoService.signInWithSso('facebook', accessToken);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('[useSocialAuth] Facebook error:', err);
      dispatch(
        showToast({
          type: 'error',
          message: err?.response?.data?.message || 'Facebook sign-in encountered an error.',
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [promptFacebookAsync, mode, dispatch]);

  // ─── Apple ────────────────────────────────────────────────────────────────
  const handleAppleAuth = useCallback(async () => {
    try {
      setLoading(true);

      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (isAvailable) {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        const identityToken = credential.identityToken;
        if (!identityToken) {
          dispatch(
            showToast({
              type: 'error',
              message: 'Apple authentication did not return an identity token.',
            }),
          );
          return;
        }

        const firstName = credential.fullName?.givenName || undefined;
        const lastName = credential.fullName?.familyName || undefined;
        const fullName =
          [firstName, lastName].filter(Boolean).join(' ') || undefined;
        const email = credential.email || undefined;

        const profileData: SsoProfileData = {
          fullName,
          firstName,
          lastName,
          email,
        };

        if (mode === 'signup') {
          await ssoService.signUpWithSso('apple', identityToken, profileData, true);
          router.replace('/(onboarding)/interests' as any);
        } else {
          await ssoService.signInWithSso('apple', identityToken, profileData);
          router.replace('/(tabs)');
        }
      } else {
        // Fallback for devices without native Apple Auth API
        dispatch(
          showToast({
            type: 'info',
            message: 'Sign in with Apple is available on iOS devices.',
          }),
        );
      }
    } catch (err: any) {
      if (err?.code === 'ERR_REQUEST_CANCELED' || err?.code === '1001') {
        // User cancelled Apple sign-in sheet
        return;
      }
      console.error('[useSocialAuth] Apple error:', err);
      dispatch(
        showToast({
          type: 'error',
          message: err?.response?.data?.message || 'Apple sign-in encountered an error.',
        }),
      );
    } finally {
      setLoading(false);
    }
  }, [mode, dispatch]);

  return {
    promptGoogleSignUp: handleGoogleAuth,
    promptGoogleSignIn: handleGoogleAuth,
    promptFacebookSignUp: handleFacebookAuth,
    promptFacebookSignIn: handleFacebookAuth,
    promptAppleSignUp: handleAppleAuth,
    promptAppleSignIn: handleAppleAuth,
    loading,
  };
}
