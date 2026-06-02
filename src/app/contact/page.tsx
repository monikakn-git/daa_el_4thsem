"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Send, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 px-4 md:px-6 relative flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-neon/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="container mx-auto max-w-5xl relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="text-gray-400">Inquire about enterprise deployment or research collaboration.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <GlassCard className="h-full">
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-white/5 text-brand-neon">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Email Us</div>
                    <div className="text-white font-medium">enterprise@eeras.ai</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-white/5 text-brand-emerald">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Headquarters</div>
                    <div className="text-white font-medium">Silicon Valley, CA</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-white/5 text-brand-cyan">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-400">Support Phone</div>
                    <div className="text-white font-medium">+1 (800) AI-EERAS</div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <GlassCard glowColor="neon">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-neon transition-colors" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                  <input type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-neon transition-colors" placeholder="john@enterprise.com" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Subject</label>
                  <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-neon transition-colors" placeholder="Enterprise Licensing" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Message</label>
                  <textarea rows={4} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-brand-neon transition-colors" placeholder="How can we help you?" />
                </div>
                
                <AnimatedButton variant="primary" className="w-full mt-4">
                  <Send className="w-4 h-4 mr-2" /> Send Message
                </AnimatedButton>
              </form>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
