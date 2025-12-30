// src/app/rbse/[grade]/[subject]/[chapterId]/page.tsx
import { notFound } from 'next/navigation';
import { cache } from 'react';
import connectDB from "@/lib/mongodb";
import { Chapter } from "@/models/chapter";
import styles from "@/styles/Home.module.css";
import PDFViewerWrapper from "@/components/PDFViewerWrapper";
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

// ✅ SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject, chapterId } = await params;

  return {
    title: `RBSE Class ${grade} ${subject} - Chapter ${chapterId} Notes | Pathshala Notes Hub`,
    description: `Access RBSE Class ${grade} ${subject} Chapter ${chapterId} notes in PDF format. Free study material for exam preparation.`,
    
  };
}

/* Child chapters: force-dynamic with caching */

/* ------------------ MAIN PAGE COMPONENT ------------------ */

// ✅ Main page component
export default async function RBSEChapterPage({ params }: PageProps) {
  const { grade, subject, chapterId } = await params;

  const chapterData = await getChapter({
    board: "RBSE",
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
            RBSE Class {grade} - {subject}
            <br /> Chapter {chapterData.name}
          </h1>
          <p>
            Free RBSE Class {grade} {subject} notes for Chapter {chapterData.name}.
            Download and study in PDF format to prepare better for your board exams.
          </p>
        </div>
      </section>
      {/* After hero */}
      <div className="ad-block">
        <AdsenseAd slot="3928666945" />
      </div>


      {/*  PDF Viewer / Extracted HTML */}
      <div className="container" style={{ marginTop: "2rem" }}>
        {chapterData.extractedHtml ? (
          <>
            <article className="prose" dangerouslySetInnerHTML={{ __html: chapterData.extractedHtml }} />
            <div className="ad-block">
              <AdsenseAd slot="4412060289" />
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
              <AdsenseAd slot="9472815276" />
            </div>
          </>
        )}
      </div>

      {/* ✅ Trust / Extra Info Section */}
      <section className={styles.trust}>
        <h2>Why Use These Notes?</h2>
        <ul>
          <li>✔ Based on official RBSE syllabus</li>
          <li>✔ Easy-to-understand PDF format</li>
          <li>✔ Helps with exam preparation and revision</li>
        </ul>
        <p>
          📌 All notes are collected and organized chapter-wise for Class {grade} {subject}.
        </p>
      </section>
      <div className="ad-block">
        <AdsenseAd slot="5729011389" />
      </div>

    </main >
  );
}
