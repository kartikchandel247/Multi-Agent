"use client";

import React from "react";
import { ParsedCommand } from "@/types";
import { Calendar, Clock, Sparkles, CheckCircle2, ShieldAlert } from "lucide-react";
import { AgentBadge } from "@/components/ui/Badge";

interface CommandVisualizerProps {
  parsed: ParsedCommand;
  rawText?: string;
  onConfirmAction?: () => void;
}

export function CommandVisualizer({ parsed, rawText, onConfirmAction }: CommandVisualizerProps) {
  const intentColors = {
    BOOK_SLOT: "bg-blue-50 text-blue-700 border-blue-200",
    POSTPONE_BOOKING: "bg-indigo-50 text-indigo-700 border-indigo-200",
    CANCEL_BOOKING: "bg-rose-50 text-rose-700 border-rose-200",
    QUERY_SCHEDULE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    UNKNOWN: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="mt-3 p-3.5 rounded-2xl bg-white/85 border border-slate-200/80 shadow-xs space-y-3">
      {/* Visual Intent Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border tracking-wide uppercase ${
              intentColors[parsed.intent]
            }`}
          >
            {parsed.intent.replace("_", " ")}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            Confidence: {Math.round(parsed.confidence * 100)}%
          </span>
        </div>

        <AgentBadge agent={parsed.agent} />
      </div>

      {/* Extracted Entities Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
        {parsed.date && (
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-400 block">Extracted Date</span>
              <span className="font-semibold text-slate-800 truncate block">{parsed.date}</span>
            </div>
          </div>
        )}

        {parsed.timeSlot && (
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-400 block">Time Slot</span>
              <span className="font-semibold text-slate-800 truncate block">{parsed.timeSlot}</span>
            </div>
          </div>
        )}

        {parsed.service && (
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center gap-2 col-span-2 sm:col-span-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] text-slate-400 block">Service Type</span>
              <span className="font-semibold text-slate-800 truncate block">{parsed.service}</span>
            </div>
          </div>
        )}
      </div>

      {/* Intent Action Trigger preview */}
      {onConfirmAction && parsed.intent !== "UNKNOWN" && (
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            Action verified by Agent {parsed.agent}
          </p>
          <button
            onClick={onConfirmAction}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors cursor-pointer"
          >
            Execute Visual Flow &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
