import { apiClient } from './apiClient';
import { showToast } from '@/store/slices/toastSlice';
import { store } from '@/store';

export const postService = {
  /**
   * Create a new post. Supports uploading an image file (multipart/form-data)
   * or providing an already-hosted URL via mediaUrl.
   */
  async createPost(data: {
    content: string;
    imageUri?: string;       // single local file URI fallback
    mediaItems?: { uri: string; type?: 'image' | 'video' }[]; // multiple local media files
    mediaUrl?: string;       // already-hosted URL
    visibility?: 'public' | 'followers-only' | 'private';
  }) {
    const formData = new FormData();

    if (data.content) {
      formData.append('content', data.content);
    }

    if (data.visibility) {
      formData.append('visibility', data.visibility);
    }

    if (data.mediaItems && data.mediaItems.length > 0) {
      data.mediaItems.forEach((item, index) => {
        const isVideo = item.type === 'video';
        const ext = item.uri.split('.').pop()?.toLowerCase() || (isVideo ? 'mp4' : 'jpg');
        const mimeType = isVideo
          ? `video/${ext === 'mov' ? 'quicktime' : 'mp4'}`
          : (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg');

        const fileObj = {
          uri: item.uri,
          name: `file_${index}.${ext}`,
          type: mimeType,
        } as any;

        if (isVideo) {
          formData.append('videos', fileObj);
        } else {
          formData.append('images', fileObj);
        }
      });
    } else if (data.imageUri) {
      const ext = data.imageUri.split('.').pop()?.toLowerCase() || 'jpg';
      const mimeType =
        ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      formData.append('image', {
        uri: data.imageUri,
        name: `post-image.${ext}`,
        type: mimeType,
      } as any);
    } else if (data.mediaUrl) {
      formData.append('mediaUrl', data.mediaUrl);
    }

    const response = await apiClient.post('/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 300000,
    });

    store.dispatch(showToast({ type: 'success', message: 'Post created successfully!' }));
    return response.data;
  },

  /**
   * GET /posts — returns public + followed-user + own posts feed.
   */
  async getPostFeed(): Promise<any[]> {
    try {
      const response = await apiClient.get('/posts');
      const data = response.data;
      // Backend may return array directly or nested under a key
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.posts)) return data.posts;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /posts/me — current user's own posts.
   */
  async getMyPosts(): Promise<any[]> {
    try {
      const response = await apiClient.get('/posts/me');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.posts)) return data.posts;
      if (Array.isArray(data?.items)) return data.items;
      return [];
    } catch {
      return [];
    }
  },

  /**
   * GET /posts/:id — fetch a single post.
   */
  async getPostById(id: string): Promise<any | null> {
    try {
      const response = await apiClient.get(`/posts/${id}`);
      return response.data?.post || response.data || null;
    } catch {
      return null;
    }
  },

  /**
   * PATCH /posts/:id — edit a post owned by the current user.
   */
  async updatePost(
    id: string,
    data: { content?: string; mediaUrls?: string[]; visibility?: string },
  ) {
    const response = await apiClient.patch(`/posts/${id}`, data);
    store.dispatch(showToast({ type: 'success', message: 'Post updated.' }));
    return response.data;
  },

  /**
   * DELETE /posts/:id — delete a post owned by the current user.
   */
  async deletePost(id: string) {
    const response = await apiClient.delete(`/posts/${id}`);
    store.dispatch(showToast({ type: 'success', message: 'Post deleted.' }));
    return response.data;
  },

  async repostPost(id: string) {
    const response = await apiClient.post(`/posts/${id}/repost`);
    store.dispatch(showToast({ type: 'success', message: 'Post reposted!' }));
    return response.data;
  },

  async sharePost(id: string) {
    const response = await apiClient.post(`/posts/${id}/share`);
    return response.data;
  },

  // ─── Post Reactions ──────────────────────────────────────────────────────────
  async reactToPost(id: string, type: 'like' | 'love' | 'wow' | 'sad' | 'angry') {
    return (await apiClient.post(`/posts/${id}/reactions/${type}`)).data;
  },

  async removeReactionFromPost(id: string) {
    return (await apiClient.delete(`/posts/${id}/reactions`)).data;
  },

  // ─── Post Comments ───────────────────────────────────────────────────────────
  async getPostComments(id: string): Promise<any[]> {
    try {
      const res = await apiClient.get(`/posts/${id}/comments`);
      const d = res.data;
      if (Array.isArray(d)) return d;
      if (Array.isArray(d?.comments)) return d.comments;
      if (Array.isArray(d?.items)) return d.items;
      if (Array.isArray(d?.data)) return d.data;
      return [];
    } catch {
      return [];
    }
  },

  async createPostComment(id: string, message: string) {
    const response = await apiClient.post(`/posts/${id}/comments`, { message });
    return response.data;
  },

  // ─── Comment Reactions ───────────────────────────────────────────────────────
  async reactToPostComment(id: string, commentId: string, type: 'like' | 'love' | 'wow' | 'sad' | 'angry') {
    return (await apiClient.post(`/posts/${id}/comments/${commentId}/reactions/${type}`)).data;
  },

  async removeReactionFromPostComment(id: string, commentId: string) {
    return (await apiClient.delete(`/posts/${id}/comments/${commentId}/reactions`)).data;
  },
};
