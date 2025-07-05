import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import styles from '@/styles/Home.module.css';
import PDFViewerWrapper from '@/components/PDFViewerWrapper';

export const dynamic = "force-dynamic"; // ⬅ live update support

interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
    chapterId: string;
  }>;
}

// ✅ Static params generate karne ka function
export async function generateStaticParams() {
  await connectDB();
  const chapters = await Chapter.find({ board: 'RBSE' });

  return chapters.map((chapter) => ({
    grade: chapter.grade,
    subject: chapter.subject,
    chapterId: chapter.name,
  }));
}

// ✅ Main page component
export default async function RBSECHAPTERPage({ params }: PageProps) {
  const { grade, subject, chapterId } = await params;

  await connectDB();

  const chapterData = await Chapter.findOne({
    board: 'RBSE',
    grade,
    subject,
    name: chapterId,
  });

  if (!chapterData) {
    return (
      <main className="container">
        <h1>📄 Work in Progress</h1>
        <p>यह अध्याय अभी वेबसाइट पर उपलब्ध नहीं है।</p>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className={styles['h2class']}>
        RBSE {chapterData.grade}th {chapterData.subject} - Chapter {chapterData.name}
      </h1>

      <PDFViewerWrapper
        url={chapterData.pdfUrl}
        title={chapterData.name}
        board={chapterData.board}
        grade={chapterData.grade}
        subject={chapterData.subject}
      />
    </main>
  );
}
