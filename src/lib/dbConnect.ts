import mongoose from "mongoose";
import dns from "dns";

try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
} catch {
  // DNS fallback
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = globalThis.mongooseCache || { conn: null, promise: null };

if (!globalThis.mongooseCache) {
  globalThis.mongooseCache = cached;
}

export interface DbStatusInfo {
  isConnected: boolean;
  mode: "REAL_MONGODB" | "SIMULATED_MONGOOSE";
  databaseName: string;
  maskedUri: string;
  message: string;
  error?: string;
}

export function getMaskedUri(uri?: string): string {
  if (!uri) return "Not Configured";
  try {
    return uri.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@");
  } catch {
    return "Configured (Protected)";
  }
}

export async function checkDatabaseConnection(): Promise<DbStatusInfo> {
  const uri = process.env.MONGODB_URI || "";
  const dbName = process.env.MONGODB_DB_NAME || "multi_agent_db";
  const useRealMongo = process.env.USE_REAL_MONGODB === "true";

  // Check if URI still has template placeholders
  const hasPlaceholders = uri.includes("<username>") || uri.includes("<password>");

  if (!useRealMongo || hasPlaceholders || !uri) {
    return {
      isConnected: true,
      mode: "SIMULATED_MONGOOSE",
      databaseName: dbName,
      maskedUri: getMaskedUri(uri),
      message: hasPlaceholders
        ? "Simulated Mongoose Engine Active. (Template placeholder detected in MONGODB_URI. Update .env with real credentials to connect to MongoDB Atlas)."
        : "Simulated Mongoose Engine Active (USE_REAL_MONGODB=false). Ready to connect to MongoDB Atlas anytime.",
    };
  }

  try {
    const conn = await dbConnect();
    if (conn) {
      return {
        isConnected: true,
        mode: "REAL_MONGODB",
        databaseName: conn.connection.name || dbName,
        maskedUri: getMaskedUri(uri),
        message: `Successfully connected to Live MongoDB Atlas (${conn.connection.name || dbName}).`,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      isConnected: false,
      mode: "SIMULATED_MONGOOSE",
      databaseName: dbName,
      maskedUri: getMaskedUri(uri),
      message: "Connection to real MongoDB failed. Gracefully falling back to Simulated Mongoose Engine.",
      error: errorMsg,
    };
  }

  return {
    isConnected: true,
    mode: "SIMULATED_MONGOOSE",
    databaseName: dbName,
    maskedUri: getMaskedUri(uri),
    message: "Operating on Simulated Mongoose In-Memory Database.",
  };
}

export async function dbConnect(): Promise<typeof mongoose | null> {
  const uri = process.env.MONGODB_URI;
  const useRealMongo = process.env.USE_REAL_MONGODB === "true";

  if (!useRealMongo || !uri || uri.includes("<username>")) {
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB_NAME || "multi_agent_db",
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => m);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
