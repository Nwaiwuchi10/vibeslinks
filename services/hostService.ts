import { apiClient } from './apiClient';
import { store } from '@/store';
import { setOverview, setHostEvents, setHostTickets } from '@/store/slices/hostSlice';
import { showToast } from '@/store/slices/toastSlice';

export const hostService = {
  async getOverview(range?: 'today' | 'thisMonth' | 'lastMonth' | 'allTime', eventId?: string) {
    const params = { range, eventId };
    const response = await apiClient.get('/host-dashboard/overview', { params });
    store.dispatch(setOverview(response.data));
    return response.data;
  },

  async getEvents(params?: {
    q?: string;
    status?: 'all' | 'active' | 'upcoming' | 'completed' | 'draft';
    category?: string;
    range?: string;
    limit?: string;
  }) {
    const response = await apiClient.get('/host-dashboard/events', { params });
    const items = response.data?.events || [];
    store.dispatch(setHostEvents(items));
    return response.data;
  },

  async getEventDetail(eventId: string) {
    return (await apiClient.get(`/host-dashboard/events/${eventId}`)).data;
  },

  async getEventAttendees(eventId: string) {
    return (await apiClient.get(`/host-dashboard/events/${eventId}/attendees`)).data;
  },

  async getTickets(params: {
    eventId: string;
    range?: string;
    category?: string;
    sort?: string;
    q?: string;
    limit?: string;
  }) {
    const response = await apiClient.get('/host-dashboard/tickets', { params });
    const purchases = response.data?.latestTicketPurchases || [];
    store.dispatch(setHostTickets(purchases));
    return response.data;
  },

  // Host Wallet
  async getWalletDetails() {
    return (await apiClient.get('/host-dashboard/wallet')).data;
  },

  async createStripeConnectAccount(data: { country: string; email: string }) {
    const response = await apiClient.post('/host-dashboard/wallet/stripe-connect/account-link', data);
    store.dispatch(showToast({ type: 'success', message: 'Stripe onboarding started.' }));
    return response.data;
  },

  async requestPayoutTransfer(amount: number) {
    const response = await apiClient.post('/host-dashboard/wallet/withdrawals', { amount });
    store.dispatch(showToast({ type: 'success', message: 'Payout requested successfully!' }));
    return response.data;
  },

  async getWalletTransactions() {
    return (await apiClient.get('/host-dashboard/wallet/transactions')).data;
  },

  // Host Promotions
  async getCampaigns(eventId?: string) {
    return (await apiClient.get('/host-dashboard/promotions', { params: { eventId } })).data;
  },

  async createCampaign(data: {
    eventId: string;
    campaignName: string;
    budget: number;
    targetReach: number;
    paymentIntentId?: string;
  }) {
    const response = await apiClient.post('/host-dashboard/promotions', data);
    store.dispatch(showToast({ type: 'success', message: 'Campaign created!' }));
    return response.data;
  },

  async toggleCampaign(campaignId: string) {
    return (await apiClient.post(`/host-dashboard/promotions/${campaignId}/end`)).data;
  },

  async terminateCampaign(campaignId: string, reason: string) {
    const response = await apiClient.post(`/host-dashboard/promotions/${campaignId}/end`, { reason });
    store.dispatch(showToast({ type: 'success', message: 'Campaign terminated.' }));
    return response.data;
  },
};
