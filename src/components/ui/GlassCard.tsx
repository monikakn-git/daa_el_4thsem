"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  className?: string;
  glowColor?: "neon" | "emerald" | "cyan";
}

const glowColors = {
  neon: "group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]",
  emerald: "group-hover:shadow-[0_0_30px_rgba(0,255,102,0.2)]",
  cyan: "group-hover:shadow-[0_0_30px_rgba(15,240,252,0.2)]",
};

export function GlassCard({ className, children, glowColor, ...props }: GlassCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative rounded-2xl glass-panel p-6 transition-all duration-300 overflow-hidden",
        glowColor && glowColors[glowColor],
        className
      )}
      {...props}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
