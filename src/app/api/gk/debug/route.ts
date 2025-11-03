// src/app/api/gk/debug/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';
import mongoose from 'mongoose';
import { verifyAdminToken } from '@/lib/adminAuth';

// Dev-only debug endpoint to inspect recent GK docs and DB connection
export async function GET(request: Request) {
  try {
    // require admin cookie to avoid exposing data publicly
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/admin_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const payload = verifyAdminToken(token, process.env.GK_ADMIN_KEY || '');
    if (!payload) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const items = await GK.find({}).sort({ updatedAt: -1 }).limit(10).lean();
    const conn = mongoose.connection;
    return NextResponse.json({ success: true, items, db: { name: conn.name, host: conn.host } });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
