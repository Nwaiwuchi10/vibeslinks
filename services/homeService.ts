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

  /** GET /users/hosts/suggested – suggested hosts for current user */
  async getSuggestedHosts(limit?: number) {
    try {
      const res = await apiClient.get('/users/hosts/suggested', {
        params: limit ? { limit: String(limit) } : undefined,
        silent: true,
      });
      const items = Array.isArray(res.data) ? res.data : res.data?.items || res.data?.hosts || [];
      return items;
    } catch {
      return [];
    }
  },

  /** GET /users/hosts – fetch all hosts */
  async getAllHosts() {
    try {
      const res = await apiClient.get('/users/hosts', { silent: true });
      const items = Array.isArray(res.data) ? res.data : res.data?.items || res.data?.hosts || [];
      return items;
    } catch {
      return [];
    }
  },
};
