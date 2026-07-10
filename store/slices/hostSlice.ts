import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HostState {
  overview: any | null;
  events: any[];
  tickets: any[];
}

const initialState: HostState = {
  overview: null,
  events: [],
  tickets: [],
};

const hostSlice = createSlice({
  name: 'host',
  initialState,
  reducers: {
    setOverview(state, action: PayloadAction<any>) {
      state.overview = action.payload;
    },
    setHostEvents(state, action: PayloadAction<any[]>) {
      state.events = action.payload;
    },
    setHostTickets(state, action: PayloadAction<any[]>) {
      state.tickets = action.payload;
    },
  },
});

export const { setOverview, setHostEvents, setHostTickets } = hostSlice.actions;
export default hostSlice.reducer;
