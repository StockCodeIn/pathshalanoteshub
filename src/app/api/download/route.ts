// app/api/download/route.ts
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';
import { Chapter } from '@/models/chapter';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // GK params
    const topic = searchParams.get('topic');
    const subtopic = searchParams.get('subtopic');

    // Chapter params
    const board = searchParams.get('board');
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');

    let pdfUrl = '';
    let safeFilename = '';

    // ✅ Case 1: GK PDF
    if (topic && subtopic) {
      const subtopicDoc = await GK.findOne({ topic, subtopic });
      if (!subtopicDoc) {
        return NextResponse.json({ error: 'Subtopic not found' }, { status: 404 });
      }
      pdfUrl = subtopicDoc.pdfUrl;
      safeFilename = encodeURIComponent(`${subtopicDoc.title}.pdf`);
    }

    // ✅ Case 2: Chapter PDF
    else if (board && grade && subject && chapter) {
      const chapterDoc = await Chapter.findOne({ board, grade, subject, name: chapter });
      if (!chapterDoc) {
        return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
      }
      pdfUrl = chapterDoc.pdfUrl;
      safeFilename = encodeURIComponent(`${chapterDoc.subject}-chapter_${chapterDoc.name}.pdf`);
    }

    // ❌ No valid params
    else {
      return NextResponse.json({ error: 'Missing query parameters' }, { status: 400 });
    }

    // ✅ Fetch PDF from Cloudinary
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    const pdfBytes = await response.arrayBuffer();

    // ✅ Add watermark
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText('© pathshalanoteshub.in', {
        x: width / 2 - 100,
        y: height / 2,
        size: 40,
        color: rgb(0.75, 0.75, 0.75),
        rotate: degrees(45),
        opacity: 0.3,
      });
    }

    const finalPdfBytes = await pdfDoc.save();

    // Ensure Blob receives a compatible ArrayBufferView by copying into a standard Uint8Array
    const pdfArray = new Uint8Array(finalPdfBytes);

    // ✅ Return single PDF response
    return new Response(new Blob([pdfArray], { type: 'application/pdf' }), {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename*=UTF-8''${safeFilename}`,
      },
    });


  } catch (error) {
    console.error('Download API Error:', error);
    return NextResponse.json({ error: 'Failed to process PDF download' }, { status: 500 });
  }
}
