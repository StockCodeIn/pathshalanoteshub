import { notFound } from "next/navigation";
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

/* ------------------ SEO METADATA ------------------ */
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
    { board: "RBSE" },
    { grade: 1, subject: 1, name: 1 }
  ).lean();

  return chapters.map((ch: any) => ({
    grade: ch.grade,
    subject: ch.subject,
    chapterId: ch.name,
  }));
}

export const revalidate = 604800; // 7 days

/* ------------------ RUNTIME CACHE ------------------ */
const chapterCache = new Map<string, any>();
const CACHE_DURATION = 3600000;

function getCacheKey(board: string, grade: string, subject: string, name: string) {
  return `${board}:${grade}:${subject}:${name}`;
}

function getCachedChapter(key: string) {
  const cached = chapterCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  chapterCache.delete(key);
  return null;
}

function setCachedChapter(key: string, data: any) {
  chapterCache.set(key, { data, timestamp: Date.now() });
}

/* ------------------ PAGE ------------------ */
export default async function RBSEChapterPage({ params }: PageProps) {
  const { grade, subject, chapterId } = await params;

  const cacheKey = getCacheKey("RBSE", grade, subject, chapterId);
  let chapterData = getCachedChapter(cacheKey);

  if (!chapterData) {
    await connectDB();
    chapterData = await Chapter.findOne({
      board: "RBSE",
      grade,
      subject,
      name: chapterId,
    })
      .lean()
      .maxTimeMS(8000);

    if (chapterData) {
      setCachedChapter(cacheKey, chapterData);
    }
  }

  if (!chapterData) {
    notFound();
  }

  /* ✅ FIRST PAGE SPLIT (KEY FIX) */
  const firstPage: string | undefined = chapterData.pageImages?.[0];
  const restPages: string[] = chapterData.pageImages?.slice(1) || [];

  return (
    <main>
      {/* HERO */}
      <section className={styles.hero} style={{
          contentVisibility: "auto",
          containIntrinsicSize: "500px",
        }} aria-labelledby="chapter-title">
        <div className={styles.heroContent}>
          <h1 id="chapter-title">
            RBSE Class {grade} - {subject}
            <br />
            Chapter {chapterData.name}
          </h1>
          <p>
            Free RBSE Class {grade} {subject} notes for Chapter{" "}
            {chapterData.name}. Download and study in PDF format to prepare
            better for your board exams.
          </p>
        </div>
      </section>

      {/* TOP AD */}
      <div className="ad-wrapper display">
        <div className="ad-slot">
          <AdsenseAd slot="8403374554" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="container pdf-section" style={{ position: 'relative', contain: "layout style paint"  }}>
        {chapterData.extractedHtml ? (
          <>
            <article
              className="prose"
              dangerouslySetInnerHTML={{ __html: chapterData.extractedHtml }}
            />
          </>
        ) : (
          <div
            style={{
              width: "100%",
              maxWidth: "900px",
              margin: "0 auto",
              contain: "layout style paint",
            }}
          >
            <article itemScope itemType="https://schema.org/Article">
              {/* 🔥 LCP IMAGE – ONLY ONCE */}
              {firstPage && (
                <img
                  src={firstPage}
                  alt={`RBSE Class ${grade} ${subject} Chapter ${chapterData.name} Page 1`}
                  width={900}
                  height={1200}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                    marginBottom: "1rem",
                  }}
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              )}

              {/* ⬇️ VIEWER FROM PAGE 2 */}
              <CloudinaryPDFViewer
                title={chapterData.name}
                pageImages={restPages}
              />
            </article>
          </div>
        )}
      </div>

      {/* 
        ============================================
        MULTIPLEX AD (Bottom - Grid Recommendations)
        ============================================
        Type: multiplex (autorelaxed)
        Purpose: Grid of related ads at bottom
        Slot: 5729011389 (Google multiplex slot)
        Format: data-ad-format="autorelaxed"
        CLS: ✅ No CLS (min-height pre-allocated)
        Dimensions: 300x250+ multiple items
        Best for: Bottom of page, recommendations
        ============================================
      */}
      <AdsenseAd slot="5729011389" variant="multiplex" />

      {/* TRUST */}
      <section className={styles.trust}>
        <h2>Why Use These Notes?</h2>
        <ul>
          <li>✔ Based on official RBSE syllabus</li>
          <li>✔ Easy-to-understand PDF format</li>
          <li>✔ Helps with exam preparation and revision</li>
        </ul>
        <p>
          📌 All notes are collected and organized chapter-wise for Class {grade}{" "}
          {subject}.
        </p>
      </section>
    </main>
  );
}
