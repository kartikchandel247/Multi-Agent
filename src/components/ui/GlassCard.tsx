"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  interactive?: boolean;
  variant?: "default" | "subtle" | "tinted-blue" | "tinted-violet";
  children: React.ReactNode;
}

export function GlassCard({
  children,
  interactive = false,
  variant = "default",
  className,
  ...props
}: GlassCardProps) {
  const variantStyles = {
    default:
      "bg-white/45 backdrop-blur-2xl border border-white/75 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.05),0_0_0_1px_rgba(255,255,255,0.85)_inset]",
    subtle:
      "bg-white/35 backdrop-blur-xl border border-white/65 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.03),0_0_0_1px_rgba(255,255,255,0.7)_inset]",
    "tinted-blue":
      "bg-gradient-to-br from-blue-500/10 via-white/50 to-indigo-500/10 backdrop-blur-2xl border border-blue-200/60 shadow-[0_20px_45px_-12px_rgba(59,130,246,0.12),0_0_0_1px_rgba(255,255,255,0.9)_inset]",
    "tinted-violet":
      "bg-gradient-to-br from-violet-500/10 via-white/50 to-purple-500/10 backdrop-blur-2xl border border-purple-200/60 shadow-[0_20px_45px_-12px_rgba(139,92,246,0.12),0_0_0_1px_rgba(255,255,255,0.9)_inset]",
  };

  const interactiveClasses = interactive
    ? "transition-all duration-300 hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.18),0_0_25px_rgba(139,92,246,0.15)] hover:-translate-y-1 hover:bg-white/65 hover:border-indigo-300/60"
    : "";

  return (
    <motion.div
      className={clsx(
        "rounded-3xl p-5 md:p-6 relative overflow-hidden",
        variantStyles[variant],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {/* Top glare reflection for glass realism */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90" />
      {children}
    </motion.div>
  );
}
