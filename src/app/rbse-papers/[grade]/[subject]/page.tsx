import connectDB from "@/lib/mongodb";
import PastPaper from "@/models/PastPaper";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "@/styles/Home.module.css";

interface PageProps {
  params: Promise<{ grade: string; subject: string }>;
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject } = await params;

  return {
    title: `RBSE Class ${grade} ${subject} Previous Year Papers | Pathshala Notes Hub`,
    description: `Download RBSE Class ${grade} ${subject} previous year papers (year-wise). Free Rajasthan Board past papers for exam preparation.`,
    keywords: [
      `RBSE Class ${grade} ${subject} papers`,
      `RBSE ${subject} previous year papers`,
      `RBSE Class ${grade} question papers`,
      "RBSE old papers",
      "Rajasthan Board past papers",
    ],
    openGraph: {
      title: `RBSE Class ${grade} ${subject} Previous Year Papers`,
      description: `Access year-wise RBSE Class ${grade} ${subject} past question papers for free.`,
      url: process.env.NEXT_PUBLIC_SITE_URL + `/rbse-papers/${grade}/${subject}`,
      siteName: "Pathshala Notes Hub",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `RBSE Class ${grade} ${subject} Previous Year Papers`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}
// Parent listing now served on-demand; cache for SEO
export const revalidate = 604800; // 7 days

// ✅ RBSE Past Papers Page (year-wise)
export default async function RBSEPastPapersPage({ params }: PageProps) {
  const { grade, subject } = await params;

  // Convert route param to DB format
  const dbGrade = grade.endsWith("th") ? grade : `${grade}th`;

  const DB_TIMEOUT_MS = 3000;
  let uniqueYears: string[] = [];

  try {
    await Promise.race([
      connectDB(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("DB timeout")), DB_TIMEOUT_MS)),
    ]);

    // ✅ MongoDB query with timeout
    const papers = await Promise.race([
      PastPaper.find({ board: "RBSE", grade: dbGrade, subject }).select("year").lean(),
      new Promise<any[]>((_, reject) => setTimeout(() => reject(new Error("Query timeout")), DB_TIMEOUT_MS)),
    ]);

    // ✅ Unique years (descending)
    uniqueYears = Array.from(new Set((papers as any[]).map((p) => p.year))).sort((a, b) => b - a);
  } catch (err) {
    // Silent fallback: render empty year list
    uniqueYears = [];
  }

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            RBSE Class {grade} - {subject} Previous Year Papers
          </h1>
          <p>
            Access <strong>RBSE Class {grade} {subject}</strong> past question papers year-wise to prepare effectively for exams.
          </p>
        </div>
      </section>

      <h2 className={styles.sectionTitle}>Available Years</h2>
      <div className={styles.cardContainer2}>
        {uniqueYears.length > 0 ? (
          uniqueYears.map((year) => (
            <Link
              key={year}
              href={`/rbse-papers/${grade}/${subject}/${year}`}
              className={styles.card2}
            >
              <h3>{year}</h3>
              <p>View {year} RBSE {subject} paper</p>
            </Link>
          ))
        ) : (
          <p>No papers available for RBSE Class {grade} {subject}.</p>
        )}
      </div>

      <section className={styles.trust}>
        <h2>Why Practice Previous Year Papers?</h2>
        <ul>
          <li>✔ Understand real exam patterns and difficulty level</li>
          <li>✔ Identify important questions and topics</li>
          <li>✔ Improve exam time management</li>
        </ul>
      </section>
    </main>
  );
}
