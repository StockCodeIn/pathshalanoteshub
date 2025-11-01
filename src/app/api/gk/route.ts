//src/app/api/gk/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';
import sanitizeHtml from 'sanitize-html';
import { verifyAdminToken } from '@/lib/adminAuth';
import mongoose from 'mongoose';

// POST /api/gk -> create or update sub-subtopic HTML content
export async function POST(request: Request) {
  try {
    // ✅ Validate admin token cookie
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/admin_token=([^;]+)/);
    const token = match ? decodeURIComponent(match[1]) : null;
    const payload = verifyAdminToken(token, process.env.GK_ADMIN_KEY || '');
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // ✅ Get request body
    const body = await request.json();
    const { topic, subtopic, name, displayName, htmlContent, order } = body;
    if (!topic || !subtopic || !name) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 });
    }

    // ✅ Sanitize HTML before saving
    const clean = sanitizeHtml(htmlContent || '', {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2', 'h3', 'figure']),
      allowedAttributes: {
        a: ['href', 'name', 'target', 'rel'],
        img: ['src', 'alt', 'title', 'width', 'height'],
        '*': ['class', 'id', 'style'],
      },
      allowedSchemesByTag: {
        img: ['http', 'https', 'data'],
      },
    });

    // ✅ Connect to MongoDB
    await connectDB();

    // Determine order handling:
    // - If order provided in request, use it.
    // - If updating existing record and no order provided, keep existing order.
    // - If creating new record and no order provided, assign max(order)+1 within the subtopic.
    await connectDB();
    const existing = (await GK.findOne({ topic, subtopic, name }).lean()) as
      | { order?: number }
      | null;

    let finalOrder: number | undefined = undefined;
    if (typeof order === 'number') {
      finalOrder = Math.floor(order);
    } else if (!existing) {
      // new record: pick next order
      const highest = await GK.find({ topic, subtopic }).sort({ order: -1 }).limit(1).lean();
      if (highest && highest.length > 0 && typeof highest[0].order === 'number') {
        finalOrder = (highest[0].order || 0) + 1;
      } else {
        finalOrder = 1;
      }
    } else {
      // updating existing and order not provided: preserve
  finalOrder = existing?.order ?? 0;
    }

    // ✅ Create or update record (include displayName and order)
    await GK.findOneAndUpdate(
      { topic, subtopic, name },
      {
        $set: {
          displayName: displayName || "",
          htmlContent: clean,
          updatedAt: new Date(),
          order: finalOrder,
        },
      },
      { upsert: true, new: true }
    );

    // ✅ Read back and confirm
  const saved = await GK.findOne({ topic, subtopic, name }).lean();
    const conn = mongoose.connection;

    return NextResponse.json({
      success: true,
      item: saved,
      db: { name: conn.name, host: conn.host },
    });
  } catch (err) {
    console.error("GK API Error:", err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// ❌ Disable direct GET on /api/gk
export async function GET() {
  return NextResponse.json({ success: false, error: 'Use specific endpoints' }, { status: 405 });
}
