"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Zap, Target, CheckCircle2, XCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { api, getSocket } from "@/lib/api";

export default function AlgorithmsPage() {
  const [comparisonData, setComparisonData] = useState([
    { metric: "Energy (kWh)", Greedy: 85, Optimization: 40 },
    { metric: "Time (ms)", Greedy: 12, Optimization: 45 },
    { metric: "Throughput", Greedy: 70, Optimization: 95 },
    { metric: "Scalability", Greedy: 60, Optimization: 90 },
  ]);

  useEffect(() => {
    const fetchPerf = async () => {
      try {
        const perfRes = await api.get("/analytics/performance");
        if (perfRes.data) {
           const greedy = perfRes.data.find((d:any) => d.algorithm === "Greedy");
           const opt = perfRes.data.find((d:any) => d.algorithm === "Optimization");
           
           if(greedy && opt) {
             setComparisonData([
                { metric: "Energy (kWh)", Greedy: greedy.energy, Optimization: opt.energy },
                { metric: "Time (ms)", Greedy: 12, Optimization: 45 },
                { metric: "Throughput", Greedy: greedy.throughput, Optimization: opt.throughput },
                { metric: "Scalability", Greedy: greedy.efficiency - 20, Optimization: opt.efficiency - 5 },
             ]);
           }
        }
      } catch (e) {
        console.error("Failed to load performance data");
      }
    };
    fetchPerf();

    const socket = getSocket();
    if (socket) {
      socket.on("analytics_updated", fetchPerf);
    }
    return () => {
      if (socket) socket.off("analytics_updated", fetchPerf);
    };
  }, []);

  return (
    <div className="min-h-screen py-20 px-4 md:px-6 relative">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Algorithm <span className="text-gradient">Comparison</span>
          </h1>
          <p className="text-gray-400">Head-to-head analysis of scheduling strategies.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 relative">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 -translate-x-1/2" />
          
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard glowColor="neon" className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-blue-500/10 text-brand-neon">
                  <Zap className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Greedy Scheduling</h2>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  { text: "Fast Scheduling", pos: true },
                  { text: "Real-Time Decision Making", pos: true },
                  { text: "Low Computation Cost", pos: true },
                  { text: "Moderate Energy Efficiency", pos: false },
                  { text: "Sub-optimal Resource Usage", pos: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {item.pos ? <CheckCircle2 className="w-5 h-5 text-brand-neon mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />}
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard glowColor="emerald" className="h-full">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-4 rounded-xl bg-brand-emerald/10 text-brand-emerald">
                  <Target className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Optimization Engine</h2>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  { text: "Maximum Energy Efficiency", pos: true },
                  { text: "Optimal Resource Distribution", pos: true },
                  { text: "High Deadline Compliance", pos: true },
                  { text: "Higher Computation Overhead", pos: false },
                  { text: "Slower Initial Assignment", pos: false },
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    {item.pos ? <CheckCircle2 className="w-5 h-5 text-brand-emerald mt-0.5 shrink-0" /> : <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />}
                    <span className="text-gray-300">{item.text}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <GlassCard className="h-[400px] flex flex-col">
            <h3 className="text-xl font-bold mb-6 text-center">Metric Comparison Matrix</h3>
            <div className="flex-grow w-full min-h-[320px] min-w-0">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" stroke="#ffffff50" tickLine={false} axisLine={false} />
                  <YAxis dataKey="metric" type="category" stroke="#ffffff" fontSize={14} tickLine={false} axisLine={false} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }} cursor={{ fill: '#ffffff05' }} />
                  <Bar dataKey="Greedy" fill="#00f0ff" radius={[0, 4, 4, 0]} barSize={20} />
                  <Bar dataKey="Optimization" fill="#00ff66" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
