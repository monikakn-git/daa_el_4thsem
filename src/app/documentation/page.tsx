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
                  </div>
                )}
                
                {/* Fallback for other sections */}
                {!["intro", "problem"].includes(activeSection) && (
                   <div>
                      <h2 className="text-3xl font-bold mb-6">{sections.find(s => s.id === activeSection)?.title}</h2>
                      <p className="text-gray-400 italic">Content for this section is currently being updated by the engineering team.</p>
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
