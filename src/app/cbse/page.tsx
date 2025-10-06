import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import styles from "@/styles/Home.module.css";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "CBSE Notes - Class 10 & 12 | Pathshala Notes Hub",
  description:
    "Download free CBSE Class 10 & 12 notes and study resources. Perfect for CBSE board exam preparation.",
  keywords: [
    "CBSE notes",
    "CBSE Class 10 notes",
    "CBSE Class 12 notes",
    "CBSE study material",
  ],
  openGraph: {
    title: "CBSE Notes - Class 10 & 12 | Pathshala Notes Hub",
    description:
      "Free CBSE study materials for Class 10 & 12 including notes and guides.",
    url: process.env.NEXT_PUBLIC_SITE_URL + "/cbse",
    siteName: "Pathshala Notes Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CBSE Notes",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

// ✅ Classes Data
const gradesData = [
  {
    href: "/cbse/10",
    title: "CBSE Class 10",
    description: "Notes and resources for Class 10 CBSE students",
  },
  {
    href: "/cbse/12",
    title: "CBSE Class 12",
    description: "Notes and resources for Class 12 CBSE students",
  },
];

// ✅ FAQ Data
const faqData = [
  {
    q: "What is included in CBSE Class 10 notes?",
    a: "CBSE Class 10 notes include chapter-wise summaries and key points.",
  },
  {
    q: "Are CBSE Class 12 notes free?",
    a: "Yes, all CBSE Class 12 notes and study resources are completely free to access on Pathshala Notes Hub.",
  },
];

export default function CBSEPage() {
  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>CBSE Study Materials</h1>
          <p>
            Free <strong>CBSE Class 10 & 12 Notes</strong> and study
            resources to help you score better in board exams.
          </p>
        </div>
      </section>

      {/* ✅ Classes Section */}
      <h2 className={styles.sectionTitle}>Choose Your Class</h2>
      <div className={styles.cardContainer2}>
        {gradesData.map((grade, index) => (
          <Link key={index} href={grade.href} className={styles.card2}>
            <h3>{grade.title}</h3>
            <p>{grade.description}</p>
          </Link>
        ))}
      </div>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Choose Our CBSE Notes?</h2>
        <ul>
          <li>✔ Chapter-wise concise notes</li>
          <li>✔ Student-friendly explanations</li>
          <li>✔ Up-to-date with latest CBSE syllabus</li>
        </ul>
      </section>

      {/* ✅ FAQ Section */}
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
        id="cbse-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          }),
        }}
      />
    </main>
  );
}
