"use client";

import React from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Counter } from "@/components/ui/Counter";
import { useAgentBooking } from "@/context/AgentContext";
import {
  CalendarCheck2,
  Cpu,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  Bot,
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
  const capacity = stats?.capacityUtilization ?? 84;

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
      {/* Bento Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Bookings */}
        <GlassCard interactive variant="tinted-blue" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Bookings
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <Counter
                  value={totalBookings}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
                <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  <ArrowUpRight className="w-3 h-3" /> +18%
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Confirmed: {bookings.filter((b) => b.status === "CONFIRMED").length}</span>
            <span>Rescheduled: {bookings.filter((b) => b.status === "RESCHEDULED").length}</span>
          </div>
        </GlassCard>

        {/* Card 2: Active AI Sessions */}
        <GlassCard interactive variant="tinted-violet" className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Active AI Sessions
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                <Counter
                  value={activeSessions}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
                <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  Live Mesh
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-violet-600 to-purple-600 text-white shadow-md shadow-violet-500/25">
              <Cpu className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-purple-600 font-semibold">Nova &bull; Atlas &bull; Vera</span>
            <span>Latency: 28ms</span>
          </div>
        </GlassCard>

        {/* Card 3: Revenue (with animated counter) */}
        <GlassCard interactive className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Pipeline Revenue
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-2xl font-extrabold text-blue-600">$</span>
                <Counter
                  value={revenue}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-500/25">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Avg Session: $650</span>
            <span className="text-emerald-600 font-semibold">+24.5% vs last mo</span>
          </div>
        </GlassCard>

        {/* Card 4: Compliance & Success Rate */}
        <GlassCard interactive className="flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                AI Accuracy & Success
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <Counter
                  value={successRate}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                />
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Collisions: 0</span>
            <span className="text-indigo-600 font-semibold">Policy Cleared 100%</span>
          </div>
        </GlassCard>
      </div>

      {/* Bento Middle Row: Capacity + Multi-Agent Swarm Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Weekly Booking & Revenue Distribution Bar Chart */}
        <GlassCard className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                Weekly Booking Volume & Capacity Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Simulated real-time throughput from Mongoose collections
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Optimal Velocity
            </span>
          </div>

          {/* Mini modern bar chart visualization */}
          <div className="pt-4 flex items-end justify-between gap-2 h-44 sm:h-48 px-2">
            {weeklyTrend.map((item, idx) => {
              const maxBookings = 8;
              const heightPct = Math.min(100, Math.max(20, (item.bookings / maxBookings) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-900 text-white px-2 py-0.5 rounded shadow-sm whitespace-nowrap -mb-1">
                    ${item.revenue}
                  </div>
                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-xl overflow-hidden h-32 flex items-end p-1">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-lg bg-gradient-to-t from-blue-600 via-indigo-500 to-violet-500 transition-all duration-500 group-hover:brightness-110 shadow-xs"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
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
            <h3 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Autonomous Agent Orchestration
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Live duty allocation & health</p>
          </div>

          <div className="space-y-3 pt-1">
            {/* Agent Nova */}
            <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <AgentBadge agent="Nova" />
                <span className="text-[11px] font-bold text-blue-700">92% Capacity</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Front-desk conversational NLP intake, entity extraction, client onboarding.
              </p>
            </div>

            {/* Agent Atlas */}
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <AgentBadge agent="Atlas" />
                <span className="text-[11px] font-bold text-emerald-700">Active</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Conflict resolution algorithm, slot optimization, reschedule management.
              </p>
            </div>

            {/* Agent Vera */}
            <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <AgentBadge agent="Vera" />
                <span className="text-[11px] font-bold text-purple-700">Guarding</span>
              </div>
              <p className="text-[11px] text-slate-600">
                Cancellation policy audit verification, credit issuance, MongoDB audit trail.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
