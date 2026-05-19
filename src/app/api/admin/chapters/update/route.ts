// src/app/api/admin/chapters/update/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import { verifyAdminToken } from '@/lib/adminAuth';

function calculateReadingTime(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]*>/g, ' '); // Remove HTML tags
  const words = text.split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200; // Average reading speed
  return Math.ceil(words / wordsPerMinute);
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin
    const token = request.cookies.get('admin_token')?.value;
    
    // ✅ IMPORTANT: verifyAdminToken is ASYNC, must await!
    const payload = await verifyAdminToken(token, process.env.GK_ADMIN_KEY || '');
    if (!payload) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { chapterId, htmlContent, metaDescription, htmlTitle, keywords, isHtmlReady } = body;

    if (!chapterId) {
      return NextResponse.json({ success: false, error: 'Chapter ID required' }, { status: 400 });
    }

    // Calculate metadata
    const text = htmlContent?.replace(/<[^>]*>/g, ' ') || '';
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readingTime = calculateReadingTime(htmlContent || '');

    // Update chapter
    const chapter = await Chapter.findByIdAndUpdate(
      chapterId,
      {
        htmlContent: htmlContent || '',
        metaDescription: metaDescription || '',
        htmlTitle: htmlTitle || '',
        keywords: keywords || [],
        isHtmlReady: isHtmlReady || false,
        lastHtmlUpdate: new Date(),
        readingTime,
        wordCount,
      },
      { new: true }
    );

    if (!chapter) {
      return NextResponse.json({ success: false, error: 'Chapter not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Chapter updated successfully',
      chapter: {
        _id: chapter._id,
        name: chapter.name,
        readingTime,
        wordCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
