import { BusinessStats } from "@/types";
import { MockBookingModel } from "./models/Booking";
import { MockAuditLogModel } from "./models/AuditLog";
import { INITIAL_BOOKINGS, INITIAL_AUDIT_LOGS } from "./seedData";

type Listener = () => void;

class MockMongoDatabase {
  public Booking: MockBookingModel;
  public AuditLog: MockAuditLogModel;
  private listeners: Set<Listener> = new Set();

  constructor() {
    const notify = () => this.emitChange();
    this.Booking = new MockBookingModel(INITIAL_BOOKINGS, notify);
    this.AuditLog = new MockAuditLogModel(INITIAL_AUDIT_LOGS, notify);
  }

  // Subscribe to real-time changes
  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emitChange() {
    this.listeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error("Error in mockMongo subscriber:", err);
      }
    });
  }

  // Aggregate Business Stats for Bento Grid
  async getBusinessStats(): Promise<BusinessStats> {
    const allBookings = await this.Booking.find();
    const confirmed = allBookings.filter((b) => b.status === "CONFIRMED");
    const cancelled = allBookings.filter((b) => b.status === "CANCELLED");
    const rescheduled = allBookings.filter((b) => b.status === "RESCHEDULED");

    const totalRevenue = confirmed.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalCount = allBookings.length;
    const successRate = totalCount > 0 ? Math.round(((totalCount - cancelled.length) / totalCount) * 100) : 100;

    // Daily distribution over past 7 days
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklyTrend = days.map((day, idx) => ({
      day,
      bookings: 2 + (idx % 4) + (idx === 3 ? 3 : 0),
      revenue: (2 + (idx % 4) + (idx === 3 ? 3 : 0)) * 650,
    }));

    return {
      totalBookings: allBookings.length,
      activeAiSessions: 4, // Live agent sessions (Nova, Atlas, Vera, Nexus)
      revenue: totalRevenue,
      successRate,
      capacityUtilization: Math.min(94, 60 + confirmed.length * 5),
      cancelledBookings: cancelled.length,
      rescheduledBookings: rescheduled.length,
      weeklyTrend,
    };
  }

  // Restore factory seed state
  resetAll() {
    this.Booking.reset(INITIAL_BOOKINGS);
    this.AuditLog.reset(INITIAL_AUDIT_LOGS);
    this.emitChange();
  }
}

// Preserve singleton across Next.js dev server reloads
const globalForMongo = globalThis as unknown as {
  mockMongoDbInstance?: MockMongoDatabase;
};

export const mockMongo = globalForMongo.mockMongoDbInstance || new MockMongoDatabase();

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mockMongoDbInstance = mockMongo;
}

export default mockMongo;
