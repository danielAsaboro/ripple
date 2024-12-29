// File: /app/api/webhook-events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers';

// Keep track of connected clients
let clients = new Set<ReadableStreamDefaultController>();

export async function GET(req: NextRequest) {
  console.log("New SSE connection attempt...");

  const stream = new ReadableStream({
    start(controller) {
      clients.add(controller);
      console.log(`Client connected. Total clients: ${clients.size}`);

      // Send initial connection message
      const initialMessage = `data: ${JSON.stringify({
        type: 'connection',
        message: 'Connected to server',
        timestamp: new Date().toISOString()
      })}\n\n`;

      controller.enqueue(new TextEncoder().encode(initialMessage));

      // Remove client when connection closes
      req.signal.addEventListener('abort', () => {
        clients.delete(controller);
        console.log(`Client disconnected. Remaining clients: ${clients.size}`);
      });
    },
    cancel() {
      // Handle stream cancellation
      console.log("Stream cancelled by client");
    }
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
      'Access-Control-Allow-Origin': '*',
      'X-Accel-Buffering': 'no' // Disable Nginx buffering
    },
  });
}

export function broadcastEvent(data: any) {
  console.log(`Broadcasting event to ${clients.size} clients:`, data);
  
  const event = `data: ${JSON.stringify(data)}\n\n`;
  const encoder = new TextEncoder();
  
  clients.forEach(client => {
    try {
      client.enqueue(encoder.encode(event));
      console.log('Event sent successfully to client');
    } catch (error) {
      console.error('Error sending event to client:', error);
      clients.delete(client);
    }
  });
}

// Keep connection alive
setInterval(() => {
  if (clients.size > 0) {
    const ping = `data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`;
    clients.forEach(client => {
      try {
        client.enqueue(new TextEncoder().encode(ping));
      } catch (error) {
        clients.delete(client);
      }
    });
  }
}, 30000); // Send ping every 30 seconds