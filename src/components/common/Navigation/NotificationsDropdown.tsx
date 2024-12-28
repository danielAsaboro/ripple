// File: /components/common/Navigation/NotificationsDropdown.tsx
import React, { useState } from "react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/utils/ts-merge";

interface Notification {
  id: string;
  type: "success" | "warning" | "info";
  message: string;
  time: string;
  read: boolean;
}

export const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  const [notifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      message: "Your donation of ◎1.2 SOL was successful",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "info",
      message: "New campaign: Help Build Schools",
      time: "5 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "warning",
      message: "Campaign ending soon: Clean Water Initiative",
      time: "1 day ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-400" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative rounded-full p-2 text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-400"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-400 text-xs font-medium text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg bg-slate-800 shadow-lg ring-1 ring-slate-700 z-50">
          <div className="p-4">
            <h3 className="text-sm font-medium text-white">Notifications</h3>
          </div>
          <div className="border-t border-slate-700">
            {notifications.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-slate-700 transition-colors",
                      !notification.read && "bg-slate-700/50"
                    )}
                  >
                    <div className="flex gap-3">
                      {getIcon(notification.type)}
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          {notification.message}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-slate-400">
                No notifications
              </div>
            )}
          </div>
          <div className="border-t border-slate-700 p-2">
            <button className="w-full rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-700 transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
