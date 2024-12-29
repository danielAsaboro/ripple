// File: /app/api/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { broadcastEvent } from "../webhook-events/route";

export async function POST(req: NextRequest) {
  try {
    // Get the request body as JSON
    const data = await req.json();
    
    console.log("Webhook received:", JSON.stringify(data, null, 2));

    // Validate the webhook data structure
    if (!data || !Array.isArray(data)) {
      console.error("Invalid webhook data format");
      return NextResponse.json(
        { message: "Invalid data format" },
        { status: 400 }
      );
    }

    // Parse and broadcast each event in the webhook
    data.forEach(event => {
      if (event.parsedData?.type === "CREATE_CAMPAIGN") {
        const webhookEvent = {
          type: 'webhook',
          eventType: 'campaign_created',
          timestamp: new Date().toISOString(),
          payload: event
        };

        console.log("Broadcasting campaign event:", webhookEvent);
        broadcastEvent(webhookEvent);
      }
    });

    // Send acknowledgment
    return NextResponse.json({ 
      received: true,
      eventsProcessed: data.length
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { message: "Error processing webhook" },
      { status: 400 }
    );
  }
}