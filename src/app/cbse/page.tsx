import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import styles from "@/styles/Home.module.css";
import Breadcrumbs from "@/components/Breadcrumbs";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "CBSE Notes - Free NCERT Study Material for Class 10 & 12 | Pathshala Notes Hub",
  description:
    "Complete CBSE Class 10 & 12 chapter-wise NCERT notes, previous year papers, and study resources. Free PDF download for Central Board exam preparation.",
  keywords: [
    "CBSE notes",
    "NCERT notes",
    "CBSE Class 10 notes",
    "CBSE Class 12 notes",
    "NCERT study material",
    "CBSE exam preparation",
    "Central Board notes",
    "free study material",
  ],
  alternates: {
    canonical: "https://www.pathshalanoteshub.in/cbse",
  },
  openGraph: {
    title: "CBSE Notes - Free NCERT Study Material for Class 10 & 12",
    description:
      "Complete CBSE Class 10 & 12 chapter-wise NCERT notes and study resources for Central Board exam preparation.",
    url: "https://www.pathshalanoteshub.in/cbse",
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
  twitter: {
    card: 'summary_large_image',
    title: "CBSE Notes - Class 10 & 12",
    description: "Free CBSE NCERT study materials for Class 10 & 12 exam preparation",
    images: ["/og-image.png"],
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

      <div className="container" style={{ paddingTop: "1rem" }} >
        <Breadcrumbs 
          items={[
            { href: "/", label: "Home", },
            { href: "/cbse", label: "CBSE Notes", },
          ]}
        />
      </div>


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
                name: "CBSE",
                item: "https://www.pathshalanoteshub.in/cbse",
              },
            ],
          }),
        }}
      />




    </main>
  );
}
