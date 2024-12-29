// src/utils/validation.ts
import { BN } from "@coral-xyz/anchor";
import {
  MIN_CAMPAIGN_DURATION,
  MAX_CAMPAIGN_DURATION,
  MIN_CAMPAIGN_TARGET,
} from "./constants";
// File: /utils/validation.ts
import {
  WebhookEvent,
  WebhookEventType,
  ServerEvent,
  eventTypeMap,
  VALID_EVENT_TYPES,
} from "@/types/events";

export const validateCampaignDuration = (
  startDate: number,
  endDate: number
): boolean => {
  const duration = endDate - startDate;
  return duration >= MIN_CAMPAIGN_DURATION && duration <= MAX_CAMPAIGN_DURATION;
};

export const validateCampaignTarget = (amount: number | BN): boolean => {
  return Number(amount) >= MIN_CAMPAIGN_TARGET;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export function isValidWebhookEvent(event: unknown): event is WebhookEvent {
  if (!event || typeof event !== "object") return false;

  const e = event as Partial<WebhookEvent>;

  return (
    e.type === "webhook" &&
    typeof e.eventType === "string" &&
    VALID_EVENT_TYPES.includes(e.eventType) &&
    typeof e.timestamp === "string" &&
    !!e.payload &&
    typeof e.payload === "object"
  );
}

export function isValidEventType(
  type: string
): type is keyof typeof eventTypeMap {
  return type in eventTypeMap;
}

export function isSystemEvent(event: unknown): event is ServerEvent {
  if (!event || typeof event !== "object") return false;

  const e = event as Partial<ServerEvent>;
  return (
    (e.type === "connection" || e.type === "ping") &&
    typeof e.timestamp === "string"
  );
}
