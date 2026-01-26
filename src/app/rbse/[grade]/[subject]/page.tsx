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

// ✅ SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject } = await params;
  const subjectData = subjects[grade]?.find((s) => s.id === subject);

  return {
    title: `RBSE Class ${grade} ${subjectData?.name || ""} Chapters | Pathshala Notes Hub`,
    description: `Explore RBSE Class ${grade} ${subjectData?.name || ""} chapters. Free RBSE notes and study material.`,
    keywords: [
      `RBSE Class ${grade} ${subjectData?.name} notes`,
      `RBSE ${subjectData?.name} chapters`,
      `RBSE Class ${grade} syllabus`,
    ],
    alternates: {
      canonical: `/rbse/${grade}/${subject}`,
    },
    openGraph: {
      title: `RBSE Class ${grade} ${subjectData?.name} Chapters`,
      description: `RBSE Class ${grade} ${subjectData?.name} chapter-wise notes and study resources.`,
      type: "website",
    },
  };

}
// Parent listing now served on-demand; cache for SEO
export const revalidate = 604800; // 7 days

// ✅ Page Component
export default async function RBSESubjectPage({ params }: PageProps) {
  const { grade, subject } = await params;
  const gradeSubjects = subjects[grade] || [];
  const subjectData = gradeSubjects.find((s) => s.id === subject);

  if (!subjectData) {
    return (
      <main className="container">
        <h1>❌ Subject Not Found</h1>
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
            RBSE Class {grade} - {subjectData.name}
          </h1>
          <p>
            Explore all chapters of <strong>{subjectData.name}</strong> for RBSE
            Class {grade}. Get access to free notes and resources for exam
            preparation.
          </p>
        </div>
      </section>

      {/* ===== Top display ad (just after hero) ===== */}
      {/* Ad Type: DISPLAY (responsive leaderboard) - Standard banner ad */}
      {/* Purpose: Primary monetization spot, high visibility after hero */}
      {/* CLS Safe: Yes (min-height 90px desktop, 50px mobile pre-allocated) */}
      <div className="ad-wrapper display">
        <div className="ad-slot">
        <AdsenseAd slot="3928666945" variant="display" />
        </div>
      </div>

      {/* ✅ Chapters Section */}
      <h2 className={styles.sectionTitle}>Available Chapters</h2>
      <nav aria-label="RBSE chapters list">
        <div className={styles.cardContainer2}>
          {subjectData.chapters.map((chapter, index) => (
            <div key={index} style={{ width: "100%" }}>
              <Link
                key={index}
                href={`/rbse/${grade}/${subject}/${index + 1}`}
                className={styles.card2}
              >
                {/* <span className={styles.cardIcon}>📖</span> */}
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
                  <AdsenseAd slot="1785500472" variant="in-feed" />
                  </div>
                </div>
              )}
            </div>

          ))}
        </div>
      </nav>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Use Pathshala Notes Hub?</h2>
        <ul>
          <li>✔ Free RBSE Class {grade} notes and chapters</li>
          <li>✔ Chapter-wise easy-to-read study material</li>
          <li>✔ Helps in exam preparation with organized content</li>
        </ul>
      </section>

      {/* ===== Footer multiplex ad (end of page) ===== */}
      {/* Ad Type: MULTIPLEX (autorelaxed) - Grid of recommended content links */}
      {/* Purpose: Provide related content recommendations, increase engagement */}
      {/* CLS Safe: Yes (min-height 400px desktop, 350px mobile pre-allocated) */}
      <div className="ad-wrapper multiplex">
        <div className="ad-slot">
        <AdsenseAd slot="7484768575" variant="multiplex" />
        </div>
        {/* Replace SLOT_FOOTER_MULTIPLEX with your real ad slot id */}
      </div>
      
    </main>
  );
}
