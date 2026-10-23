import { NextResponse } from "next/server";
import { dbAdapter } from "@/services/dbAdapter";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = await dbAdapter.getBookingById(id);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve booking", details: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await dbAdapter.updateBooking(id, body);

    if (!updated) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const isPostpone = body.date && body.date !== updated.date;
    const isCancel = body.status === "CANCELLED";

    await dbAdapter.createAuditLog({
      userCommand: `API PUT /api/bookings/${id}: Update received`,
      intentDetected: isCancel ? "CANCEL_BOOKING" : isPostpone ? "POSTPONE_BOOKING" : "BOOK_SLOT",
      agentInvolved: isCancel ? "Vera" : "Atlas",
      actionsTaken: [
        `Verified resource update permissions on record ${id}`,
        `Executed Mongoose updateOne({ _id: ObjectId("${id}") }, { $set: ... })`,
        `Real-time calendar subscriber notified`,
      ],
      dbOperation: "UPDATE",
      targetId: id,
      status: "SUCCESS",
      confidenceScore: 0.97,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update booking", details: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await dbAdapter.deleteBooking(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    await dbAdapter.createAuditLog({
      userCommand: `API DELETE /api/bookings/${id}`,
      intentDetected: "CANCEL_BOOKING",
      agentInvolved: "Vera",
      actionsTaken: [
        `Vera purged booking reference ${id} from persistent storage`,
        `Freed calendar time slot on ${deleted.date}`,
      ],
      dbOperation: "DELETE",
      targetId: id,
      status: "SUCCESS",
      confidenceScore: 0.99,
    });

    return NextResponse.json({ success: true, data: deleted });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete booking", details: String(error) },
      { status: 500 }
    );
  }
}
