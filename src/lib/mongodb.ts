import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

/**
 * TypeScript interface for the global mongoose cache
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Global object ko extend karna zaroori hai taaki Red Lines na aayein
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

/**
 * Next.js hot-reloading mein connection preserve karne ke liye
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<typeof mongoose> {
  // 1. Agar connection pehle se hai, toh wahi return karein
  if (cached?.conn) {
    return cached.conn;
  }

  // 2. Agar koi purana connection process mein nahi hai, toh naya banayein
  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // 5 seconds timeout
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    // 3. Connection promise ka wait karein
    cached!.conn = await cached!.promise;
  } catch (e) {
    // Agar error aaye toh promise reset karein taaki next request phir try kar sake
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;