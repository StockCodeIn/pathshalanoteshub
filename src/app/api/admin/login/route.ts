// src/app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/adminAuth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    if (!password || password !== process.env.GK_ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

  // create token
  const token = createAdminToken(process.env.GK_ADMIN_KEY || '', 60 * 60); // 1 hour

  const res = NextResponse.json({ success: true });

  // Set cookie options: add Secure in production and keep SameSite=Lax for normal flows.
  // If your production site requires cross-site cookies (e.g., different domain), change SameSite to 'None' and include 'Secure'.
  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [`admin_token=${encodeURIComponent(token)}`, 'HttpOnly', 'Path=/', `Max-Age=3600`];
  // Use Lax by default; can be switched to 'None' if cross-site behavior is needed
  cookieParts.push('SameSite=Lax');
  if (isProd) cookieParts.push('Secure');

  res.headers.append('Set-Cookie', cookieParts.join('; '));
  return res;
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
