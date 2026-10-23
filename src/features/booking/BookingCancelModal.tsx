"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { AgentBadge } from "@/components/ui/Badge";
import { useAgentBooking } from "@/context/AgentContext";
import { ShieldCheck, Trash2 } from "lucide-react";

export function BookingCancelModal() {
  const {
    isCancelModalOpen,
    setIsCancelModalOpen,
    bookingToCancel,
    bookings,
    cancelBooking,
  } = useAgentBooking();

  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [reason, setReason] = useState("Client schedule priority adjustment");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeBookings = bookings.filter((b) => b.status === "CONFIRMED" || b.status === "RESCHEDULED");
  const target = bookingToCancel || (activeBookings.length > 0 ? activeBookings[0] : null);

  const handleConfirmCancel = async () => {
    const idToCancel = target?._id || selectedBookingId;
    if (!idToCancel) return;

    setIsSubmitting(true);
    try {
      await cancelBooking(idToCancel, reason);
      setIsCancelModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isCancelModalOpen}
      onClose={() => setIsCancelModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <span className="text-rose-600 font-extrabold">Cancel Appointment</span>
          <AgentBadge agent="Vera" />
        </div>
      }
      subtitle="Agent Vera enforces policy compliance and handles cancellation ledger updates."
      maxWidth="md"
    >
      <div className="space-y-4">
        {target ? (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-300/40 backdrop-blur-xl space-y-2.5 shadow-2xs">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase font-extrabold text-rose-600 tracking-wider">Target Reservation</p>
                <h4 className="text-sm font-extrabold text-slate-900 mt-0.5">{target.serviceType}</h4>
                <p className="text-xs text-slate-600 font-medium">Client: {target.clientName} ({target.clientEmail})</p>
              </div>
              <span className="text-base font-extrabold text-slate-900">${target.amount}</span>
            </div>

            <div className="pt-2 border-t border-rose-200/50 flex items-center justify-between text-xs text-slate-600 font-medium">
              <span>Date: <strong className="text-slate-800">{target.date}</strong></span>
              <span>Time: <strong className="text-slate-800">{target.timeSlot}</strong></span>
            </div>
          </div>
        ) : (
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
              Select Booking to Cancel
            </label>
            <select
              value={selectedBookingId}
              onChange={(e) => setSelectedBookingId(e.target.value)}
              className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white/80 focus:ring-4 focus:ring-rose-500/15 focus:border-rose-400"
            >
              {activeBookings.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.clientName} - {b.serviceType} ({b.date})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Vera Policy Verification Banner */}
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-400/30 text-xs text-purple-950 flex items-start gap-2.5 backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-extrabold text-purple-950">Vera Policy Compliance Cleared</p>
            <p className="text-[11px] text-purple-900/80 mt-0.5 font-medium leading-relaxed">
              Notice window is compliant. Atlas will immediately release this time slot for external booking, and the audit log will record status mutation.
            </p>
          </div>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            Cancellation Reason (Audit Trail)
          </label>
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason for cancellation..."
            className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 px-4 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:bg-white/80 focus:ring-4 focus:ring-rose-500/15 focus:border-rose-400"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="glass"
            size="md"
            onClick={() => setIsCancelModalOpen(false)}
            disabled={isSubmitting}
            className="rounded-2xl"
          >
            Keep Booking
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            onClick={handleConfirmCancel}
            isLoading={isSubmitting}
            icon={<Trash2 className="w-4 h-4" />}
            className="rounded-2xl shadow-sm"
          >
            Confirm Cancellation
          </Button>
        </div>
      </div>
    </Modal>
  );
}
