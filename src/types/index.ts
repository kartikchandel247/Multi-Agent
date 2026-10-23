export type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "RESCHEDULED";

export type AgentPersona = "Nova" | "Atlas" | "Vera" | "Nexus";

export interface Booking {
  _id: string;
  clientName: string;
  clientEmail: string;
  serviceType: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:00 AM"
  status: BookingStatus;
  amount: number;
  agentAssigned: AgentPersona;
  notes?: string;
  rescheduledFrom?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type CommandIntent =
  | "BOOK_SLOT"
  | "POSTPONE_BOOKING"
  | "CANCEL_BOOKING"
  | "QUERY_SCHEDULE"
  | "UNKNOWN";

export interface AuditLog {
  _id: string;
  timestamp: string;
  userCommand: string;
  intentDetected: CommandIntent;
  agentInvolved: AgentPersona;
  actionsTaken: string[];
  dbOperation: "INSERT" | "UPDATE" | "DELETE" | "QUERY";
  targetId?: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
  confidenceScore: number;
}

export interface BusinessStats {
  totalBookings: number;
  activeAiSessions: number;
  revenue: number;
  successRate: number;
  capacityUtilization: number;
  cancelledBookings: number;
  rescheduledBookings: number;
  weeklyTrend: { day: string; bookings: number; revenue: number }[];
}

export interface ParsedCommand {
  intent: CommandIntent;
  date?: string;
  timeSlot?: string;
  service?: string;
  clientName?: string;
  bookingId?: string;
  reason?: string;
  confidence: number;
  suggestedResponse: string;
  agent: AgentPersona;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "agent" | "system";
  agentName?: AgentPersona;
  content: string;
  timestamp: string;
  parsedCommand?: ParsedCommand;
  actionRequired?: "CONFIRM_BOOKING" | "CONFIRM_POSTPONE" | "CONFIRM_CANCEL";
  bookingData?: Partial<Booking>;
}
