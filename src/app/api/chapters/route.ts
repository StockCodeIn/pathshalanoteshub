import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';

// ✅ POST API - Upload PDF & Save to DB (file OR pdfUrl)
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const pdfUrl = formData.get('pdfUrl') as string | null;
    const board = formData.get('board') as string;
    const grade = formData.get('grade') as string;
    const subject = formData.get('subject') as string;
    const chapter = formData.get('chapter') as string;

    let finalPdfUrl = '';
    let fileSize = 0;

    if (file) {
      // Convert File to Buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: `education-notes/${board}/${grade}/${subject}`,
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      if (!result || !(result as any).secure_url) {
        throw new Error('Failed to upload file to Cloudinary');
      }
      finalPdfUrl = (result as any).secure_url;
      fileSize = file.size;
    } else if (pdfUrl) {
      finalPdfUrl = pdfUrl;
      fileSize = 0; // Agar size pata ho to bhej sakte hain
    } else {
      return NextResponse.json({ error: 'No file or pdfUrl provided' }, { status: 400 });
    }

    // Connect to MongoDB
    await connectDB();

    // Save chapter info to database
    const chapterDoc = await Chapter.create({
      name: chapter,
      board,
      grade,
      subject,
      pdfUrl: finalPdfUrl,
      size: fileSize,
      uploadedAt: new Date(),
    });

    return NextResponse.json({ success: true, chapter: chapterDoc });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}

// ✅ GET API - Fetch Chapters
export async function GET(request: Request) {
  try {
    await connectDB(); // MongoDB से कनेक्ट करें
    // console.log("✅ Connected to MongoDB");

    // Query Parameters को Extract करें
    const { searchParams } = new URL(request.url);
    const board = searchParams.get("board");
    const grade = searchParams.get("grade");
    const subject = searchParams.get("subject");
    const chapter = searchParams.get("chapter");

    // MongoDB में से डेटा खोजें
    const chapters = await Chapter.find({
      board: board, // Filter by board
      grade: grade,
      subject: subject,
      name: chapter,
    });

    return NextResponse.json({ success: true, chapters });
  } catch (error) {
    // console.error("GET API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch chapters" },
      { status: 500 }
    );
  }
}
