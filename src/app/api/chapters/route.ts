import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';

// ✅ POST API - Upload PDF & Save to DB
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const board = formData.get('board') as string;
    const grade = formData.get('grade') as string;
    const subject = formData.get('subject') as string;
    const chapter = formData.get('chapter') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Auto-detect file type
          folder: `education-notes/${board}/${grade}/${subject}`,
        },
        (error, result) => {
          if (error) {
            // console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            // console.log('Cloudinary upload result:', result);
            resolve(result);
          }
        }
      ).end(buffer);
    });

    // Check if Upload was successful
    if (!result || !(result as any).secure_url) {
      throw new Error('Failed to upload file to Cloudinary');
    }

    // Connect to MongoDB
    await connectDB();
    // console.log('✅ Connected to MongoDB');

    // Save chapter info to database
    const chapterDoc = await Chapter.create({
      name: chapter,
      board,
      grade,
      subject,
      pdfUrl: (result as any).secure_url,
      size: file.size,
      uploadedAt: new Date(),
    });
    // console.log('✅ Chapter saved to DB:', chapterDoc);

    return NextResponse.json({ success: true, chapter: chapterDoc });
  } catch (error) {
    // console.error('Upload error:', error);
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
