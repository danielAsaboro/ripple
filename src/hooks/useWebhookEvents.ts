// File: /hooks/useWebhookEvents.ts
import { useEffect, useState, useCallback } from "react";
import { toast } from "react-hot-toast";

interface WebhookEvent {
  type: string;
  eventType?: string;
  timestamp: string;
  payload: any;
}

export function useWebhookEvents() {
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const connect = useCallback(() => {
    console.log("Attempting to connect to SSE...");
    let eventSource: EventSource | null = null;

    try {
      // Close any existing connection
      if (eventSource) {
        eventSource.close();
      }

      // Create new EventSource connection
      eventSource = new EventSource("/api/webhook-events");

      // Connection opened
      eventSource.onopen = () => {
        console.log("SSE Connection opened");
        setIsConnected(true);
        setError(null);
        setReconnectAttempt(0);
        toast.success("Connected to live updates");
      };

      // Receive message
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received event:", data);

          if (data.type === "ping") {
            // Handle ping - connection is alive
            return;
          }

          setEvents((prev) => [data, ...prev].slice(0, 100)); // Keep last 100 events
        } catch (err) {
          console.error("Error parsing event data:", err);
        }
      };

      // Handle errors
      eventSource.onerror = (error) => {
        console.error("EventSource failed:", error);
        eventSource?.close();
        setIsConnected(false);
        setError(new Error("Connection to live updates failed"));

        // Implement exponential backoff for reconnection
        const timeout = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
        console.log(
          `Reconnecting in ${timeout}ms... (attempt ${reconnectAttempt + 1})`
        );

        setTimeout(() => {
          setReconnectAttempt((prev) => prev + 1);
          connect();
        }, timeout);
      };

      return () => {
        if (eventSource) {
          console.log("Closing SSE connection");
          eventSource.close();
          setIsConnected(false);
        }
      };
    } catch (err) {
      console.error("Error setting up SSE:", err);
      setError(err as Error);
      setIsConnected(false);

      // Attempt to reconnect
      setTimeout(() => {
        setReconnectAttempt((prev) => prev + 1);
        connect();
      }, 5000);
    }
  }, [reconnectAttempt]);

  // Initial connection
  useEffect(() => {
    const cleanup = connect();
    return () => {
      if (cleanup && typeof cleanup === "function") {
        cleanup();
      }
    };
  }, [connect]);

  const clearEvents = () => {
    setEvents([]);
    toast.success("Events cleared");
  };

  return {
    events,
    isConnected,
    error,
    clearEvents,
    reconnect: connect,
  };
}
