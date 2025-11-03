import GKEditorClient from '@/components/GKEditorClient';
import { verifyAdminToken } from '@/lib/adminAuth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation'; // ✅ ye line nayi add hui

export const metadata = {
  title: 'GK Editor - Admin',
};

export default async function Page() {
  // ✅ Server-side cookie check
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get('admin_token')?.value || null;
  const payload = verifyAdminToken(cookieHeader, process.env.GK_ADMIN_KEY || '');

  // ✅ Agar token invalid hai to Next.js redirect karega (no flicker, no reload loop)
  if (!payload) {
    redirect('/admin/login');
  }

  // ✅ Otherwise show editor
  return (
    <main>
      <GKEditorClient />
    </main>
  );
}
