"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Menu,
  RotateCcw,
  Plus,
  Radio,
  Sparkles,
  Command,
  LogOut,
  ChevronDown,
  UserCheck,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAgentBooking } from "@/context/AgentContext";
import { useAuth } from "@/context/AuthContext";
import { NavTab } from "./Sidebar";

interface TopbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMobile: () => void;
}

export function Topbar({ currentTab, onTabChange, onOpenMobile }: TopbarProps) {
  const { resetToDefault, setIsBookModalOpen, setPendingBooking } = useAgentBooking();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    chat: {
      title: "Autonomous AI Travel & Booking Assistant",
      subtitle: "Live search & reservations for Hotels, Buses, Trains & Flights in any state or district",
    },
    dashboard: {
      title: "Travel Ledger & Bookings",
      subtitle: "Real-time records of hotel reservations, bus/train tickets, and cancellations",
    },
    calendar: {
      title: "Dynamic Synchronization Calendar",
      subtitle: "Live reactive appointment ledger updated instantly by AI agents",
    },
    audit: {
      title: "AI Compliance & Audit Trail",
      subtitle: "Immutable chronological history of customer requests & autonomous agent actions",
    },
  };

  const handleQuickBook = () => {
    const today = new Date().toISOString().split("T")[0];
    setPendingBooking({
      clientName: user?.name || "Traveler",
      clientEmail: user?.email || "user@auraagent.ai",
      serviceType: "AI Strategy Consult",
      date: today,
      timeSlot: "10:00 AM",
      amount: 600,
      agentAssigned: "Nova",
    });
    setIsBookModalOpen(true);
  };

  return (
    <header className="sticky top-3 z-30 mx-4 sm:mx-6 lg:mx-8 mb-4">
      <div className="w-full bg-white/45 backdrop-blur-2xl border border-white/70 shadow-[0_15px_40px_-10px_rgba(31,38,135,0.07),0_0_0_1px_rgba(255,255,255,0.8)_inset] px-5 sm:px-7 py-3.5 rounded-3xl flex items-center justify-between gap-4 transition-all">
        {/* Left: Mobile hamburger & Page Title */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-2xl bg-white/50 backdrop-blur-md border border-white/70 text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all shadow-xs"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                {titles[currentTab]?.title || "AuraAgent"}
              </h1>
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-400/30 backdrop-blur-md shadow-2xs">
                <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                Live Mesh Online
              </span>
            </div>
            <p className="hidden sm:block text-xs text-slate-500 mt-0.5 truncate max-w-md font-medium">
              {titles[currentTab]?.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Transparent Mode Switcher & Frosted Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Glass Segmented View Switcher */}
          <div className="hidden sm:flex items-center bg-white/35 backdrop-blur-xl p-1 rounded-2xl border border-white/70 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <button
              onClick={() => onTabChange("chat")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab === "chat"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              Customer View
            </button>
            <button
              onClick={() => onTabChange("dashboard")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currentTab !== "chat"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-white/40"
              }`}
            >
              Admin Bento
            </button>
          </div>

          {/* Reset State Button (Translucent Glass Pill) */}
          <button
            onClick={resetToDefault}
            title="Reset data to initial state"
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/40 hover:bg-white/75 backdrop-blur-xl border border-white/70 text-slate-700 hover:text-slate-900 text-xs font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo</span>
          </button>

          {/* Primary Action Button (Glossy Holographic Pill) */}
          <Button
            variant="primary"
            size="sm"
            onClick={handleQuickBook}
            icon={<Plus className="w-4 h-4" />}
            className="rounded-2xl px-4 py-2 font-bold shadow-[0_8px_20px_-3px_rgba(79,70,229,0.45)] hover:shadow-[0_12px_28px_-3px_rgba(79,70,229,0.6)]"
          >
            Book Slot
          </Button>

          {/* User Profile Avatar with Frosted Ring & Dropdown */}
          <div ref={profileRef} className="relative hidden md:block pl-3 border-l border-white/60">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1 rounded-2xl hover:bg-white/40 transition-all cursor-pointer focus:outline-none"
              title="Account Menu"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 via-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-extrabold shadow-md shadow-indigo-500/25 ring-2 ring-white/80">
                {user?.avatarInitials || "AU"}
              </div>
              <div className="text-left hidden xl:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">
                  {user?.name || "Jordan Doe"}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold">
                  {user?.role || "Lead Architect"}
                </p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" />
            </button>

            {/* Frosted Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white/85 backdrop-blur-3xl border border-white/95 shadow-[0_20px_50px_-10px_rgba(15,23,42,0.15),0_0_0_1px_rgba(255,255,255,0.9)_inset] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="pb-2.5 mb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white text-xs font-extrabold shadow-xs">
                      {user?.avatarInitials || "AU"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user?.name || "Jordan Doe"}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {user?.email || "jordan.doe@auraagent.ai"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      {user?.role || "Lead Architect"}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Mesh
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 rounded-xl transition-all cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out of Terminal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
