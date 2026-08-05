import { apiClient } from './apiClient';
import { store } from '@/store';
import { setOverview, setHostEvents, setHostTickets } from '@/store/slices/hostSlice';
import { showToast } from '@/store/slices/toastSlice';

export const hostService = {
  // ─── Overview ────────────────────────────────────────────────────────────────

  async getOverview(range?: 'today' | 'thisMonth' | 'lastMonth' | 'allTime', eventId?: string) {
    const params = { range, eventId };
    const response = await apiClient.get('/host-dashboard/overview', { params });
    store.dispatch(setOverview(response.data));
    return response.data;
  },

  // ─── Events ──────────────────────────────────────────────────────────────────

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

  // ─── Tickets ─────────────────────────────────────────────────────────────────

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

  // ─── Engagement stats ────────────────────────────────────────────────────────

  async getAudience(range?: string) {
    return (await apiClient.get('/host-dashboard/audience', { params: { range } })).data;
  },

  async getReach(eventId?: string, range?: string) {
    return (await apiClient.get('/host-dashboard/reach', { params: { eventId, range } })).data;
  },

  async getSaves(eventId?: string, range?: string) {
    return (await apiClient.get('/host-dashboard/saves', { params: { eventId, range } })).data;
  },

  async getShares(eventId?: string, range?: string) {
    return (await apiClient.get('/host-dashboard/shares', { params: { eventId, range } })).data;
  },

  async getNewFollowers() {
    try {
      return (await apiClient.get('/host-dashboard/audience/new-followers')).data;
    } catch {
      return [];
    }
  },

  // ─── Wallet ──────────────────────────────────────────────────────────────────

  async getWalletDetails(range?: string) {
    return (await apiClient.get('/host-dashboard/wallet', { params: { range } })).data;
  },

  async getWalletTransactions(params?: {
    q?: string;
    type?: string;
    source?: string;
    range?: string;
    sort?: string;
    limit?: string;
  }) {
    return (await apiClient.get('/host-dashboard/wallet/transactions', { params })).data;
  },

  async previewWithdrawal(amount: number, narration?: string) {
    return (await apiClient.post('/host-dashboard/wallet/withdrawals/preview', { amount, narration })).data;
  },

  async requestWithdrawal(amount: number, narration?: string) {
    const response = await apiClient.post('/host-dashboard/wallet/withdrawals', { amount, narration });
    store.dispatch(showToast({ type: 'success', message: 'Payout requested successfully!' }));
    return response.data;
  },

  async getStripeConnectStatus() {
    return (await apiClient.get('/host-dashboard/wallet/stripe-connect/status')).data;
  },

  async createStripeConnectLink(data: { country: string; email: string }) {
    const response = await apiClient.post('/host-dashboard/wallet/stripe-connect/account-link', data);
    store.dispatch(showToast({ type: 'success', message: 'Stripe onboarding started.' }));
    return response.data;
  },

  async getStatements(params?: { range?: string; format?: string; email?: string }) {
    return (await apiClient.get('/host-dashboard/wallet/statements', { params })).data;
  },

  // ─── Promotions ──────────────────────────────────────────────────────────────

  async getPromotionOverview(range?: string, eventId?: string) {
    return (await apiClient.get('/host-dashboard/promotions/overview', { params: { range, eventId } })).data;
  },

  async getPromotionEvents(params?: {
    q?: string;
    status?: string;
    category?: string;
    range?: string;
    limit?: string;
  }) {
    return (await apiClient.get('/host-dashboard/promotions/events', { params })).data;
  },

  async getCampaignTypes(eventId: string, campaignType?: string) {
    return (await apiClient.get('/host-dashboard/promotions/campaign-types', {
      params: { eventId, campaignType },
    })).data;
  },

  async estimateCampaign(data: {
    eventId: string;
    campaignType: string;
    budget: number;
    durationDays: number;
  }) {
    return (await apiClient.post('/host-dashboard/promotions/estimate', data)).data;
  },

  async getCampaigns(params?: { status?: string; q?: string; range?: string; limit?: string }) {
    return (await apiClient.get('/host-dashboard/promotions', { params })).data;
  },

  async createCampaign(data: {
    eventId: string;
    campaignType: string;
    budget: number;
    durationDays: number;
    paymentMethod: 'stripe' | 'wallet';
  }) {
    const response = await apiClient.post('/host-dashboard/promotions', data);
    store.dispatch(showToast({ type: 'success', message: 'Campaign created!' }));
    return response.data;
  },

  async confirmCampaignPayment(campaignId: string, data: {
    paymentMethod: string;
    stripePaymentIntentId?: string;
  }) {
    const response = await apiClient.post(
      `/host-dashboard/promotions/${campaignId}/payment-confirmation`,
      data,
    );
    return response.data;
  },

  async getCampaignReceipt(campaignId: string) {
    return (await apiClient.get(`/host-dashboard/promotions/${campaignId}/receipt`)).data;
  },

  async getCampaignPerformance(campaignId: string) {
    return (await apiClient.get(`/host-dashboard/promotions/${campaignId}/performance`)).data;
  },

  async getCampaignEndPreview(campaignId: string) {
    return (await apiClient.get(`/host-dashboard/promotions/${campaignId}/end-preview`)).data;
  },

  async endCampaign(campaignId: string, reason?: string) {
    const response = await apiClient.post(`/host-dashboard/promotions/${campaignId}/end`, { reason });
    store.dispatch(showToast({ type: 'success', message: 'Campaign ended.' }));
    return response.data;
  },

  async cancelEvent(eventId: string, reason: string, details?: string) {
    const response = await apiClient.post(`/host-dashboard/events/${eventId}/cancel`, { reason, details });
    store.dispatch(showToast({ type: 'success', message: 'Event cancelled successfully!' }));
    return response.data;
  },
};
