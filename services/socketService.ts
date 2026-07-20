import { io, Socket } from 'socket.io-client';
import { store } from '@/store';
import { addMessage, setSocketConnected } from '@/store/slices/chatSlice';

const BASE_URL = 'https://vibezlink-app-on-god-backend-production.up.railway.app';

class SocketService {
  private socket: Socket | null = null;

  connect(token: string) {
    if (this.socket?.connected) return;

    this.socket = io(BASE_URL, {
      auth: { token },
      transports: ['polling', 'websocket'],
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('[SocketService] Connected to gateway');
      store.dispatch(setSocketConnected(true));
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SocketService] Disconnected:', reason);
      store.dispatch(setSocketConnected(false));
    });

    this.socket.on('connect_error', (error) => {
      console.error('[SocketService] Connection error:', error);
      store.dispatch(setSocketConnected(false));
    });

    // Real-time message listener
    this.socket.on('message', (message: any) => {
      console.log('[SocketService] Received real-time message:', message);
      if (message && message.conversationId) {
        store.dispatch(addMessage(message));
      }
    });

    // Handle NestJS validation exceptions sent over websockets
    this.socket.on('exception', (data: any) => {
      console.warn('[SocketService] Gateway Exception:', data);
    });
  }

  onLiveStreamUpdate(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('liveStreamUpdate', callback);
  }

  onLiveStreamMessage(callback: (msg: any) => void) {
    if (!this.socket) return;
    this.socket.on('liveMessage', callback);
  }

  offLiveStreamEvents() {
    if (!this.socket) return;
    this.socket.off('liveStreamUpdate');
    this.socket.off('liveMessage');
  }

  joinConversation(conversationId: string) {
    if (!this.socket?.connected) {
      console.warn('[SocketService] Socket not connected. Cannot join conversation.');
      return;
    }
    console.log(`[SocketService] Joining conversation: ${conversationId}`);
    this.socket.emit('joinRoom', { conversationId });
  }

  leaveConversation(conversationId: string) {
    if (!this.socket?.connected) return;
    console.log(`[SocketService] Leaving conversation: ${conversationId}`);
    this.socket.emit('leaveRoom', { conversationId });
  }

  joinLiveStream(streamId: string) {
    if (!this.socket?.connected) return;
    console.log(`[SocketService] Joining live stream room: ${streamId}`);
    this.socket.emit('joinRoom', { conversationId: `stream_${streamId}` });
  }

  leaveLiveStream(streamId: string) {
    if (!this.socket?.connected) return;
    console.log(`[SocketService] Leaving live stream room: ${streamId}`);
    this.socket.emit('leaveRoom', { conversationId: `stream_${streamId}` });
  }

  sendLiveStreamMessage(streamId: string, messageText: string) {
    if (!this.socket?.connected) return;
    this.socket.emit('liveMessage', { streamId, message: messageText });
  }

  sendLiveStreamReaction(streamId: string, emoji: 'love' | 'clap' | 'like' | 'fire') {
    if (!this.socket?.connected) return;
    this.socket.emit('liveReaction', { streamId, emoji });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      store.dispatch(setSocketConnected(false));
      console.log('[SocketService] Socket connection destroyed.');
    }
  }
}

export const socketService = new SocketService();
