import Link from "next/link";
import { subjects } from "@/config/subjects";
import styles from "@/styles/Home.module.css";
import type { Metadata } from "next";
import Script from "next/script";
import AdsenseAd from "@/components/AdsenseAd"; 
import Breadcrumbs from "@/components/Breadcrumbs";

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

  const title = `RBSE Class ${grade} ${subjectData?.name || ""} - Chapter-Wise Notes, Study Material & Solutions | Pathshala Notes Hub`;
  const description = `Complete RBSE Class ${grade} ${subjectData?.name || ""} chapter-wise notes with explanations, solutions and past papers. Free PDF study material for board exam preparation.`;

  return {
    title,
    description,
    keywords: [
      `RBSE Class ${grade} ${subjectData?.name} notes`,
      `RBSE ${subjectData?.name} chapters`,
      `RBSE Class ${grade} syllabus`,
      `RBSE ${subjectData?.name} study material`,
      `${subjectData?.name} exam preparation`,
    ],
    alternates: {
      canonical: `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}`,
    },
    openGraph: {
      title: `RBSE Class ${grade} ${subjectData?.name} Chapters`,
      description,
      type: "website",
      url: `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}`,
    },
    twitter: {
      card: 'summary',
      title: `RBSE Class ${grade} ${subjectData?.name}`,
      description,
    },
  };

}
// Parent listing now served on-demand; cache for SEO
export const revalidate = 604800; // 7 days

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
      <section className={styles.hero} aria-labelledby="subject-title">
        <div className={styles.heroContent}>
          <h1 id="subject-title">
            RBSE Class {grade} - {subjectData.name}
          </h1>
          <p>
            Explore all chapters of <strong>{subjectData.name}</strong> for RBSE
            Class {grade}. Get access to free notes and resources for exam
            preparation.
          </p>
        </div>
      </section>

            <div className="container" style={{ paddingTop: "1rem" }} >
              <Breadcrumbs 
                items={[
                  { href: "/", label: "Home", },
                  { href: "/rbse", label: "RBSE Notes", },
                  { href: `/rbse/${grade}`, label: `Class ${grade}`, },
                  { href: `/rbse/${grade}/${subject}`, label: subjectData.name, },
                ]}
              />
            </div>

      
      <AdsenseAd slot="3928666945" variant="display" />


      {/* ✅ Chapters Section */}
      <h2 className={styles.sectionTitle}>Available Chapters</h2>
      <nav aria-label="RBSE chapters list">
        <div className={styles.cardContainer2}>
          {subjectData.chapters.map((chapter, index) => (
            <div key={index} style={{ width: "100%" }}>
              <Link
                key={index}
                href={`/rbse/${grade}/${subject}/${index + 1}`}
                className={styles.card2}
              >
                {/* <span className={styles.cardIcon}>📖</span> */}
                <h3>Chapter {index + 1}</h3>
                <p>
                  {chapter}
                </p>
              </Link>
              
            </div>

          ))}
        </div>
      </nav>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Use Pathshala Notes Hub?</h2>
        <ul>
          <li>✔ Free RBSE Class {grade} notes and chapters</li>
          <li>✔ Chapter-wise easy-to-read study material</li>
          <li>✔ Helps in exam preparation with organized content</li>
        </ul>
      </section>



      <Script
       id="breadcrumb-schema"
       type="application/ld+json"
       dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.pathshalanoteshub.in",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "RBSE",
                item: "https://www.pathshalanoteshub.in/rbse",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `Class ${grade}`,
                item: `https://www.pathshalanoteshub.in/rbse/${grade}`,
             },
             {
               "@type": "ListItem",
               position: 4,
               name: subjectData.name,
               item: `https://www.pathshalanoteshub.in/rbse/${grade}/${subject}`,
             },
           ],
          }),
        }}
      />

    </main>
  );
}
