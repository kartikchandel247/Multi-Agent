"use client";

import React from "react";
import { ParsedCommand } from "@/types";
import { Calendar, Clock, Sparkles, CheckCircle2 } from "lucide-react";
import { AgentBadge } from "@/components/ui/Badge";

interface CommandVisualizerProps {
  parsed: ParsedCommand;
  onConfirmAction?: () => void;
}

export function CommandVisualizer({ parsed, onConfirmAction }: CommandVisualizerProps) {
  const intentColors = {
    BOOK_SLOT: "bg-blue-500/10 text-blue-700 border-blue-400/40",
    POSTPONE_BOOKING: "bg-indigo-500/10 text-indigo-700 border-indigo-400/40",
    CANCEL_BOOKING: "bg-rose-500/10 text-rose-700 border-rose-400/40",
    QUERY_SCHEDULE: "bg-emerald-500/10 text-emerald-700 border-emerald-400/40",
    UNKNOWN: "bg-slate-500/10 text-slate-700 border-slate-400/40",
  };

  return (
    <div className="mt-3.5 p-4 rounded-2xl bg-white/55 backdrop-blur-xl border border-white/80 shadow-[0_4px_18px_rgba(0,0,0,0.03)] space-y-3">
      {/* Visual Intent Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-xl text-[11px] font-extrabold border tracking-wider uppercase backdrop-blur-md ${
              intentColors[parsed.intent]
            }`}
          >
            {parsed.intent.replace("_", " ")}
          </span>
          <span className="text-xs text-slate-500 font-mono font-medium">
            Confidence: {Math.round(parsed.confidence * 100)}%
          </span>
        </div>

        <AgentBadge agent={parsed.agent} />
      </div>

      {/* Extracted Entities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {parsed.date && (
          <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center gap-2 shadow-2xs">
            <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Date Entity</span>
              <span className="font-bold text-slate-900 truncate block">{parsed.date}</span>
            </div>
          </div>
        )}

        {parsed.timeSlot && (
          <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center gap-2 shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Time Slot</span>
              <span className="font-bold text-slate-900 truncate block">{parsed.timeSlot}</span>
            </div>
          </div>
        )}

        {parsed.service && (
          <div className="p-2.5 rounded-xl bg-white/60 backdrop-blur-md border border-white/80 flex items-center gap-2 col-span-2 sm:col-span-1 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-violet-600 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Track</span>
              <span className="font-bold text-slate-900 truncate block">{parsed.service}</span>
            </div>
          </div>
        )}
      </div>

      {/* Intent Action Trigger preview */}
      {onConfirmAction && parsed.intent !== "UNKNOWN" && (
        <div className="pt-2.5 border-t border-white/70 flex items-center justify-between">
          <p className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Action verified by Agent {parsed.agent}
          </p>
          <button
            onClick={onConfirmAction}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Execute Visual Flow &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
