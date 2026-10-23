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
    default: "bg-white/75 backdrop-blur-md border border-white/80 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.04)]",
    subtle: "bg-white/50 backdrop-blur-sm border border-slate-200/60 shadow-sm",
    "tinted-blue":
      "bg-gradient-to-br from-blue-50/80 via-white/80 to-white/70 backdrop-blur-md border border-blue-200/50 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.08)]",
    "tinted-violet":
      "bg-gradient-to-br from-purple-50/80 via-white/80 to-white/70 backdrop-blur-md border border-purple-200/50 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.08)]",
  };

  const interactiveClasses = interactive
    ? "transition-all duration-300 hover:shadow-[0_20px_35px_-10px_rgba(59,130,246,0.12)] hover:-translate-y-1 hover:border-blue-400/40"
    : "";

  return (
    <motion.div
      className={clsx(
        "rounded-2xl p-5 md:p-6 relative overflow-hidden",
        variantStyles[variant],
        interactiveClasses,
        className
      )}
      {...props}
    >
      {/* Subtle top glare reflection */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
      {children}
    </motion.div>
  );
}
