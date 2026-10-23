import { NextResponse } from "next/server";
import { checkDatabaseConnection } from "@/lib/dbConnect";
import { dbAdapter } from "@/services/dbAdapter";

export async function GET() {
  try {
    const status = await checkDatabaseConnection();
    const [bookingsCount, auditLogsCount] = await Promise.all([
      dbAdapter.getBookings().then((b) => b.length).catch(() => 0),
      dbAdapter.getAuditLogs().then((a) => a.length).catch(() => 0),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        ...status,
        counts: {
          bookings: bookingsCount,
          auditLogs: auditLogsCount,
        },
        serverTimestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to evaluate database connection status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
