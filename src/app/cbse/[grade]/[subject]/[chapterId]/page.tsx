import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import styles from '@/styles/Home.module.css';

import PDFViewerWrapper from '@/components/PDFViewerWrapper';

interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
    chapterId: string;
  }>;
}

export async function generateStaticParams() {
  await connectDB();
  const chapters = await Chapter.find({ board: 'CBSE' }); // or 'CBSE' accordingly

  return chapters.map(chapter => ({
    grade: chapter.grade,
    subject: chapter.subject,
    chapterId: chapter.name,
  }));
}

export default async function CBSECHAPTERPage({ params }: PageProps) {
  const { grade, subject, chapterId } = await params;

  await connectDB();

  const chapterData = await Chapter.findOne({
    board: 'CBSE',
    grade,
    subject,
    name: chapterId,
  });

  if (!chapterData) {
    return (
      <main className="container">
        <h1>&quot;Work in Progress&quot;</h1>
      </main>
    );
  }

  return (
    <main className="container">
      <h1 className={styles['h2class']}>
        CBSE {chapterData.grade}th {chapterData.subject} - Chapter {chapterData.name}
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

