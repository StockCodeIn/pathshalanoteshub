import GKEditorClient from '@/components/GKEditorClient';
import { verifyAdminToken } from '@/lib/adminAuth';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'GK Editor - Admin',
};

export default async function Page() {
  // Server-side cookie check
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get('admin_token')?.value || null;
  const payload = verifyAdminToken(cookieHeader, process.env.GK_ADMIN_KEY || '');
  if (!payload) {
    // redirect to login
    return (
      <main>
        <p>Redirecting to login...</p>
        <script dangerouslySetInnerHTML={{ __html: "window.location.href='/admin/login'" }} />
      </main>
    );
  }

  return (
    <main>
      <GKEditorClient />
    </main>
  );
}
