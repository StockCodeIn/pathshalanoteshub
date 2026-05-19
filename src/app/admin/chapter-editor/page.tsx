// src/app/admin/chapter-editor/page.tsx
import { verifyAdminToken } from '@/lib/adminAuth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import ChapterEditorClient from '@/components/ChapterEditorClient';

export const metadata = {
  title: 'Chapter Editor - Admin',
};

export default async function Page() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.get('admin_token')?.value || null;
  const payload = verifyAdminToken(cookieHeader, process.env.GK_ADMIN_KEY || '');

  if (!payload) {
    redirect('/admin/login');
  }

  return (
    <main>
      <ChapterEditorClient />
    </main>
  );
}
