"use client";

import React from "react";

type Task = {
  id: string;
  taskName: string;
  status: string;
  executionTime: number;
  remainingTime: number;
  assignedProcessor: string | null;
};

export function SimulationGantt({ tasks }: { tasks: Task[] }) {
  const maxTime = Math.max(1, ...tasks.map((t) => t.executionTime));

  return (
    <div className="space-y-2">
      {tasks.map((t) => {
        const progress = Math.min(1, (t.executionTime - (t.remainingTime || 0)) / maxTime);
        const color = t.status === "completed" ? "bg-emerald-400" : t.status === "running" ? "bg-brand-neon" : "bg-white/10";
        return (
          <div key={t.id} className="text-sm">
            <div className="flex justify-between mb-1">
              <div className="font-mono text-xs text-gray-300">{t.taskName || t.id.slice(0,6)}</div>
              <div className="text-xs text-gray-400">{t.status}{t.assignedProcessor ? ` • ${t.assignedProcessor}` : ""}</div>
            </div>
            <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden">
              <div className={`${color} h-3 rounded-full`} style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
