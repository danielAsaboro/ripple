// File: /types/events.ts
import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export type WebhookEventType =
  | "campaign_created"
  | "donation_received"
  | "user_initialized"
  | "campaign_updated"
  | "funds_withdrawn";

export const eventTypeMap = {
  CREATE_CAMPAIGN: "campaign_created",
  DONATE: "donation_received",
  INITIALIZE: "user_initialized",
  UPDATE_CAMPAIGN: "campaign_updated",
  WITHDRAW_FUNDS: "funds_withdrawn",
} as const;

export type RawEventType = keyof typeof eventTypeMap;

export interface RawEvent {
  parsedData: {
    type: RawEventType;
    data: Record<string, unknown>;
  };
  blockTime?: number;
  accounts?: Record<string, unknown>;
}
export const VALID_EVENT_TYPES = Object.values(eventTypeMap);

export interface WebhookEventMetadata {
  title?: string;
  category?: string;
  targetAmount?: string;
  organization?: string;
  startDate?: number;
  endDate?: number;
  isUrgent?: boolean;
  amount?: string;
  paymentMethod?: string;
  name?: string;
  updates?: {
    description?: string | null;
    imageUrl?: string | null;
    endDate?: number | null;
    status?: string | null;
    isUrgent?: boolean | null;
  };
}

export interface WebhookEventPayload {
  metadata: WebhookEventMetadata;
  blockTime: number;
  accounts: Record<string, unknown>;
  parsedData: {
    type: string;
    data: Record<string, unknown>;
  };
}
export interface WebhookEvent {
  type: "webhook";
  eventType: WebhookEventType;
  timestamp: string;
  payload: WebhookEventPayload;
}

export interface SystemEvent {
  type: "connection" | "ping";
  timestamp: string;
  status?: "connected";
  clientCount?: number;
}

export type ServerEvent = WebhookEvent | SystemEvent;

// API Response Types
export interface WebhookResponse {
  received: boolean;
  eventsProcessed: number;
  totalEvents: number;
  skippedEvents: number;
  timestamp: string;
}

export interface WebhookError {
  message: string;
  error: string;
}

// Validation Types for specific events
export interface CampaignCreatedEvent {
  accounts: {
    campaign: PublicKey;
    authority: PublicKey;
  };
  data: {
    title: string;
    category: string;
    targetAmount: BN;
    organizationName: string;
    startDate: BN;
    endDate: BN;
  };
}

export interface DonationReceivedEvent {
  accounts: {
    donation: PublicKey;
    campaign: PublicKey;
    donor: PublicKey;
  };
  data: {
    amount: BN;
    timestamp: BN;
    paymentMethod: string;
  };
}

export interface UserInitializedEvent {
  accounts: {
    user: PublicKey;
    authority: PublicKey;
  };
  data: {
    name: string;
  };
}

export interface EventStreamState {
  isConnected: boolean;
  events: WebhookEvent[];
  lastEventTimestamp: string | null;
  error: Error | null;
}
