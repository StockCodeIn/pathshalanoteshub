import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import GK from '@/models/gk';

// ✅ POST API - Upload PDF & Save to DB
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const topic = formData.get('topic') as string;
    const subtopic = formData.get('subtopic') as string;
    const title = formData.get('title') as string;

    if (!file || !topic || !subtopic || !title) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto', // Auto-detect file type
          folder: `education-notes/gk/${topic}/${subtopic}`,
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

    // Save subtopic info to database
    const subtopicDoc = await GK.create({
      topic,
      subtopic,
      title,
      pdfUrl: (result as any).secure_url,
      uploadedAt: new Date(),
    });
    // console.log('✅ Subtopic saved to DB:', subtopicDoc);

    return NextResponse.json({ success: true, subtopic: subtopicDoc });
  } catch (error) {
    // console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process upload' }, { status: 500 });
  }
}

// ✅ GET API - Fetch Subtopics List
export async function GET(request: Request) {
  try {
    await connectDB();
    // console.log('✅ Connected to MongoDB');

    const { searchParams } = new URL(request.url);
    const topic = searchParams.get('topic');
    const subtopic = searchParams.get('subtopic');

    // Agar subtopic query nahi hai to list return karo
    if (topic && !subtopic) {
      const subtopics = await GK.find({ topic });
      return NextResponse.json({ success: true, subtopics });
    }

    // Agar topic + subtopic dono diye hain to single PDF return karo
    if (topic && subtopic) {
      const subtopicDoc = await GK.findOne({ topic, subtopic });
      if (!subtopicDoc) {
        return NextResponse.json({ success: false, error: 'Subtopic not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, subtopic: subtopicDoc });
    }

    return NextResponse.json({ success: false, error: 'Missing query parameters' }, { status: 400 });
  } catch (error) {
    // console.error('GET API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}
