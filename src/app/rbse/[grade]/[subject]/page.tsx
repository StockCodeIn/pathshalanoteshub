import Link from "next/link";
import { subjects } from "@/config/subjects";
import styles from "@/styles/Home.module.css";
import type { Metadata } from "next";

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
    description: `Explore RBSE Class ${grade} ${subjectData?.name || ""} chapters. Get free notes and resources for exam preparation.`,
    keywords: [
      `RBSE Class ${grade} ${subjectData?.name} notes`,
      `RBSE ${subjectData?.name} syllabus`,
      `RBSE Class ${grade} chapters`,
      "RBSE study material",
    ],
  };
}

// ✅ Generate static params
export async function generateStaticParams() {
  const params: { grade: string; subject: string }[] = [];
  for (const grade of Object.keys(subjects)) {
    for (const subject of subjects[grade]) {
      params.push({
        grade,
        subject: subject.id,
      });
    }
  }
  return params;
}

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
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>
            RBSE Class {grade} - {subjectData.name}
          </h1>
          <p>
            Explore all chapters of <strong>{subjectData.name}</strong> for RBSE
            Class {grade}. Get access to free notes and resources for exam
            preparation.
          </p>
        </div>
      </section>

      {/* ✅ Chapters Section */}
      <h2 className={styles.sectionTitle}>Available Chapters</h2>
      <div className={styles.cardContainer2}>
        {subjectData.chapters.map((chapter, index) => (
          <Link
            key={index}
            href={`/rbse/${grade}/${subject}/${index + 1}`}
            className={styles.card2}
          >
            {/* <span className={styles.cardIcon}>📖</span> */}
            <h3>Chapter {index + 1}</h3>
            <p>
              {chapter.split(" ").length > 5
                ? chapter.split(" ").slice(0, 5).join(" ") + "..."
                : chapter}
            </p>
          </Link>
        ))}
      </div>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Use Pathshala Notes Hub?</h2>
        <ul>
          <li>✔ Free RBSE Class {grade} notes and chapters</li>
          <li>✔ Chapter-wise easy-to-read study material</li>
          <li>✔ Helps in exam preparation with organized content</li>
        </ul>
      </section>
    </main>
  );
}
