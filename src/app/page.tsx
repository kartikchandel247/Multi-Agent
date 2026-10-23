"use client";

import React, { useState } from "react";
import { AgentProvider, useAgentBooking } from "@/context/AgentContext";
import { MeshGradient } from "@/components/ui/MeshGradient";
import { Sidebar, NavTab } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { CommandChat } from "@/features/booking/CommandChat";
import { OverviewBentoGrid } from "@/features/admin/OverviewBentoGrid";
import { DynamicBookingCalendar } from "@/features/admin/DynamicBookingCalendar";
import { AiAuditLog } from "@/features/admin/AiAuditLog";
import { MongoSchemaManager } from "@/features/admin/MongoSchemaManager";
import { BookingConfirmModal } from "@/features/booking/BookingConfirmModal";
import { BookingPostponeModal } from "@/features/booking/BookingPostponeModal";
import { BookingCancelModal } from "@/features/booking/BookingCancelModal";
import { ToastContainer } from "@/components/ui/ToastContainer";

function AppContent() {
  const [currentTab, setCurrentTab] = useState<NavTab>("chat");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex bg-[#FAFAFA] font-sans antialiased text-slate-800 selection:bg-blue-500/20 selection:text-blue-700">
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
        <Topbar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          onOpenMobile={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {currentTab === "chat" && <CommandChat />}
          {currentTab === "dashboard" && <OverviewBentoGrid />}
          {currentTab === "calendar" && <DynamicBookingCalendar />}
          {currentTab === "audit" && <AiAuditLog />}
          {currentTab === "database" && <MongoSchemaManager />}
        </main>
      </div>

      {/* Modals & Toasts */}
      <BookingConfirmModal />
      <BookingPostponeModal />
      <BookingCancelModal />
      <ToastContainer />
    </div>
  );
}

export default function Home() {
  return (
    <AgentProvider>
      <AppContent />
    </AgentProvider>
  );
}
