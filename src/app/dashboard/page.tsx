"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Cpu, Server, Zap, CheckCircle, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/home/AnimatedCounter";
import { useEffect, useState } from "react";
import { api, getSocket } from "@/lib/api";

type DashboardData = {
  totalTasks: number;
  runningTasks: number;
  completedTasks: number;
  activeProcessors: number;
  energySaved: number;
  throughput: number;
  cpuUtilization: number;
};

const performanceData = Array.from({ length: 20 }, (_, i) => ({
  time: `10:${i.toString().padStart(2, '0')}`,
  throughput: 100 + Math.random() * 50,
  energy: 200 - Math.random() * 30,
}));

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState({
    totalTasks: 0,
    activeTasks: 0,
    completedTasks: 0,
    activeProcessors: 0,
    energySaved: 0,
    throughput: 0,
    efficiencyScore: 0,
    cpuUtilization: 0
  });

  const updateState = (data: DashboardData) => {
    setAnalytics(prev => ({
      ...prev,
      totalTasks: data.totalTasks || 0,
      activeTasks: data.runningTasks || 0,
      completedTasks: data.completedTasks || 0,
      energySaved: data.energySaved || 0,
      throughput: data.throughput || 0,
      cpuUtilization: data.cpuUtilization || 0,
      efficiencyScore: data.throughput > 0 ? Math.min(100, 80 + (data.throughput / 10)) : 0
    }));
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get<DashboardData>("/analytics/dashboard");
        if (res.data) updateState(res.data);
      } catch (error) {
        console.error("Failed to load analytics", error);
      }
    };

    fetchAnalytics();

    const socket = getSocket();
    if (socket) {
      socket.on("analytics_updated", (data: DashboardData) => {
        updateState(data);
      });
    }

    return () => {
      if (socket) socket.off("analytics_updated");
    };
  }, []);

  const kpiData = [
    { title: "Total Tasks", value: analytics.totalTasks, icon: Activity, color: "text-blue-400" },
    { title: "Active Tasks", value: analytics.activeTasks, icon: TrendingUp, color: "text-brand-neon" },
    { title: "Completed Tasks", value: analytics.completedTasks, icon: CheckCircle, color: "text-brand-emerald" },
    { title: "CPU Utilization", value: analytics.cpuUtilization, icon: Cpu, color: "text-purple-400", suffix: "%" },
    { title: "Energy Consumed (kWh)", value: parseFloat(analytics.energySaved.toFixed(1)), icon: Zap, color: "text-yellow-400", float: true },
    { title: "Efficiency Score", value: Math.round(analytics.efficiencyScore), icon: Server, color: "text-brand-cyan", suffix: "%" },
  ];

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-2">
              System <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-gray-400">Real-time monitoring of cloud cluster performance.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-brand-emerald/30 text-brand-emerald">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-emerald"></span>
            </span>
            Live Telemetry Active
          </div>
        </motion.div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {kpiData.map((kpi, i) => (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="flex items-center p-6 gap-6">
                <div className={`p-4 rounded-xl bg-white/5 ${kpi.color}`}>
                  <kpi.icon className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm font-medium mb-1">{kpi.title}</p>
                  <div className="text-3xl font-bold font-mono">
                    {kpi.float ? kpi.value : <AnimatedCounter value={kpi.value} duration={1} />}
                    {kpi.suffix}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="col-span-1 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-neon" /> Throughput Analysis
            </h3>
            <div className="flex-grow w-full min-h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="colorThroughput" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00f0ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00f0ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#00f0ff' }}
                  />
                  <Area type="monotone" dataKey="throughput" stroke="#00f0ff" strokeWidth={2} fillOpacity={1} fill="url(#colorThroughput)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="col-span-1 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-brand-emerald" /> Energy Consumption (Watts)
            </h3>
            <div className="flex-grow w-full min-h-[300px] min-w-0">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }}
                    itemStyle={{ color: '#00ff66' }}
                  />
                  <Line type="monotone" dataKey="energy" stroke="#00ff66" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#00ff66' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
