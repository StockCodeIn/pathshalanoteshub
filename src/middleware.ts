import { NextRequest, NextResponse } from 'next/server';
import { subjects } from '@/config/subjects';

const VALID_GRADES = new Set(Object.keys(subjects));

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Fast reject invalid grade routes like /cbse/11/... or /rbse/11/...
  const m = pathname.match(/^\/(cbse|rbse)\/([^\/]+)(?:\/|$)/);
  if (m) {
    const grade = m[2];
    if (!VALID_GRADES.has(grade)) {
      return new NextResponse('Not Found', { status: 404 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cbse/:path*', '/rbse/:path*'],
};
