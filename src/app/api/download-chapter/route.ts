import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';

export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const board = searchParams.get('board');
    const grade = searchParams.get('grade');
    const subject = searchParams.get('subject');
    const chapter = searchParams.get('chapter');

    if (!board || !grade || !subject || !chapter) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const chapterDoc = await Chapter.findOne({
      board,
      grade,
      subject,
      name: chapter,
    });

    if (!chapterDoc) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 });
    }

    const pdfUrl = chapterDoc.pdfUrl;

    const response = await fetch(pdfUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'PDF not found on Cloudinary' }, { status: 404 });
    }

    const pdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      page.drawText('© www.pathshalanoteshub.in', {
        x: width / 2 - 100,
        y: height / 2,
        size: 40,
        color: rgb(0.75, 0.75, 0.75),
        rotate: degrees(45),
        opacity: 0.3,
      });
    }

    const finalPdfBytes = await pdfDoc.save();
    const safeFilename = encodeURIComponent(`${chapterDoc.subject}-chapter_${chapterDoc.name}.pdf`);

    return new Response(finalPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${safeFilename}`,
      },
    });
  } catch (error) {
    // console.error('Chapter Download Error:', error);
    return NextResponse.json({ error: 'Failed to process PDF download' }, { status: 500 });
  }
}
