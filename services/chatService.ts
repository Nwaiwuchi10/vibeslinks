import { apiClient } from './apiClient';
import { store } from '@/store';
import { setThreads, setMessages, updateThread, addMessage } from '@/store/slices/chatSlice';

export const chatService = {
  async getThreads(params?: { q?: string; type?: 'all' | 'direct' | 'host-event' | 'community'; eventId?: string }) {
    const response = await apiClient.get('/chats/threads', { params });
    const items = response.data?.items || response.data || [];
    store.dispatch(setThreads(items));
    return items;
  },

  async createDirectThread(recipientUserId: string) {
    const response = await apiClient.post('/chats/direct', { recipientUserId });
    const thread = response.data;
    store.dispatch(updateThread(thread));
    return thread;
  },

  async createHostEventThread(eventId: string) {
    const response = await apiClient.post(`/chats/events/${eventId}/host-thread`);
    const thread = response.data;
    store.dispatch(updateThread(thread));
    return thread;
  },

  async createCommunity(eventId: string, title: string) {
    const response = await apiClient.post(`/chats/events/${eventId}/community`, { title });
    return response.data;
  },

  async listCommunities(eventId: string) {
    return (await apiClient.get(`/chats/events/${eventId}/community`)).data;
  },

  async getMessages(conversationId: string) {
    const response = await apiClient.get(`/chats/${conversationId}/messages`);
    const messages = response.data?.items || response.data || [];
    store.dispatch(setMessages({ conversationId, messages }));
    return messages;
  },

  async sendMessage(conversationId: string, message: string) {
    const response = await apiClient.post(`/chats/${conversationId}/messages`, { message });
    const newMessage = response.data;
    store.dispatch(addMessage(newMessage));
    return newMessage;
  },
};
