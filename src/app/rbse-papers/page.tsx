import Link from "next/link";
import type { Metadata } from "next";
import Script from "next/script";
import styles from "@/styles/Home.module.css";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "RBSE Previous Year Papers - Class 10 & 12 | Pathshala Notes Hub",
  description:
    "Download free RBSE previous year papers for Class 10 & 12. Best resource for Rajasthan Board exam preparation.",
  keywords: [
    "RBSE previous year papers",
    "RBSE Class 10 papers",
    "RBSE Class 12 papers",
    "Rajasthan Board papers",
    "RBSE question papers",
  ],
  openGraph: {
    title: "RBSE Previous Year Papers - Class 10 & 12 | Pathshala Notes Hub",
    description:
      "Free RBSE previous year question papers for Class 10 & 12. Practice real exam papers for better preparation.",
    url: process.env.NEXT_PUBLIC_SITE_URL + "/rbse-papers",
    siteName: "Pathshala Notes Hub",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "RBSE Previous Year Papers",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

// ✅ Classes Data
const rbseClasses = [
  {
    grade: "10",
    href: "/rbse-papers/10",
    description: "Access Class 10 RBSE previous year question papers.",
  },
  {
    grade: "12",
    href: "/rbse-papers/12",
    description: "Access Class 12 RBSE previous year question papers.",
  },
];

// ✅ FAQ Data
const faqData = [
  {
    q: "Why should I practice RBSE previous year papers?",
    a: "Practicing RBSE previous year papers helps you understand exam patterns, frequently asked questions, and improves time management.",
  },
  {
    q: "Do these RBSE papers have answers?",
    a: "No, we provide direct access to official RBSE previous year papers only.",
  },
  {
    q: "Are these RBSE papers free to download?",
    a: "Yes, all RBSE previous year papers on Pathshala Notes Hub are completely free to access.",
  },
];

export default function RBSEPastPapersPage() {
  return (
    <main>
      {/* ✅ Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>RBSE Previous Year Papers</h1>
          <p>
            Download free <strong>RBSE Class 10 & 12 Previous Year Papers</strong> to boost your exam preparation.
          </p>
        </div>
      </section>

      {/* ✅ Classes Section */}
      <h2 className={styles.sectionTitle}>Select Your Class</h2>
      <div className={styles.cardContainer2}>
        {rbseClasses.map((cls, i) => (
          <Link key={i} href={cls.href} className={styles.card2}>
            {/* <span className={styles.cardIcon}>{cls.grade}</span> */}
            <h3>RBSE Class {cls.grade}</h3>
            <p>{cls.description}</p>
          </Link>
        ))}
      </div>

      {/* ✅ Trust Section */}
      <section className={styles.trust}>
        <h2>Why Use Our RBSE Papers?</h2>
        <ul>
          <li>✔ Get official RBSE previous year papers</li>
          <li>✔ Understand exam pattern & important topics</li>
          <li>✔ Improve speed and accuracy with practice</li>
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
        id="rbse-papers-faq-schema"
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
