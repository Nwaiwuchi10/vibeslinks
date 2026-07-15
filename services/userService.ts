import { apiClient } from './apiClient';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';
import { setCredentials } from '@/store/slices/authSlice';

export const userService = {
  // Figma Flow Register
  async register(data: {
    method: 'email' | 'phone' | 'google' | 'facebook' | 'apple';
    fullName: string;
    username: string;
    email?: string;
    phoneNumber?: string;
    password?: string;
    acceptedTerms: boolean;
    providerUserId?: string;
  }) {
    const response = await apiClient.post('/users/register', data);
    store.dispatch(showToast({ type: 'success', message: response.data?.message || 'Verification sent.' }));
    
    // Auto-authenticate if token is returned
    const token = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (token) {
      store.dispatch(
        setCredentials({
          token,
          user: response.data.user || {},
        })
      );
    }
    return response.data;
  },

  async verifyRegistration(data: {
    method: 'email' | 'phone';
    email?: string;
    phoneNumber?: string;
    code: string;
  }) {
    const response = await apiClient.post('/users/verify-registration', data);
    console.log('[userService] verifyRegistration response:', response.data);
    store.dispatch(showToast({ type: 'success', message: 'Account verified successfully!' }));
    // Auto-authenticate if token returned
    const token = response.data?.access_token || response.data?.token || response.data?.accessToken;
    if (token) {
      store.dispatch(
        setCredentials({
          token,
          user: response.data.user || {},
        })
      );
    }
    return response.data;
  },

  // Alternative flow signup
  async signup(data: any) {
    const response = await apiClient.post('/users/signup', data);
    store.dispatch(showToast({ type: 'success', message: response.data?.message || 'Verification email code sent.' }));
    return response.data;
  },

  async signupWithPhone(data: any) {
    const response = await apiClient.post('/users/signup/phone', data);
    store.dispatch(showToast({ type: 'success', message: response.data?.message || 'Verification text code sent.' }));
    return response.data;
  },

  async sendVerificationCode(email: string) {
    return (await apiClient.post('/users/verification-code', { email })).data;
  },

  async verifyEmailCode(email: string, code: string) {
    const response = await apiClient.post('/users/verify-email-code', { email, code });
    store.dispatch(showToast({ type: 'success', message: 'Email code verified.' }));
    return response.data;
  },

  async sendPhoneVerificationCode(phoneNumber: string, countryCode: string) {
    return (await apiClient.post('/users/phone-verification-code', { phoneNumber, countryCode })).data;
  },

  async verifyPhoneCode(phoneNumber: string, countryCode: string, code: string) {
    const response = await apiClient.post('/users/verify-phone-code', { phoneNumber, countryCode, code });
    store.dispatch(showToast({ type: 'success', message: 'Phone code verified.' }));
    return response.data;
  },

  async getCountries() {
    const response = await apiClient.get('/users/countries');
    return response.data;
  },

  async checkUsernameAvailability(username: string) {
    const response = await apiClient.get(`/users/username-availability?username=${username}`);
    return response.data; // { username, available }
  },

  async getMyOnboarding() {
    return (await apiClient.get('/users/me/onboarding')).data;
  },

  async patchMyOnboarding(step: number, completed: boolean) {
    // Backend expects step as a number (1–6), not a string.
    return (await apiClient.patch('/users/me/onboarding', { step, completed })).data;
  },

  async updateOnboardingData(data: any) {
    return (await apiClient.patch('/users/me/onboarding', data)).data;
  },

  async applyForHostRole(reason: string) {
    const response = await apiClient.post('/users/role-upgrade-requests', {
      requestedRole: 'host',
      reason,
    });
    store.dispatch(showToast({ type: 'success', message: 'Host application submitted successfully!' }));
    return response.data;
  },

  async followArtist(artistId: string) {
    try {
      // Try standard NestJS follow paths
      return (await apiClient.post(`/users/${artistId}/follow`)).data;
    } catch (err) {
      try {
        return (await apiClient.post('/users/follow', { artistId })).data;
      } catch (nestedErr) {
        console.warn('[userService] Follow artist endpoints not fully registered, simulated success.', nestedErr);
        return { success: true };
      }
    }
  },



  async updateProfile(profileData: {
    name?: string;
    bio?: string;
    username?: string;
    country?: string;
    profilePictureUrl?: string;
    interests?: string[];
    contactDetails?: {
      phone?: string;
      website?: string;
      location?: string;
    };
  }) {
    const response = await apiClient.patch('/users/me/profile', profileData);
    store.dispatch(showToast({ type: 'success', message: 'Profile updated successfully.' }));
    
    // Sync local Redux state with updated user details
    const currentUser = store.getState().auth.user || {};
    const updatedUser = response.data?.user || response.data || {};
    store.dispatch(
      setCredentials({
        token: store.getState().auth.token || '',
        user: { ...currentUser, ...updatedUser, ...profileData }, // merge current state, backend response, and request data
      })
    );
    return response.data;
  },


  async getSettings() {
    return (await apiClient.get('/users/me/settings')).data;
  },

  async updateSettings(settings: any) {
    const response = await apiClient.patch('/users/me/settings', settings);
    store.dispatch(showToast({ type: 'success', message: 'Settings updated.' }));
    return response.data;
  },

  async getWallet() {
    return (await apiClient.get('/users/me/wallet')).data;
  },

  async fundWallet(amount: number, paymentMethodId: string, paymentIntentId?: string) {
    const response = await apiClient.post('/users/me/wallet/fund', {
      amount,
      paymentMethodId,
      paymentIntentId,
    });
    store.dispatch(showToast({ type: 'success', message: 'Wallet funded successfully!' }));
    return response.data;
  },

  async createWalletTopUpIntent(amount: number) {
    return (await apiClient.post('/users/me/wallet/stripe-intent', { amount })).data;
  },

  async getPaymentMethods() {
    return (await apiClient.get('/users/me/payment-methods')).data;
  },

  async createPaymentMethodSetupIntent() {
    return (await apiClient.post('/users/me/payment-methods/stripe/setup-intent')).data;
  },

  async addPaymentMethod(data: {
    setupIntentId?: string;
    paymentMethodId: string;
    cardholderName: string;
    setAsDefault: boolean;
  }) {
    const response = await apiClient.post('/users/me/payment-methods', data);
    store.dispatch(showToast({ type: 'success', message: 'Card added successfully!' }));
    return response.data;
  },

  async setDefaultPaymentMethod(id: string) {
    const response = await apiClient.patch(`/users/me/payment-methods/${id}/default`);
    store.dispatch(showToast({ type: 'success', message: 'Default payment method updated.' }));
    return response.data;
  },

  async deletePaymentMethod(id: string) {
    const response = await apiClient.delete(`/users/me/payment-methods/${id}`);
    store.dispatch(showToast({ type: 'success', message: 'Payment method removed.' }));
    return response.data;
  },

  async uploadProfilePicture(profilePictureUrl: string) {
    return (await apiClient.post('/users/me/profile-picture', { profilePictureUrl })).data;
  },
};
