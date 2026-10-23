"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AgentBadge } from "@/components/ui/Badge";
import { useAgentBooking } from "@/context/AgentContext";
import { CommandIntent } from "@/types";
import {
  FileClock,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Database,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export function AiAuditLog() {
  const { auditLogs } = useAgentBooking();
  const [searchTerm, setSearchTerm] = useState("");
  const [intentFilter, setIntentFilter] = useState<string>("ALL");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesSearch =
      log.userCommand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.agentInvolved.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actionsTaken.some((a) => a.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesIntent = intentFilter === "ALL" || log.intentDetected === intentFilter;

    return matchesSearch && matchesIntent;
  });

  const intentOptions: { label: string; value: string }[] = [
    { label: "All Logs", value: "ALL" },
    { label: "Book Slot", value: "BOOK_SLOT" },
    { label: "Postpone", value: "POSTPONE_BOOKING" },
    { label: "Cancel", value: "CANCEL_BOOKING" },
    { label: "Query", value: "QUERY_SCHEDULE" },
  ];

  const dbOpColors: Record<string, string> = {
    INSERT: "bg-emerald-50 text-emerald-700 border-emerald-200",
    UPDATE: "bg-blue-50 text-blue-700 border-blue-200",
    DELETE: "bg-rose-50 text-rose-700 border-rose-200",
    QUERY: "bg-slate-50 text-slate-700 border-slate-200",
  };

  return (
    <div className="space-y-5">
      {/* Search & Intent Filter Toolbar */}
      <GlassCard className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
            <FileClock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              Autonomous AI Audit Ledger
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200">
                {auditLogs.length} Records
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Immutable audit tracking for natural language commands and Mongoose mutations
            </p>
          </div>
        </div>

        {/* Search input & Filter pills */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 w-48 sm:w-56"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 overflow-x-auto">
            {intentOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setIntentFilter(opt.value)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  intentFilter === opt.value
                    ? "bg-white text-purple-700 font-bold shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Minimalist Audit Table */}
      <GlassCard className="p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4 sm:px-6">Timestamp & DB Op</th>
                <th className="py-3.5 px-4">User Command</th>
                <th className="py-3.5 px-4">Intent & Confidence</th>
                <th className="py-3.5 px-4">Agent Assigned</th>
                <th className="py-3.5 px-4 sm:px-6">Autonomous Multi-Agent Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No audit records match the current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const dateObj = new Date(log.timestamp);
                  const formattedTime = dateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  });
                  const formattedDate = dateObj.toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  });

                  return (
                    <tr
                      key={log._id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      {/* Timestamp & Operation */}
                      <td className="py-3.5 px-4 sm:px-6 whitespace-nowrap">
                        <div className="font-mono font-semibold text-slate-800">
                          {formattedTime}
                        </div>
                        <div className="text-[10px] text-slate-400">{formattedDate}</div>
                        <span
                          className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase border ${
                            dbOpColors[log.dbOperation] || dbOpColors.QUERY
                          }`}
                        >
                          {log.dbOperation}
                        </span>
                      </td>

                      {/* User Command */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">
                          &ldquo;{log.userCommand}&rdquo;
                        </div>
                        {log.targetId && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            Target Doc: {log.targetId}
                          </div>
                        )}
                      </td>

                      {/* Intent & Confidence */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {log.intentDetected}
                        </span>
                        <div className="text-[10px] text-emerald-600 font-medium mt-1">
                          Score: {Math.round(log.confidenceScore * 100)}%
                        </div>
                      </td>

                      {/* Agent */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <AgentBadge agent={log.agentInvolved} />
                      </td>

                      {/* Actions Taken */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <ul className="space-y-1">
                          {log.actionsTaken.map((action, i) => (
                            <li
                              key={i}
                              className="text-slate-600 text-[11px] flex items-start gap-1.5 leading-snug"
                            >
                              <span className="text-blue-500 font-bold shrink-0">&rsaquo;</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
