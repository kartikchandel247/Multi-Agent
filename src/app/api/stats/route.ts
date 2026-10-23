import { NextResponse } from "next/server";
import { dbAdapter } from "@/services/dbAdapter";

export async function GET() {
  try {
    const stats = await dbAdapter.getBusinessStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats", details: String(error) },
      { status: 500 }
    );
  }
}
