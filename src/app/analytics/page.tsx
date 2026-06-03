"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { PieChart, Pie, Cell } from "recharts";

const workloadData = [
  { name: 'Jan', cpu: 65, mem: 45, io: 30 },
  { name: 'Feb', cpu: 75, mem: 55, io: 40 },
  { name: 'Mar', cpu: 85, mem: 60, io: 50 },
  { name: 'Apr', cpu: 70, mem: 48, io: 35 },
  { name: 'May', cpu: 90, mem: 75, io: 60 },
  { name: 'Jun', cpu: 95, mem: 80, io: 70 },
];

const resourceDistribution = [
  { name: 'Compute', value: 400 },
  { name: 'Memory', value: 300 },
  { name: 'Storage', value: 300 },
  { name: 'Network', value: 200 },
];
const COLORS = ['#00f0ff', '#00ff66', '#0ff0fc', '#3b82f6'];

const algorithmEfficiency = [
  { subject: 'Speed', A: 120, B: 110, fullMark: 150 },
  { subject: 'Energy', A: 98, B: 130, fullMark: 150 },
  { subject: 'Accuracy', A: 86, B: 130, fullMark: 150 },
  { subject: 'Scalability', A: 99, B: 100, fullMark: 150 },
  { subject: 'Cost', A: 85, B: 90, fullMark: 150 },
  { subject: 'Latency', A: 65, B: 85, fullMark: 150 },
];

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Enterprise <span className="text-gradient">Analytics Center</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">Deep dive into historical performance, resource distribution, and algorithm efficiency metrics.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <GlassCard className="h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-6">Workload Trends</h3>
            <div className="flex-grow w-full min-h-[320px] min-w-0">
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="cpu" fill="#00f0ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="mem" fill="#00ff66" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-6">Algorithm Radar Analysis</h3>
            <div className="flex-grow w-full min-h-[320px] min-w-0">
              <ResponsiveContainer width="100%" height={320}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={algorithmEfficiency}>
                  <PolarGrid stroke="#ffffff20" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#ffffff50', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar name="Greedy" dataKey="A" stroke="#00f0ff" fill="#00f0ff" fillOpacity={0.3} />
                  <Radar name="Optimization" dataKey="B" stroke="#00ff66" fill="#00ff66" fillOpacity={0.3} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <GlassCard className="lg:col-span-1 h-[400px] flex flex-col items-center">
             <h3 className="text-lg font-semibold mb-2 self-start">Resource Distribution</h3>
             <div className="flex-grow w-full flex items-center justify-center min-h-[320px] min-w-0">
                <ResponsiveContainer width="100%" height={320}>
                  <PieChart>
                    <Pie data={resourceDistribution} cx="50%" cy="50%" innerRadius={80} outerRadius={120} fill="#8884d8" paddingAngle={5} dataKey="value">
                      {resourceDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
             </div>
           </GlassCard>

           <GlassCard className="lg:col-span-2 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold mb-6">Task Completion & Deadline Success</h3>
            <div className="flex-grow w-full min-h-[320px] min-w-0">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={workloadData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="cpu" name="Completed" stroke="#0ff0fc" strokeWidth={3} />
                  <Line type="monotone" dataKey="io" name="Missed Deadline" stroke="#ef4444" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
