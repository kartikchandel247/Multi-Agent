"use client";

import React from "react";
import {
  Menu,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Plus,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAgentBooking } from "@/context/AgentContext";
import { NavTab } from "./Sidebar";

interface TopbarProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenMobile: () => void;
}

export function Topbar({ currentTab, onTabChange, onOpenMobile }: TopbarProps) {
  const { resetToDefault, setIsBookModalOpen, setPendingBooking } = useAgentBooking();

  const titles: Record<NavTab, { title: string; subtitle: string }> = {
    chat: {
      title: "Customer Booking Command Center",
      subtitle: "Autonomous multi-agent scheduling with natural language parsing",
    },
    dashboard: {
      title: "Business Manager Bento Matrix",
      subtitle: "Real-time metrics, autonomous capacity tracking, and revenue projections",
    },
    calendar: {
      title: "Dynamic Synchronization Calendar",
      subtitle: "Directly linked to simulated MongoDB ledger with instant reactive updates",
    },
    audit: {
      title: "AI Compliance & Audit Trail",
      subtitle: "Immutable chronological history of customer requests & autonomous agent actions",
    },
    database: {
      title: "MongoDB Architecture & Connection",
      subtitle: "Simulated Mongoose engine with ready-to-wire MongoDB Atlas schemas & .env settings",
    },
  };

  const handleQuickBook = () => {
    const today = new Date().toISOString().split("T")[0];
    setPendingBooking({
      clientName: "Alex Morgan",
      clientEmail: "alex.morgan@client.com",
      serviceType: "AI Strategy Consult",
      date: today,
      timeSlot: "10:00 AM",
      amount: 600,
      agentAssigned: "Nova",
    });
    setIsBookModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white/70 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 transition-all">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
            {titles[currentTab]?.title || "AuraAgent"}
            <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
              Live Mesh
            </span>
          </h1>
          <p className="hidden sm:block text-xs text-slate-400 mt-0.5 truncate max-w-md">
            {titles[currentTab]?.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Mode quick switcher & Action buttons */}
      <div className="flex items-center gap-2.5">
        {/* Quick View Switcher Pill */}
        <div className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            onClick={() => onTabChange("chat")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === "chat"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Customer View
          </button>
          <button
            onClick={() => onTabChange("dashboard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab !== "chat"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Admin Bento
          </button>
        </div>

        {/* Reset Database Button */}
        <Button
          variant="glass"
          size="sm"
          onClick={resetToDefault}
          icon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
          title="Reset mock MongoDB collections to factory seed state"
          className="hidden md:inline-flex text-xs"
        >
          Reset DB
        </Button>

        {/* Quick Book Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={handleQuickBook}
          icon={<Plus className="w-4 h-4" />}
          className="text-xs sm:text-sm font-semibold"
        >
          Book Slot
        </Button>

        {/* Operator Profile Pill */}
        <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-xs">
            JD
          </div>
          <div className="text-left">
            <p className="text-xs font-semibold text-slate-800 leading-tight">Jordan Doe</p>
            <p className="text-[10px] text-slate-400">Lead Architect</p>
          </div>
        </div>
      </div>
    </header>
  );
}
