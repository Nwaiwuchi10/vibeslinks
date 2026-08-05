import { apiClient } from './apiClient';

export interface NotificationItem {
  id: string;
  _id?: string;
  type?: string; // 'mention' | 'event' | 'message' | 'ticket' | 'follow' | 'like' | 'comment' | 'system'
  category?: string; // 'mentions' | 'events' | 'messages' | 'tickets' | 'general'
  title: string;
  message?: string;
  subtitle?: string;
  body?: string;
  read?: boolean;
  isRead?: boolean;
  createdAt?: string;
  time?: string;
  sender?: {
    id?: string;
    name?: string;
    username?: string;
    profilePictureUrl?: string;
    avatarUrl?: string;
  };
  user?: {
    id?: string;
    name?: string;
    username?: string;
    profilePictureUrl?: string;
    avatarUrl?: string;
  };
  metadata?: any;
}

export const notificationService = {
  /**
   * GET /notifications
   * Fetch current user's notifications list
   */
  async getNotifications(): Promise<NotificationItem[]> {
    try {
      const response = await apiClient.get('/notifications');
      const data = response.data;
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.items)) return data.items;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.notifications)) return data.notifications;
      return [];
    } catch (error) {
      console.warn('[notificationService] Failed to fetch notifications:', error);
      return [];
    }
  },

  /**
   * PATCH /notifications/read-all
   * Mark all notifications as read for current user
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      await apiClient.patch('/notifications/read-all');
      return true;
    } catch (error) {
      console.warn('[notificationService] Failed to mark all as read:', error);
      return false;
    }
  },

  /**
   * PATCH /notifications/{id}/read
   * Mark a single notification as read
   */
  async markAsRead(id: string): Promise<boolean> {
    try {
      await apiClient.patch(`/notifications/${id}/read`);
      return true;
    } catch (error) {
      console.warn(`[notificationService] Failed to mark notification ${id} as read:`, error);
      return false;
    }
  },

  /**
   * POST /notifications/devices
   * Register push notification device token
   */
  async registerDevice(token: string, platform: 'android' | 'ios' | 'web' = 'android'): Promise<any> {
    try {
      const response = await apiClient.post('/notifications/devices', {
        registrationToken: token,
        installationId: token,
        token: token,
        platform,
      });
      return response.data;
    } catch (error) {
      console.warn('[notificationService] Failed to register device token:', error);
      return null;
    }
  },

  /**
   * DELETE /notifications/devices/{id}
   * Remove a registered notification device installation
   */
  async removeDevice(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/notifications/devices/${id}`);
      return true;
    } catch (error) {
      console.warn(`[notificationService] Failed to remove device ${id}:`, error);
      return false;
    }
  },
};
