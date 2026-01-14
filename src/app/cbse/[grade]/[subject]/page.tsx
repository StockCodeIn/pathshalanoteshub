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

      {/* ===== Top in-article ad (just after hero) ===== */}
      <div className="ad-wrapper display">
        <div className="ad-slot">
        <AdsenseAd slot="4962547015" />
        </div>
        {/* Replace SLOT_LISTING_TOP with your real ad slot id */}
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

              {/* ===== Mid-list ad: insert AFTER the 6th chapter (index === 5) ===== */}
              {index === 5 && (
                <div className="ad-wrapper display">
                  <div className="ad-slot">
                  <AdsenseAd slot="9855958653" />
                  </div>
                  {/* Replace SLOT_LISTING_INSET with your real ad slot id */}
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
      <div className="ad-wrapper multiplex">
        <div className="ad-slot">
        <AdsenseAd slot="7421367001" />
        </div>
        {/* Replace SLOT_FOOTER_MULTIPLEX with your real ad slot id */}
      </div>
    </main>
  );
}
