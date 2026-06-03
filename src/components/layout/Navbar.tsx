"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Cpu, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Features", path: "/features" },
  { name: "Architecture", path: "/architecture" },
  { name: "Algorithms", path: "/algorithms" },
  { name: "Simulation", path: "/simulation" },
  { name: "DVFS", path: "/dvfs" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Analytics", path: "/analytics" },
  { name: "Performance", path: "/performance" },
  { name: "Docs", path: "/documentation" },
  { name: "Team", path: "/team" },
  { name: "Contact", path: "/contact" },
  { name: "Admin", path: "/admin" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        isScrolled
          ? "glass-panel border-white/10 shadow-[0_4px_30px_rgba(0,240,255,0.05)] py-3"
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-brand-dark border border-brand-neon/30 overflow-hidden group-hover:border-brand-neon transition-colors">
              <div className="absolute inset-0 bg-brand-neon/10 group-hover:bg-brand-neon/20 transition-colors" />
              <Cpu className="w-5 h-5 text-brand-neon group-hover:scale-110 transition-transform" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-wide text-white leading-none">EERAS</span>
              <span className="text-[10px] text-brand-emerald font-mono uppercase tracking-widest">AI Core</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={cn(
                    "relative px-3 py-1.5 text-sm font-medium transition-colors rounded-md",
                    isActive ? "text-brand-neon" : "text-gray-400 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-brand-neon/10 border border-brand-neon/30 rounded-md"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <button
            className="lg:hidden text-gray-400 hover:text-white p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden absolute top-full left-0 w-full glass-panel border-t border-white/10 py-4 px-4 flex flex-col gap-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                pathname === link.path
                  ? "bg-brand-neon/10 text-brand-neon border border-brand-neon/30"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </header>
  );
}
