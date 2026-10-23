import { AuditLog } from "@/types";
import { generateObjectId } from "./Booking";

/*
// ==============================================================================
// REAL MONGOOSE SCHEMA SETUP FOR AUDIT LOGS (PRODUCTION)
// ==============================================================================
// import mongoose, { Schema, Document, Model } from "mongoose";
//
// export interface IAuditLogDocument extends Document {
//   timestamp: Date;
//   userCommand: string;
//   intentDetected: "BOOK_SLOT" | "POSTPONE_BOOKING" | "CANCEL_BOOKING" | "QUERY_SCHEDULE" | "UNKNOWN";
//   agentInvolved: "Nova" | "Atlas" | "Vera" | "Nexus";
//   actionsTaken: string[];
//   dbOperation: "INSERT" | "UPDATE" | "DELETE" | "QUERY";
//   targetId?: string;
//   status: "SUCCESS" | "WARNING" | "BLOCKED";
//   confidenceScore: number;
// }
//
// const AuditLogSchema = new Schema<IAuditLogDocument>(
//   {
//     timestamp: { type: Date, default: Date.now, index: true },
//     userCommand: { type: String, required: true },
//     intentDetected: { type: String, required: true },
//     agentInvolved: { type: String, required: true },
//     actionsTaken: [{ type: String }],
//     dbOperation: { type: String, enum: ["INSERT", "UPDATE", "DELETE", "QUERY"], required: true },
//     targetId: { type: String },
//     status: { type: String, enum: ["SUCCESS", "WARNING", "BLOCKED"], default: "SUCCESS" },
//     confidenceScore: { type: Number, default: 0.95 },
//   },
//   { timestamps: true }
// );
//
// export const RealAuditLogModel: Model<IAuditLogDocument> =
//   mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema);
// ==============================================================================
*/

export class MockAuditLogModel {
  private collection: AuditLog[];
  private notifyListeners: () => void;

  constructor(initialData: AuditLog[], notifyFn: () => void) {
    this.collection = [...initialData];
    this.notifyListeners = notifyFn;
  }

  // Simulates: AuditLog.find().sort({ timestamp: -1 })
  async find(filter?: Partial<AuditLog>): Promise<AuditLog[]> {
    if (!filter) return [...this.collection];
    return this.collection.filter((item) => {
      return Object.entries(filter).every(([key, val]) => {
        return ((item as unknown) as Record<string, unknown>)[key] === val;
      });
    });
  }

  // Simulates: AuditLog.create(doc)
  async create(payload: Partial<AuditLog>): Promise<AuditLog> {
    const newDoc: AuditLog = {
      _id: payload._id || generateObjectId(),
      timestamp: payload.timestamp || new Date().toISOString(),
      userCommand: payload.userCommand || "Unspecified command",
      intentDetected: payload.intentDetected || "UNKNOWN",
      agentInvolved: payload.agentInvolved || "Nova",
      actionsTaken: payload.actionsTaken || ["Processed autonomous agent action"],
      dbOperation: payload.dbOperation || "QUERY",
      targetId: payload.targetId,
      status: payload.status || "SUCCESS",
      confidenceScore: payload.confidenceScore ?? 0.95,
    };

    this.collection.unshift(newDoc);
    this.notifyListeners();
    return { ...newDoc };
  }

  reset(data: AuditLog[]) {
    this.collection = [...data];
    this.notifyListeners();
  }
}
