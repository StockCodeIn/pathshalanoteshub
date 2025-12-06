// src/app/cbse/[grade]/[subject]/[chapterId]/page.tsx
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import styles from '@/styles/Home.module.css';
import PDFViewerWrapper from '@/components/PDFViewerWrapper';
import type { Metadata } from "next";
import AdsenseAd from "@/components/AdsenseAd";


export const dynamic = "force-dynamic"; // ⬅ Live updates के लिए ज़रूरी

interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
    chapterId: string;
  }>;
}

// ✅ Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject, chapterId } = await params;

  return {
    title: `CBSE Class ${grade} ${subject} - Chapter ${chapterId} Notes PDF | Pathshala`,
    description: `Download free CBSE Class ${grade} ${subject} Chapter ${chapterId} notes in PDF format. Easy to understand, NCERT-based study material for exam preparation.`,
    keywords: [
      `CBSE Class ${grade} ${subject} Chapter ${chapterId} notes`,
      `CBSE ${grade} ${subject} PDF`,
      "CBSE study material",
      "NCERT based notes",
    ],
  };
}

// ✅ Static params generate function
export async function generateStaticParams() {
  await connectDB();
  const chapters = await Chapter.find({ board: 'CBSE' });

  return chapters.map((chapter) => ({
    grade: chapter.grade,
    subject: chapter.subject,
    chapterId: chapter.name,
  }));
}

// ✅ Main page
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
        <h1>📄 Work in Progress</h1>
        <p>यह अध्याय अभी वेबसाइट पर उपलब्ध नहीं है।</p>
      </main>
    );
  }

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            CBSE Class {chapterData.grade} {chapterData.subject} - Chapter{" "}
            {chapterData.name}
          </h1>
          <p>
            Free CBSE Class {chapterData.grade} {chapterData.subject} notes for
            Chapter {chapterData.name}. Download PDF study material to prepare
            effectively for your exams.
          </p>
        </div>
      </section>
      {/* After hero */}
      <AdsenseAd slot="3294419739" />


      {/*  PDF Viewer / Extracted HTML */}
      <section className="container">
        {chapterData.extractedHtml ? (
          <>
            <article className="prose" dangerouslySetInnerHTML={{ __html: chapterData.extractedHtml }} />
            <div style={{ margin: "1rem 0" }}>
              <AdsenseAd slot="8355174726" />
            </div>
          </>
        ) : (
          <>
            <PDFViewerWrapper
              url={chapterData.pdfUrl}
              title={chapterData.name}
              board={chapterData.board}
              grade={chapterData.grade}
              subject={chapterData.subject}
            />
            <div style={{ margin: "1rem 0" }}>
              <AdsenseAd slot="7612938696" />
            </div>
          </>
        )}
      </section>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Choose Our Notes?</h2>
        <ul>
          <li>✔ Based on NCERT & CBSE latest syllabus</li>
          <li>✔ Free PDF download for offline study</li>
          <li>✔ Helps you score high in board exams</li>
        </ul>
      </section>
      <AdsenseAd slot="7421367001" />

    </main>
  );
}
