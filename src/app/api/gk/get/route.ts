import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const subtopic = searchParams.get('subtopic');
    const name = searchParams.get('name');

    if (!topic || !subtopic || !name) {
      return NextResponse.json({ success: false, error: 'Missing query params' }, { status: 400 });
    }

    await connectDB();

    const doc = await GK.findOne({ topic, subtopic, name });

    if (!doc) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, item: doc });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
