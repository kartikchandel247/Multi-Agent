import { NextResponse } from "next/server";
import { mockMongo } from "@/services/mockMongo";

export async function GET() {
  try {
    const bookings = await mockMongo.Booking.find();
    return NextResponse.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch bookings", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await mockMongo.Booking.create(body);

    // Record autonomous AI audit log
    await mockMongo.AuditLog.create({
      userCommand: `API POST /api/bookings: Created booking for ${created.clientName}`,
      intentDetected: "BOOK_SLOT",
      agentInvolved: created.agentAssigned || "Nova",
      actionsTaken: [
        `Nova authorized booking parameters for ${created.clientName}`,
        `Atlas allocated calendar time slot ${created.date} at ${created.timeSlot}`,
        `Persisted document ID ${created._id} into MongoDB collection`,
      ],
      dbOperation: "INSERT",
      targetId: created._id,
      status: "SUCCESS",
      confidenceScore: 0.99,
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create booking", details: String(error) },
      { status: 500 }
    );
  }
}
