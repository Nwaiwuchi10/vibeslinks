/**
 * ssoService.ts
 *
 * Handles all social sign-on (SSO) API calls for Google and Facebook.
 *
 * SSO Signup  → POST /users/signup/sso  (requires acceptedTerms: true)
 * SSO Sign-in → POST /auth/sign-in/sso
 *
 * Both endpoints return `access_token` immediately — no separate verification step.
 *
 * Google payload uses  { provider: 'google', credential: <ID_TOKEN> }
 * Facebook payload uses { provider: 'facebook', accessToken: <ACCESS_TOKEN> }
 */

import { apiClient } from './apiClient';
import { setCredentials } from '@/store/slices/authSlice';
import { store } from '@/store';
import { showToast } from '@/store/slices/toastSlice';
import * as Location from 'expo-location';

export type SsoProvider = 'google' | 'facebook' | 'apple';

export interface SsoProfileData {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  pictureUrl?: string;
}

/** Build the provider-specific token payload. */
function buildProviderPayload(
  provider: SsoProvider,
  token: string,
  extra?: SsoProfileData,
): Record<string, any> {
  const base: Record<string, any> = {
    ...(extra?.fullName ? { fullName: extra.fullName } : {}),
    ...(extra?.firstName ? { firstName: extra.firstName } : {}),
    ...(extra?.lastName ? { lastName: extra.lastName } : {}),
    ...(extra?.email ? { email: extra.email } : {}),
    ...(extra?.pictureUrl ? { pictureUrl: extra.pictureUrl } : {}),
  };

  switch (provider) {
    case 'google':
      return { ...base, credential: token, idToken: token };
    case 'facebook':
      return { ...base, accessToken: token };
    case 'apple':
      return { ...base, identityToken: token, credential: token };
    default:
      return { ...base, credential: token };
  }
}

export const ssoService = {
  /**
   * Create or link a social account.
   * Call this from the Signup screen.
   * On success the backend returns `access_token` immediately.
   */
  async signUpWithSso(
    provider: SsoProvider,
    providerToken: string,
    extra?: SsoProfileData,
    acceptedTerms: boolean = true,
  ) {
    const payload = {
      provider,
      ...buildProviderPayload(provider, providerToken, extra),
      acceptedTerms,
    };

    const response = await apiClient.post('/users/signup/sso', payload);
    const data = response.data;

    const token: string | undefined =
      data?.access_token ?? data?.token ?? data?.accessToken;

    if (token) {
      store.dispatch(
        setCredentials({
          token,
          user: data.user ?? {},
        }),
      );
      store.dispatch(
        showToast({
          type: 'success',
          message: data?.message || 'Signed up successfully!',
        }),
      );
    }

    return data;
  },

  /**
   * Sign in an existing social-linked account (or auto-provision if new).
   * Call this from the Login screen.
   * On success the backend returns `access_token` immediately.
   */
  async signInWithSso(
    provider: SsoProvider,
    providerToken: string,
    extra?: SsoProfileData,
  ) {
    let latitude: number | undefined;
    let longitude: number | undefined;
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        latitude = loc.coords.latitude;
        longitude = loc.coords.longitude;
      }
    } catch (err) {
      console.warn('[ssoService] Location request failed:', err);
    }

    const payload = {
      provider,
      ...buildProviderPayload(provider, providerToken, extra),
      latitude,
      longitude,
    };

    const response = await apiClient.post('/auth/sign-in/sso', payload);
    const data = response.data;

    const token: string | undefined =
      data?.access_token ?? data?.token ?? data?.accessToken;

    if (token) {
      store.dispatch(
        setCredentials({
          token,
          user: data.user ?? {},
        }),
      );
      store.dispatch(
        showToast({
          type: 'success',
          message: data?.message || 'Logged in successfully!',
        }),
      );
    }

    return data;
  },
};
