import { apiClient } from './apiClient';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

export const advertService = {
  async createAdvert(data: { title: string; description: string; image: string; price: number }) {
    const response = await apiClient.post('/adverts', data);
    store.dispatch(showToast({ type: 'success', message: 'Advert created successfully!' }));
    return response.data;
  },

  async getAllAdverts() {
    const response = await apiClient.get('/adverts');
    return response.data?.items || response.data || [];
  },
};
