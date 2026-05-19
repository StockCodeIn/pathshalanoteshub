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
  const title = `RBSE Class ${gradeValue} All Subjects - Free Chapter-Wise Notes & Study Material | Pathshala Notes Hub`;
  const description = `Complete RBSE Class ${gradeValue} subject-wise chapter notes with explanations. Access free PDF study material for Rajasthan Board exam preparation.`;
  
  return {
    title,
    description,
    keywords: [
      `RBSE Class ${gradeValue} subjects`,
      `RBSE Class ${gradeValue} study material`,
      `RBSE Class ${gradeValue} syllabus`,
      `RBSE ${gradeValue} notes`,
      "Rajasthan Board subjects",
      "RBSE exam preparation",
    ],
    alternates: {
      canonical: `https://www.pathshalanoteshub.in/rbse/${gradeValue}`,
    },
    openGraph: {
      title: `RBSE Class ${gradeValue} Subjects`,
      description,
      url: `https://www.pathshalanoteshub.in/rbse/${gradeValue}`,
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
    twitter: {
      card: 'summary_large_image',
      title: `RBSE Class ${gradeValue} Subjects`,
      description,
      images: ["/og-image.png"],
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
