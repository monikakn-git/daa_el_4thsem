"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { 
  ArrowDown, GitCommit, Settings, Cpu, LineChart, Target, 
  Activity, BarChart3, Database, ShieldCheck, FileInput
} from "lucide-react";

const flowNodes = [
  { id: "input", label: "Task Input", icon: FileInput, color: "text-blue-400" },
  { id: "char", label: "Task Characterization", icon: Database, color: "text-purple-400" },
  { id: "engine", label: "Scheduling Engine", icon: Settings, color: "text-brand-neon" },
  { id: "split", split: true },
  { id: "greedy", label: "Greedy Scheduler", icon: Zap, color: "text-yellow-400" },
  { id: "opt", label: "Optimization Scheduler", icon: Target, color: "text-brand-emerald" },
  { id: "merge", merge: true },
  { id: "decision", label: "Decision Module", icon: GitCommit, color: "text-brand-cyan" },
  { id: "dvfs", label: "DVFS Controller", icon: Cpu, color: "text-orange-400" },
  { id: "alloc", label: "Resource Allocation Engine", icon: Activity, color: "text-green-400" },
  { id: "monitor", label: "Performance Monitoring", icon: ShieldCheck, color: "text-blue-500" },
  { id: "analytics", label: "Analytics Dashboard", icon: BarChart3, color: "text-pink-400" },
];

function Zap(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6 relative flex flex-col items-center overflow-x-hidden">
      <div className="absolute top-1/4 left-0 w-full h-[600px] bg-brand-emerald/5 blur-[150px] pointer-events-none rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto mb-16 relative z-10"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          System <span className="text-gradient">Architecture</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Explore the data flow and execution pipeline from task inception to analytics.
        </p>
      </motion.div>

      <div className="relative z-10 max-w-4xl w-full flex flex-col items-center">
        {/* Simplified Flow rendering for layout */}
        <div className="flex flex-col items-center gap-6 w-full">
          {flowNodes.map((node, i) => {
            if (node.split) {
              return (
                <div key={i} className="flex flex-row w-full justify-center gap-20 my-4 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[2px] bg-white/20" />
                </div>
              );
            }
            if (node.merge) {
              return (
                <div key={i} className="flex flex-col items-center w-full my-4 relative">
                  <div className="w-[2px] h-12 bg-white/20 relative">
                     <motion.div
                        animate={{ y: [0, 48, 48] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-brand-neon shadow-[0_0_10px_#00f0ff]"
                     />
                  </div>
                </div>
              );
            }

            const isParallel = node.id === "greedy" || node.id === "opt";

            if (isParallel) {
                // Handled in a wrapper below
                return null;
            }

            return (
              <div key={node.id} className="flex flex-col items-center w-full max-w-sm">
                {i !== 0 && !flowNodes[i-1].merge && !flowNodes[i-1].split && (
                  <div className="h-12 w-[2px] bg-white/10 relative overflow-hidden mb-6">
                    <motion.div
                      animate={{ y: [-48, 48] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-brand-neon to-transparent"
                    />
                  </div>
                )}
                
                {/* Check for parallel block */}
                {node.id === "engine" && (
                    <>
                        <NodeCard node={node} />
                        <div className="h-12 w-[2px] bg-white/10 relative overflow-hidden my-6">
                            <motion.div animate={{ y: [-48, 48] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-brand-neon to-transparent" />
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 md:gap-16 justify-center w-full">
                            <NodeCard node={flowNodes.find(n => n.id === "greedy")!} />
                            <NodeCard node={flowNodes.find(n => n.id === "opt")!} />
                        </div>
                    </>
                )}

                {node.id !== "engine" && node.id !== "greedy" && node.id !== "opt" && (
                    <NodeCard node={node} />
                )}

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function NodeCard({ node }: { node: any }) {
  if (!node || !node.icon) return null;
  const Icon = node.icon;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      className="w-full relative group"
    >
      <div className="absolute inset-0 bg-brand-neon/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 relative z-10 border border-white/5 group-hover:border-brand-neon/50 transition-colors">
        <div className={`p-3 rounded-xl bg-white/5 ${node.color} group-hover:scale-110 transition-transform`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="font-semibold text-lg">{node.label}</div>
      </div>
    </motion.div>
  );
}
