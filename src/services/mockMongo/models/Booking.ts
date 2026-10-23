import { Booking, BookingStatus } from "@/types";

/*
// ==============================================================================
// REAL MONGOOSE SCHEMA SETUP FOR PRODUCTION
// ==============================================================================
// To connect to your real MongoDB instance, uncomment this block and export
// the real Mongoose Model:
//
// import mongoose, { Schema, Document, Model } from "mongoose";
//
// export interface IBookingDocument extends Document {
//   clientName: string;
//   clientEmail: string;
//   serviceType: string;
//   date: string;
//   timeSlot: string;
//   status: "CONFIRMED" | "PENDING" | "CANCELLED" | "RESCHEDULED";
//   amount: number;
//   agentAssigned: "Nova" | "Atlas" | "Vera" | "Nexus";
//   notes?: string;
//   rescheduledFrom?: string;
//   cancellationReason?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }
//
// const BookingSchema = new Schema<IBookingDocument>(
//   {
//     clientName: { type: String, required: true, trim: true },
//     clientEmail: { type: String, required: true, lowercase: true, trim: true },
//     serviceType: { type: String, required: true },
//     date: { type: String, required: true, index: true },
//     timeSlot: { type: String, required: true },
//     status: {
//       type: String,
//       enum: ["CONFIRMED", "PENDING", "CANCELLED", "RESCHEDULED"],
//       default: "CONFIRMED",
//       index: true,
//     },
//     amount: { type: Number, default: 450 },
//     agentAssigned: { type: String, default: "Nova" },
//     notes: { type: String },
//     rescheduledFrom: { type: String },
//     cancellationReason: { type: String },
//   },
//   { timestamps: true }
// );
//
// export const RealBookingModel: Model<IBookingDocument> =
//   mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", BookingSchema);
// ==============================================================================
*/

// Generate a random 24-character hexadecimal MongoDB ObjectId
export function generateObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, "0");
  const randomChars = "0123456789abcdef";
  let rest = "";
  for (let i = 0; i < 16; i++) {
    rest += randomChars[Math.floor(Math.random() * randomChars.length)];
  }
  return timestamp + rest;
}

export class MockBookingModel {
  private collection: Booking[];
  private notifyListeners: () => void;

  constructor(initialData: Booking[], notifyFn: () => void) {
    this.collection = [...initialData];
    this.notifyListeners = notifyFn;
  }

  // Simulates: Booking.find(query)
  async find(filter?: Partial<Booking> | ((item: Booking) => boolean)): Promise<Booking[]> {
    if (!filter) return [...this.collection];
    if (typeof filter === "function") {
      return this.collection.filter(filter);
    }
    return this.collection.filter((item) => {
      return Object.entries(filter).every(([key, val]) => {
        return ((item as unknown) as Record<string, unknown>)[key] === val;
      });
    });
  }

  // Simulates: Booking.findById(id)
  async findById(id: string): Promise<Booking | null> {
    const found = this.collection.find((b) => b._id === id);
    return found ? { ...found } : null;
  }

  // Simulates: Booking.create(doc)
  async create(payload: Partial<Booking>): Promise<Booking> {
    const now = new Date().toISOString();
    const newDoc: Booking = {
      _id: payload._id || generateObjectId(),
      clientName: payload.clientName || "Alex Morgan",
      clientEmail: payload.clientEmail || "alex.morgan@client.com",
      serviceType: payload.serviceType || "AI Strategy Consult",
      date: payload.date || now.split("T")[0],
      timeSlot: payload.timeSlot || "11:00 AM",
      status: (payload.status as BookingStatus) || "CONFIRMED",
      amount: payload.amount || 600,
      agentAssigned: payload.agentAssigned || "Nova",
      notes: payload.notes || "Autonomous booking registered via multi-agent command.",
      rescheduledFrom: payload.rescheduledFrom,
      cancellationReason: payload.cancellationReason,
      createdAt: now,
      updatedAt: now,
    };

    this.collection.unshift(newDoc);
    this.notifyListeners();
    return { ...newDoc };
  }

  // Simulates: Booking.findByIdAndUpdate(id, update, { new: true })
  async findByIdAndUpdate(
    id: string,
    update: Partial<Booking>,
    options?: { new?: boolean }
  ): Promise<Booking | null> {
    const index = this.collection.findIndex((b) => b._id === id);
    if (index === -1) return null;

    const original = { ...this.collection[index] };
    const updated: Booking = {
      ...original,
      ...update,
      _id: original._id, // preserve ID
      updatedAt: new Date().toISOString(),
    };

    this.collection[index] = updated;
    this.notifyListeners();
    return options?.new !== false ? { ...updated } : original;
  }

  // Simulates: Booking.updateOne(filter, update)
  async updateOne(
    filter: Partial<Booking>,
    update: Partial<Booking>
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const doc = await this.find(filter);
    if (doc.length === 0) {
      return { acknowledged: true, modifiedCount: 0 };
    }
    const target = doc[0];
    await this.findByIdAndUpdate(target._id, update);
    return { acknowledged: true, modifiedCount: 1 };
  }

  // Simulates: Booking.findByIdAndDelete(id)
  async findByIdAndDelete(id: string): Promise<Booking | null> {
    const index = this.collection.findIndex((b) => b._id === id);
    if (index === -1) return null;
    const deleted = this.collection.splice(index, 1)[0];
    this.notifyListeners();
    return deleted;
  }

  // Helper to reset data
  reset(data: Booking[]) {
    this.collection = [...data];
    this.notifyListeners();
  }
}
