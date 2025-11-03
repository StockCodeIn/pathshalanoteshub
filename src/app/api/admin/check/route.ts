import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  const token = match ? decodeURIComponent(match[1]) : null;

  if (!token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const valid = verifyAdminToken(token, process.env.GK_ADMIN_KEY || '');
  if (!valid) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
