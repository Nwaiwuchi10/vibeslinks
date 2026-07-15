import { apiClient } from './apiClient';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

export const liveStreamService = {
  async getCreateOptions() {
    return (await apiClient.get('/live-streams/create-options')).data;
  },

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

  async getActiveStreams() {
    return (await apiClient.get('/live-streams/live')).data;
  },

  async getCreatorsOnLive() {
    return (await apiClient.get('/live-streams/creators-on-live')).data;
  },

  async getWatchFeed(params?: { q?: string; category?: string; limit?: number; excludeWatched?: boolean }) {
    return (await apiClient.get('/live-streams/watch-feed', { params })).data;
  },

  async getStreamDetails(id: string) {
    return (await apiClient.get(`/live-streams/${id}/watch`)).data;
  },

  async watchStream(id: string) {
    return (await apiClient.get(`/live-streams/${id}/watch`)).data;
  },

  async requestWatchAccess(id: string, message: string) {
    const response = await apiClient.post(`/live-streams/${id}/request`, { message });
    store.dispatch(showToast({ type: 'success', message: 'Request sent to host' }));
    return response.data;
  },

  async cancelWatchRequest(id: string) {
    return (await apiClient.delete(`/live-streams/${id}/request`)).data;
  },

  async reactToStream(id: string, type: 'love' | 'clap' | 'like') {
    return (await apiClient.post(`/live-streams/${id}/reactions`, { type })).data;
  }
};
