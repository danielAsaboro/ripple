// // File: /app/api/webhook/route.ts

import { NextRequest, NextResponse } from "next/server";
import { broadcastEvent } from "../webhook-events/route";
import {
  WebhookEvent,
  WebhookEventType,
  WebhookEventMetadata,
  eventTypeMap,
  WebhookResponse,
  WebhookError,
  RawEvent,
  ServerEvent,
} from "@/types/events";

// Configuration
const CONFIG = {
  ANALYTICS_WEBHOOK_TIMEOUT: 60 * 1000,
  MAX_BATCH_SIZE: 100,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
} as const;

function validateEnvironmentVariables() {
  const requiredEnvVars = {
    ANALYTICS_WEBHOOK_URL: process.env.ANALYTICS_WEBHOOK_URL,
    QUICKNODE_API_KEY: process.env.QUICKNODE_API_KEY,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  try {
    new URL(process.env.ANALYTICS_WEBHOOK_URL!);
  } catch {
    throw new Error("ANALYTICS_WEBHOOK_URL is not a valid URL");
  }
}

function createISOTimestamp(): string {
  return new Date().toISOString();
}

function isValidEventType(type: string): type is keyof typeof eventTypeMap {
  return type in eventTypeMap;
}

function createEventMetadata(event: RawEvent): WebhookEventMetadata | null {
  if (!event?.parsedData?.data || typeof event.parsedData.data !== "object") {
    return null;
  }

  const { type, data } = event.parsedData;

  const isString = (value: unknown): value is string =>
    typeof value === "string";
  const isNumber = (value: unknown): value is number =>
    typeof value === "number";
  const isBoolean = (value: unknown): value is boolean =>
    typeof value === "boolean";

  switch (type) {
    case "CREATE_CAMPAIGN":
      return {
        title: isString(data.title) ? data.title : "Untitled",
        category: isString(data.category) ? data.category : "Unknown",
        targetAmount: isString(data.targetAmount) ? data.targetAmount : "0",
        organization: isString(data.organizationName)
          ? data.organizationName
          : "Unknown",
        startDate: isNumber(data.startDate) ? data.startDate : undefined,
        endDate: isNumber(data.endDate) ? data.endDate : undefined,
        isUrgent: isBoolean(data.isUrgent) ? data.isUrgent : false,
      };

    case "DONATE":
      return {
        amount: isString(data.amount) ? data.amount : "0",
        paymentMethod: isString(data.paymentMethod)
          ? data.paymentMethod
          : "Unknown",
      };

    case "INITIALIZE":
      return {
        name: isString(data.name) ? data.name : "Unknown",
      };

    case "UPDATE_CAMPAIGN":
      return {
        updates: {
          description: isString(data.description)
            ? data.description
            : undefined,
          imageUrl: isString(data.imageUrl) ? data.imageUrl : undefined,
          endDate: isNumber(data.endDate) ? data.endDate : undefined,
          status: isString(data.status) ? data.status : undefined,
          isUrgent: isBoolean(data.isUrgent) ? data.isUrgent : undefined,
        },
      };

    case "WITHDRAW_FUNDS":
      return {
        amount: isString(data.amount) ? data.amount : "0",
      };

    default:
      return null;
  }
}

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  retries: number = CONFIG.RETRY_ATTEMPTS,
  delay: number = CONFIG.RETRY_DELAY
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return retryWithBackoff(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

async function sendToAnalyticsWebhook(event: RawEvent): Promise<void> {
  validateEnvironmentVariables();

  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    CONFIG.ANALYTICS_WEBHOOK_TIMEOUT
  );

  try {
    const formattedPayload = {
      user_data: event,
    };

    await retryWithBackoff(async () => {
      const response = await fetch(process.env.ANALYTICS_WEBHOOK_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "QuickNode-Analytics/1.0",
          "x-api-key": process.env.QUICKNODE_API_KEY!,
        },
        body: JSON.stringify(formattedPayload),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Analytics webhook failed: ${response.status}`);
      }

      return response.json();
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("abort")) {
      console.error(
        `Analytics webhook timeout after ${CONFIG.ANALYTICS_WEBHOOK_TIMEOUT}ms`
      );
    } else {
      console.error("Analytics webhook error:", error);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: NextRequest) {
  try {
    validateEnvironmentVariables();

    const data = await req.json();
    console.log("Webhook received:", JSON.stringify(data, null, 2));

    if (!data || !Array.isArray(data)) {
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    if (data.length > CONFIG.MAX_BATCH_SIZE) {
      return NextResponse.json(
        { message: `Maximum batch size is ${CONFIG.MAX_BATCH_SIZE} events` },
        { status: 400 }
      );
    }

    const processedEvents: WebhookEvent[] = [];
    const analyticsPromises: Promise<void>[] = [];
    const errors: Array<{ index: number; error: string }> = [];

    await Promise.all(
      data.map(async (event: RawEvent, index) => {
        try {
          if (
            !event?.parsedData?.type ||
            !isValidEventType(event.parsedData.type)
          ) {
            throw new Error(`Invalid event type at index ${index}`);
          }

          const metadata = createEventMetadata(event);
          if (!metadata) {
            throw new Error(
              `Could not create metadata for event at index ${index}`
            );
          }

          const webhookEvent: WebhookEvent = {
            type: "webhook",
            eventType: eventTypeMap[event.parsedData.type],
            timestamp: createISOTimestamp(),
            payload: {
              metadata,
              blockTime: event.blockTime ?? Date.now(),
              accounts: event.accounts ?? {},
              parsedData: event.parsedData,
            },
          };

          // Only send donation and campaign creation events to analytics
          if (
            event.parsedData.type === "DONATE" ||
            event.parsedData.type === "CREATE_CAMPAIGN"
          ) {
            analyticsPromises.push(sendToAnalyticsWebhook(event));
          }

          broadcastEvent(webhookEvent as ServerEvent);
          processedEvents.push(webhookEvent);
        } catch (error) {
          errors.push({
            index,
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      })
    );

    // Handle analytics promises
    await Promise.allSettled(analyticsPromises).then((results) => {
      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        console.error(`${failed.length} analytics webhooks failed`);
      }
    });

    const response: WebhookResponse = {
      received: true,
      eventsProcessed: processedEvents.length,
      totalEvents: data.length,
      skippedEvents: data.length - processedEvents.length,
      timestamp: createISOTimestamp(),
    };

    if (errors.length > 0) {
      return NextResponse.json({ ...response, errors }, { status: 207 });
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      {
        message: "Error processing webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
