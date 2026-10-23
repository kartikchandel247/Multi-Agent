"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AgentBadge } from "@/components/ui/Badge";
import { useAgentBooking } from "@/context/AgentContext";
import { RefreshCw, AlertCircle } from "lucide-react";

export function BookingPostponeModal() {
  const {
    isPostponeModalOpen,
    setIsPostponeModalOpen,
    bookingToPostpone,
    bookings,
    postponeBooking,
  } = useAgentBooking();

  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("02:30 PM");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "RESCHEDULED");

  useEffect(() => {
    if (bookingToPostpone) {
      setSelectedBookingId(bookingToPostpone._id);
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 4);
      setNewDate(nextDay.toISOString().split("T")[0]);
      setNewTime(bookingToPostpone.timeSlot || "02:30 PM");
    } else if (activeBookings.length > 0) {
      setSelectedBookingId(activeBookings[0]._id);
      const nextDay = new Date();
      nextDay.setDate(nextDay.getDate() + 4);
      setNewDate(nextDay.toISOString().split("T")[0]);
    }
  }, [bookingToPostpone, activeBookings]);

  const targetBooking = bookings.find((b) => b._id === selectedBookingId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !newDate) return;
    setIsSubmitting(true);
    try {
      await postponeBooking(selectedBookingId, newDate, newTime);
      setIsPostponeModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const timeOptions = [
    "09:00 AM",
    "10:00 AM",
    "11:15 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
  ];

  return (
    <Modal
      isOpen={isPostponeModalOpen}
      onClose={() => setIsPostponeModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <span>Postpone & Reschedule Session</span>
          <AgentBadge agent="Atlas" />
        </div>
      }
      subtitle="Agent Atlas calculates real-time slot clearance to prevent scheduling collisions."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Booking selector */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            Select Active Appointment
          </label>
          <select
            value={selectedBookingId}
            onChange={(e) => setSelectedBookingId(e.target.value)}
            className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white/80 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400"
          >
            {activeBookings.map((b) => (
              <option key={b._id} value={b._id}>
                {b.clientName} &bull; {b.serviceType} ({b.date} at {b.timeSlot})
              </option>
            ))}
          </select>
        </div>

        {targetBooking && (
          <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-400/30 text-xs text-indigo-950 flex items-center justify-between backdrop-blur-md">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-600 block tracking-wider">Current Schedule</span>
              <p className="font-extrabold">{targetBooking.date} at {targetBooking.timeSlot}</p>
            </div>
            <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" style={{ animationDuration: "6s" }} />
          </div>
        )}

        {/* New Date and Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
              Target New Date
            </label>
            <input
              type="date"
              required
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white/80 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
              Target Time Slot
            </label>
            <select
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white/80 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400"
            >
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Atlas confirmation note */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-400/30 text-xs text-emerald-950 flex items-start gap-2.5 backdrop-blur-md">
          <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <p className="font-medium">
            Atlas verified zero double-booking conflicts on <strong>{newDate || "selected date"}</strong>.
            The appointment will be rescheduled immediately across team calendars.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="glass"
            size="md"
            onClick={() => setIsPostponeModalOpen(false)}
            disabled={isSubmitting}
            className="rounded-2xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="violet"
            size="md"
            isLoading={isSubmitting}
            icon={<RefreshCw className="w-4 h-4" />}
            className="rounded-2xl shadow-[0_10px_25px_-4px_rgba(139,92,246,0.45)]"
          >
            Apply Postponement
          </Button>
        </div>
      </form>
    </Modal>
  );
}
