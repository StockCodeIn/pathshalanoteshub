// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || password !== process.env.GK_ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    // ✅ Generate token (ensure it is string)
    const token = await Promise.resolve(
      createAdminToken(process.env.GK_ADMIN_KEY || '', 60 * 60)
    );

    const res = NextResponse.json({ success: true });

    // ✅ Cookie settings
    const isProd = process.env.NODE_ENV === 'production';
    const cookieParts = [
      `admin_token=${encodeURIComponent(token)}`,
      'HttpOnly',
      'Path=/',
      'Max-Age=3600',
    ];

    cookieParts.push('SameSite=Lax');
    if (isProd) cookieParts.push('Secure');

    res.headers.append('Set-Cookie', cookieParts.join('; '));

    return res;
  } catch (err) {
    console.error('Login route error:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
