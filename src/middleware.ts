// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login')) {
    const token = req.cookies.get('admin_token')?.value || null;
    const secret = process.env.GK_ADMIN_KEY || '';
    const verified = await verifyAdminToken(token, secret);
    if (!verified) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*'],
};
