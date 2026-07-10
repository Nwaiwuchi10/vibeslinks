import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventState {
  events: any[];
  nearYou: any[];
  recommended: any[];
  myTickets: any[];
  currentEvent: any | null;
  comments: any[];
  isLoadingEvents: boolean;
}

const initialState: EventState = {
  events: [],
  nearYou: [],
  recommended: [],
  myTickets: [],
  currentEvent: null,
  comments: [],
  isLoadingEvents: false,
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setEvents(state, action: PayloadAction<any[]>) {
      state.events = action.payload;
    },
    setNearYou(state, action: PayloadAction<any[]>) {
      state.nearYou = action.payload;
    },
    setRecommended(state, action: PayloadAction<any[]>) {
      state.recommended = action.payload;
    },
    setMyTickets(state, action: PayloadAction<any[]>) {
      state.myTickets = action.payload;
    },
    setCurrentEvent(state, action: PayloadAction<any>) {
      state.currentEvent = action.payload;
    },
    setComments(state, action: PayloadAction<any[]>) {
      state.comments = action.payload;
    },
    addCommentToState(state, action: PayloadAction<any>) {
      state.comments.unshift(action.payload);
    },
    setLoadingEvents(state, action: PayloadAction<boolean>) {
      state.isLoadingEvents = action.payload;
    },
  },
});

export const {
  setEvents,
  setNearYou,
  setRecommended,
  setMyTickets,
  setCurrentEvent,
  setComments,
  addCommentToState,
  setLoadingEvents,
} = eventSlice.actions;

export default eventSlice.reducer;
