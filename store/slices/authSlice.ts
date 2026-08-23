import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'vibezlink_access_token';
const USER_KEY = 'vibezlink_user_info';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: any | null;
  isRestoring: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  isRestoring: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ token: string; user: any }>) {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isRestoring = false;
      
      // Async save in background
      SecureStore.setItemAsync(TOKEN_KEY, action.payload.token).catch((err) =>
        console.error('Failed to save auth token to SecureStore', err)
      );
      SecureStore.setItemAsync(USER_KEY, JSON.stringify(action.payload.user)).catch((err) =>
        console.error('Failed to save user profile to SecureStore', err)
      );
    },
    clearCredentials(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.isRestoring = false;
      
      // Async clear in background
      SecureStore.deleteItemAsync(TOKEN_KEY).catch((err) =>
        console.error('Failed to remove auth token from SecureStore', err)
      );
      SecureStore.deleteItemAsync(USER_KEY).catch((err) =>
        console.error('Failed to remove user profile from SecureStore', err)
      );
    },
    restoredCredentials(state, action: PayloadAction<{ token: string | null; user: any | null }>) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = !!action.payload.token;
      state.isRestoring = false;
    },
  },
});

export const { setCredentials, clearCredentials, restoredCredentials } = authSlice.actions;
export default authSlice.reducer;
