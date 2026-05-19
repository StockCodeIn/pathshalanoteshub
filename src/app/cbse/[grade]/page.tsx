import Link from "next/link";
import { subjects } from "@/config/subjects";
import type { Metadata } from "next";
import styles from "@/styles/Home.module.css";

interface PageProps {
  params: Promise<{ grade: string }>;
}

// ✅ SEO Metadata (Dynamic per grade)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const gradeValue = resolvedParams.grade;

  const title = `CBSE Class ${gradeValue} All Subjects - Free NCERT Chapter-Wise Notes & Study Material | Pathshala Notes Hub`;
  const description = `Complete CBSE Class ${gradeValue} subject-wise chapter notes based on NCERT. Access free PDF study material for Central Board exam preparation.`;

  return {
    title,
    description,
    keywords: [
      `CBSE Class ${gradeValue} subjects`,
      `NCERT Class ${gradeValue} subjects`,
      `CBSE Class ${gradeValue} syllabus`,
      `CBSE ${gradeValue} notes`,
      "Central Board subjects",
      "CBSE exam preparation",
    ],
    alternates: {
      canonical: `https://www.pathshalanoteshub.in/cbse/${gradeValue}`,
    },
    openGraph: {
      title: `CBSE Class ${gradeValue} Subjects`,
      description,
      url: `https://www.pathshalanoteshub.in/cbse/${gradeValue}`,
      siteName: "Pathshala Notes Hub",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: `CBSE Class ${gradeValue} Subjects`,
        },
      ],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: 'summary_large_image',
      title: `CBSE Class ${gradeValue} Subjects`,
      description,
      images: ["/og-image.png"],
    },
  };
}

// ✅ Static params for each CBSE grade
export function generateStaticParams() {
  return Object.keys(subjects).map((grade) => ({
    grade,
  }));
}

export default async function CBSEGradeSubjectsPage({ params }: PageProps) {
  const resolvedParams = await params;
  const gradeValue = resolvedParams.grade;
  const gradeSubjects = subjects[gradeValue] || [];

  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>CBSE Class {gradeValue} Subjects</h1>
          <p>
            <strong>CBSE Class {gradeValue}</strong> Importent subjects and
            access notes, chapters, and study resources.
          </p>
        </div>
      </section>

      {/* ✅ Subjects Section */}
      <h2 className={styles.sectionTitle}>Available Subjects</h2>
      <div className={styles.cardContainer2}>
        {gradeSubjects.map((subject) => (
          <Link
            key={subject.id}
            href={`/cbse/${gradeValue}/${subject.id}`}
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
          <li>✔ Free access to all CBSE Class {gradeValue} subjects</li>
          <li>✔ Organized notes and chapters for easy learning</li>
          <li>✔ Helps in exam preparation with structured resources</li>
        </ul>
      </section>
    </main>
  );
}
