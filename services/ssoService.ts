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

export type SsoProvider = 'google' | 'facebook' | 'apple';

/** Build the provider-specific token payload. */
function buildProviderPayload(
  provider: SsoProvider,
  token: string,
): Record<string, string> {
  switch (provider) {
    case 'google':
      // Google Identity Services returns a credential (ID token JWT).
      return { credential: token };
    case 'facebook':
      // Facebook SDK returns an access token.
      return { accessToken: token };
    case 'apple':
      // Apple returns an identityToken.
      return { identityToken: token };
    default:
      return { credential: token };
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
    acceptedTerms: boolean = true,
  ) {
    const payload = {
      provider,
      ...buildProviderPayload(provider, providerToken),
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
   * Sign in an existing social-linked account.
   * Call this from the Login screen.
   * On success the backend returns `access_token` immediately.
   */
  async signInWithSso(provider: SsoProvider, providerToken: string) {
    const payload = {
      provider,
      ...buildProviderPayload(provider, providerToken),
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
        showToast({ type: 'success', message: 'Logged in successfully!' }),
      );
    }

    return data;
  },
};
