"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnimatedButton } from "@/components/ui/AnimatedButton";

const HeroScene = dynamic(
  () => import("@/components/home/HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-brand-dark pointer-events-none" />
    ),
  }
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20 overflow-hidden">
        <HeroScene />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,5,0.4)_0%,rgba(5,5,5,1)_100%)] pointer-events-none" />
        
        <div className="container relative z-10 px-4 md:px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel border-brand-neon/30 text-brand-neon text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-neon"></span>
              </span>
              System Online - v2.4.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
              Energy Efficient <br className="hidden md:block" />
              <span className="text-gradient">Resource Allocation System</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
              AI-Powered Adaptive Scheduling for Sustainable High Performance Computing.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link href="/simulation">
                <AnimatedButton variant="primary" className="w-full sm:w-auto">
                  Launch Simulation <ArrowRight className="w-5 h-5 ml-2" />
                </AnimatedButton>
              </Link>
              <Link href="/dashboard">
                <AnimatedButton variant="outline" className="w-full sm:w-auto">
                  Open Dashboard
                </AnimatedButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 border-t border-white/10 mt-auto">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} EERAS. Enterprise AI Resource Management Platform.
        </div>
      </footer>
    </div>
  );
}
