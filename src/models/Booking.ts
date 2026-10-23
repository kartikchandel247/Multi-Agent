import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBookingDocument extends Document {
  clientName: string;
  clientEmail: string;
  serviceType: string;
  date: string;
  timeSlot: string;
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

export const BookingModel: Model<IBookingDocument> =
  mongoose.models.Booking || mongoose.model<IBookingDocument>("Booking", BookingSchema);

export default BookingModel;
