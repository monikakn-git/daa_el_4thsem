"use client";

import { useEffect, useState, type FormEvent, type SVGProps } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { NotificationPanel, type NotificationItem } from "@/components/ui/NotificationPanel";
import { Play, Pause, RotateCcw, Plus, Cpu, Server } from "lucide-react";
import { api, getSocket } from "@/lib/api";

type SimulationTask = {
  id: string;
  taskName: string;
  priority: string;
  executionTime: number;
  deadline: number;
  cpuRequirement: number;
  memoryRequirement: number;
  status: string;
  assignedProcessor: string | null;
  remainingTime: number;
};

type ProcessorNode = {
  id: string;
  processorName?: string;
  load?: number;
  active?: boolean;
  utilization?: number;
  temperature?: number;
};

const initialNodes: ProcessorNode[] = [
  { id: "1", load: 0, active: true, utilization: 0 },
  { id: "2", load: 0, active: true, utilization: 0 },
  { id: "3", load: 0, active: true, utilization: 0 },
  { id: "4", load: 0, active: true, utilization: 0 },
];

export default function SimulationPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<SimulationTask[]>([]);
  const [nodes, setNodes] = useState<ProcessorNode[]>(initialNodes);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const pushNotification = (notification: Omit<NotificationItem, "id" | "timestamp">) => {
    setNotifications((prev) => [
      {
        id: `notification-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...notification,
      },
      ...prev,
    ].slice(0, 6));
  };

  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Form states
  const [priority, setPriority] = useState("Medium");
  const [cpuReq, setCpuReq] = useState(50);
  const [execTime, setExecTime] = useState(200);

  useEffect(() => {
    // Initial fetch
    const fetchData = async () => {
      try {
        const t = await api.get<SimulationTask[]>("/tasks");
        if (t.data) setTasks(t.data);
        const p = await api.get<ProcessorNode[]>("/processors");
        if (p.data && p.data.length > 0) setNodes(p.data);
      } catch (error) {
        console.error("Failed to load initial simulation data", error);
      }
    };
    fetchData();

    const socket = getSocket();
    if (socket) {
      socket.on("task_created", (t: SimulationTask) => {
        setTasks((prev) => [t, ...prev]);
      });
      socket.on("task_updated", (t: SimulationTask) => {
        setTasks((prev) => prev.map(task => task.id === t.id ? { ...task, ...t } : task));
      });
      socket.on("task_deleted", (t: { id: string }) => {
         setTasks((prev) => prev.filter(task => task.id !== t.id));
      });
      socket.on("allocation_created", (data: { taskId: string; processorId: string }) => {
         setTasks((prev) => prev.map(task => task.id === data.taskId ? { ...task, assignedProcessor: data.processorId, status: "running" } : task));
      });
      socket.on("processor_updated", (data: ProcessorNode) => {
         setNodes((prev) => {
            const exists = prev.find(p => p.id === data.id);
            if (exists) return prev.map(p => p.id === data.id ? { ...p, ...data } : p);
            return [...prev, data];
         });
      });
      socket.on("notification", (notification: NotificationItem) => {
         pushNotification(notification);
      });
      socket.on("analytics_updated", () => {
         // Optionally refresh data if needed
      });
    }

    return () => {
      if (socket) {
        socket.off("task_created");
        socket.off("task_updated");
        socket.off("task_deleted");
        socket.off("allocation_created");
        socket.off("processor_updated");
        socket.off("notification");
        socket.off("analytics_updated");
      }
    };
  }, []);

  const handleStart = async () => {
    try {
      await api.post("/simulation/start", {});
      setIsRunning(true);
      pushNotification({
        title: "Simulation started",
        message: "Real-time scheduling has begun.",
        level: "info",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePause = async () => {
    try {
      await api.post("/simulation/pause", {});
      setIsRunning(false);
      pushNotification({
        title: "Simulation paused",
        message: "Processing has been paused.",
        level: "warning",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleReset = async () => {
    try {
      await api.post("/simulation/reset", {});
      setIsRunning(false);
      setTasks([]);
      // Reset local nodes visual to 0 if they were mock
      setNodes(prev => prev.map(n => ({...n, utilization: 0, load: 0})));
      pushNotification({
        title: "Simulation reset",
        message: "All task and processor metrics have been cleared.",
        level: "warning",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const taskName = "Task_" + Math.floor(Math.random() * 1000);
      await api.post("/tasks", {
        taskName,
        priority,
        executionTime: execTime,
        deadline: execTime * 2,
        cpuRequirement: cpuReq,
        memoryRequirement: 100,
      });
      pushNotification({
        title: "Task queued",
        message: `${taskName} has been added to the waiting queue.`,
        level: "success",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Real-Time <span className="text-gradient">Simulator</span>
          </h1>
          <p className="text-gray-400">Interactive sandbox for task scheduling and resource allocation.</p>
        </motion.div>

        <NotificationPanel
          notifications={notifications}
          onDismiss={handleDismissNotification}
          onClear={handleClearNotifications}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Input */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><SettingsIcon /> Simulation Controls</h3>
              <div className="flex flex-wrap gap-3">
                <AnimatedButton variant={isRunning ? "outline" : "primary"} onClick={isRunning ? handlePause : handleStart}>
                  {isRunning ? <><Pause className="w-4 h-4 mr-2" /> Pause</> : <><Play className="w-4 h-4 mr-2" /> Start</>}
                </AnimatedButton>
                <AnimatedButton variant="outline" onClick={handleReset}>
                  <RotateCcw className="w-4 h-4 mr-2" /> Reset
                </AnimatedButton>
              </div>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5 text-brand-emerald" /> Inject Task</h3>
              <form className="space-y-4 text-sm" onSubmit={handleAddTask}>
                <div>
                  <label className="block text-gray-400 mb-1">Task Priority</label>
                  <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white outline-none focus:border-brand-neon">
                    <option value="High">High (Deadline-critical)</option>
                    <option value="Medium">Medium (Standard)</option>
                    <option value="Low">Low (Background)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">CPU Requirement (%)</label>
                  <input type="range" min="10" max="100" value={cpuReq} onChange={e => setCpuReq(parseInt(e.target.value))} className="w-full accent-brand-neon" />
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">Execution Time (ms)</label>
                  <input type="number" value={execTime} onChange={e => setExecTime(parseInt(e.target.value))} className="w-full bg-black/50 border border-white/10 rounded-md p-2 text-white outline-none focus:border-brand-neon" />
                </div>
                <AnimatedButton type="submit" variant="secondary" className="w-full py-2">
                  Add to Queue
                </AnimatedButton>
              </form>
            </GlassCard>

            <GlassCard>
              <h3 className="text-xl font-bold mb-4">Task Queue</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.filter(t => t.status === "waiting").map(t => (
                  <div key={t.id} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10">
                    <span className="font-mono text-brand-neon text-xs">{t.taskName || t.id.slice(0,8)}</span>
                    <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{t.priority}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Visualization */}
          <div className="lg:col-span-8">
            <GlassCard className="h-full min-h-[600px] flex flex-col relative overflow-hidden">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 z-10 relative"><Server className="w-5 h-5 text-brand-cyan" /> Cluster Nodes</h3>
              
              <div className="flex-grow grid grid-cols-2 gap-4 relative z-10">
                {nodes.map((node, i) => {
                  const displayLoad = node.utilization || node.load || 0;
                  return (
                  <div key={node.id} className="relative rounded-xl border border-white/10 bg-black/40 p-4 flex flex-col overflow-hidden">
                    {/* Node background load indicator */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-brand-neon/20 transition-all duration-1000 ease-in-out" 
                      style={{ height: `${Math.min(displayLoad, 100)}%` }}
                    />
                    
                    <div className="relative z-10 flex justify-between items-center mb-4">
                      <div className="flex items-center gap-2">
                        <Cpu className={`w-5 h-5 ${displayLoad > 0 ? "text-brand-neon" : "text-gray-500"}`} />
                        <span className="font-bold">{node.processorName || `Node ${i+1}`}</span>
                      </div>
                      <span className="font-mono text-sm">{Math.round(displayLoad)}% Load</span>
                    </div>

                    <div className="relative z-10 flex-grow border border-dashed border-white/20 rounded-lg p-2 min-h-[100px] flex items-center justify-center flex-wrap gap-2">
                      {tasks.filter(t => t.assignedProcessor === node.id && t.status === "running").map(t => (
                        <motion.div
                          key={t.id}
                          layoutId={`task-${t.id}`}
                          className="px-2 py-1 bg-brand-neon text-black font-bold text-xs rounded-md flex items-center gap-1"
                        >
                          <SettingsIcon className="w-3 h-3 animate-spin-slow" /> {t.taskName || t.id.slice(0,4)}
                        </motion.div>
                      ))}
                      {tasks.filter(t => t.assignedProcessor === node.id && t.status === "running").length === 0 && (
                        <span className="text-gray-500 text-sm">Idle</span>
                      )}
                    </div>
                  </div>
                )})}
              </div>

              {isRunning && (
                <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                   <motion.div animate={{ opacity: [0.1, 0.3, 0.1] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-brand-neon/5" />
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
}

