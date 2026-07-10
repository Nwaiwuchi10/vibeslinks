import { apiClient } from './apiClient';
import { setCredentials, clearCredentials } from '@/store/slices/authSlice';
import { store } from '@/store';
import { showToast } from '@/store/slices/toastSlice';

export const authService = {
  async signIn(emailOrUsername: string, password: string) {
    const response = await apiClient.post('/auth/sign-in', {
      emailOrUsername,
      password,
    });
    const token = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (token) {
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
    const response = await apiClient.post('/auth/sign-in/phone', {
      phoneNumber,
      countryCode,
      password,
    });
    const token = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (token) {
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

  async signInWithSso(provider: string, providerUserId: string, email: string) {
    const response = await apiClient.post('/auth/sign-in/sso', {
      provider,
      providerUserId,
      email,
    });
    const token = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (token) {
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
