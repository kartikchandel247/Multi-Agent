"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useAgentBooking } from "@/context/AgentContext";
import { AgentBadge } from "./Badge";

export function ToastContainer() {
  const { toasts, removeToast } = useAgentBooking();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full px-4">
      <AnimatePresence>
        {toasts.map((toast) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
            error: <XCircle className="w-5 h-5 text-rose-500 shrink-0" />,
          };

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="pointer-events-auto rounded-2xl bg-white/90 backdrop-blur-xl border border-white/95 shadow-xl p-4 flex items-start gap-3 relative overflow-hidden"
            >
              {/* Subtle accent border */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                  toast.type === "success"
                    ? "bg-emerald-500"
                    : toast.type === "warning"
                    ? "bg-amber-500"
                    : toast.type === "error"
                    ? "bg-rose-500"
                    : "bg-blue-500"
                }`}
              />

              <div className="pt-0.5">{icons[toast.type]}</div>

              <div className="flex-1 min-w-0 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                    {toast.title}
                  </h4>
                  {toast.agent && <AgentBadge agent={toast.agent} showIcon={false} />}
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{toast.description}</p>
              </div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
