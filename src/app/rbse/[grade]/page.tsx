import Link from "next/link";
import { subjects } from "@/config/subjects";
import type { Metadata } from "next";
import styles from "@/styles/Home.module.css";

interface PageProps {
  params: Promise<{ grade: string }>;
}

// ✅ SEO Metadata (Dynamic per grade)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const gradeValue = (await params).grade;
  return {
    title: `RBSE Class ${gradeValue} Subjects | Pathshala Notes Hub`,
    description: `Explore all subjects for RBSE Class ${gradeValue}. Access free notes, chapters, and study resources for Rajasthan Board exam preparation.`,
    keywords: [
      `RBSE Class ${gradeValue} subjects`,
      `RBSE ${gradeValue} study material`,
      `RBSE ${gradeValue} syllabus`,
      "Rajasthan Board subjects",
      "RBSE notes",
    ],
    openGraph: {
      title: `RBSE Class ${gradeValue} Subjects | Pathshala Notes Hub`,
      description: `Get RBSE Class ${gradeValue} subject-wise resources including chapters and notes.`,
      url: process.env.NEXT_PUBLIC_SITE_URL + `/rbse/${gradeValue}`,
      siteName: "Pathshala Notes Hub",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `RBSE Class ${gradeValue} Subjects`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
  };
}

// ✅ Generate static parameters for RBSE grades
export function generateStaticParams() {
  return Object.keys(subjects).map((grade) => ({
    grade,
  }));
}

export default async function RBSESubjectsPage({ params }: PageProps) {
  const gradeValue = (await params).grade;
  const gradeSubjects = subjects[gradeValue] || [];

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>RBSE Class {gradeValue} Subjects</h1>
          <p>
            <strong>RBSE Class {gradeValue}</strong> Importent subjects and access
            notes, chapters, and study materials.
          </p>
        </div>
      </section>

      {/* ✅ Subjects Section */}
      <h2 className={styles.sectionTitle}>Available Subjects</h2>
      <div className={styles.cardContainer2}>
        {gradeSubjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/rbse/${gradeValue}/${subject.id}`}
            className={styles.card2}
          >
            {/* <span className={styles.cardIcon}>📘</span> */}
            <h3>{subject.name}</h3>
            <p>Click to view chapters</p>
          </Link>
        ))}
      </div>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Study with Pathshala Notes Hub?</h2>
        <ul>
          <li>✔ Free access to all RBSE Class {gradeValue} subjects</li>
          <li>✔ Organized notes and chapters for easy learning</li>
          <li>✔ Covers Rajasthan Board syllabus completely</li>
        </ul>
      </section>
    </main>
  );
}
