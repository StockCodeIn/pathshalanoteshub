import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import styles from "@/styles/Home.module.css";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "RBSE Notes - Class 10 & 12 | Pathshala Notes Hub",
  description:
    "Download free RBSE Class 10 & 12 notes, and study resources. Perfect for Rajasthan Board exam preparation.",
  keywords: [
    "RBSE notes",
    "RBSE Class 10 notes",
    "RBSE Class 12 notes",
    "RBSE study material",
  ],
  openGraph: {
    title: "RBSE Notes - Class 10 & 12 | Pathshala Notes Hub",
    description:
      "Free RBSE study materials for Class 10 & 12 including notes.",
    url: process.env.NEXT_PUBLIC_SITE_URL + "/rbse",
    siteName: "Pathshala Notes Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RBSE Notes",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

// ✅ Classes Data
const gradesData = [
  {
    href: "/rbse/10",
    // icon: "10",
    title: "RBSE Class 10",
    description: "Notes and resources for Class 10 RBSE students",
  },
  {
    href: "/rbse/12",
    // icon: "12",
    title: "RBSE Class 12",
    description: "Notes and resources for Class 12 RBSE students",
  },
];

// ✅ FAQ Data
const faqData = [
  {
    q: "What is included in RBSE Class 10 notes?",
    a: "RBSE Class 10 notes include chapter-wise study material and solved examples.",
  },
  {
    q: "Are RBSE Class 12 notes free?",
    a: "Yes, all RBSE Class 12 notes and resources are completely free to access on Pathshala Notes Hub.",
  }
];

export default function RBSEPage() {
  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>RBSE Study Materials</h1>
          <p>
            Free <strong>RBSE Class 10 & 12 Notes</strong> and study
            resources to help you prepare better for your board exams.
          </p>
        </div>
      </section>

      {/* ✅ Classes Section */}
      <h2 className={styles.sectionTitle}>Choose Your Class</h2>
      <div className={styles.cardContainer2}>
        {gradesData.map((grade, index) => (
          <Link key={index} href={grade.href} className={styles.card2}>
            {/* <span className={styles.cardIcon}>{grade.icon}</span> */}
            <h3>{grade.title}</h3>
            <p>{grade.description}</p>
          </Link>
        ))}
      </div>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Choose Our RBSE Notes?</h2>
        <ul>
          <li>✔ Chapter-wise concise notes</li>
          <li>✔ Student-friendly explanations</li>
          <li>✔ Up-to-date with latest RBSE syllabus</li>
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
        id="rbse-faq-schema"
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
