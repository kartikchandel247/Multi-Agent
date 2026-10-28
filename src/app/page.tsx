"use client";

import React, { useState } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AgentProvider } from "@/context/AgentContext";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { AiTravelChat } from "@/features/travel/AiTravelChat";
import { CommandChat } from "@/features/booking/CommandChat";
import { OverviewBentoGrid } from "@/features/admin/OverviewBentoGrid";
import { DynamicBookingCalendar } from "@/features/admin/DynamicBookingCalendar";
import { AiAuditLog } from "@/features/admin/AiAuditLog";
import { BookingConfirmModal } from "@/features/booking/BookingConfirmModal";
import { BookingPostponeModal } from "@/features/booking/BookingPostponeModal";
import { BookingCancelModal } from "@/features/booking/BookingCancelModal";
import { ToastContainer } from "@/components/ui/ToastContainer";
import { AuthPage } from "@/features/auth/AuthPage";
import { motion, AnimatePresence } from "framer-motion";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentTab, setCurrentTab] = useState<NavTab>("chat");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Initial loading state while reading stored session
  if (isLoading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAFA] font-sans">
        <MeshGradient />
        <div className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-3xl bg-white/50 backdrop-blur-2xl border border-white/80 shadow-xl">
          <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <p className="text-sm font-extrabold text-slate-800 tracking-tight">
              AuraAgent Orchestrator
            </p>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Connecting neural agent mesh...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated: Display high-end Auth/Login Portal
  if (!isAuthenticated) {
    return <AuthPage />;
  }

  // Authenticated: Display main application dashboard
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative min-h-screen flex bg-[#FAFAFA] font-sans antialiased text-slate-800 selection:bg-blue-500/20 selection:text-blue-700"
    >
      {/* Animated Subtle Mesh Gradient Background */}
      <MeshGradient />

      {/* Navigation Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 md:lg:pl-72 flex flex-col min-h-screen relative z-10">
        <main className="flex-1 p-3 sm:p-4 lg:p-6 max-w-7xl w-full mx-auto">
          {currentTab === "chat" && (
            <AiTravelChat onOpenMobile={() => setIsMobileMenuOpen(true)} />
          )}
          {currentTab === "dashboard" && <OverviewBentoGrid />}
          {currentTab === "calendar" && <DynamicBookingCalendar />}
          {currentTab === "audit" && <AiAuditLog />}
        </main>
      </div>

      {/* Modals & Toasts */}
      <BookingConfirmModal />
      <BookingPostponeModal />
      <BookingCancelModal />
      <ToastContainer />
    </motion.div>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <AgentProvider>
        <AppContent />
      </AgentProvider>
    </AuthProvider>
  );
}
