import { apiClient } from './apiClient';
import { store } from '@/store';
import { setThreads, setMessages, updateThread, addMessage } from '@/store/slices/chatSlice';

export const chatService = {
  async getThreads(params?: { q?: string; type?: 'all' | 'direct' | 'host-event' | 'community'; eventId?: string }) {
    try {
      let response;
      try {
        response = await apiClient.get('/chats', { params });
      } catch {
        response = await apiClient.get('/chats/threads', { params });
      }
      const data = response.data;
      const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.threads)
        ? data.threads
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : [];
      store.dispatch(setThreads(items));
      return items;
    } catch (err) {
      console.warn('[chatService] getThreads error:', err);
      return [];
    }
  },

  async createDirectThread(recipientUserId: string) {
    const response = await apiClient.post('/chats/direct', { recipientUserId });
    const thread = response.data?.thread || response.data;
    if (thread) {
      store.dispatch(updateThread(thread));
    }
    return thread;
  },

  async createGroupThread(title: string, participantUserIds: string[]) {
    const response = await apiClient.post('/chats/groups', { title, participantUserIds });
    const thread = response.data?.thread || response.data;
    if (thread) {
      store.dispatch(updateThread(thread));
    }
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
    const data = response.data;
    const messages = Array.isArray(data) ? data : Array.isArray(data?.messages) ? data.messages : Array.isArray(data?.items) ? data.items : [];
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
