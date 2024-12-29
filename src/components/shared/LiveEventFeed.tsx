// File: /components/shared/EventFeed.tsx
import React from "react";
import { WebhookEvent } from "@/types/events";
import Card from "@/components/common/Card";
import ConnectionStatus from "./ConnectionStatus";
import { formatDistance } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import { lamportsToSol } from "@/utils/format";
import Button from "@/components/common/Button";

interface EventFeedProps {
  events: WebhookEvent[];
  isConnected: boolean;
  maxHeight?: string;
  title?: string;
  showHeader?: boolean;
  loading?: boolean;
  onClearEvents?: () => void;
  maxEvents?: number;
  className?: string;
}

const getEventIcon = (event: WebhookEvent) => {
  switch (event.eventType) {
    case "campaign_created":
      return "🎯";
    case "donation_received":
      return "💝";
    case "user_initialized":
      return "👋";
    case "campaign_updated":
      return "📝";
    case "funds_withdrawn":
      return "💰";
    default:
      return "📋";
  }
};

const EventFeed = ({
  events,
  isConnected,
  maxHeight = "32rem",
  title = "Recent Activity",
  showHeader = true,
  loading = false,
  onClearEvents,
  maxEvents = 50,
  className,
}: EventFeedProps) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const displayEvents = events.slice(0, maxEvents);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-700 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-slate-700 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      {showHeader && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <ConnectionStatus isConnected={isConnected} size="sm" />
          </div>
          {onClearEvents && events.length > 0 && (
            <Button variant="outline" size="sm" onClick={onClearEvents}>
              Clear
            </Button>
          )}
        </div>
      )}

      <div
        className="space-y-2 overflow-y-auto"
        style={{ maxHeight: isExpanded ? "none" : maxHeight }}
      >
        <AnimatePresence>
          {displayEvents.map((event, index) => (
            <motion.div
              key={`${event.timestamp}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-3 bg-slate-800 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getEventIcon(event)}</span>
                  <div>
                    <EventContent event={event} />
                    <p className="text-xs text-slate-400">
                      {formatDistance(new Date(event.timestamp), new Date(), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {events.length > 5 && (
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-2 flex items-center justify-center gap-2"
          >
            {isExpanded ? (
              <>
                Show Less <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
        )}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-slate-400">
          No activity to show
        </div>
      )}
    </Card>
  );
};

const EventContent = ({ event }: { event: WebhookEvent }) => {
  switch (event.eventType) {
    case "donation_received":
      return (
        <p className="text-sm text-white">
          <span className="text-green-400">
            ◎{lamportsToSol(event.payload.data.amount)}
          </span>{" "}
          donated to{" "}
          <span className="text-slate-300">
            {event.payload.metadata.campaign.slice(0, 8)}...
          </span>
        </p>
      );
    case "campaign_created":
      return (
        <p className="text-sm text-white">
          New campaign created:{" "}
          <span className="text-slate-300">{event.payload.metadata.title}</span>
        </p>
      );
    case "campaign_updated":
      return (
        <p className="text-sm text-white">
          Campaign updated:{" "}
          <span className="text-slate-300">
            {event.payload.campaign.slice(0, 8)}...
          </span>
        </p>
      );
    default:
      return (
        <p className="text-sm text-white">
          {event.eventType.replace(/_/g, " ")}
        </p>
      );
  }
};

export default EventFeed;
