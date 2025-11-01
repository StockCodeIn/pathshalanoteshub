// src/app/api/pdf/scan/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: 'PDF scan/processing feature is disabled on this deployment' }, { status: 410 });
}

export async function GET() {
  return NextResponse.json({ message: 'PDF scan feature is disabled on this deployment' }, { status: 410 });
}
