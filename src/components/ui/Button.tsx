"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { clsx } from "clsx";

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "primary" | "violet" | "glass" | "danger" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  children?: React.ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const sizeStyles = {
    sm: "text-xs px-3.5 py-2 gap-1.5",
    md: "text-sm px-4.5 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5 font-bold",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_10px_25px_-5px_rgba(79,70,229,0.4),0_0_0_1px_rgba(255,255,255,0.3)_inset] hover:shadow-[0_15px_32px_-5px_rgba(79,70,229,0.55),0_0_20px_2px_rgba(139,92,246,0.3)] hover:brightness-105 focus:ring-indigo-500",
    violet:
      "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 text-white shadow-[0_10px_25px_-5px_rgba(139,92,246,0.4),0_0_0_1px_rgba(255,255,255,0.3)_inset] hover:shadow-[0_15px_32px_-5px_rgba(139,92,246,0.55)] hover:brightness-105 focus:ring-purple-500",
    glass:
      "bg-white/40 backdrop-blur-xl text-slate-800 border border-white/70 shadow-[0_4px_16px_rgba(0,0,0,0.03),0_0_0_1px_rgba(255,255,255,0.7)_inset] hover:bg-white/75 hover:border-indigo-300 hover:text-indigo-900 hover:shadow-[0_8px_24px_rgba(99,102,241,0.12)] focus:ring-indigo-400",
    outline:
      "bg-transparent text-slate-700 border border-white/60 hover:bg-white/40 hover:text-slate-900 backdrop-blur-md focus:ring-slate-400",
    danger:
      "bg-rose-500/10 text-rose-600 border border-rose-300/60 backdrop-blur-md hover:bg-rose-500/20 shadow-xs focus:ring-rose-500",
    ghost:
      "bg-transparent text-slate-600 hover:bg-white/40 hover:text-slate-900 backdrop-blur-sm focus:ring-slate-400",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && <span className="flex-shrink-0">{icon}</span>}
          {children && <span>{children}</span>}
          {icon && iconPosition === "right" && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </motion.button>
  );
}
