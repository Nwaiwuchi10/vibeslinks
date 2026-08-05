import { apiClient } from './apiClient';
import { store } from '@/store';
import {
  setEvents,
  setNearYou,
  setRecommended,
  setMyTickets,
  setCurrentEvent,
  setComments,
  addCommentToState,
  setLoadingEvents,
  setLastPurchase,
} from '@/store/slices/eventSlice';
import { showToast } from '@/store/slices/toastSlice';

export const eventService = {
  async createEvent(eventData: any) {
    const isMultipart = eventData.imageUrl?.startsWith('file://') || eventData.imageUrl?.startsWith('content://') || eventData.imageUrl?.startsWith('ph://');
    
    if (isMultipart) {
      const formData = new FormData();
      const coverUri = eventData.imageUrl;
      const ext = coverUri.split('.').pop() || 'jpg';
      formData.append('eventCover', {
        uri: coverUri,
        type: `image/${ext}`,
        name: `event-cover.${ext}`,
      } as any);

      Object.keys(eventData).forEach(key => {
        if (key === 'imageUrl') return;
        const val = eventData[key];
        if (val === undefined || val === null) return;
        if (Array.isArray(val) || typeof val === 'object') {
          formData.append(key, JSON.stringify(val));
        } else {
          formData.append(key, String(val));
        }
      });

      const response = await apiClient.post('/events', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      store.dispatch(showToast({ type: 'success', message: 'Event created successfully!' }));
      return response.data;
    } else {
      const response = await apiClient.post('/events', eventData);
      store.dispatch(showToast({ type: 'success', message: 'Event created successfully!' }));
      return response.data;
    }
  },

  async updateEvent(id: string, eventData: any) {
    const response = await apiClient.patch(`/events/${id}`, eventData);
    store.dispatch(showToast({ type: 'success', message: 'Event updated successfully!' }));
    return response.data;
  },

  async createLiveStream(data: {
    title: string;
    coverUrl: string;
    category: string;
    privacy: 'all' | 'ticket-holders-only' | 'invite-only';
    ticketPrice?: number;
  }) {
    const response = await apiClient.post('/live-streams', data);
    store.dispatch(showToast({ type: 'success', message: 'Livestream created successfully!' }));
    return response.data;
  },

  async getAllEvents() {
    store.dispatch(setLoadingEvents(true));
    try {
      const response = await apiClient.get('/events');
      const items = Array.isArray(response.data) ? response.data : response.data?.items || [];
      store.dispatch(setEvents(items));
      return items;
    } finally {
      store.dispatch(setLoadingEvents(false));
    }
  },

  async getCreateEventOptions() {
    return (await apiClient.get('/events/create-options')).data;
  },

  async getArtistOptions() {
    return (await apiClient.get('/events/artist-options')).data;
  },

  async uploadImage(fileUri: string): Promise<string> {
    const formData = new FormData();
    const ext = fileUri.split('.').pop() || 'jpg';
    formData.append('image', {
      uri: fileUri,
      type: `image/${ext}`,
      name: `upload.${ext}`,
    } as any);

    const response = await apiClient.post('/events/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data?.url;
  },

  async getEventsNearYou(params?: {
    radiusKm?: string;
    lat?: number;
    lng?: number;
    search?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'distance' | 'date' | 'price';
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    const qs = new URLSearchParams();
    if (params?.radiusKm) qs.set('radiusKm', params.radiusKm);
    if (params?.lat !== undefined) qs.set('lat', String(params.lat));
    if (params?.lng !== undefined) qs.set('lng', String(params.lng));
    if (params?.search) qs.set('search', params.search);
    if (params?.category) qs.set('category', params.category);
    if (params?.startDate) qs.set('startDate', params.startDate);
    if (params?.endDate) qs.set('endDate', params.endDate);
    if (params?.minPrice !== undefined) qs.set('minPrice', String(params.minPrice));
    if (params?.maxPrice !== undefined) qs.set('maxPrice', String(params.maxPrice));
    if (params?.sortBy) qs.set('sortBy', params.sortBy);
    if (params?.sortOrder) qs.set('sortOrder', params.sortOrder);
    if (params?.page) qs.set('page', String(params.page));
    if (params?.limit) qs.set('limit', String(params.limit));

    const query = qs.toString();
    const url = `/events/near-you${query ? `?${query}` : ''}`;
    const response = await apiClient.get(url);
    // Response is { data: [...], total, page, limit } — extract items
    const items: any[] = Array.isArray(response.data)
      ? response.data
      : response.data?.data || response.data?.items || response.data?.events || [];
    store.dispatch(setNearYou(items));
    return { items, total: response.data?.total ?? items.length, page: response.data?.page ?? 1, limit: response.data?.limit ?? items.length };
  },

  async getEventsNearYouCards(radiusKm?: string) {
    return (await apiClient.get(`/events/near-you/cards${radiusKm ? `?radiusKm=${radiusKm}` : ''}`)).data;
  },

  async getRecommendedEvents(limit?: string) {
    const response = await apiClient.get(`/events/recommended/cards${limit ? `?limit=${limit}` : ''}`);
    const cards = response.data?.cards || [];
    store.dispatch(setRecommended(cards));
    return response.data;
  },

  async getEventById(id: string) {
    const response = await apiClient.get(`/events/${id}`);
    store.dispatch(setCurrentEvent(response.data?.event || response.data));
    return response.data;
  },

  async getEventDetailsScreen(id: string) {
    const response = await apiClient.get(`/events/${id}/details-screen`);
    store.dispatch(setCurrentEvent(response.data?.event || response.data));
    return response.data;
  },

  async getTicketCheckoutScreen(id: string) {
    return (await apiClient.get(`/events/${id}/tickets/checkout-screen`)).data;
  },

  async createStripeTicketIntent(id: string, data: {
    items: { tierId: string; quantity: number }[];
    fullName: string;
    email: string;
    phoneNumber: string;
    country: string;
    gender: string;
  }) {
    return (await apiClient.post(`/events/${id}/tickets/stripe-intent`, data)).data;
  },

  async purchaseTickets(id: string, data: {
    items: { tierId: string; quantity: number }[];
    paymentMethod: string;
    paymentIntentId?: string;
  }) {
    const response = await apiClient.post(`/events/${id}/tickets/purchase`, data);
    if (response.data?.purchase) {
      store.dispatch(setLastPurchase(response.data.purchase));
    }
    store.dispatch(showToast({ type: 'success', message: 'Ticket purchased successfully!' }));
    return response.data;
  },

  async purchaseEventTickets(id: string, data: {
    items: { tierId: string; quantity: number }[];
    paymentMethod: string;
    paymentIntentId?: string;
  }) {
    return this.purchaseTickets(id, data);
  },

  async getMyTickets(status?: string) {
    const response = await apiClient.get(`/events/my-tickets${status ? `?status=${status}` : ''}`);
    const tickets = response.data?.sections?.upcoming || response.data?.items || [];
    store.dispatch(setMyTickets(tickets));
    return response.data;
  },

  async getTicketPurchases(id: string) {
    return (await apiClient.get(`/events/${id}/tickets/purchases`)).data;
  },

  async getTicketPurchaseDetails(id: string, purchaseId: string) {
    return (await apiClient.get(`/events/${id}/tickets/purchases/${purchaseId}`)).data;
  },

  async cancelTicketPurchase(id: string, purchaseId: string) {
    const response = await apiClient.post(`/events/${id}/tickets/purchases/${purchaseId}/cancel`);
    store.dispatch(showToast({ type: 'success', message: 'Ticket booking cancelled successfully.' }));
    return response.data;
  },

  async getEventAttendees(id: string) {
    try {
      const response = await apiClient.get(`/events/${id}/attendees`, { silent: true });
      return Array.isArray(response.data) ? response.data : response.data?.items || response.data?.attendees || [];
    } catch {
      return [];
    }
  },

  async getEventComments(id: string) {
    try {
      const response = await apiClient.get(`/events/${id}/comments`, { silent: true });
      const comments = Array.isArray(response.data) ? response.data : response.data?.items || [];
      store.dispatch(setComments(comments));
      return comments;
    } catch {
      // Comments may be restricted to attendees only — silently ignore
      return [];
    }
  },

  async createEventComment(id: string, message: string) {
    const response = await apiClient.post(`/events/${id}/comments`, { message });
    store.dispatch(addCommentToState(response.data));
    return response.data;
  },

  async saveEventToFavorite(id: string, source?: string) {
    const response = await apiClient.post(`/events/${id}/favorite`, { source });
    store.dispatch(showToast({ type: 'success', message: 'Added to favorites.' }));
    return response.data;
  },

  async removeEventFromFavorite(id: string) {
    const response = await apiClient.delete(`/events/${id}/favorite`);
    store.dispatch(showToast({ type: 'success', message: 'Removed from favorites.' }));
    return response.data;
  },

  async shareEvent(id: string, channel: string, targetUrl: string) {
    return (await apiClient.post(`/events/${id}/share`, { channel, targetUrl })).data;
  },

  async inviteFriends(id: string, userIds: string[]) {
    const response = await apiClient.post(`/events/${id}/invite-friends`, { userIds });
    store.dispatch(showToast({ type: 'success', message: 'Invitations sent!' }));
    return response.data;
  },

  async getInviteFriends(id: string) {
    return (await apiClient.get(`/events/${id}/invite-friends`)).data;
  },

  async getEventCollaborators(id: string) {
    return (await apiClient.get(`/events/${id}/collaborators`)).data;
  },

  async addEventCollaborator(id: string, userId: string, role: string) {
    return (await apiClient.post(`/events/${id}/collaborators`, { userId, role })).data;
  },

  async removeEventCollaborator(id: string, collaboratorId: string) {
    return (await apiClient.delete(`/events/${id}/collaborators/${collaboratorId}`)).data;
  },

  async scanTicket(id: string, purchaseId: string, quantity: number = 1) {
    const response = await apiClient.post(`/events/${id}/tickets/scan`, { purchaseId, quantity });
    store.dispatch(showToast({ type: 'success', message: 'Ticket scanned successfully!' }));
    return response.data;
  },

  async cancelEvent(id: string, reason: string) {
    const response = await apiClient.post(`/events/${id}/cancel`, { reason });
    store.dispatch(showToast({ type: 'success', message: 'Event cancelled and refunds initiated.' }));
    return response.data;
  },

  async createGalleryItem(id: string, data: { imageUrl: string; caption?: string; downloadAllowed?: boolean }) {
    const response = await apiClient.post(`/events/${id}/gallery`, data);
    store.dispatch(showToast({ type: 'success', message: 'Gallery item posted!' }));
    return response.data;
  },

  async getEventGallery(id: string) {
    return (await apiClient.get(`/events/${id}/gallery`)).data;
  },

  async getEventAnalytics(id: string) {
    return (await apiClient.get(`/events/${id}/analytics`)).data;
  },

  async getEventFriendsAttending(id: string) {
    return (await apiClient.get(`/events/${id}/friends-attending`)).data;
  },

  async postEventReaction(id: string, type: string) {
    return (await apiClient.post(`/events/${id}/reactions/${type}`)).data;
  },

  async deleteEventReaction(id: string) {
    return (await apiClient.delete(`/events/${id}/reactions`)).data;
  },

  async duplicateEvent(id: string) {
    const response = await apiClient.post(`/events/${id}/duplicate`);
    store.dispatch(showToast({ type: 'success', message: 'Event duplicated successfully!' }));
    return response.data;
  },
  async getEventSearchScreen() {
    return (await apiClient.get('/events/search-screen')).data;
  },

  async searchEvents(query: string, limit?: string) {
    const q = encodeURIComponent(query);
    return (await apiClient.get(`/events/search?query=${q}${limit ? `&limit=${limit}` : ''}`)).data;
  },

  async deleteRecentSearch(id: string) {
    return (await apiClient.delete(`/events/search/recent/${id}`)).data;
  },
};
