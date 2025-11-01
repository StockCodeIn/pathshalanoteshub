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
    res.headers.append('Set-Cookie', `admin_token=${encodeURIComponent(token)}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`);
    return res;
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
