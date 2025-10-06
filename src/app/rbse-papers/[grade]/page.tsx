import connectDB from "@/lib/mongodb";
import PastPaper from "@/models/PastPaper";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "@/styles/Home.module.css";

interface PageProps {
  params: Promise<{ grade: string }>;
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade } = await params;

  return {
    title: `RBSE Class ${grade} Previous Year Papers - Subjects | Pathshala Notes Hub`,
    description: `Browse all RBSE Class ${grade} subjects to download previous year papers. Free access to Rajasthan Board past question papers.`,
    keywords: [
      `RBSE Class ${grade} previous year papers`,
      `RBSE ${grade} subjects`,
      `RBSE ${grade} question papers`,
      "Rajasthan Board previous papers",
      "RBSE past papers",
    ],
    openGraph: {
      title: `RBSE Class ${grade} Previous Year Papers | Pathshala Notes Hub`,
      description: `Select subject to view RBSE Class ${grade} previous year question papers.`,
      url: process.env.NEXT_PUBLIC_SITE_URL + `/rbse-papers/${grade}`,
      siteName: "Pathshala Notes Hub",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `RBSE Class ${grade} Previous Year Papers`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}

export default async function RBSESubjectsPage({ params }: PageProps) {
  const { grade } = await params;

  await connectDB();

  // ✅ MongoDB से उस grade के subjects निकालना
  const papers = await PastPaper.find({ board: "RBSE", grade }).select("subject");

  // ✅ Duplicate हटाना और Alphabetical order में sort करना
  const uniqueSubjects = Array.from(new Set(papers.map((p) => p.subject))).sort();

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>RBSE Class {grade} - Previous Year Papers</h1>
          <p>
            Select a subject to explore{" "}
            <strong>RBSE Class {grade} Previous Year Papers</strong>.
          </p>
        </div>
      </section>

      {/* ✅ Subjects Section */}
      <h2 className={styles.sectionTitle}>Available Subjects</h2>
      <div className={styles.cardContainer2}>
        {uniqueSubjects.length > 0 ? (
          uniqueSubjects.map((subject) => (
            <Link
              key={subject}
              href={`/rbse-papers/${grade}/${subject}`}
              className={styles.card2}
            >
              {/* <span className={styles.cardIcon}>📘</span> */}
              <h3>{subject}</h3>
              <p>View RBSE {grade} {subject} papers</p>
            </Link>
          ))
        ) : (
          <p>No subjects found for RBSE Class {grade}.</p>
        )}
      </div>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Use Our RBSE Previous Papers?</h2>
        <ul>
          <li>✔ Official RBSE past year question papers</li>
          <li>✔ Organized subject-wise for easy navigation</li>
          <li>✔ Free access for all students</li>
        </ul>
      </section>
    </main>
  );
}

