import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  message: string;
  createdAt: string;
  sender?: any;
}

interface ChatState {
  threads: any[];
  messages: { [conversationId: string]: Message[] };
  isConnected: boolean;
}

const initialState: ChatState = {
  threads: [],
  messages: {},
  isConnected: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setThreads(state, action: PayloadAction<any[]>) {
      state.threads = action.payload;
    },
    updateThread(state, action: PayloadAction<any>) {
      const index = state.threads.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.threads[index] = { ...state.threads[index], ...action.payload };
      } else {
        state.threads.unshift(action.payload);
      }
    },
    setMessages(state, action: PayloadAction<{ conversationId: string; messages: Message[] }>) {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      // Avoid duplicate socket messages
      if (!state.messages[conversationId].some((m) => m.id === action.payload.id)) {
        state.messages[conversationId].push(action.payload);
      }
      
      // Update last message in thread
      const threadIndex = state.threads.findIndex((t) => t.id === conversationId);
      if (threadIndex !== -1) {
        state.threads[threadIndex].lastMessage = action.payload;
        state.threads[threadIndex].updatedAt = action.payload.createdAt;
      }
    },
    setSocketConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
  },
});

export const {
  setThreads,
  updateThread,
  setMessages,
  addMessage,
  setSocketConnected,
} = chatSlice.actions;

export default chatSlice.reducer;
