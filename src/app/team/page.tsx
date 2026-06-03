"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Code, Link, Mail } from "lucide-react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Dr. Alan Turing",
    role: "Lead Systems Architect",
    skills: ["Algorithm Design", "Distributed Systems", "AI"],
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    glow: "neon"
  },
  {
    name: "Ada Lovelace",
    role: "Machine Learning Engineer",
    skills: ["Deep Learning", "Resource Prediction", "Python"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    glow: "emerald"
  },
  {
    name: "Grace Hopper",
    role: "Backend Developer",
    skills: ["Go", "Kubernetes", "Microservices"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    glow: "cyan"
  },
  {
    name: "Linus Torvalds",
    role: "Kernel Optimization Lead",
    skills: ["C", "Linux Kernel", "DVFS Implementation"],
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    glow: "neon"
  }
] as const;

export default function TeamPage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6 relative">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Meet the <span className="text-gradient">Team</span>
          </h1>
          <p className="text-gray-400">The brilliant minds behind the AI-Powered Resource Allocation System.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, i) => (
            <motion.div 
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard glowColor={member.glow} className="flex flex-col items-center text-center h-full group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-6 border-2 border-white/10 group-hover:border-brand-neon transition-colors duration-500">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    sizes="128px"
                  />
                  <div className="absolute inset-0 bg-brand-neon/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-brand-neon text-sm mb-4">{member.role}</p>
                
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {member.skills.map(skill => (
                    <span key={skill} className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gray-300">
                      {skill}
                    </span>
                  ))}
                </div>
                
                <div className="mt-auto flex gap-4">
                  <button className="text-gray-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                    <Code className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-[#0a66c2] transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                    <Link className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-brand-emerald transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10">
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
