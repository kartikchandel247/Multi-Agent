"use client";

import React from "react";
import {
  MessageSquareCode,
  LayoutDashboard,
  CalendarDays,
  FileClock,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";
import { Logo } from "./Logo";
import { useAgentBooking } from "@/context/AgentContext";
import { useAuth } from "@/context/AuthContext";
import { clsx } from "clsx";

export type NavTab = "chat" | "dashboard" | "calendar" | "audit";

interface SidebarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ currentTab, onTabChange, isOpenMobile, onCloseMobile }: SidebarProps) {
  const { bookings, stats } = useAgentBooking();
  const { user, logout } = useAuth();

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: "chat",
      label: "AI Travel Chat",
      icon: <MessageSquareCode className="w-4 h-4" />,
      badge: "ChatGPT/Gemini",
    },
    {
      id: "dashboard",
      label: "My Trips & Ledger",
      icon: <LayoutDashboard className="w-4 h-4" />,
      badge: stats ? `${stats.totalBookings}` : undefined,
    },
    {
      id: "calendar",
      label: "Live Schedule",
      icon: <CalendarDays className="w-4 h-4" />,
      badge: `${bookings.filter((b) => b.status === "CONFIRMED").length} Active`,
    },
    {
      id: "audit",
      label: "Booking Audit Trail",
      icon: <FileClock className="w-4 h-4" />,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/25 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={clsx(
          "fixed top-0 bottom-0 left-0 z-40 w-64 md:w-72 bg-white/45 backdrop-blur-2xl border-r border-white/70 shadow-[10px_0_40px_rgba(31,38,135,0.06),0_0_0_1px_rgba(255,255,255,0.8)_inset] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 p-5",
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
          {/* Brand header */}
          <div className="pb-6 border-b border-white/60 flex items-center justify-between">
            <Logo />
          </div>

          {/* Navigation Section */}
          <div className="mt-6">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3.5 mb-2.5">
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
                      "w-full flex items-center justify-between px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-250 group cursor-pointer",
                      isActive
                        ? "bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-violet-600/15 backdrop-blur-xl text-blue-700 border border-blue-400/40 shadow-[0_4px_16px_rgba(99,102,241,0.08)]"
                        : "text-slate-600 hover:text-slate-900 bg-transparent hover:bg-white/50 backdrop-blur-sm border border-transparent hover:border-white/60 shadow-none hover:shadow-xs"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={clsx(
                          "transition-transform duration-200 group-hover:scale-110",
                          isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-700"
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
                            "text-[10px] px-2 py-0.5 rounded-full font-bold transition-all",
                            isActive
                              ? "bg-blue-600 text-white shadow-xs"
                              : "bg-white/60 text-slate-500 border border-white/80 group-hover:bg-white"
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

        {/* Bottom Section: User Session & System Status */}
        <div className="pt-4 border-t border-white/60 space-y-3.5">
          {/* User Session Quick Profile & Sign Out */}
          {user && (
            <div className="p-2.5 rounded-2xl bg-white/45 backdrop-blur-xl border border-white/80 flex items-center justify-between gap-2 shadow-2xs">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-[10px] font-extrabold shrink-0 shadow-2xs">
                  {user.avatarInitials}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{user.role}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Clean system status footer */}
          <div className="px-2 flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-amber-500" />
              Neural Mesh v2.4
            </span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              99.98% Latency
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
