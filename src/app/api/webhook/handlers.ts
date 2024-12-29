// File: /app/api/webhook/handlers.ts
import { RawEvent } from "@/types/events";

const ANALYTICS_WEBHOOK_URL = "YOUR_ANALYTICS_WEBHOOK_URL"; // Replace with your analytics webhook URL
const ANALYTICS_WEBHOOK_TIMEOUT = 60 * 1000;

interface WebhookConfig {
  url: string;
  headers?: Record<string, string>;
  timeout?: number;
}

const webhookConfigs: Record<string, WebhookConfig> = {
  default: {
    url: "https://api.quicknode.com/functions/rest/v1/functions/f303850f-364c-4822-a92f-f7ff7420f8e8/call",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "QuickNode-Function/1.0",
      "x-api-key": "QN_2f27fdca85ee498b865d174ef37a7f76",
    },
    timeout: WEBHOOK_TIMEOUT,
  },
  analytics: {
    url: ANALYTICS_WEBHOOK_URL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: WEBHOOK_TIMEOUT,
  },
};

async function sendToWebhook(
  payload: any,
  config: WebhookConfig
): Promise<void> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    config.timeout || WEBHOOK_TIMEOUT
  );

  try {
    const formattedPayload = {
      user_data: payload,
    };

    const response = await fetch(config.url, {
      method: "POST",
      headers: {
        ...config.headers,
      },
      body: JSON.stringify(formattedPayload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status >= 400 && response.status < 500) {
      const responseData = await response.json();
      throw new Error(
        `Webhook failed: ${response.status} - ${JSON.stringify(responseData)}`
      );
    }

    const responseData = await response.json();
    console.log(`Webhook response for ${config.url}:`, {
      status: response.status,
      data: responseData,
    });
  } catch (error) {
    handleWebhookError(error, config.url);
    throw error;
  }
}

function handleWebhookError(error: unknown, webhookUrl: string): void {
  if (error instanceof TypeError && error.message.includes("abort")) {
    console.error(
      `Webhook timeout after ${WEBHOOK_TIMEOUT}ms for ${webhookUrl}`
    );
  } else if (error instanceof Error) {
    console.error(`Webhook error for ${webhookUrl}:`, {
      message: error.message,
      status: error instanceof TypeError ? undefined : (error as any).status,
      response:
        error instanceof TypeError ? undefined : (error as any).responseData,
    });
  } else {
    console.error(
      `Unexpected webhook error for ${webhookUrl}:`,
      error instanceof Error ? error.message : String(error)
    );
  }
}

export async function processEvents(events: RawEvent[]): Promise<void> {
  // Process all events for the default webhook
  await sendToWebhook(events, webhookConfigs.default);

  // Filter and process donation events for analytics
  const donationEvents = events.filter(
    (event) => event?.parsedData?.type === "DONATE"
  );

  if (donationEvents.length > 0) {
    try {
      await sendToWebhook(donationEvents, webhookConfigs.analytics);
      console.log(
        `Successfully forwarded ${donationEvents.length} donation events to analytics`
      );
    } catch (error) {
      console.error("Failed to process donation events for analytics:", error);
      // Don't throw here to prevent failing the main webhook if analytics fails
    }
  }
}
