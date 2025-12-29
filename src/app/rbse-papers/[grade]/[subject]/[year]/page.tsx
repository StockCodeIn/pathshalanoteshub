// src/app/rbse-papers/[grade]/[subject]/[year]/page.tsx
import connectDB from "@/lib/mongodb";
import PastPaper from "@/models/PastPaper";
import Link from "next/link";
import styles from "@/styles/Home.module.css";
import type { Metadata } from "next";
import OpenPaperButtonClient from "@/components/OpenPaperButtonClient";

interface PageProps {
  params: Promise<{ grade: string; subject: string; year: string }>;
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject, year } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: `RBSE Class ${grade} ${subject} Question Paper ${year} | Pathshala Notes Hub`,
    description: `Download RBSE Class ${grade} ${subject} ${year} question paper PDF. Practice past papers for better exam preparation.`,
    keywords: [
      `RBSE Class ${grade} ${subject} ${year} question paper`,
      `RBSE ${subject} ${year} PDF`,
      "RBSE previous year papers",
    ],
    alternates: {
      canonical: `${baseUrl}/rbse-papers/${grade}/${subject}/${year}`,
    },
    openGraph: {
      title: `RBSE Class ${grade} ${subject} Question Paper ${year}`,
      description: `Free RBSE Class ${grade} ${subject} ${year} past paper PDF.`,
      url: `${baseUrl}/rbse-papers/${grade}/${subject}/${year}`,
      siteName: "Pathshala Notes Hub",
      locale: "en_IN",
      type: "article",
    },
  };
}
/* ------------------ STATIC PARAMS ------------------ */
export async function generateStaticParams() {
  await connectDB();

  const papers = await PastPaper.find(
    { board: "RBSE" },
    { grade: 1, subject: 1, year: 1 }
  ).lean();

  return papers.map((p) => ({
    grade: p.grade,      // example: "10th"
    subject: p.subject,  // example: "Hindi"
    year: p.year,        // example: "2024"
  }));
}

// ✅ RBSE Paper Viewer Page
export default async function RBSEPaperViewerPage({ params }: PageProps) {
  const { grade, subject, year } = await params;

  // Convert grade to DB format
  const dbGrade = grade.endsWith("th") ? grade : `${grade}th`;

  await connectDB();

  // ✅ Fetch paper from DB (match grade as string)
  const paper = await PastPaper.findOne({
    board: "RBSE",
    grade: dbGrade,
    subject,
    year: year, // keep string, since DB has string
  });

  if (!paper) {
    return (
      <main className="container">
        <h1 className={styles["h2class"]}>❌ Paper Not Found</h1>
        <p>No question paper available for RBSE Class {grade} {subject} {year}.</p>
        <Link href="/rbse-papers" className={styles.ctaDownloadButton}>
          Back to Papers
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            RBSE Class {grade} - {subject} - {year} Question Paper
          </h1>
          <p>
            Access the official RBSE {subject} question paper for Class {grade} ({year}) in PDF format.
            Perfect for exam practice and understanding the board exam pattern.
          </p>
        </div>
      </section>

      <div className={styles.downloadSection}>
        <OpenPaperButtonClient url={paper.pdfUrl} label={`${subject} ${year} Paper`} />
      </div>


      <section className={styles.trust}>
        <h2>Why Practice RBSE Past Papers?</h2>
        <ul>
          <li>✔ Understand exam pattern</li>
          <li>✔ Improve time management</li>
          <li>✔ Identify important questions</li>
        </ul>
        <p>
          📌 Papers sourced from official RBSE website.
        </p>
      </section>
    </main>
  );
}
