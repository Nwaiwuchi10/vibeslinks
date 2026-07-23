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
} from '@/store/slices/eventSlice';
import { showToast } from '@/store/slices/toastSlice';

export const eventService = {
  async createEvent(eventData: any) {
    const response = await apiClient.post('/events', eventData);
    store.dispatch(showToast({ type: 'success', message: 'Event created successfully!' }));
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

  async getEventsNearYou(radiusKm?: string) {
    const response = await apiClient.get('/events');
    const items = Array.isArray(response.data) ? response.data : response.data?.items || [];
    store.dispatch(setNearYou(items));
    return items;
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
    store.dispatch(showToast({ type: 'success', message: 'Ticket purchased successfully!' }));
    return response.data;
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

  async scanTicket(id: string, purchaseId: string, quantity: number) {
    const response = await apiClient.post(`/events/${id}/tickets/scan`, { purchaseId, quantity });
    store.dispatch(showToast({ type: 'success', message: 'Ticket scanned successfully!' }));
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

  async getEventAttendees(id: string) {
    return (await apiClient.get(`/events/${id}/attendees`)).data;
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
};
