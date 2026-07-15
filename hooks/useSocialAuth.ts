/**
 * useSocialAuth.ts
 *
 * React hooks for Google and Facebook OAuth on mobile using
 * expo-auth-session v7 (bundled with Expo SDK 54).
 *
 * ─── Google setup ────────────────────────────────────────────────────────────
 * 1. Go to https://console.cloud.google.com → APIs & Services → Credentials
 * 2. Create three OAuth 2.0 Client IDs:
 *      Type               | Notes
 *      ─────────────────────────────────────────────────────────────────────
 *      Web application    | Authorized redirect URIs → add: myapp://
 *      Android            | Package name: com.nwaiwuchi10.vibeslinks
 *      iOS                | Bundle ID:   com.nwaiwuchi10.vibeslinks
 * 3. Paste all three client IDs in the constants below.
 *
 * ─── Facebook setup ──────────────────────────────────────────────────────────
 * 1. Go to https://developers.facebook.com → Your App → App Settings → Basic
 * 2. Copy the App ID and paste below.
 * 3. In Facebook Login > Settings, add   myapp://   to Valid OAuth Redirect URIs.
 *
 * ─── Redirect URI ────────────────────────────────────────────────────────────
 * The redirect URI is built from the "scheme" in app.json ("myapp").
 * It will look like:  myapp://
 * Register exactly that string in both Google Cloud Console and Facebook Dev.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useCallback } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';
import { router } from 'expo-router';
import { useAppDispatch } from '@/store/hooks';
import { showToast } from '@/store/slices/toastSlice';
import { ssoService } from '@/services/ssoService';

// Required so the in-app browser closes properly after redirect.
WebBrowser.maybeCompleteAuthSession();

// ─── PASTE YOUR REAL CREDENTIALS HERE ────────────────────────────────────────
const GOOGLE_WEB_CLIENT_ID     = 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID     = 'YOUR_GOOGLE_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID = 'YOUR_GOOGLE_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const FACEBOOK_APP_ID          = 'YOUR_FACEBOOK_APP_ID';
// ─────────────────────────────────────────────────────────────────────────────

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
  // useIdTokenAuthRequest returns the Google ID token directly in
  // result.params.id_token — this is the token the backend expects as
  // { provider: 'google', credential: <id_token> }.
  const [_googleRequest, _googleResponse, promptGoogleAsync] =
    Google.useIdTokenAuthRequest(
      {
        webClientId: GOOGLE_WEB_CLIENT_ID,
        iosClientId: GOOGLE_IOS_CLIENT_ID,
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        redirectUri: REDIRECT_URI,
      },
    );

  const handleGoogleAuth = useCallback(async () => {
    // Guard: show helpful error instead of a cryptic Google 400 page.
    if (GOOGLE_WEB_CLIENT_ID.startsWith('YOUR_')) {
      dispatch(
        showToast({
          type: 'error',
          message:
            'Google is not configured yet. Open hooks/useSocialAuth.ts and replace the placeholder client IDs.',
        }),
      );
      return;
    }

    try {
      setLoading(true);
      const result = await promptGoogleAsync();

      if (result?.type === 'dismiss' || result?.type === 'cancel') {
        // User dismissed voluntarily — no toast
        return;
      }

      if (result?.type !== 'success') {
        dispatch(
          showToast({ type: 'error', message: 'Google sign-in failed. Please try again.' }),
        );
        return;
      }

      // useIdTokenAuthRequest puts the ID token in result.params.id_token
      const idToken = (result as any).params?.id_token;

      if (!idToken) {
        dispatch(
          showToast({
            type: 'error',
            message:
              'Google did not return an ID token. Check that the Web client ID is correct and openid scope is enabled.',
          }),
        );
        return;
      }

      if (mode === 'signup') {
        await ssoService.signUpWithSso('google', idToken, true);
        router.replace('/(onboarding)/interests' as any);
      } else {
        await ssoService.signInWithSso('google', idToken);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('[useSocialAuth] Google error:', err);
      dispatch(
        showToast({ type: 'error', message: 'Google sign-in encountered an error.' }),
      );
    } finally {
      setLoading(false);
    }
  }, [promptGoogleAsync, mode, dispatch]);

  // ─── Facebook ─────────────────────────────────────────────────────────────
  const [_fbRequest, _fbResponse, promptFacebookAsync] =
    Facebook.useAuthRequest(
      {
        clientId: FACEBOOK_APP_ID,
        redirectUri: REDIRECT_URI,
      },
    );

  const handleFacebookAuth = useCallback(async () => {
    if (FACEBOOK_APP_ID.startsWith('YOUR_')) {
      dispatch(
        showToast({
          type: 'error',
          message:
            'Facebook is not configured yet. Open hooks/useSocialAuth.ts and replace the placeholder App ID.',
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

      // Facebook returns the access token in result.params.access_token
      const accessToken = (result as any).params?.access_token;

      if (!accessToken) {
        dispatch(
          showToast({
            type: 'error',
            message:
              'Facebook did not return an access token. Check your Facebook App configuration.',
          }),
        );
        return;
      }

      if (mode === 'signup') {
        await ssoService.signUpWithSso('facebook', accessToken, true);
        router.replace('/(onboarding)/interests' as any);
      } else {
        await ssoService.signInWithSso('facebook', accessToken);
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      console.error('[useSocialAuth] Facebook error:', err);
      dispatch(
        showToast({ type: 'error', message: 'Facebook sign-in encountered an error.' }),
      );
    } finally {
      setLoading(false);
    }
  }, [promptFacebookAsync, mode, dispatch]);

  return {
    promptGoogleSignUp: handleGoogleAuth,
    promptGoogleSignIn: handleGoogleAuth,
    promptFacebookSignUp: handleFacebookAuth,
    promptFacebookSignIn: handleFacebookAuth,
    loading,
  };
}
