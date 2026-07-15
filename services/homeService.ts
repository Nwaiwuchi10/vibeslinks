import { apiClient } from './apiClient';
import { store } from '@/store';

export const homeService = {
  /**
   * Returns the logged-in user from Redux store.
   * The backend has no GET /users/me/profile endpoint —
   * the user object comes from the login/signup response and is stored in Redux auth slice.
   */
  getMe() {
    const state = store.getState();
    return state.auth?.user ?? null;
  },

  /** GET /adverts – banner advert for home screen */
  async getAdverts() {
    try {
      const res = await apiClient.get('/adverts', { silent: true });
      const items = Array.isArray(res.data) ? res.data : res.data?.items || [];
      return items;
    } catch {
      return [];
    }
  },

  /** GET /live-streams/creators-on-live – live creator cards */
  async getCreatorsOnLive() {
    try {
      const res = await apiClient.get('/live-streams/creators-on-live', { silent: true });
      const items = Array.isArray(res.data) ? res.data : res.data?.items || res.data?.creators || [];
      return items;
    } catch {
      return [];
    }
  },

  /** GET /events/recommended/cards – recommended events for "friends vibing" section */
  async getRecommendedEvents() {
    try {
      const res = await apiClient.get('/events/recommended/cards', { silent: true });
      const cards = Array.isArray(res.data) ? res.data : res.data?.cards || res.data?.items || [];
      return cards;
    } catch {
      return [];
    }
  },

  /** GET /users/onboarding/options – suggested creators/hosts */
  async getSuggestedHosts() {
    try {
      const res = await apiClient.get('/users/onboarding/options', { silent: true });
      const data = res.data;
      return data?.suggestedCreators || data?.artists || data?.suggestedHosts || data?.hosts || [];
    } catch {
      return [];
    }
  },
};
