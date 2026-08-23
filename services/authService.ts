import { apiClient } from './apiClient';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';
import { store } from '@/store';
import { showToast } from '@/store/slices/toastSlice';
import * as Location from 'expo-location';

export const authService = {
  async signIn(emailOrUsername: string, password: string) {
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
      console.warn('[authService] Location request failed:', err);
    }

    const response = await apiClient.post('/auth/sign-in', {
      emailOrUsername,
      password,
      latitude,
      longitude,
    });
    const token = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (token) {
      console.log('\n\n======================================================');
      console.log('✨ FRESH ACCESS TOKEN (Copy below this line):');
      console.log(token);
      console.log('======================================================\n\n');
      
      store.dispatch(
        setCredentials({
          token,
          user: response.data.user || {},
        })
      );
      store.dispatch(showToast({ type: 'success', message: 'Logged in successfully' }));
    }
    return response.data;
  },

  async signInWithPhone(phoneNumber: string, countryCode: string, password: string) {
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
      console.warn('[authService] Location request failed:', err);
    }

    const response = await apiClient.post('/auth/sign-in/phone', {
      phoneNumber,
      countryCode,
      password,
      latitude,
      longitude,
    });
    const token = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (token) {
      console.log('\n\n======================================================');
      console.log('✨ FRESH ACCESS TOKEN (Copy below this line):');
      console.log(token);
      console.log('======================================================\n\n');

      store.dispatch(
        setCredentials({
          token,
          user: response.data.user || {},
        })
      );
      store.dispatch(showToast({ type: 'success', message: 'Logged in successfully' }));
    }
    return response.data;
  },

  /**
   * Sign in with a real SSO provider token.
   *
   * Google  → pass the ID-token JWT as `token`  (field name: `credential`)
   * Facebook → pass the access token as `token`  (field name: `accessToken`)
   *
   * For the full SSO signup+login flow use `ssoService` directly.
   */
  async signInWithSso(
    provider: string,
    token: string,
    latitude?: number,
    longitude?: number,
  ) {
    // Build the correct payload for each provider.
    let providerPayload: Record<string, string>;
    if (provider === 'facebook') {
      providerPayload = { accessToken: token };
    } else if (provider === 'apple') {
      providerPayload = { identityToken: token };
    } else {
      // google (and any future OIDC provider)
      providerPayload = { credential: token };
    }

    const response = await apiClient.post('/auth/sign-in/sso', {
      provider,
      ...providerPayload,
      latitude,
      longitude,
    });
    const accessToken = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (accessToken) {
      store.dispatch(
        setCredentials({
          token: accessToken,
          user: response.data.user || {},
        })
      );
      store.dispatch(showToast({ type: 'success', message: 'Logged in successfully' }));
    }
    return response.data;
  },


  async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    store.dispatch(
      showToast({ type: 'success', message: 'Password reset code sent to your email.' })
    );
    return response.data;
  },

  async forgotPasswordWithPhone(phoneNumber: string, countryCode: string) {
    const response = await apiClient.post('/auth/forgot-password/phone', {
      phoneNumber,
      countryCode,
    });
    store.dispatch(
      showToast({ type: 'success', message: 'Password reset code sent to your phone.' })
    );
    return response.data;
  },

  async resetPassword(token: string, oldPassword: string, newPassword: string) {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      oldPassword,
      newPassword,
    });
    store.dispatch(
      showToast({ type: 'success', message: 'Password reset successfully. Please login.' })
    );
    return response.data;
  },

  async resetPasswordWithPhone(phoneNumber: string, countryCode: string, code: string, newPassword: string) {
    const response = await apiClient.post('/auth/reset-password/phone', {
      phoneNumber,
      countryCode,
      code,
      newPassword,
    });
    store.dispatch(
      showToast({ type: 'success', message: 'Password reset successfully. Please login.' })
    );
    return response.data;
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout');
    } catch (err) {
      console.warn('Backend logout failed or not available, clearing local credentials anyway.', err);
    } finally {
      store.dispatch(clearCredentials());
    }
  },
};
