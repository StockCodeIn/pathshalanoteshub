// src/proxy.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { subjects } from '@/config/subjects';

const VALID_GRADES = new Set(Object.keys(subjects));

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Fast reject invalid grade routes like /cbse/11/... or /rbse/11/...
  const m = pathname.match(/^\/(cbse|rbse)\/([^\/]+)(?:\/|$)/);
  if (m) {
    const grade = m[2];
    if (!VALID_GRADES.has(grade)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  // Admin proxy/auth
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
  matcher: ['/api/admin/:path*', '/cbse/:path*', '/rbse/:path*'],
};
