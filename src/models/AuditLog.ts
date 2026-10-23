import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAuditLogDocument extends Document {
  timestamp: Date;
  userCommand: string;
  intentDetected: "BOOK_SLOT" | "POSTPONE_BOOKING" | "CANCEL_BOOKING" | "QUERY_SCHEDULE" | "UNKNOWN";
  agentInvolved: "Nova" | "Atlas" | "Vera" | "Nexus";
  actionsTaken: string[];
  dbOperation: "INSERT" | "UPDATE" | "DELETE" | "QUERY";
  targetId?: string;
  status: "SUCCESS" | "WARNING" | "BLOCKED";
  confidenceScore: number;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    timestamp: { type: Date, default: Date.now, index: true },
    userCommand: { type: String, required: true },
    intentDetected: { type: String, required: true },
    agentInvolved: { type: String, required: true },
    actionsTaken: [{ type: String }],
    dbOperation: { type: String, enum: ["INSERT", "UPDATE", "DELETE", "QUERY"], required: true },
    targetId: { type: String },
    status: { type: String, enum: ["SUCCESS", "WARNING", "BLOCKED"], default: "SUCCESS" },
    confidenceScore: { type: Number, default: 0.95 },
  },
  { timestamps: true }
);

export const AuditLogModel: Model<IAuditLogDocument> =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema);

export default AuditLogModel;
