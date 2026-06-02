"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  children: React.ReactNode;
}

export function AnimatedButton({ variant = "primary", className, children, ...props }: AnimatedButtonProps) {
  const baseStyles = "relative inline-flex items-center justify-center px-6 py-3 font-semibold rounded-lg overflow-hidden transition-all duration-300 group";
  
  const variants = {
    primary: "bg-brand-neon/10 text-brand-neon border border-brand-neon/50 hover:bg-brand-neon hover:text-black shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)]",
    secondary: "bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/50 hover:bg-brand-emerald hover:text-black shadow-[0_0_15px_rgba(0,255,102,0.3)] hover:shadow-[0_0_30px_rgba(0,255,102,0.6)]",
    outline: "bg-transparent text-white border border-white/20 hover:bg-white/10 hover:border-white/50",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant !== "outline" && (
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
      )}
    </motion.button>
  );
}
