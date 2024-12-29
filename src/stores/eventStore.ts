// File: /stores/eventStore.ts
import { create } from "zustand";
import { WebhookEvent } from "@/types/events";

interface EventState {
  events: WebhookEvent[];
  isConnected: boolean;
  lastProcessedEvent: string | null;
  error: Error | null;
  addEvent: (event: WebhookEvent) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: Error | null) => void;
  clearEvents: () => void;
}

const MAX_EVENTS = 1000; // Maximum number of events to keep in memory

export const useEventStore = create<EventState>((set) => ({
  events: [],
  isConnected: false,
  lastProcessedEvent: null,
  error: null,

  addEvent: (event) =>
    set((state) => ({
      events: [event, ...state.events].slice(0, MAX_EVENTS),
      lastProcessedEvent: event.timestamp,
    })),

  setConnected: (connected) =>
    set((state) => ({
      isConnected: connected,
      error: connected ? null : state.error,
    })),

  setError: (error) =>
    set(() => ({
      error,
      isConnected: false,
    })),

  clearEvents: () =>
    set(() => ({
      events: [],
      lastProcessedEvent: null,
    })),
}));

// Helper functions to filter events by type
export const getEventsByType = (events: WebhookEvent[], type: string) =>
  events.filter((event) => event.eventType === type);

// Helper to get events for a specific campaign
export const getCampaignEvents = (events: WebhookEvent[], campaignId: string) =>
  events.filter((event) => event.payload?.campaign === campaignId);

// Helper to get events for a specific user
export const getUserEvents = (events: WebhookEvent[], userId: string) =>
  events.filter((event) => event.payload?.user === userId);
