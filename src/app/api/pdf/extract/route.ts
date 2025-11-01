// src/app/api/pdf/extract/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'PDF extraction feature is disabled on this deployment' }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ message: 'PDF extraction feature is disabled on this deployment' }, { status: 410 });
}
