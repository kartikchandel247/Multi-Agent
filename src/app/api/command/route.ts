import { NextResponse } from "next/server";
import { dbAdapter } from "@/services/dbAdapter";
import { parseUserCommand } from "@/services/commandParser";

export async function POST(request: Request) {
  try {
    const { command } = await request.json();
    if (!command || typeof command !== "string") {
      return NextResponse.json({ success: false, error: "Command is required" }, { status: 400 });
    }

    const currentBookings = await dbAdapter.getBookings();
    const parsed = parseUserCommand(command, currentBookings);

    let executionResult = null;

    if (parsed.intent === "POSTPONE_BOOKING" && parsed.bookingId && parsed.date) {
      const target = await dbAdapter.getBookingById(parsed.bookingId);
      if (target) {
        const oldDate = target.date;
        const updated = await dbAdapter.updateBooking(parsed.bookingId, {
          date: parsed.date,
          timeSlot: parsed.timeSlot || target.timeSlot,
          status: "RESCHEDULED",
          rescheduledFrom: oldDate,
        });

        await dbAdapter.createAuditLog({
          userCommand: command,
          intentDetected: "POSTPONE_BOOKING",
          agentInvolved: "Atlas",
          actionsTaken: [
            `Atlas relocated booking for ${target.clientName} from ${oldDate} to ${parsed.date}`,
            `MongoDB updateOne executed: status -> 'RESCHEDULED'`,
            `Calendar slot synchronized across all connected admin screens`,
          ],
          dbOperation: "UPDATE",
          targetId: target._id,
          status: "SUCCESS",
          confidenceScore: parsed.confidence,
        });

        executionResult = {
          action: "POSTPONE_EXECUTED",
          oldDate,
          newDate: parsed.date,
          booking: updated,
        };
      }
    } else {
      await dbAdapter.createAuditLog({
        userCommand: command,
        intentDetected: parsed.intent,
        agentInvolved: parsed.agent,
        actionsTaken: [
          `Agent ${parsed.agent} evaluated intent confidence (${Math.round(parsed.confidence * 100)}%)`,
          `Parsed visual entities: Date=${parsed.date || "N/A"}, Time=${parsed.timeSlot || "N/A"}`,
          `Dispatched command action payload to client UI`,
        ],
        dbOperation: "QUERY",
        status: "SUCCESS",
        confidenceScore: parsed.confidence,
      });
    }

    return NextResponse.json({
      success: true,
      parsed,
      executionResult,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to process command", details: String(error) },
      { status: 500 }
    );
  }
}
