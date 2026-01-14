// src/app/cbse/[grade]/[subject]/[chapterId]/page.tsx
import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import { Chapter } from '@/models/chapter';
import styles from '@/styles/Home.module.css';
import CloudinaryPDFViewer from '@/components/CloudinaryPDFViewer';
import type { Metadata } from "next";
import AdsenseAd from "@/components/AdsenseAd";

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
    title: `CBSE Class ${grade} ${subject} Chapter ${chapterId} Notes (PDF) | Pathshala Notes Hub`,
    description: `CBSE Class ${grade} ${subject} Chapter ${chapterId} notes with page-wise PDF images. Free, syllabus-based study material.`,
    alternates: {
      canonical: `/CBSE/${grade}/${subject}/${chapterId}`,
    },
    openGraph: {
      title: `CBSE Class ${grade} ${subject} Chapter ${chapterId} Notes`,
      description: `Free CBSE Class ${grade} ${subject} Chapter ${chapterId} notes in PDF image format.`,
      type: "article",
    },
  };
}

/* ------------------ STATIC PATHS WITH ISR ------------------ */
export async function generateStaticParams() {
  await connectDB();
  const chapters = await Chapter.find(
    { board: 'CBSE' },
    { grade: 1, subject: 1, name: 1 }
  ).lean();

  return chapters.map((ch: any) => ({
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

export default async function CBSECHAPTERPage({ params }: PageProps) {
  const { grade, subject, chapterId } = await params;

  // Check cache first (for runtime caching)
  const cacheKey = getCacheKey('CBSE', grade, subject, chapterId);
  let chapterData = getCachedChapter(cacheKey);

  if (!chapterData) {
    // Only connect if not in cache
    await connectDB();

    chapterData = await Chapter.findOne({
      board: 'CBSE',
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
      {/* ✅ TOP DISPLAY AD (CLS SAFE) */}
      <div className="ad-wrapper display">
        <div className="ad-slot">
        <AdsenseAd slot="3294419739" />
        </div>
      </div>

      {/* ✅ PDF Viewer section with Cloudinary JPG Images */}
      <section className="container pdf-section" style={{ position: 'relative' }}>
        {chapterData.extractedHtml ? (
          <>
            <article className="prose" dangerouslySetInnerHTML={{ __html: chapterData.extractedHtml }} />
            <div className="ad-wrapper display">
              <div className="ad-slot">
              <AdsenseAd slot="8355174726" />
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
            {/* ✅ Cloudinary PDF Viewer - Crystal Clear Images */}
            <article itemScope itemType="https://schema.org/Article">
              <CloudinaryPDFViewer
                title={chapterData.name}
                pageImages={chapterData.pageImages || []}
              />
            </article>
          </div>
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
      <div className="ad-wrapper multiplex">
        <div className="ad-slot">
        <AdsenseAd slot="7421367001" />
        </div>
      </div>

    </main>
  );
}
