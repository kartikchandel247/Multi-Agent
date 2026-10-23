"use client";

import React, { useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { useAgentBooking } from "@/context/AgentContext";
import {
  Database,
  Code2,
  FileCode,
  Copy,
  Check,
  Server,
  Layers,
  Sparkles,
} from "lucide-react";

export function MongoSchemaManager() {
  const { bookings, auditLogs, resetToDefault } = useAgentBooking();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const schemaSnippet = `// Mongoose Schema Definition: models/Booking.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  clientName: string;
  clientEmail: string;
  serviceType: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // "10:00 AM"
  status: "CONFIRMED" | "PENDING" | "CANCELLED" | "RESCHEDULED";
  amount: number;
  agentAssigned: "Nova" | "Atlas" | "Vera" | "Nexus";
  notes?: string;
  rescheduledFrom?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    clientName: { type: String, required: true, trim: true },
    clientEmail: { type: String, required: true, lowercase: true, trim: true },
    serviceType: { type: String, required: true },
    date: { type: String, required: true, index: true },
    timeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ["CONFIRMED", "PENDING", "CANCELLED", "RESCHEDULED"],
      default: "CONFIRMED",
      index: true,
    },
    amount: { type: Number, default: 600 },
    agentAssigned: { type: String, default: "Nova" },
    notes: { type: String },
    rescheduledFrom: { type: String },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);`;

  const envSnippet = `# .env / .env.local Configuration
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/multi_agent_db?retryWrites=true&w=majority"
MONGODB_DB_NAME="multi_agent_db"
USE_REAL_MONGODB="true"

# App & Multi-Agent Engine
NEXT_PUBLIC_APP_NAME="AuraAgent"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="aura_agent_super_secret_jwt_key_928374982374"`;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <GlassCard className="p-4 sm:p-5 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              MongoDB Backend Architecture & Mongoose Schemas
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ready to Connect
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              The application simulates Mongoose queries. Switch to real MongoDB anytime via <code>.env</code>.
            </p>
          </div>
        </div>

        <Button variant="glass" size="sm" onClick={resetToDefault} className="text-xs">
          Reset In-Memory DB
        </Button>
      </GlassCard>

      {/* Code snippets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Mongoose Schema */}
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <Code2 className="w-4 h-4 text-blue-600" />
              Booking Schema (Mongoose Model)
            </div>
            <button
              onClick={() => copyToClipboard(schemaSnippet, "schema")}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1 font-semibold cursor-pointer"
            >
              {copiedKey === "schema" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === "schema" ? "Copied!" : "Copy Code"}
            </button>
          </div>

          <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[360px]">
            <code>{schemaSnippet}</code>
          </pre>
        </GlassCard>

        {/* Environment File & Quick Setup Guide */}
        <div className="space-y-5">
          <GlassCard className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
                <FileCode className="w-4 h-4 text-emerald-600" />
                Environment Configuration (.env)
              </div>
              <button
                onClick={() => copyToClipboard(envSnippet, "env")}
                className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 font-semibold cursor-pointer"
              >
                {copiedKey === "env" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedKey === "env" ? "Copied!" : "Copy .env"}
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed">
              <code>{envSnippet}</code>
            </pre>
          </GlassCard>

          {/* Quick Migration Steps */}
          <GlassCard className="p-5 space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-4 h-4 text-purple-600" />
              How to Connect Real MongoDB in 3 Steps:
            </h4>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <strong>Update .env:</strong> Replace <code>&lt;username&gt;</code> and <code>&lt;password&gt;</code> with your MongoDB Atlas credentials and set <code>USE_REAL_MONGODB="true"</code>.
              </li>
              <li>
                <strong>Install Mongoose:</strong> Run <code>npm install mongoose</code>.
              </li>
              <li>
                <strong>Uncomment Schema:</strong> In <code>src/services/mockMongo/models/Booking.ts</code>, uncomment the <code>RealBookingModel</code> export. The API routes already use Mongoose-compatible method signatures!
              </li>
            </ol>
          </GlassCard>
        </div>
      </div>

      {/* Live In-Memory Collection Inspector */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Layers className="w-4 h-4 text-blue-600" />
            Live In-Memory Documents ({bookings.length} Bookings, {auditLogs.length} Audit Records)
          </div>
          <span className="text-[11px] text-slate-400">Auto-synchronized with UI actions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] max-h-48 overflow-y-auto">
            <p className="font-bold text-slate-700 mb-1 text-xs font-sans">// db.bookings.find().limit(3)</p>
            <pre>{JSON.stringify(bookings.slice(0, 3), null, 2)}</pre>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[10px] max-h-48 overflow-y-auto">
            <p className="font-bold text-slate-700 mb-1 text-xs font-sans">// db.audit_logs.find().limit(2)</p>
            <pre>{JSON.stringify(auditLogs.slice(0, 2), null, 2)}</pre>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
