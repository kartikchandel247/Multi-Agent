"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AgentBadge } from "@/components/ui/Badge";
import { useAgentBooking } from "@/context/AgentContext";
import { User, Mail, Sparkles, Check } from "lucide-react";

export function BookingConfirmModal() {
  const { isBookModalOpen, setIsBookModalOpen, pendingBooking, createBooking } = useAgentBooking();

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceType, setServiceType] = useState("AI Strategy Consult");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("10:00 AM");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pendingBooking) {
      setClientName(pendingBooking.clientName || "Alex Morgan");
      setClientEmail(pendingBooking.clientEmail || "alex.morgan@client.com");
      setServiceType(pendingBooking.serviceType || "AI Strategy Consult");
      setDate(pendingBooking.date || new Date().toISOString().split("T")[0]);
      setTimeSlot(pendingBooking.timeSlot || "10:00 AM");
      setNotes(pendingBooking.notes || "Autonomous reservation via multi-agent command.");
    }
  }, [pendingBooking]);

  const timeOptions = [
    "09:00 AM",
    "10:00 AM",
    "11:15 AM",
    "01:00 PM",
    "02:30 PM",
    "04:00 PM",
  ];

  const services = [
    { name: "AI Strategy Consult", price: 600, duration: "60 mins" },
    { name: "Autonomous Agent Audit", price: 750, duration: "90 mins" },
    { name: "Full-Stack System Architecture", price: 1200, duration: "120 mins" },
    { name: "Enterprise Growth Sprint", price: 1500, duration: "180 mins" },
  ];

  const currentService = services.find((s) => s.name === serviceType) || services[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createBooking({
        clientName,
        clientEmail,
        serviceType,
        date,
        timeSlot,
        amount: currentService.price,
        agentAssigned: "Nova",
        notes,
        status: "CONFIRMED",
      });
      setIsBookModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isBookModalOpen}
      onClose={() => setIsBookModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <span>Confirm Autonomous Booking</span>
          <AgentBadge agent="Nova" />
        </div>
      }
      subtitle="Agent Nova parsed your request. Review the session specs and confirm appointment."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Service Selector Chips */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2">
            Select Consultation Track
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {services.map((item) => {
              const isSelected = serviceType === item.name;
              return (
                <button
                  type="button"
                  key={item.name}
                  onClick={() => setServiceType(item.name)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-br from-blue-500/15 via-white/70 to-indigo-500/15 border-blue-400 shadow-md shadow-blue-500/10 text-blue-900"
                      : "bg-white/40 hover:bg-white/70 backdrop-blur-md border-white/80 text-slate-700"
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold leading-tight">{item.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{item.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-blue-600">${item.price}</p>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 ml-auto mt-0.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Time Slot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
              Appointment Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:bg-white/80 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
              Preferred Time Slot
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
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

        {/* Client details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Client Full Name"
            required
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            placeholder="e.g. Elena Rostova"
          />
          <Input
            label="Work Email"
            type="email"
            required
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            placeholder="e.g. elena@vanguardai.tech"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-1.5">
            Mission Directives & Context Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Provide architectural goals or topic requests..."
            className="w-full rounded-2xl bg-white/50 backdrop-blur-xl border border-white/80 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white/80 focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400 font-medium"
          />
        </div>

        {/* Summary Footer */}
        <div className="p-4 rounded-2xl bg-white/40 backdrop-blur-xl border border-white/70 flex items-center justify-between flex-wrap gap-2 text-xs shadow-2xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <span className="text-slate-600 font-medium">
              Synchronizing with <strong>Atlas Resource Engine</strong>
            </span>
          </div>
          <div className="font-extrabold text-slate-900 text-sm">
            Total: <span className="text-blue-600">${currentService.price}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="glass"
            size="md"
            onClick={() => setIsBookModalOpen(false)}
            disabled={isSubmitting}
            className="rounded-2xl"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            icon={<Check className="w-4 h-4" />}
            className="rounded-2xl shadow-[0_10px_25px_-4px_rgba(79,70,229,0.45)]"
          >
            Confirm Reservation
          </Button>
        </div>
      </form>
    </Modal>
  );
}
