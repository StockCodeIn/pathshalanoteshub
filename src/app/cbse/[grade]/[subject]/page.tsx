// src/app/cbse/[grade]/[subject]/page.tsx
import Link from "next/link";
import { subjects } from "@/config/subjects";
import styles from "@/styles/Home.module.css";
import type { Metadata } from "next";
import AdsenseAd from "@/components/AdsenseAd"; // <-- import the ad component

interface PageProps {
  params: Promise<{
    grade: string;
    subject: string;
  }>;
}

// ... generateMetadata and generateStaticParams unchanged (keep your existing functions) ...

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject } = await params;
  const subjectName =
    subjects[grade]?.find((s) => s.id === subject)?.name || "Subject";

  return {
    title: `CBSE Class ${grade} ${subjectName} Chapters | Pathshala Notes Hub`,
    description: `Explore CBSE Class ${grade} ${subjectName} chapter-wise study material. Free PDF notes for exam preparation.`,
    keywords: [
      `CBSE Class ${grade} ${subjectName} notes`,
      `CBSE ${subjectName} chapters`,
      `CBSE Class ${grade} syllabus`,
    ],
    alternates: {
      canonical: `/cbse/${grade}/${subject}`,
    },
    openGraph: {
      title: `CBSE Class ${grade} ${subjectName} Chapters`,
      description: `CBSE Class ${grade} ${subjectName} chapter-wise notes and study material.`,
      type: "website",
    },
  };
}

// Parent listing now served on-demand; cache for SEO
export const revalidate = 604800; // 7 days

export default async function CBSESubjectPage({ params }: PageProps) {
  const gradeValue = (await params).grade;
  const subjectId = (await params).subject;
  const gradeSubjects = subjects[gradeValue] || [];
  const subject = gradeSubjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <main className="container">
        <h1>Subject Not Found</h1>
        <p>The requested subject could not be found.</p>
      </main>
    );
  }

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero} aria-labelledby="subject-title">
        <div className={styles.heroContent}>
          <h1 id="subject-title">
            CBSE Class {gradeValue} - {subject.name}
          </h1>
          <p>
            Access free CBSE Class {gradeValue} {subject.name} chapter-wise
            notes. Download PDF study material for better exam preparation.
          </p>
        </div>
      </section>

      {/* ===== Top display ad (just after hero) ===== */}
      {/* Ad Type: DISPLAY (responsive leaderboard) - Standard banner ad */}
      {/* Purpose: Primary monetization spot, high visibility after hero */}
      {/* CLS Safe: Yes (min-height 90px desktop, 50px mobile pre-allocated) */}
      <div className="ad-wrapper display">
        <div className="ad-slot">
        <AdsenseAd slot="4962547015" variant="display" />
        </div>
      </div>

      {/* ✅ Chapter Cards */}
      <nav aria-label="CBSE chapters list">
        <div className={styles.cardContainer2}>
          {subject.chapters.map((chapter, index) => (
            <div key={index} style={{ width: "100%" }}>
              <Link
                href={`/cbse/${gradeValue}/${subjectId}/${index + 1}`}
                className={styles.card2}
              >
                <h3>Chapter {index + 1}</h3>
                <p>
                  {chapter}
                </p>
              </Link>

              {/* ===== Mid-list in-feed ad: insert AFTER the 6th chapter (index === 5) ===== */}
              {/* Ad Type: IN-FEED (fluid) - Blends with content list like native ad */}
              {/* Purpose: Non-disruptive monetization within chapter list flow */}
              {/* CLS Safe: Yes (min-height 150px desktop, 120px mobile pre-allocated) */}
              {index === 5 && (
                <div className="ad-wrapper in-feed">
                  <div className="ad-slot">
                  <AdsenseAd slot="5055156483" variant="in-feed" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Study with Us?</h2>
        <ul>
          <li>✔ NCERT + CBSE based structured notes</li>
          <li>✔ Free PDF access anytime</li>
          <li>✔ Helps in board exam preparation</li>
        </ul>
      </section>

      {/* ===== Footer multiplex ad (end of page) ===== */}
      {/* Ad Type: MULTIPLEX (autorelaxed) - Grid of recommended content links */}
      {/* Purpose: Provide related content recommendations, increase engagement */}
      {/* CLS Safe: Yes (min-height 400px desktop, 350px mobile pre-allocated) */}
      <div className="ad-wrapper multiplex">
        <div className="ad-slot">
        <AdsenseAd slot="7421367001" variant="multiplex" />
        </div>
      </div>
    </main>
  );
}
