import { createSlice } from '@reduxjs/toolkit';

interface LoadingState {
  loadingCount: number;
}

const initialState: LoadingState = {
  loadingCount: 0,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    startLoading(state) {
      state.loadingCount += 1;
    },
    stopLoading(state) {
      state.loadingCount = Math.max(0, state.loadingCount - 1);
    },
    clearLoading(state) {
      state.loadingCount = 0;
    },
  },
});

export const { startLoading, stopLoading, clearLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
