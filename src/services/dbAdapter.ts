import { dbConnect } from "@/lib/dbConnect";
import { BookingModel, IBookingDocument } from "@/models/Booking";
import { AuditLogModel, IAuditLogDocument } from "@/models/AuditLog";
import { mockMongo } from "@/services/mockMongo";
import { Booking, AuditLog, BusinessStats } from "@/types";

export class DatabaseAdapter {
  private async isLiveMongo(): Promise<boolean> {
    try {
      const conn = await dbConnect();
      return conn !== null && conn.connection.readyState === 1;
    } catch {
      return false;
    }
  }

  // --- BOOKINGS ---
  async getBookings(filter?: Partial<Booking>): Promise<Booking[]> {
    if (await this.isLiveMongo()) {
      const docs = await BookingModel.find(filter || {}).sort({ createdAt: -1 }).lean<IBookingDocument[]>();
      return docs.map((doc) => ({
        _id: String(doc._id),
        clientName: doc.clientName,
        clientEmail: doc.clientEmail,
        serviceType: doc.serviceType,
        date: doc.date,
        timeSlot: doc.timeSlot,
        status: doc.status,
        amount: doc.amount,
        agentAssigned: doc.agentAssigned,
        notes: doc.notes,
        rescheduledFrom: doc.rescheduledFrom,
        cancellationReason: doc.cancellationReason,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
      }));
    }
    return mockMongo.Booking.find(filter);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    if (await this.isLiveMongo()) {
      const doc = await BookingModel.findById(id).lean<IBookingDocument | null>();
      if (!doc) return null;
      return {
        _id: String(doc._id),
        clientName: doc.clientName,
        clientEmail: doc.clientEmail,
        serviceType: doc.serviceType,
        date: doc.date,
        timeSlot: doc.timeSlot,
        status: doc.status,
        amount: doc.amount,
        agentAssigned: doc.agentAssigned,
        notes: doc.notes,
        rescheduledFrom: doc.rescheduledFrom,
        cancellationReason: doc.cancellationReason,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
    return mockMongo.Booking.findById(id);
  }

  async createBooking(data: Partial<Booking>): Promise<Booking> {
    if (await this.isLiveMongo()) {
      const created = await BookingModel.create(data);
      const json = created.toObject();
      return {
        _id: String(json._id),
        clientName: json.clientName,
        clientEmail: json.clientEmail,
        serviceType: json.serviceType,
        date: json.date,
        timeSlot: json.timeSlot,
        status: json.status,
        amount: json.amount,
        agentAssigned: json.agentAssigned,
        notes: json.notes,
        rescheduledFrom: json.rescheduledFrom,
        cancellationReason: json.cancellationReason,
        createdAt: json.createdAt ? new Date(json.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: json.updatedAt ? new Date(json.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
    return mockMongo.Booking.create(data);
  }

  async updateBooking(id: string, update: Partial<Booking>): Promise<Booking | null> {
    if (await this.isLiveMongo()) {
      const updated = await BookingModel.findByIdAndUpdate(id, { $set: update }, { new: true }).lean<IBookingDocument | null>();
      if (!updated) return null;
      return {
        _id: String(updated._id),
        clientName: updated.clientName,
        clientEmail: updated.clientEmail,
        serviceType: updated.serviceType,
        date: updated.date,
        timeSlot: updated.timeSlot,
        status: updated.status,
        amount: updated.amount,
        agentAssigned: updated.agentAssigned,
        notes: updated.notes,
        rescheduledFrom: updated.rescheduledFrom,
        cancellationReason: updated.cancellationReason,
        createdAt: updated.createdAt ? new Date(updated.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: updated.updatedAt ? new Date(updated.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
    return mockMongo.Booking.findByIdAndUpdate(id, update);
  }

  async deleteBooking(id: string): Promise<Booking | null> {
    if (await this.isLiveMongo()) {
      const deleted = await BookingModel.findByIdAndDelete(id).lean<IBookingDocument | null>();
      if (!deleted) return null;
      return {
        _id: String(deleted._id),
        clientName: deleted.clientName,
        clientEmail: deleted.clientEmail,
        serviceType: deleted.serviceType,
        date: deleted.date,
        timeSlot: deleted.timeSlot,
        status: deleted.status,
        amount: deleted.amount,
        agentAssigned: deleted.agentAssigned,
        notes: deleted.notes,
        rescheduledFrom: deleted.rescheduledFrom,
        cancellationReason: deleted.cancellationReason,
        createdAt: deleted.createdAt ? new Date(deleted.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: deleted.updatedAt ? new Date(deleted.updatedAt).toISOString() : new Date().toISOString(),
      };
    }
    return mockMongo.Booking.findByIdAndDelete(id);
  }

  // --- AUDIT LOGS ---
  async getAuditLogs(): Promise<AuditLog[]> {
    if (await this.isLiveMongo()) {
      const logs = await AuditLogModel.find().sort({ timestamp: -1 }).limit(100).lean<IAuditLogDocument[]>();
      return logs.map((log) => ({
        _id: String(log._id),
        timestamp: log.timestamp ? new Date(log.timestamp).toISOString() : new Date().toISOString(),
        userCommand: log.userCommand,
        intentDetected: log.intentDetected,
        agentInvolved: log.agentInvolved,
        actionsTaken: log.actionsTaken,
        dbOperation: log.dbOperation,
        targetId: log.targetId,
        status: log.status,
        confidenceScore: log.confidenceScore,
      }));
    }
    return mockMongo.AuditLog.find();
  }

  async createAuditLog(data: Partial<AuditLog>): Promise<AuditLog> {
    if (await this.isLiveMongo()) {
      const created = await AuditLogModel.create(data);
      const json = created.toObject();
      return {
        _id: String(json._id),
        timestamp: json.timestamp ? new Date(json.timestamp).toISOString() : new Date().toISOString(),
        userCommand: json.userCommand,
        intentDetected: json.intentDetected,
        agentInvolved: json.agentInvolved,
        actionsTaken: json.actionsTaken,
        dbOperation: json.dbOperation,
        targetId: json.targetId,
        status: json.status,
        confidenceScore: json.confidenceScore,
      };
    }
    return mockMongo.AuditLog.create(data);
  }

  // --- STATS ---
  async getBusinessStats(): Promise<BusinessStats> {
    const allBookings = await this.getBookings();
    const confirmed = allBookings.filter((b) => b.status === "CONFIRMED");
    const cancelled = allBookings.filter((b) => b.status === "CANCELLED");
    const rescheduled = allBookings.filter((b) => b.status === "RESCHEDULED");

    const totalRevenue = confirmed.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalCount = allBookings.length;
    const successRate = totalCount > 0 ? Math.round(((totalCount - cancelled.length) / totalCount) * 100) : 100;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyTrend = days.map((day, idx) => ({
      day,
      bookings: 2 + (idx % 4) + (idx === 3 ? 3 : 0),
      revenue: (2 + (idx % 4) + (idx === 3 ? 3 : 0)) * 650,
    }));

    return {
      totalBookings: allBookings.length,
      activeAiSessions: 4,
      revenue: totalRevenue,
      successRate,
      capacityUtilization: Math.min(94, 60 + confirmed.length * 5),
      cancelledBookings: cancelled.length,
      rescheduledBookings: rescheduled.length,
      weeklyTrend,
    };
  }
}

export const dbAdapter = new DatabaseAdapter();
export default dbAdapter;
