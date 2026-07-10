import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastState {
  toasts: ToastItem[];
}

const initialState: ToastState = {
  toasts: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast(state, action: PayloadAction<Omit<ToastItem, 'id'>>) {
      const id = Math.random().toString(36).substring(2, 9);
      state.toasts.push({
        ...action.payload,
        id,
        duration: action.payload.duration ?? 4000,
      });
    },
    hideToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    clearAllToasts(state) {
      state.toasts = [];
    },
  },
});

export const { showToast, hideToast, clearAllToasts } = toastSlice.actions;
export default toastSlice.reducer;
