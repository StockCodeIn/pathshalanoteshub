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

// ✅ Metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject } = await params;
  const subjectName =
    subjects[grade]?.find((s) => s.id === subject)?.name || "Subject";

  return {
    title: `CBSE Class ${grade} ${subjectName} - Chapters | Pathshala Notes Hub`,
    description: `Explore CBSE Class ${grade} ${subjectName} chapter-wise study material. Access free notes in PDF format to prepare better for your exams.`,
    keywords: [
      `CBSE Class ${grade} ${subjectName} notes`,
      `CBSE Class ${grade} ${subjectName} chapters`,
      "CBSE study material",
      "CBSE notes PDF",
    ],
  };
}

// ✅ Static params generate karne ka function
export async function generateStaticParams() {
  const params = [];
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

// ✅ Main Page Component
export default async function CBSESubjectPage({ params }: PageProps) {
  const gradeValue = (await params).grade;
  const subjectId = (await params).subject;
  const gradeSubjects = subjects[gradeValue] || [];
  const subject = gradeSubjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <main className="container">
        <h1>Subject Not Found</h1>
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
            CBSE Class {gradeValue} - {subject.name}
          </h1>
          <p>
            Access free CBSE Class {gradeValue} {subject.name} chapter-wise
            notes. Download PDF study material for better exam preparation.
          </p>
        </div>
      </section>

      {/* ✅ Chapter Cards */}
      <div className={styles.cardContainer2}>
        {subject.chapters.map((chapter, index) => (
          <Link
            key={index}
            href={`/cbse/${gradeValue}/${subjectId}/${index + 1}`}
            className={styles.card2}
          >
            {/* <span className={styles.cardIcon}>📘</span> */}
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
        <h2>Why Study with Us?</h2>
        <ul>
          <li>✔ NCERT + CBSE based structured notes</li>
          <li>✔ Free PDF access anytime</li>
          <li>✔ Helps in board exam preparation</li>
        </ul>
      </section>
    </main>
  );
}
