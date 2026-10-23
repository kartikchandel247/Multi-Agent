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
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export function MongoSchemaManager() {
  const { bookings, auditLogs, resetToDefault, dbStatus, refreshData } = useAgentBooking();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestConnection = async () => {
    setIsRefreshing(true);
    await refreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const schemaSnippet = `// Mongoose Schema Definition: src/models/Booking.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBookingDocument extends Document {
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

const BookingSchema = new Schema<IBookingDocument>(
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

export default mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", BookingSchema);`;

  const envSnippet = `# .env / .env.local Configuration
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/multi_agent_db?retryWrites=true&w=majority"
MONGODB_DB_NAME="multi_agent_db"
USE_REAL_MONGODB="true"

# App & Multi-Agent Engine
NEXT_PUBLIC_APP_NAME="AuraAgent"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
JWT_SECRET="aura_agent_super_secret_jwt_key_928374982374"`;

  const isLiveMongo = dbStatus?.mode === "REAL_MONGODB";

  return (
    <div className="space-y-6">
      {/* Live Backend Diagnostic Banner */}
      <GlassCard className="p-5 border-blue-200/80 shadow-md">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-3 rounded-2xl ${isLiveMongo ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-blue-50 text-blue-600 border border-blue-200"}`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Backend Database Connection Status
                </h3>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                  isLiveMongo
                    ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                    : "bg-blue-50 text-blue-700 border-blue-300"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isLiveMongo ? "bg-emerald-500" : "bg-blue-500"} animate-pulse`} />
                  {isLiveMongo ? "CONNECTED: LIVE MONGODB ATLAS" : "CONNECTED: SIMULATED MONGOOSE ENGINE"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {dbStatus?.message || "Operating on unified Database Adapter layer. REST API endpoints (/api/bookings, /api/stats, /api/command) are active."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="glass"
              size="sm"
              onClick={handleTestConnection}
              isLoading={isRefreshing}
              icon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />}
              className="text-xs"
            >
              Ping / Test Connection
            </Button>
            <Button variant="outline" size="sm" onClick={resetToDefault} className="text-xs">
              Reset In-Memory DB
            </Button>
          </div>
        </div>

        {/* Diagnostic Meta Grid */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Connection URI</span>
            <span className="font-mono text-slate-700 truncate block mt-0.5">{dbStatus?.maskedUri || "mongodb+srv://***:***@cluster0.mongodb.net"}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Database</span>
            <span className="font-semibold text-slate-800 block mt-0.5">{dbStatus?.databaseName || "multi_agent_db"}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Bookings Count</span>
            <span className="font-semibold text-blue-600 block mt-0.5">{bookings.length} Documents</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Audit Log Trail</span>
            <span className="font-semibold text-purple-600 block mt-0.5">{auditLogs.length} Records</span>
          </div>
        </div>
      </GlassCard>

      {/* Code snippets grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Mongoose Schema */}
        <GlassCard className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
              <Code2 className="w-4 h-4 text-blue-600" />
              Booking Schema (Mongoose Model in src/models/Booking.ts)
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
              How to Connect Your MongoDB Database in 2 Steps:
            </h4>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
              <li>
                <strong>Update .env:</strong> In your <code>.env</code> file, paste your real connection URI (e.g. <code>mongodb+srv://myuser:mypassword@cluster0.mongodb.net/multi_agent_db</code>) and set <code>USE_REAL_MONGODB="true"</code>.
              </li>
              <li>
                <strong>Restart Dev Server:</strong> That&apos;s all! <code>mongoose</code> and <code>dbAdapter</code> are already installed and compiled. The application will immediately switch to live MongoDB Atlas without any extra code changes!
              </li>
            </ol>
          </GlassCard>
        </div>
      </div>

      {/* Live Documents Inspector */}
      <GlassCard className="p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600">
            <Layers className="w-4 h-4 text-blue-600" />
            Live Database Documents ({bookings.length} Bookings, {auditLogs.length} Audit Records)
          </div>
          <span className="text-[11px] text-slate-400">Synchronized via REST API endpoints</span>
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
