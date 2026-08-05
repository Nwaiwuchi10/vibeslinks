import { apiClient } from './apiClient';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

export const storyService = {
  /**
   * POST /stories — post a new story (24-hour expiry).
   * Supports multipart upload (image file) or providing an existing hosted URL.
   */
  async createStory(data: {
    imageUri?: string;         // local file URI for upload
    mediaUrl?: string;         // already-hosted URL alternative
    text?: string;             // text overlay
    caption?: string;          // caption for the story
    mediaType?: 'image' | 'video' | 'text';
    backgroundColor?: string;  // e.g. '#6C2BD9'
    visibility?: 'public' | 'followers-only' | 'private';
  }) {
    const formData = new FormData();

    if (data.text) formData.append('text', data.text);
    if (data.caption) formData.append('caption', data.caption);
    if (data.mediaType) formData.append('mediaType', data.mediaType);
    if (data.backgroundColor) formData.append('backgroundColor', data.backgroundColor);
    if (data.visibility) formData.append('visibility', data.visibility);

    if (data.imageUri) {
      const ext = data.imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType =
        ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      formData.append('image', {
        uri: data.imageUri,
        name: `story-image.${ext}`,
        type: mimeType,
      } as any);
    } else if (data.mediaUrl) {
      formData.append('mediaUrl', data.mediaUrl);
    }

    const response = await apiClient.post('/stories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });

    store.dispatch(showToast({ type: 'success', message: 'Story posted!' }));
    return response.data;
  },

  /**
   * GET /stories — returns active stories grouped by user; unviewed first.
   */
  async getStoryFeed(): Promise<any[]> {
    try {
      const response = await apiClient.get('/stories');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.stories)) return data.stories;
      if (Array.isArray(data?.groups)) return data.groups;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /stories/feed — alias for story feed.
   */
  async getStoryFeedAlias(): Promise<any[]> {
    try {
      const response = await apiClient.get('/stories/feed');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.stories)) return data.stories;
      if (Array.isArray(data?.groups)) return data.groups;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /stories/me — current user's active stories and view counts.
   */
  async getMyStories(): Promise<any[]> {
    try {
      const response = await apiClient.get('/stories/me');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.stories)) return data.stories;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /stories/:id — fetch a single active story.
   */
  async getStoryById(id: string): Promise<any | null> {
    try {
      const response = await apiClient.get(`/stories/${id}`);
      return response.data?.story || response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * POST /stories/:id/view — mark another user's story as viewed.
   */
  async markStoryViewed(id: string): Promise<void> {
    try {
      await apiClient.post(`/stories/${id}/view`, {});
    } catch {
      // Silently fail — not critical
    }
  },

  /**
   * DELETE /stories/:id — delete a story owned by the current user.
   */
  async deleteStory(id: string) {
    const response = await apiClient.delete(`/stories/${id}`);
    store.dispatch(showToast({ type: 'success', message: 'Story deleted.' }));
    return response.data;
  },
};
