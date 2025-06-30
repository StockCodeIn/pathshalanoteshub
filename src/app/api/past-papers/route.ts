import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PastPaper from '@/models/PastPaper';

// ✅ GET API - Fetch Past Papers
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const board = req.nextUrl.searchParams.get('board');
    const grade = req.nextUrl.searchParams.get('grade');
    const subject = req.nextUrl.searchParams.get('subject');

    if (!board || !grade || !subject) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const papers = await PastPaper.find({ board, grade, subject }).select("year pdfUrl");

    return NextResponse.json({ papers });
  } catch (error) {
    // console.error("Error fetching past papers:", error);
    return NextResponse.json({ error: "Failed to fetch papers" }, { status: 500 });
  }
}

// ✅ POST API - Add New Paper (Only Link)
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { board, grade, subject, year, link } = await req.json();

    if (!board || !grade || !subject || !year || !link) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newPaper = new PastPaper({ board, grade, subject, year, pdfUrl: link });
    await newPaper.save();

    return NextResponse.json({ message: "Paper link uploaded successfully", pdfUrl: link }, { status: 201 });
  } catch (error) {
    // console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload paper" }, { status: 500 });
  }
}

// ✅ PUT API - Update Existing Paper Link
export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const { board, grade, subject, year, newLink } = await req.json();

    if (!board || !grade || !subject || !year || !newLink) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedPaper = await PastPaper.findOneAndUpdate(
      { board, grade, subject, year },
      { pdfUrl: newLink },
      { new: true }
    );

    if (!updatedPaper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Paper link updated successfully", pdfUrl: newLink });
  } catch (error) {
    // console.error("Update error:", error);
    return NextResponse.json({ error: "Failed to update paper link" }, { status: 500 });
  }
}

// ✅ DELETE API - Delete Paper
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();

    const { board, grade, subject, year } = await req.json();

    if (!board || !grade || !subject || !year) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const deletedPaper = await PastPaper.findOneAndDelete({ board, grade, subject, year });

    if (!deletedPaper) {
      return NextResponse.json({ error: "Paper not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Paper deleted successfully" });
  } catch (error) {
    // console.error("Delete error:", error);
    return NextResponse.json({ error: "Failed to delete paper" }, { status: 500 });
  }
}
