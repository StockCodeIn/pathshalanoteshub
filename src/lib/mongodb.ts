// src/lib/mongodb.ts
import mongoose from "mongoose";
import * as dotenv from "dotenv"; // ✅ यह ES module के लिए सही है
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

// TypeScript को global में mongooseCache को पहचानने के लिए declare करना होगा
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

global.mongooseCache = global.mongooseCache || { conn: null, promise: null };

async function connectDB(): Promise<typeof mongoose> {
  if (global.mongooseCache!.conn) {
    // console.log("Using existing MongoDB connection.");
    return global.mongooseCache!.conn;
  }

  if (!global.mongooseCache!.promise) {
    // console.log("Creating a new MongoDB connection.");
    const opts = {
      bufferCommands: false,
    };

    global.mongooseCache!.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    global.mongooseCache!.conn = await global.mongooseCache!.promise; // ✅ अब यह error नहीं देगा
  } catch (error) {
    global.mongooseCache!.promise = null;
    // console.error("MongoDB connection error:", error);
    throw error;
  }

  return global.mongooseCache!.conn;
}

export default connectDB;
