import { CommandIntent, ParsedCommand, AgentPersona, Booking } from "@/types";

// Helper to normalize and parse relative dates or explicit dates
export function extractDateFromText(text: string): string {
  const lower = text.toLowerCase();
  const today = new Date();

  // Explicit YYYY-MM-DD
  const isoMatch = text.match(/\b\d{4}-\d{2}-\d{2}\b/);
  if (isoMatch) return isoMatch[0];

  // Specific keywords
  if (lower.includes("today")) {
    return today.toISOString().split("T")[0];
  }
  if (lower.includes("tomorrow")) {
    const d = new Date(today);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }
  if (lower.includes("day after tomorrow")) {
    const d = new Date(today);
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  }

  // Days of week
  const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  for (let i = 0; i < daysOfWeek.length; i++) {
    if (lower.includes(daysOfWeek[i])) {
      const currentDay = today.getDay();
      let diff = i - currentDay;
      if (diff <= 0 || lower.includes("next " + daysOfWeek[i])) {
        diff += 7;
      }
      const target = new Date(today);
      target.setDate(target.getDate() + diff);
      return target.toISOString().split("T")[0];
    }
  }

  // "in X days"
  const inDaysMatch = lower.match(/in\s+(\d+)\s+days?/);
  if (inDaysMatch) {
    const daysToAdd = parseInt(inDaysMatch[1], 10);
    const target = new Date(today);
    target.setDate(target.getDate() + daysToAdd);
    return target.toISOString().split("T")[0];
  }

  // Fallback default: next business day (3 days ahead)
  const fallback = new Date(today);
  fallback.setDate(fallback.getDate() + 3);
  return fallback.toISOString().split("T")[0];
}

// Helper to extract time slot (e.g., 10:00 AM, 2:30 PM, 3pm)
export function extractTimeFromText(text: string): string {
  const timeMatch = text.match(/\b(0?[1-9]|1[0-2])(?::([0-5][0-9]))?\s*(am|pm|AM|PM)\b/);
  if (timeMatch) {
    const hour = timeMatch[1].padStart(2, "0");
    const minutes = timeMatch[2] || "00";
    const meridiem = timeMatch[3].toUpperCase();
    return `${hour}:${minutes} ${meridiem}`;
  }
  return "10:00 AM"; // default slot
}

// Master command parser
export function parseUserCommand(command: string, currentBookings: Booking[] = []): ParsedCommand {
  const lower = command.toLowerCase().trim();

  // 1. POSTPONE / RESCHEDULE
  if (
    lower.includes("postpone") ||
    lower.includes("reschedule") ||
    lower.includes("delay") ||
    lower.includes("move my booking") ||
    lower.includes("change date")
  ) {
    const extractedDate = extractDateFromText(command);
    const extractedTime = extractTimeFromText(command);
    // Find client's most recent confirmed booking
    const activeBooking = currentBookings.find((b) => b.status === "CONFIRMED") || currentBookings[0];

    return {
      intent: "POSTPONE_BOOKING",
      date: extractedDate,
      timeSlot: extractedTime,
      bookingId: activeBooking?._id,
      clientName: activeBooking?.clientName || "Alex Morgan",
      confidence: 0.96,
      agent: "Atlas",
      suggestedResponse: `Agent Atlas received your reschedule request. I have verified calendar availability for ${extractedDate} at ${extractedTime}. Updating MongoDB state...`,
    };
  }

  // 2. CANCEL
  if (
    lower.includes("cancel") ||
    lower.includes("drop booking") ||
    lower.includes("void my appointment") ||
    lower.includes("call off")
  ) {
    const activeBooking = currentBookings.find((b) => b.status === "CONFIRMED") || currentBookings[0];

    return {
      intent: "CANCEL_BOOKING",
      bookingId: activeBooking?._id,
      clientName: activeBooking?.clientName || "Alex Morgan",
      reason: "Client command via conversational interface",
      confidence: 0.98,
      agent: "Vera",
      suggestedResponse:
        "Agent Vera has initiated cancellation protocol. Please verify cancellation in the glass confirmation box to release the time slot and update records.",
    };
  }

  // 3. BOOK / SCHEDULE
  if (
    lower.includes("book") ||
    lower.includes("schedule") ||
    lower.includes("reserve") ||
    lower.includes("appointment") ||
    lower.includes("slot")
  ) {
    const extractedDate = extractDateFromText(command);
    const extractedTime = extractTimeFromText(command);

    let service = "AI Strategy Consult";
    if (lower.includes("architecture") || lower.includes("full-stack") || lower.includes("system")) {
      service = "Full-Stack System Architecture";
    } else if (lower.includes("audit") || lower.includes("review")) {
      service = "Autonomous Agent Audit";
    } else if (lower.includes("growth") || lower.includes("enterprise")) {
      service = "Enterprise Growth Sprint";
    }

    return {
      intent: "BOOK_SLOT",
      date: extractedDate,
      timeSlot: extractedTime,
      service,
      clientName: "Alex Morgan",
      confidence: 0.99,
      agent: "Nova",
      suggestedResponse: `Agent Nova prepared your reservation for ${extractedDate} at ${extractedTime}. Opening the interactive confirmation modal now.`,
    };
  }

  // 4. QUERY / AVAILABILITY
  if (lower.includes("available") || lower.includes("show") || lower.includes("calendar") || lower.includes("list")) {
    return {
      intent: "QUERY_SCHEDULE",
      confidence: 0.91,
      agent: "Atlas",
      suggestedResponse:
        "Agent Atlas scanned the MongoDB calendar ledger. There are active slots open across this week.",
    };
  }

  // Default fallback
  return {
    intent: "UNKNOWN",
    confidence: 0.45,
    agent: "Nova",
    suggestedResponse:
      "I am Agent Nova. Try actionable commands like: 'Book a slot for tomorrow at 2:00 PM', 'Postpone my booking to Friday', or 'Cancel my booking'.",
  };
}
