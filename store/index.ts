import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import loadingReducer from './slices/loadingSlice';
import toastReducer from './slices/toastSlice';
import eventReducer from './slices/eventSlice';
import chatReducer from './slices/chatSlice';
import hostReducer from './slices/hostSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    loading: loadingReducer,
    toast: toastReducer,
    event: eventReducer,
    chat: chatReducer,
    host: hostReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Prevents errors with Date parsing and complex structures
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
