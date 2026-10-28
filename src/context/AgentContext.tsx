"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Booking, AuditLog, BusinessStats, AgentPersona, ParsedCommand } from "@/types";
import { mockMongo } from "@/services/mockMongo";
import { parseUserCommand } from "@/services/commandParser";
import confetti from "canvas-confetti";

export interface DbStatusState {
  isConnected: boolean;
  mode: "REAL_MONGODB" | "SIMULATED_MONGOOSE";
  databaseName: string;
  maskedUri: string;
  message: string;
  error?: string;
  counts?: {
    bookings: number;
    auditLogs: number;
  };
}

export interface ToastNotification {
  id: string;
  title: string;
  description: string;
  type: "success" | "info" | "warning" | "error";
  agent?: AgentPersona;
}

interface AgentContextType {
  bookings: Booking[];
  auditLogs: AuditLog[];
  stats: BusinessStats | null;
  dbStatus: DbStatusState | null;
  isLoading: boolean;
  activeView: "customer" | "admin";
  setActiveView: (view: "customer" | "admin") => void;

  // Active modals
  isBookModalOpen: boolean;
  setIsBookModalOpen: (open: boolean) => void;
  isCancelModalOpen: boolean;
  setIsCancelModalOpen: (open: boolean) => void;
  isPostponeModalOpen: boolean;
  setIsPostponeModalOpen: (open: boolean) => void;

  pendingBooking: Partial<Booking> | null;
  setPendingBooking: (booking: Partial<Booking> | null) => void;
  bookingToCancel: Booking | null;
  setBookingToCancel: (booking: Booking | null) => void;
  bookingToPostpone: Booking | null;
  setBookingToPostpone: (booking: Booking | null) => void;

  // Action methods
  createBooking: (data: Partial<Booking>) => Promise<Booking>;
  postponeBooking: (id: string, newDate: string, newTime?: string) => Promise<Booking | null>;
  cancelBooking: (id: string, reason?: string) => Promise<Booking | null>;
  runCommand: (commandText: string) => Promise<{ parsed: ParsedCommand; success: boolean }>;
  resetToDefault: () => void;
  refreshData: () => Promise<void>;

  // Toasts
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
  addToast: (title: string, description: string, type?: "success" | "info" | "warning" | "error", agent?: AgentPersona) => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [dbStatus, setDbStatus] = useState<DbStatusState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState<"customer" | "admin">("customer");

  // Modal states
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isPostponeModalOpen, setIsPostponeModalOpen] = useState(false);

  const [pendingBooking, setPendingBooking] = useState<Partial<Booking> | null>(null);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [bookingToPostpone, setBookingToPostpone] = useState<Booking | null>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback(
    (
      title: string,
      description: string,
      type: "success" | "info" | "warning" | "error" = "info",
      agent?: AgentPersona
    ) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, description, type, agent }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 5000);
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch from live /api/ routes with fallback to local mockMongo
  const refreshData = useCallback(async () => {
    try {
      // 1. Fetch bookings from /api/bookings
      const bookingsRes = await fetch("/api/bookings").then((r) => r.json()).catch(() => null);
      if (bookingsRes?.success && Array.isArray(bookingsRes.data)) {
        setBookings(bookingsRes.data);
      } else {
        const localBookings = await mockMongo.Booking.find();
        setBookings(localBookings);
      }

      // 2. Fetch audit logs from /api/audit-logs
      const logsRes = await fetch("/api/audit-logs").then((r) => r.json()).catch(() => null);
      if (logsRes?.success && Array.isArray(logsRes.data)) {
        setAuditLogs(logsRes.data);
      } else {
        const localLogs = await mockMongo.AuditLog.find();
        setAuditLogs(localLogs);
      }

      // 3. Fetch stats from /api/stats
      const statsRes = await fetch("/api/stats").then((r) => r.json()).catch(() => null);
      if (statsRes?.success && statsRes.data) {
        setStats(statsRes.data);
      } else {
        const localStats = await mockMongo.getBusinessStats();
        setStats(localStats);
      }

      // 4. Fetch database status from /api/db-status
      const dbStatusRes = await fetch("/api/db-status").then((r) => r.json()).catch(() => null);
      if (dbStatusRes?.success && dbStatusRes.data) {
        setDbStatus(dbStatusRes.data);
      }
    } catch (err) {
      console.error("Error refreshing backend data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load and periodic subscription
  useEffect(() => {
    refreshData();
    const unsubscribe = mockMongo.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  // Create booking via /api/bookings
  const createBooking = async (data: Partial<Booking>): Promise<Booking> => {
    let created: Booking;
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.success && json.data) {
        created = json.data;
      } else {
        created = await mockMongo.Booking.create(data);
      }
    } catch {
      created = await mockMongo.Booking.create(data);
    }

    addToast(
      "Slot Confirmed & Registered!",
      `Agent Nova registered session for ${created.date} at ${created.timeSlot}.`,
      "success",
      "Nova"
    );

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#3B82F6", "#8B5CF6", "#10B981"],
      });
    } catch {
      // ignore
    }

    await refreshData();
    return created;
  };

  // Postpone booking via /api/bookings/:id
  const postponeBooking = async (
    id: string,
    newDate: string,
    newTime?: string
  ): Promise<Booking | null> => {
    let updated: Booking | null = null;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: newDate,
          timeSlot: newTime,
          status: "RESCHEDULED",
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        updated = json.data;
      } else {
        updated = await mockMongo.Booking.findByIdAndUpdate(id, {
          date: newDate,
          timeSlot: newTime,
          status: "RESCHEDULED",
        });
      }
    } catch {
      updated = await mockMongo.Booking.findByIdAndUpdate(id, {
        date: newDate,
        timeSlot: newTime,
        status: "RESCHEDULED",
      });
    }

    addToast(
      "Booking Postponed Successfully!",
      `Agent Atlas updated schedule to ${newDate} at ${newTime || "specified slot"}.`,
      "success",
      "Atlas"
    );

    await refreshData();
    return updated;
  };

  // Cancel booking via /api/bookings/:id
  const cancelBooking = async (id: string, reason?: string): Promise<Booking | null> => {
    let updated: Booking | null = null;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CANCELLED",
          cancellationReason: reason || "User initiated cancellation via AI Agent",
        }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        updated = json.data;
      } else {
        updated = await mockMongo.Booking.findByIdAndUpdate(id, {
          status: "CANCELLED",
          cancellationReason: reason,
        });
      }
    } catch {
      updated = await mockMongo.Booking.findByIdAndUpdate(id, {
        status: "CANCELLED",
        cancellationReason: reason,
      });
    }

    addToast(
      "Booking Cancelled",
      "Agent Vera cleared the slot and logged compliance verification.",
      "warning",
      "Vera"
    );

    await refreshData();
    return updated;
  };

  // Run command via /api/command
  const runCommand = async (
    commandText: string
  ): Promise<{ parsed: ParsedCommand; success: boolean }> => {
    let parsed: ParsedCommand;
    try {
      const res = await fetch("/api/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: commandText }),
      });
      const json = await res.json();
      if (json.success && json.parsed) {
        parsed = json.parsed;
      } else {
        parsed = parseUserCommand(commandText, bookings);
      }
    } catch {
      parsed = parseUserCommand(commandText, bookings);
    }

    if (parsed.intent === "BOOK_SLOT") {
      setPendingBooking({
        clientName: parsed.clientName || "User",
        clientEmail: "user@auraagent.ai",
        serviceType: parsed.service || "AI Strategy Consult",
        date: parsed.date || new Date().toISOString().split("T")[0],
        timeSlot: parsed.timeSlot || "10:00 AM",
        amount: 600,
        agentAssigned: "Nova",
      });
      setIsBookModalOpen(true);
      await refreshData();
      return { parsed, success: true };
    }

    if (parsed.intent === "POSTPONE_BOOKING") {
      const active = bookings.find((b) => b.status === "CONFIRMED") || bookings[0];
      if (active) {
        if (parsed.date) {
          await postponeBooking(active._id, parsed.date, parsed.timeSlot);
        } else {
          setBookingToPostpone(active);
          setIsPostponeModalOpen(true);
        }
      }
      await refreshData();
      return { parsed, success: true };
    }

    if (parsed.intent === "CANCEL_BOOKING") {
      const active = bookings.find((b) => b.status === "CONFIRMED") || bookings[0];
      if (active) {
        setBookingToCancel(active);
        setIsCancelModalOpen(true);
      } else {
        addToast("No Active Booking", "No confirmed bookings found to cancel.", "info", "Vera");
      }
      await refreshData();
      return { parsed, success: true };
    }

    await refreshData();
    return { parsed, success: true };
  };

  const resetToDefault = async () => {
    mockMongo.resetAll();
    await refreshData();
    addToast("Database Reset", "Collections restored to factory seed state.", "info", "Nexus");
  };

  return (
    <AgentContext.Provider
      value={{
        bookings,
        auditLogs,
        stats,
        dbStatus,
        isLoading,
        activeView,
        setActiveView,
        isBookModalOpen,
        setIsBookModalOpen,
        isCancelModalOpen,
        setIsCancelModalOpen,
        isPostponeModalOpen,
        setIsPostponeModalOpen,
        pendingBooking,
        setPendingBooking,
        bookingToCancel,
        setBookingToCancel,
        bookingToPostpone,
        setBookingToPostpone,
        createBooking,
        postponeBooking,
        cancelBooking,
        runCommand,
        resetToDefault,
        refreshData,
        toasts,
        removeToast,
        addToast,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}

export function useAgentBooking() {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgentBooking must be used within an AgentProvider");
  }
  return context;
}
