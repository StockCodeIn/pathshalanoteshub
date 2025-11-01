// app/api/gk/[topic]/[subtopic]/[subsubtopic]/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

export async function GET(request: Request, context: any) {
  try {
    const params = await context.params;
    const { topic, subtopic, subsubtopic } = params as { topic: string; subtopic: string; subsubtopic: string };
    if (!topic || !subtopic || !subsubtopic) return NextResponse.json({ success: false, error: 'Missing params' }, { status: 400 });

    await connectDB();
    const item = await GK.findOne({ topic, subtopic, name: subsubtopic });
    if (!item) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, item });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
