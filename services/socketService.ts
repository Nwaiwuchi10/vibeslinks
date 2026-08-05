import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import { addMessage, setSocketConnected } from '@/store/slices/chatSlice';

const BASE_URL = 'https://vibezlink-app-on-god-backend-production.up.railway.app';

class SocketService {
  private socket: Socket | null = null;
  private userId: string | null = null;

  connect(token: string, userId?: string) {
    if (this.socket?.connected) return;

    this.userId = userId || null;

    this.socket = io(BASE_URL, {
      auth: { token, accessToken: token },
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('[SocketService] Connected to gateway');
    });

    this.socket.on('realtime:connected', (data: any) => {
      console.log('[SocketService] Realtime connection approved:', data);
      store.dispatch(setSocketConnected(true));

      // Auto-join the user's room to receive chat:message.created
      if (this.userId) {
        this.joinRoom(`user:${this.userId}`);
      }
    });

    this.socket.on('realtime:error', (error: any) => {
      console.error('[SocketService] Realtime auth error:', error);
      store.dispatch(setSocketConnected(false));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] Disconnected:', reason);
      store.dispatch(setSocketConnected(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] Connection error:', error);
      store.dispatch(setSocketConnected(false));
    });

    // Real-time message listener matching chat-socket-handoff.md
    this.socket.on('chat:message.created', (message: any) => {
      console.log('[SocketService] Received real-time message:', message);
      if (message && message.conversationId) {
        store.dispatch(addMessage(message));
      }
    });

    this.socket.on('realtime:joined', (data: any) => {
      console.log('[SocketService] Successfully joined room:', data);
    });

    this.socket.on('realtime:left', (data: any) => {
      console.log('[SocketService] Successfully left room:', data);
    });

    // Handle NestJS validation exceptions
    this.socket.on('exception', (data: any) => {
      console.warn('[SocketService] Gateway Exception:', data);
    });
  }

  // Room Join and Leave matching handoffs
  joinRoom(room: string) {
    if (!this.socket?.connected) {
      console.warn(`[SocketService] Cannot join room ${room} - socket not connected`);
      return;
    }
    console.log(`[SocketService] Joining room: ${room}`);
    this.socket.emit('realtime:join', { rooms: [room] });
  }

  leaveRoom(room: string) {
    if (!this.socket?.connected) return;
    console.log(`[SocketService] Leaving room: ${room}`);
    this.socket.emit('realtime:leave', { rooms: [room] });
  }

  on(event: string, callback: (data: any) => void) {
    this.socket?.on(event, callback);
  }

  off(event: string, callback?: (data: any) => void) {
    if (callback) {
      this.socket?.off(event, callback);
    } else {
      this.socket?.off(event);
    }
  }

  // Live Stream room listeners matching live-stream-emitter-handoff.md
  onLivestreamUpdated(callback: (data: any) => void) {
    this.socket?.on('livestream:updated', callback);
  }

  onHostDashboardUpdated(callback: (data: any) => void) {
    this.socket?.on('host:dashboard.updated', callback);
  }

  onNotificationNew(callback: (data: any) => void) {
    this.socket?.on('notification:new', callback);
  }

  onLivestreamReaction(callback: (data: any) => void) {
    this.socket?.on('livestream:reaction', callback);
  }

  onLivestreamViewerJoined(callback: (data: any) => void) {
    this.socket?.on('livestream:viewer.joined', callback);
  }

  offLivestreamEvents() {
    if (!this.socket) return;
    this.socket.off('livestream:updated');
    this.socket.off('host:dashboard.updated');
    this.socket.off('notification:new');
    this.socket.off('livestream:reaction');
    this.socket.off('livestream:viewer.joined');
  }

  // ─── Legacy Compatibility Methods ──────────────────────────────────────────
  joinConversation(conversationId: string) {
    this.joinRoom(conversationId);
  }

  leaveConversation(conversationId: string) {
    this.leaveRoom(conversationId);
  }

  joinLiveStream(streamId: string) {
    this.joinRoom(`livestream:${streamId}`);
  }

  leaveLiveStream(streamId: string) {
    this.leaveRoom(`livestream:${streamId}`);
  }

  sendLiveStreamMessage(streamId: string, messageText: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('liveMessage', { streamId, message: messageText });
  }

  sendLiveStreamReaction(streamId: string, emoji: 'love' | 'clap' | 'like' | 'fire') {
    if (!this.socket?.connected) return;
    this.socket.emit('liveReaction', { streamId, emoji });
  }

  onLiveStreamUpdate(callback: (data: any) => void) {
    this.socket?.on('livestream:updated', callback);
  }

  onLiveStreamMessage(callback: (msg: any) => void) {
    this.socket?.on('chat:message.created', callback);
  }

  offLiveStreamEvents() {
    this.offLivestreamEvents();
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.userId = null;
      store.dispatch(setSocketConnected(false));
      console.log('[SocketService] Socket connection destroyed.');
    }
  }
}

export const socketService = new SocketService();
