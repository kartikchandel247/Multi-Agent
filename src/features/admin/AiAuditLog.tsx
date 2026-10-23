"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AgentBadge } from "@/components/ui/Badge";
import { useAgentBooking } from "@/context/AgentContext";
import {
  FileClock,
  Search,
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
    INSERT: "bg-emerald-500/10 text-emerald-800 border-emerald-400/40",
    UPDATE: "bg-blue-500/10 text-blue-800 border-blue-400/40",
    DELETE: "bg-rose-500/10 text-rose-800 border-rose-400/40",
    QUERY: "bg-slate-500/10 text-slate-800 border-slate-400/40",
  };

  return (
    <div className="space-y-5">
      {/* Search & Intent Filter Toolbar */}
      <GlassCard className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25">
            <FileClock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Autonomous AI Audit Ledger
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-700 border border-purple-400/30 backdrop-blur-md">
                {auditLogs.length} Records
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Immutable cryptographic audit tracking for natural language commands
            </p>
          </div>
        </div>

        {/* Search input & Filter pills */}
        <div className="flex items-center flex-wrap gap-2.5">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3.5 py-2 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/75 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/15 w-48 sm:w-56 shadow-2xs"
            />
          </div>

          <div className="flex items-center bg-white/40 backdrop-blur-xl p-1 rounded-2xl border border-white/70 shadow-2xs overflow-x-auto">
            {intentOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setIntentFilter(opt.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  intentFilter === opt.value
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Minimalist Frosted Glass Audit Table */}
      <GlassCard className="p-0 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-white/30 backdrop-blur-md border-b border-white/60 text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                <th className="py-4 px-5 sm:px-6">Timestamp & Op</th>
                <th className="py-4 px-4">User Command</th>
                <th className="py-4 px-4">Intent & Confidence</th>
                <th className="py-4 px-4">Agent Assigned</th>
                <th className="py-4 px-5 sm:px-6">Autonomous Multi-Agent Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/50">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
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
                      className="hover:bg-white/50 transition-colors group"
                    >
                      {/* Timestamp & Operation */}
                      <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-800">
                          {formattedTime}
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">{formattedDate}</div>
                        <span
                          className={`mt-1.5 inline-block px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase border backdrop-blur-sm ${
                            dbOpColors[log.dbOperation] || dbOpColors.QUERY
                          }`}
                        >
                          {log.dbOperation}
                        </span>
                      </td>

                      {/* User Command */}
                      <td className="py-4 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                          &ldquo;{log.userCommand}&rdquo;
                        </div>
                        {log.targetId && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                            Ref ID: {log.targetId}
                          </div>
                        )}
                      </td>

                      {/* Intent & Confidence */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/60 text-slate-700 border border-white/80 shadow-2xs">
                          {log.intentDetected}
                        </span>
                        <div className="text-[10px] text-emerald-700 font-bold mt-1">
                          Score: {Math.round(log.confidenceScore * 100)}%
                        </div>
                      </td>

                      {/* Agent */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <AgentBadge agent={log.agentInvolved} />
                      </td>

                      {/* Actions Taken */}
                      <td className="py-4 px-5 sm:px-6">
                        <ul className="space-y-1">
                          {log.actionsTaken.map((action, i) => (
                            <li
                              key={i}
                              className="text-slate-600 text-[11px] flex items-start gap-1.5 leading-snug font-medium"
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
