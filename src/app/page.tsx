import Link from "next/link";
import Script from "next/script";
import styles from "@/styles/Home.module.css";
import type { Metadata } from "next";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title:
    "Pathshala Notes Hub - Free RBSE & CBSE Notes, Old Papers, Study Material",
  description:
    "Download free RBSE & CBSE class 10th and 12th notes, previous year question papers, Indian GK, study plans and time management tips. Perfect resource for board exam preparation.",
  keywords: [
    "RBSE notes",
    "CBSE notes",
    "Class 10 notes",
    "Class 12 notes",
    "RBSE previous year papers",
    "CBSE study material",
    "Indian GK notes",
  ],
  openGraph: {
    title: 'Pathshala Notes Hub - Free RBSE & CBSE Notes & Indian GK',
    description:
      "Free RBSE & CBSE notes for 10th & 12th, old papers, Indian GK and study resources.",
    url:
      process.env.NEXT_PUBLIC_SITE_URL ||
      "https://www.pathshalanoteshub.in",
    siteName: "Pathshala Notes Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pathshala Notes Hub",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

// Boards Data
const boardsData = [
  {
    href: "/rbse",
    title: "RBSE Notes",
    description: "Rajasthan Board of Secondary Education",
  },
  {
    href: "/cbse",
    title: "CBSE Notes",
    description: "Central Board of Secondary Education",
  },
  {
    href: "/rbse-papers",
    title: "RBSE Old Papers",
    description: "Previous years exam papers with solutions",
  },
];

// Subjects Data
const subjectsData = [
  {
    href: "/rbse/10/mathematics",
    title: "RBSE 10 Mathematics",
    description: "Complete notes with examples",
  },
  {
    href: "/rbse/10/science",
    title: "RBSE 10 Science",
    description: "Easy and exam-focused notes",
  },
  {
    href: "/rbse/12/mathematics",
    title: "RBSE 12 Mathematics",
    description: "Chapter-wise notes",
  },
  {
    href: "/rbse/12/physics",
    title: "RBSE 12 Physics",
    description: "Well explained concepts + numericals",
  },
  {
    href: "/rbse/12/chemistry",
    title: "RBSE 12 Chemistry",
    description: "Chapter-wise notes with diagrams",
  },
  {
    href: "/cbse/10/mathematics",
    title: "CBSE 10 Mathematics",
    description: "Step-by-step solutions",
  },
  {
    href: "/cbse/10/science",
    title: "CBSE 10 Science",
    description: "Detailed notes with NCERT ref",
  },
  {
    href: "/cbse/12/mathematics",
    title: "CBSE 12 Mathematics",
    description: "Chapter-wise + PYQs",
  },
  
  {
    href: "/cbse/12/physics",
    title: "CBSE 12 Physics",
    description: "Numerical + Theory Notes",
  },
  {
    href: "/cbse/12/chemistry",
    title: "CBSE 12 Chemistry",
    description: "Chapter Notes + Equations",
  },
];

// Study Resources Data
const studyResources = [
  { href: "/study-plan", title: "Study Plan" },
  { href: "/time-management", title: "Time Management" },
  { href: "/gk", title: "Indian GK" },
];

// FAQ Data
const faqData = [
  {
    q: "What is Pathshala Notes Hub?",
    a: "It is a free platform providing RBSE & CBSE Class 10 and 12 notes, old papers, and study resources for board exam preparation.",
  },
  {
    q: "Are the notes free?",
    a: "Yes, all notes and resources on Pathshala Notes Hub are completely free to access.",
  },
  {
    q: "Which boards do you cover?",
    a: "Currently, we provide study material for RBSE (Rajasthan Board) and CBSE (Central Board of Secondary Education).",
  },
  {
  "q": "Is Indian GK content useful for exams?",
  "a": "Yes, our Indian GK notes cover important topics for board exams and various competitive exams in India."
},

];

export default function Home() {
  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Pathshala Notes Hub</h1>
          <p>
             Trusted by thousands of students for <strong>RBSE & CBSE Board Exam Preparation</strong> and <strong>Indian GK</strong>. Free notes, old papers, and study guides for Class 10 & 12.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/rbse" className={styles.ctaButton}>
              Explore RBSE
            </Link>
            <Link href="/cbse" className={styles.ctaButtonSecondary}>
              Explore CBSE
            </Link>
          </div>
        </div>
      </section>

      {/* ✅ Boards Section */}
      <h2 className={styles.sectionTitle}>RBSE & CBSE Notes</h2>
      <ul className={styles.listContainer}>
        {boardsData.map((board, i) => (
          <li key={i}>
            <Link href={board.href} className={styles.listCard}>
              <h3>{board.title}</h3>
              <p>{board.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {/* ✅ Study Resources Section */}
      <h2 className={styles.sectionTitle}>Study Resources</h2>
      <ul className={styles.listContainer}>
        {studyResources.map((res, i) => (
          <li key={i}>
            <Link href={res.href} className={styles.listCard}>
              <h3>{res.title}</h3>
            </Link>
          </li>
        ))}
      </ul>

      {/* ✅ Important Subjects */}
      <h2 className={styles.sectionTitle}>Important Subjects</h2>
      <div className={styles.cardContainer2}>
        {subjectsData.map((sub, i) => (
          <Link key={i} href={sub.href} className={styles.card2}>
            <h3>{sub.title}</h3>
            <p>{sub.description}</p>
          </Link>
        ))}
      </div>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Students Trust Us?</h2>
        <ul>
          <li>✔ 100% Free study resources</li>
          <li>✔ Updated & Board-specific notes</li>
          <li>✔ Student-friendly explanations</li>
        </ul>
      </section>

      {/* ✅ FAQ Accordion */}
      <section className={styles.faq}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqList}>
          {faqData.map((faq, i) => (
            <details key={i} className={styles.faqItem}>
              <summary>{faq.q}</summary>
              <p>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ✅ FAQ JSON-LD */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </main>
  );
}
