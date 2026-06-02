"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  Zap, Settings, Cpu, LineChart, Target, 
  Activity, BarChart3, Database, ShieldCheck, Combine
} from "lucide-react";

const features = [
  {
    title: "Greedy Scheduling",
    description: "Lightning-fast resource allocation prioritizing immediate availability for minimum latency.",
    icon: Zap,
    glow: "neon"
  },
  {
    title: "Optimization Scheduling",
    description: "Complex algorithm that calculates the most energy-efficient task placement across the entire cluster.",
    icon: Settings,
    glow: "emerald"
  },
  {
    title: "Hybrid Algorithm Selection",
    description: "Dynamically switches between greedy and optimization strategies based on real-time workload.",
    icon: Combine,
    glow: "cyan"
  },
  {
    title: "Dynamic Voltage Frequency Scaling",
    description: "Adjusts CPU voltage and frequency in real-time to save energy without violating task deadlines.",
    icon: Cpu,
    glow: "emerald"
  },
  {
    title: "Task Characterization",
    description: "AI-driven analysis of incoming workloads to predict execution time and resource needs.",
    icon: Database,
    glow: "neon"
  },
  {
    title: "Resource Monitoring",
    description: "Continuous telemetry on memory, CPU, and power consumption across all distributed nodes.",
    icon: Activity,
    glow: "cyan"
  },
  {
    title: "Deadline Management",
    description: "Strict enforcement of task completion deadlines, ensuring QoS guarantees for critical processes.",
    icon: Target,
    glow: "emerald"
  },
  {
    title: "Performance Evaluation",
    description: "Automated benchmarking of system throughput and task success rates under varied loads.",
    icon: ShieldCheck,
    glow: "neon"
  },
  {
    title: "Energy Analytics",
    description: "Granular reporting on power consumption and carbon footprint reductions over time.",
    icon: BarChart3,
    glow: "emerald"
  },
  {
    title: "Intelligent Decision Engine",
    description: "The core AI module that orchestrates scheduling, DVFS, and allocation autonomously.",
    icon: LineChart,
    glow: "cyan"
  }
] as const;

export default function FeaturesPage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-neon/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Core <span className="text-gradient">Capabilities</span>
          </h1>
          <p className="text-gray-400 text-lg">
            A comprehensive suite of intelligent tools designed to maximize computational throughput while minimizing energy expenditure.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <GlassCard glowColor={feature.glow} className="h-full flex flex-col items-start group">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-6 h-6 text-white group-hover:text-brand-neon transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
                <div className="mt-6 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
