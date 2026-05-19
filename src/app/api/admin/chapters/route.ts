// src/app/api/admin/chapters/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import { verifyAdminToken } from '@/lib/adminAuth';

export async function GET(request: NextRequest) {
  try {
    // Verify admin
    const token = request.cookies.get('admin_token')?.value;
    console.log('📡 Chapters API - Token:', { hasToken: !!token, tokenLength: token?.length });
    
    // ✅ IMPORTANT: verifyAdminToken is ASYNC, must await!
    const payload = await verifyAdminToken(token, process.env.GK_ADMIN_KEY || '');
    console.log('🔐 Auth Result:', { isValid: !!payload });
    
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get query params
    const { searchParams } = new URL(request.url);
    const board = searchParams.get('board');
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');

    // Build filter
    const filter: any = {};
    if (board && board !== 'ALL') filter.board = board;
    if (grade && grade !== 'ALL') filter.grade = grade;
    if (subject && subject !== 'ALL') filter.subject = subject;

    // Fetch chapters
    const chapters = await Chapter.find(filter)
      .select('name board grade subject htmlContent isHtmlReady metaDescription keywords')
      .sort({ board: 1, grade: 1, subject: 1, name: 1 })
      .limit(200)
      .lean();

    return NextResponse.json({ success: true, chapters });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
