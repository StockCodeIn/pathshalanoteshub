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

export default async function RBSEPastPapersPage({ params }: PageProps) {
  const { grade, subject } = await params;

  await connectDB();

  // ✅ MongoDB से उस subject के available years निकालना
  const papers = await PastPaper.find({
    board: "RBSE",
    grade,
    subject,
  }).select("year");

  // ✅ Unique years (descending order)
  const uniqueYears = Array.from(new Set(papers.map((p) => p.year))).sort(
    (a, b) => b - a
  );

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            RBSE Class {grade} - {subject} Previous Year Papers
          </h1>
          <p>
            Access <strong>RBSE Class {grade} {subject}</strong> past question
            papers year-wise to prepare effectively for exams.
          </p>
        </div>
      </section>

      {/* ✅ Years Section */}
      <h2 className={styles.sectionTitle}>Available Years</h2>
      <div className={styles.cardContainer2}>
        {uniqueYears.length > 0 ? (
          uniqueYears.map((year) => (
            <Link
              key={year}
              href={`/rbse-papers/${grade}/${subject}/${year}`}
              className={styles.card2}
            >
              {/* <span className={styles.cardIcon}>📄</span> */}
              <h3>{year}</h3>
              <p>View {year} RBSE {subject} paper</p>
            </Link>
          ))
        ) : (
          <p>No papers available for RBSE Class {grade} {subject}.</p>
        )}
      </div>

      {/* ✅ Trust Section */}
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
