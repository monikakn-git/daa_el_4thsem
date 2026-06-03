"use client";

import { motion } from "framer-motion";
import { Bell, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  level: "info" | "success" | "warning" | "error";
  timestamp: string;
};

export type NotificationPanelProps = {
  notifications: NotificationItem[];
  onClear?: () => void;
  onDismiss?: (id: string) => void;
};

const notificationStyles = {
  info: "border-blue-400/30 bg-blue-500/5 text-blue-200",
  success: "border-emerald-400/30 bg-emerald-500/5 text-emerald-200",
  warning: "border-yellow-400/30 bg-yellow-500/5 text-yellow-200",
  error: "border-red-400/30 bg-red-500/5 text-red-200",
};

const notificationIcons = {
  info: Info,
  success: CheckCircle2,
  warning: Bell,
  error: AlertTriangle,
};

export function NotificationPanel({ notifications, onClear, onDismiss }: NotificationPanelProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-4">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">Activity Feed</p>
          <h2 className="text-2xl font-bold">Simulation Alerts</h2>
          <p className="text-sm text-gray-400 mt-1">
            {notifications.length === 0
              ? "No alerts yet. Start the simulation or add tasks to see live events."
              : `${notifications.length} recent event${notifications.length === 1 ? "" : "s"}.`}
          </p>
        </div>
        {onClear && notifications.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10"
          >
            <X className="h-4 w-4" /> Clear all
          </button>
        ) : null}
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {notifications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-gray-400">
            No alerts yet. Start the simulation or add tasks to see live events.
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = notificationIcons[notification.level];
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-3xl border p-5 shadow-sm",
                  notificationStyles[notification.level]
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-full border border-white/10 bg-white/5 p-2">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white">{notification.title}</h3>
                        <span className="text-xs text-gray-400">{new Date(notification.timestamp).toLocaleTimeString()}</span>
                      </div>
                      {onDismiss ? (
                        <button
                          type="button"
                          onClick={() => onDismiss(notification.id)}
                          className="text-gray-400 transition hover:text-white"
                          aria-label="Dismiss notification"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      ) : null}
                    </div>
                    <p className="mt-3 text-sm leading-6 text-gray-300">{notification.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
