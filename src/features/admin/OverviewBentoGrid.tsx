"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Counter } from "@/components/ui/Counter";
import { useAgentBooking } from "@/context/AgentContext";
import {
  CalendarCheck2,
  Cpu,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Activity,
  ArrowUpRight,
} from "lucide-react";
import { AgentBadge } from "@/components/ui/Badge";

export function OverviewBentoGrid() {
  const { stats, bookings } = useAgentBooking();

  const totalBookings = stats?.totalBookings ?? bookings.length;
  const activeSessions = stats?.activeAiSessions ?? 4;
  const revenue = stats?.revenue ?? 4850;
  const successRate = stats?.successRate ?? 98;

  const weeklyTrend = stats?.weeklyTrend || [
    { day: "Mon", bookings: 3, revenue: 1950 },
    { day: "Tue", bookings: 4, revenue: 2600 },
    { day: "Wed", bookings: 6, revenue: 3900 },
    { day: "Thu", bookings: 5, revenue: 3250 },
    { day: "Fri", bookings: 7, revenue: 4550 },
    { day: "Sat", bookings: 3, revenue: 1950 },
    { day: "Sun", bookings: 2, revenue: 1300 },
  ];

  return (
    <div className="space-y-6">
      {/* Bento Grid Top Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Bookings */}
        <GlassCard interactive variant="tinted-blue" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Total Bookings
              </p>
              <div className="mt-2.5 flex items-baseline gap-2">
                <Counter
                  value={totalBookings}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
                <span className="inline-flex items-center text-xs font-bold text-emerald-700 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-400/40 backdrop-blur-md">
                  <ArrowUpRight className="w-3 h-3" /> +18%
                </span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/60 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Confirmed: {bookings.filter((b) => b.status === "CONFIRMED").length}</span>
            <span>Rescheduled: {bookings.filter((b) => b.status === "RESCHEDULED").length}</span>
          </div>
        </GlassCard>

        {/* Card 2: Active AI Sessions */}
        <GlassCard interactive variant="tinted-violet" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Active AI Swarm
              </p>
              <div className="mt-2.5 flex items-baseline gap-2">
                <Counter
                  value={activeSessions}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
                <span className="text-xs font-bold text-purple-700 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-400/40 backdrop-blur-md flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  Live Mesh
                </span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/30">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/60 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span className="text-purple-700 font-bold">Nova &bull; Atlas &bull; Vera</span>
            <span>Latency: 24ms</span>
          </div>
        </GlassCard>

        {/* Card 3: Revenue */}
        <GlassCard interactive className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                Pipeline Revenue
              </p>
              <div className="mt-2.5 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-blue-600">$</span>
                <Counter
                  value={revenue}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/60 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avg Session: $650</span>
            <span className="text-emerald-700 font-bold">+24.5% vs last mo</span>
          </div>
        </GlassCard>

        {/* Card 4: AI Accuracy & Policy Compliance */}
        <GlassCard interactive className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">
                AI Accuracy & Success
              </p>
              <div className="mt-2.5 flex items-baseline gap-1">
                <Counter
                  value={successRate}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/60 flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Collisions: 0</span>
            <span className="text-indigo-700 font-bold">Policy Cleared 100%</span>
          </div>
        </GlassCard>
      </div>

      {/* Bento Middle Row: Capacity Trend + Multi-Agent Swarm Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Trend Bar Chart */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Weekly Booking Volume & Scheduling Velocity
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                Real-time booking throughput calculated autonomously
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-400/30 backdrop-blur-md">
              Optimal Flow
            </span>
          </div>

          {/* Frosted bar chart visualization */}
          <div className="pt-4 flex items-end justify-between gap-2.5 h-44 sm:h-48 px-2">
            {weeklyTrend.map((item, idx) => {
              const maxBookings = 8;
              const heightPct = Math.min(100, Math.max(20, (item.bookings / maxBookings) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded-lg shadow-md whitespace-nowrap -mb-1">
                    ${item.revenue}
                  </div>
                  <div className="w-full max-w-[42px] bg-white/40 backdrop-blur-md border border-white/70 rounded-2xl overflow-hidden h-32 flex items-end p-1 shadow-inner">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-xl bg-gradient-to-t from-blue-600 via-indigo-600 to-violet-500 transition-all duration-500 group-hover:brightness-110 shadow-md shadow-indigo-500/25"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 transition-colors">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Multi-Agent Swarm Workload Panel */}
        <GlassCard className="space-y-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Autonomous Agent Orchestration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Live duty allocation & swarm status</p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Agent Nova */}
            <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/70 space-y-1.5 shadow-2xs hover:bg-white/60 transition-all">
              <div className="flex items-center justify-between">
                <AgentBadge agent="Nova" />
                <span className="text-[11px] font-extrabold text-blue-700">92% Capacity</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Front-desk conversational NLP intake, entity extraction, client onboarding.
              </p>
            </div>

            {/* Agent Atlas */}
            <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/70 space-y-1.5 shadow-2xs hover:bg-white/60 transition-all">
              <div className="flex items-center justify-between">
                <AgentBadge agent="Atlas" />
                <span className="text-[11px] font-extrabold text-emerald-700">Online</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Conflict resolution algorithm, slot optimization, reschedule management.
              </p>
            </div>

            {/* Agent Vera */}
            <div className="p-3.5 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/70 space-y-1.5 shadow-2xs hover:bg-white/60 transition-all">
              <div className="flex items-center justify-between">
                <AgentBadge agent="Vera" />
                <span className="text-[11px] font-extrabold text-purple-700">Guarding</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">
                Cancellation policy audit verification, credit issuance, immutable audit trail.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
