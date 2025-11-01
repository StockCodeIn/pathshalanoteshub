// ✅ app/api/gk/[topic]/[subtopic]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

export async function GET(request: Request, context: any) {
  try {
    const params = await context.params;
    const { topic, subtopic } = params as { topic: string; subtopic: string };
    if (!topic || !subtopic)
      return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });

    await connectDB();

    // ✅ अब displayName और order शामिल कर दो;
    // Sort logic:
    // - If a document has order > 0, sort by order ascending.
    // - Otherwise place it after ordered items and sort by createdAt (preserve creation sequence).
    const items = await GK.aggregate([
      { $match: { topic, subtopic } },
      {
        $addFields: {
          sortOrder: {
            $cond: [{ $gt: ['$order', 0] }, '$order', 1000000000],
          },
        },
      },
      {
        $addFields: {
          createdAtSafe: { $ifNull: ['$createdAt', '$updatedAt'] },
        },
      },
      { $sort: { sortOrder: 1, createdAtSafe: 1 } },
      { $project: { name: 1, displayName: 1, order: 1 } },
    ]);

    return NextResponse.json({ success: true, items });
  } catch (err) {
    console.error('Subtopic list API error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
