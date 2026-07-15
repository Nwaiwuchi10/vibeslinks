import React, { createContext, useContext, useState, ReactNode } from 'react';

// ─── Ticket Tier for Physical Events ─────────────────────────────────────────
export interface TicketTier {
  tierName: string;
  currency: string;
  price: number;
  description: string;
  capacity: number;
}

// ─── Full form state ──────────────────────────────────────────────────────────
export interface CreateEventState {
  // Common
  title: string;
  category: string;
  imageUrl: string;        // physical event poster / livestream cover
  description: string;
  virtualEvent: boolean;

  // Physical event fields
  location: string;
  venue: string;
  venueLocation: {
    name: string;
    address: string;
    mapUrl: string;
    latitude: number;
    longitude: number;
  };
  startsAt: string;        // ISO string  (API field name)
  endsAt: string;          // ISO string  (API field name)
  timezone: string;
  totalCapacity: number;
  ticketTiers: TicketTier[];  // API field name: ticketTiers
  tags: string[];
  dressCode: string;
  ageRestriction: string;
  refundPolicy: string;
  artisteIds: string[]; // Added to match backend create event API
  
  // Livestream-specific fields
  liveStreamPrivacy: 'all' | 'ticket-holders-only' | 'invite-only';
  liveStreamTicketPrice: number;   // 0 = free

  publish: boolean;
}

export interface CreateEventContextType {
  eventData: CreateEventState;
  updateEventData: (data: Partial<CreateEventState>) => void;
  resetEventData: () => void;
}

const defaultState: CreateEventState = {
  title: '',
  category: 'concert',
  imageUrl: '',
  description: '',
  virtualEvent: false,

  location: '',
  venue: '',
  venueLocation: {
    name: '',
    address: '',
    mapUrl: '',
    latitude: 0,
    longitude: 0,
  },
  startsAt: '',
  endsAt: '',
  timezone: 'Africa/Lagos',
  totalCapacity: 0,
  ticketTiers: [],
  tags: [],
  dressCode: '',
  ageRestriction: '',
  refundPolicy: '',
  artisteIds: [],

  liveStreamPrivacy: 'all',
  liveStreamTicketPrice: 0,

  publish: true,
};

const CreateEventContext = createContext<CreateEventContextType | undefined>(undefined);

export const CreateEventProvider = ({ children }: { children: ReactNode }) => {
  const [eventData, setEventData] = useState<CreateEventState>(defaultState);

  const updateEventData = (data: Partial<CreateEventState>) => {
    setEventData((prev) => ({ ...prev, ...data }));
  };

  const resetEventData = () => {
    setEventData(defaultState);
  };

  return (
    <CreateEventContext.Provider value={{ eventData, updateEventData, resetEventData }}>
      {children}
    </CreateEventContext.Provider>
  );
};

export const useCreateEvent = () => {
  const context = useContext(CreateEventContext);
  if (!context) {
    throw new Error('useCreateEvent must be used within a CreateEventProvider');
  }
  return context;
};
