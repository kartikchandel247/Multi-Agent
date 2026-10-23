"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { StatusBadge, AgentBadge } from "@/components/ui/Badge";
import { useAgentBooking } from "@/context/AgentContext";
import { Booking } from "@/types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

export function DynamicBookingCalendar() {
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

  // Month navigation helpers
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

  // Build days for month grid
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;

  const todayStr = new Date().toISOString().split("T")[0];

  // Map bookings by date
  const bookingsByDate: Record<string, Booking[]> = {};
  bookings.forEach((b) => {
    if (!bookingsByDate[b.date]) {
      bookingsByDate[b.date] = [];
    }
    bookingsByDate[b.date].push(b);
  });

  const handleCellClick = (dateStr: string) => {
    setPendingBooking({
      date: dateStr,
      timeSlot: "10:00 AM",
      serviceType: "AI Strategy Consult",
      clientName: "Alex Morgan",
      clientEmail: "alex.morgan@client.com",
    });
    setIsBookModalOpen(true);
  };

  return (
    <div className="space-y-5">
      {/* Calendar Header Controls */}
      <GlassCard className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400">
              Reactive live sync with Mongoose mock collections
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="glass" size="sm" onClick={goToToday} className="text-xs">
            Today
          </Button>

          <div className="flex items-center bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/60">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleCellClick(todayStr)}
            icon={<Plus className="w-4 h-4" />}
            className="text-xs font-semibold"
          >
            New Slot
          </Button>
        </div>
      </GlassCard>

      {/* Main Calendar Grid */}
      <GlassCard className="p-3 sm:p-5 overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs font-bold uppercase tracking-wider text-slate-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
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

            // ISO string YYYY-MM-DD local format
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
                className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                  !isCurrentMonth
                    ? "bg-slate-50/40 border-slate-100 text-slate-300 opacity-60"
                    : isToday
                    ? "bg-blue-50/50 border-blue-300/80 shadow-xs"
                    : "bg-white/70 hover:bg-white border-slate-200/70 hover:border-blue-300 shadow-2xs"
                }`}
              >
                {/* Date header inside cell */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold rounded-lg w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? "bg-blue-600 text-white font-extrabold shadow-xs"
                        : isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {dayBookings.length > 0 && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded-full border border-blue-200">
                      {dayBookings.length}
                    </span>
                  )}
                </div>

                {/* Booking event tags inside cell */}
                <div className="space-y-1 mt-1 flex-1 overflow-y-auto no-scrollbar">
                  {dayBookings.slice(0, 2).map((booking) => {
                    const isConfirmed = booking.status === "CONFIRMED";
                    const isRescheduled = booking.status === "RESCHEDULED";
                    const isCancelled = booking.status === "CANCELLED";

                    return (
                      <div
                        key={booking._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedBooking(booking);
                        }}
                        className={`px-1.5 py-1 rounded-lg text-[10px] font-medium truncate border transition-transform hover:scale-[1.02] shadow-2xs ${
                          isConfirmed
                            ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                            : isRescheduled
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                            : "bg-rose-50 text-rose-600 line-through border-rose-200 opacity-75"
                        }`}
                        title={`${booking.clientName} - ${booking.timeSlot} (${booking.status})`}
                      >
                        <span className="font-bold">{booking.timeSlot}</span> &bull; {booking.clientName}
                      </div>
                    );
                  })}

                  {dayBookings.length > 2 && (
                    <div className="text-[9px] font-semibold text-slate-400 text-center">
                      +{dayBookings.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* Selected Booking Drawer / Details Card */}
      {selectedBooking && (
        <GlassCard className="p-5 border-blue-200 shadow-md">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedBooking.status} />
                <AgentBadge agent={selectedBooking.agentAssigned} />
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-1">{selectedBooking.serviceType}</h3>
              <p className="text-xs text-slate-500">
                Client: <strong>{selectedBooking.clientName}</strong> &bull; {selectedBooking.clientEmail}
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-extrabold text-blue-600">${selectedBooking.amount}</p>
              <p className="text-xs text-slate-400">ID: {selectedBooking._id.slice(-6)}</p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Date</span>
              <span className="font-semibold text-slate-800">{selectedBooking.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Window</span>
              <span className="font-semibold text-slate-800">{selectedBooking.timeSlot}</span>
            </div>
            {selectedBooking.rescheduledFrom && (
              <div>
                <span className="text-indigo-500 block text-[10px] uppercase font-bold">Rescheduled From</span>
                <span className="font-semibold text-indigo-700">{selectedBooking.rescheduledFrom}</span>
              </div>
            )}
            {selectedBooking.cancellationReason && (
              <div>
                <span className="text-rose-500 block text-[10px] uppercase font-bold">Cancellation Reason</span>
                <span className="font-semibold text-rose-700">{selectedBooking.cancellationReason}</span>
              </div>
            )}
          </div>

          {/* Quick Actions for Selected Booking */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
            <p className="text-[11px] text-slate-400">
              Atlas conflict resolution engine verified this slot.
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="violet"
                size="sm"
                onClick={() => {
                  setBookingToPostpone(selectedBooking);
                  setIsPostponeModalOpen(true);
                }}
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                className="text-xs"
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
                  }}
                  icon={<Trash2 className="w-3.5 h-3.5" />}
                  className="text-xs"
                >
                  Cancel Booking
                </Button>
              )}
            </div>
          </div>
        </GlassCard>
      )}
    </div>
  );
}
