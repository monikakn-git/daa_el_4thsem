"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Search, Book, Cpu, Zap, Settings, Activity } from "lucide-react";

const sections = [
  { id: "intro", title: "Introduction", icon: Book },
  { id: "problem", title: "Problem Definition", icon: Activity },
  { id: "objectives", title: "Objectives", icon: Zap },
  { id: "algorithms", title: "Algorithms", icon: Settings },
  { id: "dvfs", title: "DVFS Model", icon: Cpu },
];

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState("intro");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen py-20 px-4 md:px-6 relative">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            System <span className="text-gradient">Documentation</span>
          </h1>
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search documentation..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-full py-3 pl-12 pr-4 text-white outline-none focus:border-brand-neon transition-colors"
            />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <GlassCard className="sticky top-24">
              <nav className="space-y-2">
                {sections.map(section => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeSection === section.id 
                        ? "bg-brand-neon/10 text-brand-neon border border-brand-neon/30" 
                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </GlassCard>
          </div>

          {/* Content */}
          <div className="lg:col-span-9">
            <GlassCard className="min-h-[600px]">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="prose prose-invert prose-brand max-w-none"
              >
                {activeSection === "intro" && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Introduction</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      The Energy Efficient Resource Allocation System (EERAS) is a comprehensive AI-powered platform designed to optimize task scheduling in high-performance cloud computing environments. 
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      By intelligently routing workloads and dynamically adjusting processor states, EERAS minimizes energy consumption and carbon footprint while guaranteeing strict adherence to task execution deadlines.
                    </p>
                  </div>
                )}

                {activeSection === "problem" && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Problem Definition</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Modern data centers consume vast amounts of electricity. A significant portion of this energy is wasted due to inefficient task scheduling, idle processor time, and static voltage/frequency configurations that do not adapt to real-time workload demands.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      EERAS addresses the challenge of optimizing compute resources in high-performance cloud environments, where both energy efficiency and deadline compliance are critical. The system must balance the competing goals of maximizing throughput, reducing power draw, and ensuring that urgent tasks complete on time.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2">
                      <li>High variability in workload intensity and resource demand.</li>
                      <li>Need for dynamic adaptation of processor voltage/frequency.</li>
                      <li>Complex trade-offs between speed, energy, and reliability.</li>
                      <li>Limited observability into real-time task execution and queue state.</li>
                    </ul>
                  </div>
                )}

                {activeSection === "objectives" && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Objectives</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      EERAS is designed to achieve measurable improvement in resource utilization while minimizing energy consumption. The platform helps operations teams deliver faster completion times and better quality-of-service across mixed workload environments.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2 mb-4">
                      <li>Reduce overall energy use through intelligent task placement and DVFS control.</li>
                      <li>Maintain high throughput and satisfy strict task deadlines.</li>
                      <li>Provide transparent monitoring of processor utilization and task progress.</li>
                      <li>Enable flexible and adaptive scheduling policies for heterogeneous hardware.</li>
                    </ul>
                    <p className="text-gray-300 leading-relaxed">
                      The system is built to support both reactive scheduling and predictive optimization, so it can respond quickly to bursts of demand while preserving long-term efficiency gains.
                    </p>
                  </div>
                )}

                {activeSection === "algorithms" && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6">Algorithms</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      EERAS combines multiple algorithmic strategies to optimize task scheduling across available processors. Each strategy is chosen to provide a balance between speed, energy efficiency, and task fairness.
                    </p>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Greedy Assignment</h3>
                        <p className="text-gray-300 leading-relaxed mb-3">
                          Greedy scheduling assigns tasks to the first available processor that satisfies the workload requirements. It is fast and simple, making it ideal for bursty environments where decisions must be made quickly.
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                          <li>Quick task placement.</li>
                          <li>Low computational overhead.</li>
                          <li>Best for high-priority short workloads.</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">Optimization Engine</h3>
                        <p className="text-gray-300 leading-relaxed mb-3">
                          The optimization engine evaluates multiple scheduling scenarios to minimize energy consumption while meeting deadlines. It uses a model-driven search over processor states and task priorities.
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                          <li>Prioritizes energy-efficient assignments.</li>
                          <li>Considers deadline constraints and utilization.</li>
                          <li>Adapts to changing workload conditions.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {activeSection === "dvfs" && (
                  <div>
                    <h2 className="text-3xl font-bold mb-6">DVFS Model</h2>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      Dynamic Voltage and Frequency Scaling (DVFS) enables EERAS to adjust processor power states in real time. By scaling voltage and frequency up or down, the system can reduce energy use during low-load periods and boost performance when needed.
                    </p>
                    <p className="text-gray-300 leading-relaxed mb-4">
                      The DVFS model in EERAS uses processor telemetry and task demand estimates to select safe operating points. This allows it to balance heat, power, and execution speed without violating reliability constraints.
                    </p>
                    <ul className="list-disc pl-6 text-gray-300 space-y-2">
                      <li>Monitors processor utilization and temperature.</li>
                      <li>Adjusts frequency to match workload intensity.</li>
                      <li>Reduces voltage when tasks are not time-critical.</li>
                      <li>Maintains stable performance for latency-sensitive jobs.</li>
                    </ul>
                  </div>
                )}
              </motion.div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
