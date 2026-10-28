"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge, AgentBadge } from "@/components/ui/Badge";
import { useAgentBooking } from "@/context/AgentContext";
import { useAuth } from "@/context/AuthContext";
import { Booking } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  RefreshCw,
  Trash2,
  Clock,
  CheckCircle2,
  CalendarDays,
  LayoutGrid,
  List,
  Sparkles,
  X,
  User,
  DollarSign,
  MapPin,
  CalendarCheck,
} from "lucide-react";

export function DynamicBookingCalendar() {
  const { user } = useAuth();
  const {
    bookings,
    setPendingBooking,
    setIsBookModalOpen,
    setBookingToPostpone,
    setIsPostponeModalOpen,
    setBookingToCancel,
    setIsCancelModalOpen,
  } = useAgentBooking();

  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "agenda">("grid");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "RESCHEDULED">("ALL");

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const prevMonth = () => {
    setCurrentMonthDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonthDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentMonthDate(new Date());
  };

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
  const todayStr = new Date().toISOString().split("T")[0];

  // Filter bookings based on status filter
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === "ALL") return true;
    return b.status === statusFilter;
  });

  // Group by date
  const bookingsByDate: Record<string, Booking[]> = {};
  filteredBookings.forEach((b) => {
    if (!bookingsByDate[b.date]) {
      bookingsByDate[b.date] = [];
    }
    bookingsByDate[b.date].push(b);
  });

  // Monthly statistics
  const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthBookings = bookings.filter((b) => b.date.startsWith(currentMonthPrefix));
  const confirmedCount = monthBookings.filter((b) => b.status === "CONFIRMED").length;
  const totalMonthRevenue = monthBookings.reduce((sum, b) => (b.status === "CONFIRMED" ? sum + b.amount : sum), 0);

  const handleCellClick = (dateStr: string) => {
    setPendingBooking({
      date: dateStr,
      timeSlot: "10:00 AM",
      serviceType: "AI Travel & Stay Booking",
      clientName: user?.name || "Traveler",
      clientEmail: user?.email || "user@auraagent.ai",
    });
    setIsBookModalOpen(true);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Sleek Minimalist Header Controls */}
      <div className="rounded-3xl bg-white/70 backdrop-blur-2xl p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.03)] flex flex-wrap items-center justify-between gap-4">
        {/* Left: Month title & Live Indicator */}
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {monthNames[month]} {year}
              </h2>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Autonomous booking calendar & real-time travel schedule
            </p>
          </div>
        </div>

        {/* Right: View Switcher, Filter, Month Controls & New Slot */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* View Mode Toggle: Grid vs Agenda */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("agenda")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === "agenda"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schedule</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 text-xs font-bold">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                statusFilter === "ALL" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("CONFIRMED")}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                statusFilter === "CONFIRMED" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setStatusFilter("RESCHEDULED")}
              className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                statusFilter === "RESCHEDULED" ? "bg-white text-amber-700 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Rescheduled
            </button>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 shadow-2xs">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-white transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* New Slot Button */}
          <button
            onClick={() => handleCellClick(todayStr)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:brightness-105 active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Slot</span>
          </button>
        </div>
      </div>

      {/* Monthly Summary Statistics Strip */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Month Total
            </p>
            <p className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
              {monthBookings.length}{" "}
              <span className="text-xs font-normal text-slate-400">slots</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <CalendarCheck className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Confirmed Active
            </p>
            <p className="text-lg sm:text-2xl font-black text-emerald-600 mt-0.5">
              {confirmedCount}{" "}
              <span className="text-xs font-normal text-slate-400">ready</span>
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-3.5 sm:p-4 rounded-2xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] flex items-center justify-between">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Scheduled Value
            </p>
            <p className="text-lg sm:text-2xl font-black text-slate-900 mt-0.5">
              ${totalMonthRevenue.toLocaleString()}
            </p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Main Calendar Display: Grid View or Agenda View */}
      {viewMode === "grid" ? (
        <div className="rounded-3xl bg-white/70 backdrop-blur-2xl p-3 sm:p-5 border border-white/90 shadow-[0_12px_40px_rgb(0,0,0,0.03)] overflow-hidden">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 text-center mb-2.5 pb-2 border-b border-slate-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
              <div
                key={day}
                className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider py-1.5 rounded-xl ${
                  i === 0 || i === 6 ? "text-indigo-600/80 bg-indigo-50/30" : "text-slate-400"
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid: Refined, Minimalist & Aesthetic */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {Array.from({ length: totalCells }).map((_, idx) => {
              let dayNum: number;
              let isCurrentMonth = true;
              let dateObj: Date;

              if (idx < firstDayIndex) {
                dayNum = daysInPrevMonth - firstDayIndex + idx + 1;
                isCurrentMonth = false;
                dateObj = new Date(year, month - 1, dayNum);
              } else if (idx >= firstDayIndex + daysInMonth) {
                dayNum = idx - (firstDayIndex + daysInMonth) + 1;
                isCurrentMonth = false;
                dateObj = new Date(year, month + 1, dayNum);
              } else {
                dayNum = idx - firstDayIndex + 1;
                isCurrentMonth = true;
                dateObj = new Date(year, month, dayNum);
              }

              const y = dateObj.getFullYear();
              const m = String(dateObj.getMonth() + 1).padStart(2, "0");
              const d = String(dateObj.getDate()).padStart(2, "0");
              const dateStr = `${y}-${m}-${d}`;

              const isToday = dateStr === todayStr;
              const dayBookings = bookingsByDate[dateStr] || [];

              return (
                <div
                  key={idx}
                  onClick={() => isCurrentMonth && handleCellClick(dateStr)}
                  className={`group relative min-h-[96px] sm:min-h-[120px] p-2 sm:p-2.5 rounded-2xl transition-all flex flex-col justify-between cursor-pointer border ${
                    !isCurrentMonth
                      ? "bg-slate-50/30 border-slate-100/60 text-slate-300 opacity-40 hover:opacity-70"
                      : isToday
                      ? "bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/70 border-indigo-300 shadow-sm shadow-indigo-500/10"
                      : "bg-white/80 hover:bg-white border-slate-100 hover:border-indigo-200/80 shadow-[0_2px_10px_rgb(0,0,0,0.01)] hover:shadow-md hover:shadow-indigo-500/5"
                  }`}
                >
                  {/* Date header & Quick Add */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold rounded-xl w-6 h-6 flex items-center justify-center transition-all ${
                        isToday
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-xs shadow-indigo-500/30 ring-2 ring-indigo-500/20"
                          : isCurrentMonth
                          ? "text-slate-800 group-hover:text-indigo-600 font-extrabold"
                          : "text-slate-400"
                      }`}
                    >
                      {dayNum}
                    </span>

                    {/* Quick Add indicator on hover */}
                    {isCurrentMonth && (
                      <span className="opacity-0 group-hover:opacity-100 text-indigo-500 hover:text-indigo-700 transition-opacity p-0.5">
                        <Plus className="w-3.5 h-3.5" />
                      </span>
                    )}

                    {/* Booking count dot badge */}
                    {dayBookings.length > 0 && !isToday && (
                      <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        {dayBookings.length}
                      </span>
                    )}
                  </div>

                  {/* Booking event tags inside cell */}
                  <div className="space-y-1 mt-1.5 flex-1 overflow-y-auto no-scrollbar">
                    {dayBookings.slice(0, 2).map((booking) => {
                      const isConfirmed = booking.status === "CONFIRMED";
                      const isRescheduled = booking.status === "RESCHEDULED";

                      return (
                        <div
                          key={booking._id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedBooking(booking);
                          }}
                          className={`px-2 py-1 rounded-xl text-[10px] font-medium truncate border transition-all hover:scale-[1.02] shadow-2xs flex items-center gap-1.5 ${
                            isConfirmed
                              ? "bg-emerald-50/90 text-emerald-900 border-emerald-200/60 hover:bg-emerald-100/90"
                              : isRescheduled
                              ? "bg-amber-50/90 text-amber-900 border-amber-200/60 hover:bg-amber-100/90"
                              : "bg-slate-100 text-slate-500 line-through border-slate-200 opacity-70"
                          }`}
                          title={`${booking.clientName} - ${booking.timeSlot} (${booking.status})`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              isConfirmed
                                ? "bg-emerald-500"
                                : isRescheduled
                                ? "bg-amber-500"
                                : "bg-slate-400"
                            }`}
                          />
                          <span className="font-bold shrink-0">{booking.timeSlot.split(" ")[0]}</span>
                          <span className="truncate">{booking.clientName}</span>
                        </div>
                      );
                    })}

                    {dayBookings.length > 2 && (
                      <div className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50/80 rounded-md py-0.5 text-center">
                        +{dayBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Agenda / Timeline View */
        <div className="rounded-3xl bg-white/70 backdrop-blur-2xl p-4 sm:p-6 border border-white/90 shadow-[0_12px_40px_rgb(0,0,0,0.03)] space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-extrabold text-slate-800">
              Upcoming Bookings Agenda ({filteredBookings.length} total)
            </h3>
            <button
              onClick={() => handleCellClick(todayStr)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Appointment</span>
            </button>
          </div>

          {filteredBookings.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <CalendarDays className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold">No bookings scheduled in this view</p>
              <button
                onClick={() => handleCellClick(todayStr)}
                className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 cursor-pointer"
              >
                Create First Slot
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredBookings.map((b) => (
                <div
                  key={b._id}
                  onClick={() => setSelectedBooking(b)}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white/90 hover:bg-white border border-slate-200/70 hover:border-indigo-300 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-blue-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-black text-xs shrink-0">
                      {b.timeSlot.split(" ")[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900">{b.clientName}</h4>
                        <StatusBadge status={b.status} />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        {b.serviceType} &bull; <span className="font-semibold">{b.date}</span> at {b.timeSlot}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-black text-indigo-600">${b.amount}</p>
                      <AgentBadge agent={b.agentAssigned} />
                    </div>
                    <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Selected Booking Details Floating Modal Drawer */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl border border-white"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedBooking.status} />
                    <AgentBadge agent={selectedBooking.agentAssigned} />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-1">
                    {selectedBooking.serviceType}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Client: <strong>{selectedBooking.clientName}</strong> ({selectedBooking.clientEmail})
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Booking Metadata Cards */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Scheduled Date
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">{selectedBooking.date}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Time Window
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">{selectedBooking.timeSlot}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Booking Amount
                  </span>
                  <span className="text-sm font-extrabold text-indigo-600">${selectedBooking.amount}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Assigned Engine
                  </span>
                  <span className="text-sm font-extrabold text-slate-900">{selectedBooking.agentAssigned} AI</span>
                </div>
              </div>

              {/* Notes / Reason */}
              {selectedBooking.notes && (
                <div className="p-3 rounded-2xl bg-indigo-50/50 border border-indigo-100/60 mb-4 text-xs text-slate-600">
                  <strong className="text-indigo-900 block mb-0.5">Session Notes:</strong>
                  {selectedBooking.notes}
                </div>
              )}

              {selectedBooking.rescheduledFrom && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 mb-4 text-xs text-amber-900">
                  <strong>Rescheduled from previous date:</strong> {selectedBooking.rescheduledFrom}
                </div>
              )}

              {selectedBooking.cancellationReason && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 mb-4 text-xs text-rose-900">
                  <strong>Cancellation reason:</strong> {selectedBooking.cancellationReason}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                <Button
                  variant="violet"
                  size="sm"
                  onClick={() => {
                    setBookingToPostpone(selectedBooking);
                    setIsPostponeModalOpen(true);
                    setSelectedBooking(null);
                  }}
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  className="rounded-xl text-xs font-bold"
                >
                  Postpone Slot
                </Button>

                {selectedBooking.status !== "CANCELLED" && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      setBookingToCancel(selectedBooking);
                      setIsCancelModalOpen(true);
                      setSelectedBooking(null);
                    }}
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    className="rounded-xl text-xs font-bold"
                  >
                    Cancel Booking
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
