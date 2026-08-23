import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { eventService } from '@/services/eventService';

// ─── Ticket Tier for Physical Events ─────────────────────────────────────────
export interface TicketTier {
  id?: string;
  tierName: string;
  ticketName?: string;
  currency: string;
  price: number;
  description: string;
  capacity: number;
  quantity?: number;
  benefits?: string[];
  freeEntry?: boolean;
}

export interface FeaturedArtistState {
  id?: string;
  name: string;
  category?: string;
  imageUrl?: string;
  profilePictureUrl?: string;
  isCustom?: boolean;
}

export interface CreateEventOptionsResponse {
  eventModes?: Array<{
    key: string;
    label: string;
    description: string;
    endpoint: string;
  }>;
  wizardSteps?: Array<{
    key: string;
    title: string;
    description: string;
    fields: string[];
  }>;
  formSections?: Array<{
    key: string;
    title: string;
    fields: string[];
  }>;
  artists?: Array<{
    id: string;
    name: string;
    profilePictureUrl?: string;
    avatarUrl?: string;
    category?: string;
  }>;
  artistOptional?: boolean;
  artistCategories?: string[];
  categories?: string[];
  categoryOptions?: Array<{
    value: string;
    label: string;
  }>;
  currencies?: string[];
  timezones?: string[];
  ticketTypeTabs?: string[];
  defaultTicketTierNames?: string[];
  ticketForm?: {
    fields: string[];
    defaultCurrency: string;
    allowsCustomTicketNames: boolean;
    allowsMultipleTickets: boolean;
  };
  previewActions?: {
    saveDraft?: {
      create?: { method: string; endpoint: string; saveAsDraft: boolean };
      update?: { method: string; endpoint: string };
    };
    publish?: {
      create?: { method: string; endpoint: string; publish: boolean };
      draft?: { method: string; endpoint: string; publish: boolean };
    };
  };
}

// ─── Full form state ──────────────────────────────────────────────────────────
export interface CreateEventState {
  // Common
  title: string;
  category: string;
  imageUrl: string;        // physical event poster / livestream cover
  eventPosterUrl?: string;
  description: string;
  virtualEvent: boolean;

  // Physical event fields
  location: string;
  city: string;
  country: string;
  venue: string;
  venueLocation: {
    name: string;
    address: string;
    city?: string;
    state?: string;
    country?: string;
    mapUrl?: string;
    latitude: number;
    longitude: number;
  };
  startsAt: string;        // ISO string  (API field name)
  endsAt: string;          // ISO string  (API field name)
  timezone: string;
  totalCapacity: number;
  ticketTiers: TicketTier[];  // API field name: ticketTiers / ticketPricingTiers
  tags: string[];
  dressCode: string;
  ageRestriction: string;
  refundPolicy: string;
  artisteIds: string[]; // Registered platform artist UUIDs
  featuredArtists: FeaturedArtistState[]; // Custom / guest artists
  
  // Livestream-specific fields
  liveStreamPrivacy: 'all' | 'ticket-holders-only' | 'invite-only';
  liveStreamTicketPrice: number;   // 0 = free

  publish: boolean;
}

export interface CreateEventContextType {
  eventData: CreateEventState;
  updateEventData: (data: Partial<CreateEventState>) => void;
  resetEventData: () => void;
  options: CreateEventOptionsResponse | null;
  isLoadingOptions: boolean;
  refreshOptions: () => Promise<void>;
}

const defaultState: CreateEventState = {
  title: '',
  category: 'concert',
  imageUrl: '',
  eventPosterUrl: '',
  description: '',
  virtualEvent: false,

  location: '',
  city: '',
  country: '',
  venue: '',
  venueLocation: {
    name: '',
    address: '',
    city: '',
    state: '',
    country: '',
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
  featuredArtists: [],

  liveStreamPrivacy: 'all',
  liveStreamTicketPrice: 0,

  publish: true,
};

const CreateEventContext = createContext<CreateEventContextType | undefined>(undefined);

export const CreateEventProvider = ({ children }: { children: ReactNode }) => {
  const [eventData, setEventData] = useState<CreateEventState>(defaultState);
  const [options, setOptions] = useState<CreateEventOptionsResponse | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  const fetchOptions = useCallback(async () => {
    setIsLoadingOptions(true);
    try {
      const opts = await eventService.getCreateEventOptions();
      setOptions(opts);
    } catch (err) {
      console.warn('[CreateEventProvider] Failed to fetch create-options:', err);
    } finally {
      setIsLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  const updateEventData = (data: Partial<CreateEventState>) => {
    setEventData((prev) => ({ ...prev, ...data }));
  };

  const resetEventData = () => {
    setEventData(defaultState);
  };

  return (
    <CreateEventContext.Provider
      value={{
        eventData,
        updateEventData,
        resetEventData,
        options,
        isLoadingOptions,
        refreshOptions: fetchOptions,
      }}
    >
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
