"use client";

import React from "react";
import {
  MessageSquareCode,
  LayoutDashboard,
  CalendarDays,
  FileClock,
  Database,
  Sparkles,
  Bot,
  ShieldCheck,
  Cpu,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAgentBooking } from "@/context/AgentContext";
import { clsx } from "clsx";

export type NavTab = "chat" | "dashboard" | "calendar" | "audit" | "database";

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ currentTab, onTabChange, isOpenMobile, onCloseMobile }: SidebarProps) {
  const { bookings, stats } = useAgentBooking();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: "chat",
      label: "AI Command Chat",
      icon: <MessageSquareCode className="w-4 h-4" />,
      badge: "Customer",
    },
    {
      id: "dashboard",
      label: "Overview Bento",
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: stats ? `${stats.totalBookings}` : undefined,
    },
    {
      id: "calendar",
      label: "Dynamic Calendar",
      icon: <CalendarDays className="w-4 h-4" />,
      badge: `${bookings.filter((b) => b.status === "CONFIRMED").length} Active`,
    },
    {
      id: "audit",
      label: "AI Audit Log",
      icon: <FileClock className="w-4 h-4" />,
    },
    {
      id: "database",
      label: "MongoDB Connection",
      icon: <Database className="w-4 h-4" />,
      badge: "Mongoose",
    },
  ];

  const agents = [
    { name: "Nova", role: "Front-Desk", color: "bg-blue-500", icon: <Sparkles className="w-3 h-3 text-blue-500" /> },
    { name: "Atlas", role: "Calendar Optimizer", color: "bg-emerald-500", icon: <Cpu className="w-3 h-3 text-emerald-500" /> },
    { name: "Vera", role: "Policy & Audit", color: "bg-purple-500", icon: <ShieldCheck className="w-3 h-3 text-purple-500" /> },
    { name: "Nexus", role: "Business Analytics", color: "bg-amber-500", icon: <Bot className="w-3 h-3 text-amber-500" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 md:w-72 bg-white/80 backdrop-blur-xl border-r border-slate-200/80 shadow-[4px_0_24px_-10px_rgba(0,0,0,0.03)] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 p-5",
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Brand header */}
          <div className="pb-6 border-b border-slate-100 flex items-center justify-between">
            <Logo />
          </div>

          {/* Navigation Section */}
          <div className="mt-6">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              System Modules
            </p>
            <nav className="space-y-1.5">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      onCloseMobile();
                    }}
                    className={clsx(
                      "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative",
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50/70 text-blue-700 font-semibold shadow-xs border border-blue-200/50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          "transition-colors",
                          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.badge && (
                        <span
                          className={clsx(
                            "text-[10px] px-2 py-0.5 rounded-full font-semibold",
                            isActive
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-500 group-hover:bg-slate-200"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Multi-Agent Constellation Status */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="rounded-2xl p-3.5 bg-slate-50/80 border border-slate-200/60">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Autonomous Agents
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-100/60 px-1.5 py-0.5 rounded">
                4 Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {agents.map((ag) => (
                <div
                  key={ag.name}
                  className="p-1.5 rounded-lg bg-white border border-slate-200/50 flex items-center gap-2 shadow-2xs"
                >
                  <div className="shrink-0">{ag.icon}</div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-slate-800 leading-tight truncate">
                      {ag.name}
                    </p>
                    <p className="text-[9px] text-slate-400 truncate">{ag.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick MongoDB Status footer */}
          <div className="px-2 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              mockMongo v1.0
            </span>
            <span className="text-slate-500 hover:text-blue-600 cursor-pointer font-medium flex items-center gap-0.5"
              onClick={() => onTabChange("database")}
            >
              Schema <ExternalLink className="w-2.5 h-2.5" />
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
