import connectDB from "@/lib/mongodb";
import PastPaper from "@/models/PastPaper";
import Link from "next/link";
import type { Metadata } from "next";
import styles from "@/styles/Home.module.css";

// ✅ Params interface
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
  };
}

// ✅ RBSE Subjects Page
export default async function RBSESubjectsPage({ params }: PageProps) {
  const { grade } = await params;

  // Route grade to DB grade (10 → 10th)
  const dbGrade = grade.endsWith("th") ? grade : `${grade}th`;

  // Connect to MongoDB
  await connectDB();

  // Fetch subjects for this grade
  const papers = await PastPaper.find({ board: "RBSE", grade: dbGrade }).select("subject");

  // Remove duplicates and sort alphabetically
  const uniqueSubjects = Array.from(new Set(papers.map((p) => p.subject))).sort();

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>RBSE Class {grade} - Select Subject</h1>
          <p>Select a subject to explore <strong>RBSE Class {grade} previous year papers</strong>.</p>
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
              <h3>{subject}</h3>
              <p>View previous years question papers.</p>
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
