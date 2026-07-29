/**
 * stripeService.ts
 * REST-only Stripe integration (no native SDK required).
 * Uses the backend's intent endpoints, then the Stripe REST API to confirm.
 */
import { apiClient } from './apiClient';
import { store } from '@/store';
import { showToast } from '@/store/slices/toastSlice';

const STRIPE_BASE = 'https://api.stripe.com/v1';

/**
 * Confirm a Stripe PaymentIntent using the client secret.
 * Uses saved payment method ID (pm_xxx) from the backend.
 */
async function confirmPaymentIntent(clientSecret: string, paymentMethodId: string) {
  const intentId = clientSecret.split('_secret_')[0];
  const params = new URLSearchParams({
    payment_method: paymentMethodId,
    'expand[]': 'payment_method',
  });

  // We confirm via backend proxy since we cannot expose publishable key in app bundle safely.
  // The backend confirms the intent server-side after we POST the purchase endpoint.
  // This function is kept for reference if direct confirmation is needed in future.
  return { intentId, clientSecret };
}

export const stripeService = {
  /**
   * Step 1 of ticket purchase:
   * Create a Stripe PaymentIntent for event tickets.
   * Returns { clientSecret, paymentIntentId }
   */
  async createTicketIntent(eventId: string, data: {
    ticketTierId: string;
    quantity: number;
    buyer: {
      fullName: string;
      email: string;
      phoneNumber: string;
      gender: string;
      country: string;
    };
  }) {
    const response = await apiClient.post(`/events/${eventId}/tickets/stripe-intent`, data);
    return response.data as { clientSecret: string; paymentIntentId?: string };
  },

  /**
   * Step 2 of ticket purchase:
   * Complete the purchase after confirming payment intent.
   * paymentMethod: 'stripe' | 'wallet' | 'debit-card'
   */
  async purchaseTickets(eventId: string, data: {
    ticketTierId: string;
    quantity: number;
    buyer: {
      fullName: string;
      email: string;
      phoneNumber: string;
      gender: string;
      country: string;
    };
    paymentMethod: 'stripe' | 'wallet' | 'debit-card';
    paymentIntentId?: string;
    paymentMethodId?: string;
  }) {
    const response = await apiClient.post(`/events/${eventId}/tickets/purchase`, data);
    store.dispatch(showToast({ type: 'success', message: 'Ticket purchased successfully!' }));
    return response.data;
  },

  /**
   * Create a Stripe SetupIntent for saving a card (for ticket add-card flow).
   * Returns { clientSecret, setupIntentId }
   */
  async createSetupIntent() {
    const response = await apiClient.post('/users/me/payment-methods/stripe/setup-intent', {
      usage: 'off_session',
    });
    return response.data as { clientSecret: string; setupIntentId?: string };
  },

  /**
   * Register a payment method after user enters card details.
   * stripePaymentMethodId: a test pm_ ID or real pm_ from Stripe Elements.
   */
  async addPaymentMethod(stripePaymentMethodId: string, setAsDefault = true) {
    const response = await apiClient.post('/users/me/payment-methods', {
      stripePaymentMethodId,
      setAsDefault,
    });
    store.dispatch(showToast({ type: 'success', message: 'Card added successfully!' }));
    return response.data;
  },

  /**
   * Create a Stripe PaymentIntent for wallet funding.
   * Returns { clientSecret }
   */
  async createWalletFundingIntent(amount: number, paymentMethodId: string) {
    const response = await apiClient.post('/users/me/wallet/stripe-intent', {
      amount,
      paymentMethodId,
    });
    return response.data as { clientSecret: string };
  },

  /**
   * Fund the wallet after confirming Stripe intent.
   */
  async fundWallet(amount: number, paymentMethodId: string) {
    const response = await apiClient.post('/users/me/wallet/fund', {
      amount,
      paymentMethodId,
    });
    store.dispatch(showToast({ type: 'success', message: `Wallet funded with ₦${amount.toLocaleString()}` }));
    return response.data;
  },

  /**
   * Get current user's wallet balance.
   */
  async getWallet() {
    const response = await apiClient.get('/users/me/wallet');
    return response.data;
  },

  /**
   * Get saved payment methods.
   */
  async getPaymentMethods() {
    const response = await apiClient.get('/users/me/payment-methods');
    const items = Array.isArray(response.data)
      ? response.data
      : response.data?.paymentMethods || response.data?.items || [];
    return items;
  },

  /**
   * Delete a saved payment method.
   */
  async deletePaymentMethod(id: string) {
    const response = await apiClient.delete(`/users/me/payment-methods/${id}`);
    store.dispatch(showToast({ type: 'success', message: 'Card removed.' }));
    return response.data;
  },

  /**
   * Set a payment method as default.
   */
  async setDefaultPaymentMethod(id: string) {
    const response = await apiClient.patch(`/users/me/payment-methods/${id}/default`);
    return response.data;
  },

  /**
   * Create Stripe Connect account link for hosts.
   */
  async createHostConnectLink(data: { country: string; email: string }) {
    const response = await apiClient.post('/host-dashboard/wallet/stripe-connect/account-link', data);
    return response.data as { url: string };
  },

  /**
   * Get Stripe Connect account status for the host.
   */
  async getConnectStatus() {
    const response = await apiClient.get('/host-dashboard/wallet/stripe-connect/status');
    return response.data;
  },

  /**
   * Create a Stripe Checkout Session for event ticket or livestream.
   * Returns { checkoutUrl }
   */
  async createCheckoutSession(data: {
    purchaseType: 'event-ticket' | 'live-stream';
    eventId: string;
    tierId?: string;
    quantity: number;
  }) {
    const response = await apiClient.post('/payments/checkout', data);
    return response.data as { checkoutUrl: string };
  },

  /**
   * Confirm/Verify Stripe Checkout Session.
   */
  async confirmCheckoutSession(sessionId: string) {
    const response = await apiClient.get('/payments/checkout/complete', {
      params: { session_id: sessionId }
    });
    return response.data;
  },
};
