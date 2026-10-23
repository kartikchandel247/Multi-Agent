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
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              {monthNames[month]} {year}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Live multi-agent calendar matrix with conflict resolution
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="glass" size="sm" onClick={goToToday} className="text-xs rounded-xl">
            Today
          </Button>

          <div className="flex items-center bg-white/40 backdrop-blur-xl p-1 rounded-2xl border border-white/70 shadow-2xs">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-white/80 transition-all cursor-pointer"
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
            className="text-xs font-bold rounded-2xl"
          >
            New Slot
          </Button>
        </div>
      </GlassCard>

      {/* Main Frosted Calendar Grid */}
      <GlassCard className="p-4 sm:p-6 overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 text-center mb-3">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
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
                className={`min-h-[92px] sm:min-h-[120px] p-2 sm:p-2.5 rounded-2xl border transition-all flex flex-col justify-between cursor-pointer ${
                  !isCurrentMonth
                    ? "bg-white/10 border-white/20 text-slate-300 opacity-40"
                    : isToday
                    ? "bg-gradient-to-br from-blue-500/15 via-white/60 to-indigo-500/15 border-blue-400/50 shadow-md shadow-blue-500/10"
                    : "bg-white/40 hover:bg-white/70 backdrop-blur-xl border-white/75 hover:border-indigo-300/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-md"
                }`}
              >
                {/* Date header inside cell */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold rounded-xl w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold shadow-sm"
                        : isCurrentMonth
                        ? "text-slate-800"
                        : "text-slate-400"
                    }`}
                  >
                    {dayNum}
                  </span>

                  {dayBookings.length > 0 && (
                    <span className="text-[10px] font-extrabold text-blue-700 bg-blue-500/15 px-2 py-0.5 rounded-full border border-blue-400/30">
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
                        className={`px-2 py-1 rounded-xl text-[10px] font-semibold truncate border backdrop-blur-md transition-transform hover:scale-[1.02] shadow-2xs ${
                          isConfirmed
                            ? "bg-blue-500/15 text-blue-800 border-blue-400/40 hover:bg-blue-500/25"
                            : isRescheduled
                            ? "bg-indigo-500/15 text-indigo-800 border-indigo-400/40 hover:bg-indigo-500/25"
                            : "bg-rose-500/15 text-rose-700 line-through border-rose-400/40 opacity-75"
                        }`}
                        title={`${booking.clientName} - ${booking.timeSlot} (${booking.status})`}
                      >
                        <span className="font-bold">{booking.timeSlot}</span> &bull; {booking.clientName}
                      </div>
                    );
                  })}

                  {dayBookings.length > 2 && (
                    <div className="text-[9px] font-bold text-slate-400 text-center">
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
        <GlassCard className="p-6 border-blue-300/60 shadow-lg">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedBooking.status} />
                <AgentBadge agent={selectedBooking.agentAssigned} />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">{selectedBooking.serviceType}</h3>
              <p className="text-xs text-slate-500 font-medium">
                Client: <strong>{selectedBooking.clientName}</strong> &bull; {selectedBooking.clientEmail}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xl font-extrabold text-blue-600">${selectedBooking.amount}</p>
              <p className="text-[10px] text-slate-400 font-mono">ID: {selectedBooking._id.slice(-6)}</p>
            </div>
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Scheduled Date</span>
              <span className="font-bold text-slate-800">{selectedBooking.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Time Window</span>
              <span className="font-bold text-slate-800">{selectedBooking.timeSlot}</span>
            </div>
            {selectedBooking.rescheduledFrom && (
              <div>
                <span className="text-indigo-600 block text-[10px] uppercase font-bold">Rescheduled From</span>
                <span className="font-bold text-indigo-700">{selectedBooking.rescheduledFrom}</span>
              </div>
            )}
            {selectedBooking.cancellationReason && (
              <div>
                <span className="text-rose-600 block text-[10px] uppercase font-bold">Cancellation Reason</span>
                <span className="font-bold text-rose-700">{selectedBooking.cancellationReason}</span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-white/60 flex items-center justify-between flex-wrap gap-2">
            <p className="text-[11px] text-slate-500 font-medium">
              Atlas conflict resolution engine cleared this session.
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
                className="text-xs rounded-xl"
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
                  className="text-xs rounded-xl"
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
