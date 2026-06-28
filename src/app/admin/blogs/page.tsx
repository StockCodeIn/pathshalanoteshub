import { verifyAdminToken } from '@/lib/adminAuth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import BlogEditorClient from '@/components/BlogEditorClient';

export const metadata = {
  title: 'Blogs Admin - Pathshala Notes Hub',
};

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_token')?.value || null;
  const payload = await verifyAdminToken(token, process.env.GK_ADMIN_KEY || '');

  if (!payload) {
    redirect('/admin/login');
  }

  return (
    <main>
      <BlogEditorClient />
    </main>
  );
}
