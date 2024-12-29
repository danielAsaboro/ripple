// File: /hooks/useEventStream.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "react-hot-toast";
import { WebhookEvent, WebhookEventType } from "@/types/events";

interface EventStreamOptions {
  endpoint?: string;
  eventTypes?: WebhookEventType[];
  limit?: number;
  showToasts?: boolean;
  autoConnect?: boolean;
}

interface EventStreamState {
  events: WebhookEvent[];
  isConnected: boolean;
  error: Error | null;
}

class EventStreamConnection {
  private static instance: EventStreamConnection | null = null;
  private eventSource: EventSource | null = null;
  private listeners: Set<(event: WebhookEvent) => void> = new Set();
  private connectionListeners: Set<(connected: boolean) => void> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private baseDelay = 1000;
  private endpoint: string;
  private isConnecting = false;

  private constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  public static getInstance(endpoint: string): EventStreamConnection {
    if (!EventStreamConnection.instance) {
      EventStreamConnection.instance = new EventStreamConnection(endpoint);
    }
    return EventStreamConnection.instance;
  }

  public connect(): void {
    if (
      this.isConnecting ||
      this.eventSource?.readyState === EventSource.OPEN
    ) {
      return;
    }

    this.isConnecting = true;

    if (this.eventSource) {
      this.eventSource.close();
    }

    this.eventSource = new EventSource(this.endpoint);

    this.eventSource.onopen = () => {
      console.log("SSE Connection established");
      this.reconnectAttempts = 0;
      this.isConnecting = false;
      this.notifyConnectionListeners(true);
    };

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "ping") return;
        this.notifyEventListeners(data);
      } catch (error) {
        console.error("Error parsing event:", error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error("SSE Connection error:", error);
      this.eventSource?.close();
      this.isConnecting = false;
      this.notifyConnectionListeners(false);

      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        const delay = this.baseDelay * Math.pow(2, this.reconnectAttempts);
        setTimeout(() => {
          this.reconnectAttempts++;
          this.connect();
        }, delay);
      }
    };
  }

  public disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnecting = false;
    this.notifyConnectionListeners(false);
  }

  public addEventListener(callback: (event: WebhookEvent) => void): void {
    this.listeners.add(callback);
  }

  public removeEventListener(callback: (event: WebhookEvent) => void): void {
    this.listeners.delete(callback);
  }

  public addConnectionListener(callback: (connected: boolean) => void): void {
    this.connectionListeners.add(callback);
  }

  public removeConnectionListener(
    callback: (connected: boolean) => void
  ): void {
    this.connectionListeners.delete(callback);
  }

  private notifyEventListeners(event: WebhookEvent): void {
    this.listeners.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("Error in event listener:", error);
      }
    });
  }

  private notifyConnectionListeners(connected: boolean): void {
    this.connectionListeners.forEach((callback) => {
      try {
        callback(connected);
      } catch (error) {
        console.error("Error in connection listener:", error);
      }
    });
  }

  public static cleanup(): void {
    if (EventStreamConnection.instance) {
      EventStreamConnection.instance.disconnect();
      EventStreamConnection.instance = null;
    }
  }
}

export function useEventStream({
  endpoint = "/api/webhook-events",
  eventTypes = [],
  limit = 100,
  showToasts = false,
  autoConnect = true,
}: EventStreamOptions = {}): EventStreamState & {
  connect: () => void;
  disconnect: () => void;
  clearEvents: () => void;
} {
  const [state, setState] = useState<EventStreamState>({
    events: [],
    isConnected: false,
    error: null,
  });

  const toastShownRef = useRef(false);
  const stream = useRef(EventStreamConnection.getInstance(endpoint));

  const handleEvent = useCallback(
    (event: WebhookEvent) => {
      if (eventTypes.length === 0 || eventTypes.includes(event.eventType)) {
        setState((prev) => ({
          ...prev,
          events: [event, ...prev.events].slice(0, limit),
        }));
      }
    },
    [eventTypes, limit]
  );

  const handleConnection = useCallback(
    (connected: boolean) => {
      setState((prev) => ({
        ...prev,
        isConnected: connected,
        error: connected ? null : prev.error,
      }));

      if (showToasts && !toastShownRef.current) {
        if (connected) {
          toast.success("Connected to live updates");
          toastShownRef.current = true;
        } else {
          toast.error("Connection lost. Attempting to reconnect...");
        }
      }
    },
    [showToasts]
  );

  useEffect(() => {
    const currentStream = stream.current;

    currentStream.addEventListener(handleEvent);
    currentStream.addConnectionListener(handleConnection);

    if (autoConnect) {
      currentStream.connect();
    }

    return () => {
      currentStream.removeEventListener(handleEvent);
      currentStream.removeConnectionListener(handleConnection);
    };
  }, [handleEvent, handleConnection, autoConnect]);

  const connect = useCallback(() => stream.current.connect(), []);
  const disconnect = useCallback(() => stream.current.disconnect(), []);
  const clearEvents = useCallback(() => {
    setState((prev) => ({
      ...prev,
      events: [],
    }));
    if (showToasts) {
      toast.success("Events cleared");
    }
  }, [showToasts]);

  return {
    ...state,
    connect,
    disconnect,
    clearEvents,
  };
}
