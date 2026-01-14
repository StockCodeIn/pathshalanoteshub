// src/app/rbse/[grade]/[subject]/[chapterId]/page.tsx
import { notFound } from 'next/navigation';
import connectDB from "@/lib/mongodb";
import { Chapter } from "@/models/chapter";
import styles from "@/styles/Home.module.css";
import CloudinaryPDFViewer from "@/components/CloudinaryPDFViewer";
import type { Metadata } from "next";
import AdsenseAd from "@/components/AdsenseAd";


interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
    chapterId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject, chapterId } = await params;

  return {
    title: `RBSE Class ${grade} ${subject} Chapter ${chapterId} Notes (PDF) | Pathshala Notes Hub`,
    description: `RBSE Class ${grade} ${subject} Chapter ${chapterId} notes with page-wise PDF images. Free, syllabus-based study material.`,
    alternates: {
      canonical: `/rbse/${grade}/${subject}/${chapterId}`,
    },
    openGraph: {
      title: `RBSE Class ${grade} ${subject} Chapter ${chapterId} Notes`,
      description: `Free RBSE Class ${grade} ${subject} Chapter ${chapterId} notes in PDF image format.`,
      type: "article",
    },
  };
}


/* ------------------ STATIC PATHS WITH ISR ------------------ */
export async function generateStaticParams() {
  await connectDB();
  const chapters = await Chapter.find(
    { board: 'RBSE' },
    { grade: 1, subject: 1, name: 1 }
  ).lean();

  return chapters.map((ch) => ({
    grade: ch.grade,
    subject: ch.subject,
    chapterId: ch.name,
  }));
}

export const revalidate = 604800; // 7 days

/* ✅ QUERY CACHING - Taaki database slow na ho */
const chapterCache = new Map<string, any>();
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

function getCacheKey(board: string, grade: string, subject: string, name: string): string {
  return `${board}:${grade}:${subject}:${name}`;
}

function getCachedChapter(key: string): any | null {
  const cached = chapterCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  chapterCache.delete(key);
  return null;
}

function setCachedChapter(key: string, data: any): void {
  chapterCache.set(key, { data, timestamp: Date.now() });
}

/* ------------------ MAIN PAGE COMPONENT ------------------ */

// ✅ Main page component
export default async function RBSEChapterPage({ params }: PageProps) {
  const { grade, subject, chapterId } = await params;

  // Check cache first (for runtime caching)
  const cacheKey = getCacheKey('RBSE', grade, subject, chapterId);
  let chapterData = getCachedChapter(cacheKey);

  if (!chapterData) {
    // Only connect if not in cache
    await connectDB();

    chapterData = await Chapter.findOne({
      board: "RBSE",
      grade,
      subject,
      name: chapterId,
    }).lean().maxTimeMS(8000) as any; // 8 second timeout

    if (chapterData) {
      setCachedChapter(cacheKey, chapterData);
    }
  }

  if (!chapterData) {
    notFound();
  }

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero} aria-labelledby="chapter-title">
        <div className={styles.heroContent}>
          <h1 id="chapter-title">
            RBSE Class {grade} - {subject}
            <br /> Chapter {chapterData.name}
          </h1>
          <p>
            Free RBSE Class {grade} {subject} notes for Chapter {chapterData.name}.
            Download and study in PDF format to prepare better for your board exams.
          </p>
        </div>
      </section>

      {/* ✅ TOP DISPLAY AD (CLS SAFE) */}
      <div className="ad-wrapper display">
        <div className="ad-slot">
        <AdsenseAd slot="3928666945" />
        </div>
      </div>


      {/*  PDF Viewer / Extracted HTML */}
      <div className="container" style={{ marginTop: "2rem", contain: 'layout style paint' }}>
        {chapterData.extractedHtml ? (
          <>
            <article className="prose" dangerouslySetInnerHTML={{ __html: chapterData.extractedHtml }} />
            <div className="ad-wrapper display">
              <div className="ad-slot">
              <AdsenseAd slot="4412060289" />
              </div>
            </div>
          </>
        ) : (
          <div style={{
            width: '100%',
            maxWidth: '900px',
            margin: '0 auto',
            contain: 'layout style paint'
          }}>
            {/* ✅ Ab hum sirf wahi props bhej rahe hain jo zaruri hain */}
            <article itemScope itemType="https://schema.org/Article">
              <CloudinaryPDFViewer
                title={chapterData.name}
                pageImages={chapterData.pageImages || []}
              />
            </article>



          </div>
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
      <div className="ad-wrapper multiplex">
        <div className="ad-slot">
        <AdsenseAd slot="5729011389" />
        </div>
      </div>

    </main >
  );
}
