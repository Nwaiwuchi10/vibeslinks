import { apiClient } from './apiClient';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

export const liveStreamService = {
  async createStream(data: { title: string; category?: string; coverUrl?: string; eventId?: string }) {
    const response = await apiClient.post('/live-streams', data);
    store.dispatch(showToast({ type: 'success', message: 'Live stream started!' }));
    return response.data;
  },

  async getStreamDetails(streamId: string) {
    return (await apiClient.get(`/live-streams/${streamId}`)).data;
  },

  async getActiveStreams() {
    return (await apiClient.get('/live-streams')).data;
  },

  async watchStream(streamId: string) {
    return (await apiClient.post(`/live-streams/${streamId}/watch-request`)).data;
  },

  async reactToStream(streamId: string, reaction: 'love' | 'clap' | 'like') {
    return (await apiClient.post(`/live-streams/${streamId}/reactions`, { type: reaction })).data;
  },

  async viewStream(streamId: string) {
    return (await apiClient.post(`/live-streams/${streamId}/views`)).data;
  },
};
