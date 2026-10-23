import { NextResponse } from "next/server";
import { mockMongo } from "@/services/mockMongo";

export async function GET() {
  try {
    const stats = await mockMongo.getBusinessStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch stats", details: String(error) },
      { status: 500 }
    );
  }
}
