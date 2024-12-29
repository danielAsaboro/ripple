// File: /app/api/webhook-events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ServerEvent } from "@/types/events";
import { createISOTimestamp } from "@/utils/date";

let clients = new Set<ReadableStreamDefaultController>();
const encoder = new TextEncoder();

const removeClient = (controller: ReadableStreamDefaultController) => {
  clients.delete(controller);
  console.log(`Client disconnected. Remaining clients: ${clients.size}`);
};

export async function GET(req: NextRequest) {
  console.log("New SSE connection attempt...");

  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);
      console.log(`Client connected. Total clients: ${clients.size}`);

      const initialMessage: ServerEvent = {
        type: "connection",
        status: "connected",
        timestamp: createISOTimestamp(),
        clientCount: clients.size,
      };

      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify(initialMessage)}\n\n`)
      );
      req.signal.addEventListener("abort", () => removeClient(controller));
    },
    cancel() {
      console.log("Stream cancelled by client");
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Transfer-Encoding": "chunked",
      "Access-Control-Allow-Origin": "*",
      "X-Accel-Buffering": "no",
    },
  });
}

export function broadcastEvent(data: ServerEvent) {
  console.log(`Broadcasting event to ${clients.size} clients:`, data);

  const event = `data: ${JSON.stringify(data)}\n\n`;
  const encodedEvent = encoder.encode(event);

  clients.forEach((client) => {
    try {
      client.enqueue(encodedEvent);
    } catch (error) {
      console.error("Error sending event to client:", error);
      removeClient(client);
    }
  });
}

const PING_INTERVAL = 30000;
setInterval(() => {
  if (clients.size > 0) {
    const ping: ServerEvent = {
      type: "ping",
      timestamp: createISOTimestamp(),
    };
    broadcastEvent(ping);
  }
}, PING_INTERVAL);

const MONITORING_INTERVAL = 60000;
setInterval(() => {
  console.log(`Active SSE clients: ${clients.size}`);
}, MONITORING_INTERVAL);
