"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Booking, AuditLog, BusinessStats, AgentPersona, ParsedCommand } from "@/types";
import { mockMongo } from "@/services/mockMongo";
import { parseUserCommand } from "@/services/commandParser";
import confetti from "canvas-confetti";

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

  // Synchronize state from mockMongo
  const refreshData = useCallback(async () => {
    try {
      const [allBookings, allLogs, curStats] = await Promise.all([
        mockMongo.Booking.find(),
        mockMongo.AuditLog.find(),
        mockMongo.getBusinessStats(),
      ]);
      setBookings(allBookings);
      setAuditLogs(allLogs);
      setStats(curStats);
    } catch (err) {
      console.error("Error refreshing mockMongo data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Subscribe to mockMongo events
  useEffect(() => {
    refreshData();
    const unsubscribe = mockMongo.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  // Create booking
  const createBooking = async (data: Partial<Booking>): Promise<Booking> => {
    const created = await mockMongo.Booking.create(data);

    // Record autonomous AI audit log
    await mockMongo.AuditLog.create({
      userCommand: `Command confirmed: Book ${created.serviceType} for ${created.clientName}`,
      intentDetected: "BOOK_SLOT",
      agentInvolved: created.agentAssigned || "Nova",
      actionsTaken: [
        `Agent Nova verified client slot reservation: ${created.date} at ${created.timeSlot}`,
        `Agent Atlas updated calendar allocation table in MongoDB`,
        `Persisted document ID: ${created._id}`,
      ],
      dbOperation: "INSERT",
      targetId: created._id,
      status: "SUCCESS",
      confidenceScore: 0.99,
    });

    addToast(
      "Slot Confirmed & Registered!",
      `Agent Nova successfully confirmed your appointment for ${created.date} at ${created.timeSlot}.`,
      "success",
      "Nova"
    );

    // Trigger celebration confetti
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

    return created;
  };

  // Postpone booking
  const postponeBooking = async (
    id: string,
    newDate: string,
    newTime?: string
  ): Promise<Booking | null> => {
    const existing = await mockMongo.Booking.findById(id);
    if (!existing) return null;

    const oldDate = existing.date;
    const updated = await mockMongo.Booking.findByIdAndUpdate(id, {
      date: newDate,
      timeSlot: newTime || existing.timeSlot,
      status: "RESCHEDULED",
      rescheduledFrom: oldDate,
    });

    await mockMongo.AuditLog.create({
      userCommand: `Postpone command executed for ${existing.clientName}`,
      intentDetected: "POSTPONE_BOOKING",
      agentInvolved: "Atlas",
      actionsTaken: [
        `Agent Atlas validated new slot: ${newDate}`,
        `MongoDB updateOne executed: date modified from ${oldDate} to ${newDate}`,
        `Dispatched calendar ledger sync to dynamic dashboard`,
      ],
      dbOperation: "UPDATE",
      targetId: id,
      status: "SUCCESS",
      confidenceScore: 0.98,
    });

    addToast(
      "Booking Postponed Successfully!",
      `Agent Atlas updated your session to ${newDate} at ${newTime || existing.timeSlot}.`,
      "success",
      "Atlas"
    );

    return updated;
  };

  // Cancel booking
  const cancelBooking = async (id: string, reason?: string): Promise<Booking | null> => {
    const existing = await mockMongo.Booking.findById(id);
    if (!existing) return null;

    const updated = await mockMongo.Booking.findByIdAndUpdate(id, {
      status: "CANCELLED",
      cancellationReason: reason || "User initiated cancellation via AI Agent",
    });

    await mockMongo.AuditLog.create({
      userCommand: `Cancel booking for ${existing.clientName}`,
      intentDetected: "CANCEL_BOOKING",
      agentInvolved: "Vera",
      actionsTaken: [
        "Agent Vera evaluated cancellation terms: Verified valid policy window",
        `MongoDB updateOne executed: status changed to 'CANCELLED'`,
        `Freed calendar time slot ${existing.date} ${existing.timeSlot}`,
      ],
      dbOperation: "UPDATE",
      targetId: id,
      status: "SUCCESS",
      confidenceScore: 0.99,
    });

    addToast(
      "Booking Cancelled",
      `Agent Vera processed the cancellation. The time slot on ${existing.date} has been released.`,
      "warning",
      "Vera"
    );

    return updated;
  };

  // Run natural language command
  const runCommand = async (
    commandText: string
  ): Promise<{ parsed: ParsedCommand; success: boolean }> => {
    const parsed = parseUserCommand(commandText, bookings);

    if (parsed.intent === "BOOK_SLOT") {
      setPendingBooking({
        clientName: parsed.clientName || "Alex Morgan",
        clientEmail: "alex.morgan@client.com",
        serviceType: parsed.service || "AI Strategy Consult",
        date: parsed.date || new Date().toISOString().split("T")[0],
        timeSlot: parsed.timeSlot || "10:00 AM",
        amount: 600,
        agentAssigned: "Nova",
      });
      setIsBookModalOpen(true);
      return { parsed, success: true };
    }

    if (parsed.intent === "POSTPONE_BOOKING") {
      const active = bookings.find((b) => b.status === "CONFIRMED") || bookings[0];
      if (active) {
        if (parsed.date) {
          // Direct update
          await postponeBooking(active._id, parsed.date, parsed.timeSlot);
        } else {
          setBookingToPostpone(active);
          setIsPostponeModalOpen(true);
        }
      }
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
      return { parsed, success: true };
    }

    return { parsed, success: true };
  };

  const resetToDefault = () => {
    mockMongo.resetAll();
    addToast("Database Reset", "Mock MongoDB collections restored to factory seed state.", "info", "Nexus");
  };

  return (
    <AgentContext.Provider
      value={{
        bookings,
        auditLogs,
        stats,
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
