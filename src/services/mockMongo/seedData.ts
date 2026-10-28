import { Booking, AuditLog } from "@/types";

// Generate relative dates so seed data is always relevant today
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split("T")[0];
};

export const INITIAL_BOOKINGS: Booking[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];

