import { apiClient } from './apiClient';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

export const liveStreamService = {
  // ─── Discovery & Feed ────────────────────────────────────────────────────────

  async getCreateOptions() {
    return (await apiClient.get('/live-streams/create-options')).data;
  },

  async getActiveStreams() {
    try {
      return (await apiClient.get('/live-streams/live', { silent: true } as any)).data;
    } catch { return []; }
  },

  async getCreatorsOnLive() {
    try {
      const res = await apiClient.get('/live-streams/creators-on-live', { silent: true } as any);
      return Array.isArray(res.data) ? res.data : res.data?.items || res.data?.creators || [];
    } catch { return []; }
  },

  async getWatchFeed(params?: { q?: string; category?: string; limit?: number; excludeWatched?: boolean }) {
    try {
      return (await apiClient.get('/live-streams/watch-feed', { params, silent: true } as any)).data;
    } catch { return []; }
  },

  async findEvents() {
    try {
      return (await apiClient.get('/live-streams/find-events', { silent: true } as any)).data;
    } catch { return []; }
  },

  async search(params?: { q?: string; category?: string; limit?: number }) {
    return (await apiClient.get('/live-streams/search', { params })).data;
  },

  async getAllStreams() {
    return (await apiClient.get('/live-streams')).data;
  },

  // ─── Watch / Stream Details ───────────────────────────────────────────────────

  async getStreamDetails(id: string) {
    return (await apiClient.get(`/live-streams/${id}/watch`)).data;
  },

  async watchStream(id: string) {
    return (await apiClient.get(`/live-streams/${id}/watch`)).data;
  },

  async getViewerToken(id: string, uid: string) {
    return (await apiClient.post(`/live-streams/${id}/viewer-token`, { uid })).data;
  },

  // ─── Access Control ───────────────────────────────────────────────────────────

  async checkAccess(id: string, paymentMethod: 'stripe' | 'wallet' = 'wallet') {
    return (await apiClient.post(`/live-streams/${id}/access`, { paymentMethod })).data;
  },

  async requestWatchAccess(id: string, message: string) {
    const response = await apiClient.post(`/live-streams/${id}/request`, { message });
    store.dispatch(showToast({ type: 'success', message: 'Request sent to host' }));
    return response.data;
  },

  async cancelWatchRequest(id: string) {
    return (await apiClient.delete(`/live-streams/${id}/request`)).data;
  },

  // ─── Interactions ─────────────────────────────────────────────────────────────

  async reactToStream(id: string, emoji: 'love' | 'clap' | 'like' | 'fire') {
    return (await apiClient.post(`/live-streams/${id}/reactions`, { emoji })).data;
  },

  // ─── Create / Manage ─────────────────────────────────────────────────────────

  async createStream(data: {
    title: string;
    coverUrl?: string;
    category: string;
    privacy: string;
    ticketPrice?: number;
  }) {
    const response = await apiClient.post('/live-streams', data);
    store.dispatch(showToast({ type: 'success', message: 'Live stream created successfully!' }));
    return response.data;
  },
};
