import { PDFDocument, rgb, degrees } from 'pdf-lib';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

// ✅ GET API - Download PDF with Watermark
export async function GET(request: Request) {
  try {
    // Connect MongoDB
    await connectDB();

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const subtopic = searchParams.get('subtopic');

    if (!topic || !subtopic) {
      return NextResponse.json({ success: false, error: 'Missing query parameters' }, { status: 400 });
    }

    // Find PDF URL from MongoDB
    const subtopicDoc = await GK.findOne({ topic, subtopic });

    if (!subtopicDoc) {
      return NextResponse.json({ success: false, error: 'Subtopic not found' }, { status: 404 });
    }

    const pdfUrl = subtopicDoc.pdfUrl;

    // ✅ Fetch PDF from Cloudinary
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    const pdfBytes = await response.arrayBuffer();

    // ✅ Load PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // ✅ Add watermark to each page
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

    // ✅ Final PDF bytes
    const finalPdfBytes = await pdfDoc.save();

    // ✅ Safe filename for Unicode (Hindi, etc.)
    const safeFilename = encodeURIComponent(`${subtopicDoc.title}.pdf`);

    // ✅ Return PDF as download
    return new Response(finalPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename*=UTF-8''${safeFilename}`,
      },
    });
  } catch (error) {
    // console.error('Download API Error:', error);
    return NextResponse.json({ error: 'Failed to process PDF download' }, { status: 500 });
  }
}
