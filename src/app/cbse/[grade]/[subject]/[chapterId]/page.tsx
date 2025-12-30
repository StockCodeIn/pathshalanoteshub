// src/app/cbse/[grade]/[subject]/[chapterId]/page.tsx
import { notFound } from 'next/navigation';
import { cache } from 'react';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import styles from '@/styles/Home.module.css';
import PDFViewerWrapper from '@/components/PDFViewerWrapper';
import type { Metadata } from "next";
import AdsenseAd from "@/components/AdsenseAd";

export const dynamic = "force-dynamic";

const getChapter = cache(async (query: any): Promise<any> => {
  await connectDB();
  return Chapter.findOne(query, { name: 1, board: 1, grade: 1, subject: 1, pdfUrl: 1, extractedHtml: 1 }).lean();
});

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
  };
}

/* Child chapters: force-dynamic with caching */

/* ------------------ MAIN PAGE COMPONENT ------------------ */

// ✅ Main page
export default async function CBSECHAPTERPage({ params }: PageProps) {
  const { grade, subject, chapterId } = await params;

  const chapterData = await getChapter({
    board: 'CBSE',
    grade,
    subject,
    name: chapterId,
  });

  if (!chapterData) {
    notFound();
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
      <div className="ad-block">
        <AdsenseAd slot="3294419739" />
      </div>


      {/*  PDF Viewer / Extracted HTML */}
      <section className="container">
        {chapterData.extractedHtml ? (
          <>
            <article className="prose" dangerouslySetInnerHTML={{ __html: chapterData.extractedHtml }} />
            <div className="ad-block">
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
            <div className="ad-block">
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
      <div className="ad-block">
        <AdsenseAd slot="7421367001" />
      </div>

    </main>
  );
}
