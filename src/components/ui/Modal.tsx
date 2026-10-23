"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { clsx } from "clsx";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
  className,
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const maxWidthStyles = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/25 backdrop-blur-md"
          />

          {/* Luxury Frosted Acrylic Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
            className={clsx(
              "relative w-full rounded-3xl bg-white/75 backdrop-blur-3xl border border-white/90 shadow-[0_30px_80px_-15px_rgba(15,23,42,0.2),0_0_0_1px_rgba(255,255,255,0.95)_inset] p-6 sm:p-8 z-10 overflow-hidden",
              maxWidthStyles[maxWidth],
              className
            )}
          >
            {/* Ambient accent top glow */}
            <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-r from-blue-500/25 via-indigo-500/25 to-violet-500/25 blur-3xl rounded-full" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                {title && <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{title}</h3>}
                {subtitle && <p className="text-sm text-slate-500 mt-1 font-medium">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded-2xl p-2 bg-white/40 hover:bg-white/80 border border-white/70 text-slate-400 hover:text-slate-700 transition-all shadow-2xs focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
