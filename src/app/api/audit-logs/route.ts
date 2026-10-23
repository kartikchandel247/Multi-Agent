import { NextResponse } from "next/server";
import { mockMongo } from "@/services/mockMongo";

export async function GET() {
  try {
    const logs = await mockMongo.AuditLog.find();
    return NextResponse.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch audit logs", details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const created = await mockMongo.AuditLog.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create audit log", details: String(error) },
      { status: 500 }
    );
  }
}
