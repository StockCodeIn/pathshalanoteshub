// src/app/rbse-papers/[grade]/[subject]/[year]/page.tsx
import { notFound } from 'next/navigation';
import connectDB from "@/lib/mongodb";
import PastPaper from "@/models/PastPaper";
import styles from "@/styles/Home.module.css";
import type { Metadata } from "next";
import OpenPaperButtonClient from "@/components/OpenPaperButtonClient";
import AdsenseAd from "@/components/AdsenseAd";
import Breadcrumbs from "@/components/Breadcrumbs";
import Script from "next/script";
import Link from "next/link";

interface PageProps {
  params: Promise<{ grade: string; subject: string; year: string }>;
}

// ✅ Dynamic SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { grade, subject, year } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  return {
    title: `RBSE Class ${grade} ${subject} Previous Year Question Paper ${year} PDF| Pathshala Notes Hub`,
    description: `Download RBSE Class ${grade} ${subject} Previous Year Question Paper ${year} PDF with official board pattern.`,
    keywords: [
      `RBSE Class ${grade} ${subject} ${year} question paper`,
      `RBSE ${subject} ${year} PDF`,
      "RBSE previous year papers",
    ],
    robots: {
      index: true,
      follow: true,
    },

    alternates: {
      canonical: `${baseUrl}/rbse-papers/${grade}/${subject}/${year}`,
    },
    openGraph: {
      title: `RBSE Class ${grade} ${subject} Question Paper ${year}`,
      description: `Free RBSE Class ${grade} ${subject} ${year} past paper PDF.`,
      url: `${baseUrl}/rbse-papers/${grade}/${subject}/${year}`,
      siteName: "Pathshala Notes Hub",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "RBSE Previous Year Question Paper",
        },
      ],
      locale: "en_IN",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `RBSE Class ${grade} ${subject} ${year} Notes PDF`,
      description: `Download RBSE Class ${grade} ${subject} ${year} Notes PDF.`,
      images: ["/og-image.png"],
    },
  };
}

export const revalidate = 604800; // 7 days

// ✅ RBSE Paper Viewer Page
export default async function RBSEPaperViewerPage({ params }: PageProps) {
  const { grade, subject, year } = await params;

  // Convert grade to DB format
  const dbGrade = grade.endsWith("th") ? grade : `${grade}th`;
  await connectDB();
  const paper = await PastPaper.findOne({
    board: "RBSE",
    grade: dbGrade,
    subject,
    year: year,
  })

  if (!paper) {
    notFound();
  }
  const otherYears = await PastPaper.find({
    board: "RBSE",
    grade: dbGrade,
    subject,
    year: { $ne: year },
  })
    .select("year")
    .sort({ year: -1 })
    .lean();

  return (
    <main>
      <section
        className={styles.hero}
        aria-labelledby="paper-title"
        style={{
          containIntrinsicSize: "260px",
        }}>
        <div className={styles.heroContent}>
          <h1 id="paper-title">
            RBSE Class {grade} - {subject} - {year} Question Paper
          </h1>
          <p>
            Access the official RBSE {subject} question paper for Class {grade} ({year}) in PDF format.
            Perfect for exam practice and understanding the board exam pattern.
          </p>
        </div>
      </section>

      <div
        className="container"
        style={{ paddingTop: "1rem" }}
      >
        <Breadcrumbs
          items={[
            {
              href: "/",
              label: "Home",
            },
            {
              href: "/rbse-papers",
              label: "RBSE Previous Papers",
            },
            {
              href: `/rbse-papers/${grade}`,
              label: `Class ${grade}`,
            },
            {
              href: `/rbse-papers/${grade}/${subject}`,
              label: subject,
            },
            {
              href: `/rbse-papers/${grade}/${subject}/${year}`,
              label: year,
            },
          ]}
        />
      </div>


      <AdsenseAd slot="3697566809" variant="display" />

      <section
        aria-label="Download RBSE question paper"
        style={{
          minHeight: 120,
          containIntrinsicSize: "260px"
        }}
      >
        <div className={styles.downloadSection}>
          <OpenPaperButtonClient url={paper.pdfUrl} />
        </div>
      </section>




      <section className={styles.trust}>
        <h2>Why Practice RBSE Past Papers?</h2>
        <p>
          These papers help you understand the latest exam pattern, marking scheme, and question trend.
          Regular practice improves speed, accuracy, and confidence for the final board exam.
        </p>
        <ul>
          <li>✔ Updated exam pattern and question style</li>
          <li>✔ Better time management with real paper practice</li>
          <li>✔ Focus on important and repeated questions</li>
          <li>✔ Build confidence before the final exam</li>
        </ul>
        <p>
          📌 All papers are collected from official or trusted RBSE sources.
        </p>
      </section>

      <section className={styles.trust}>
        <h2>Other Previous Year Papers</h2>

        <div className={styles.paperGrid}>
          {otherYears.map((paper) => (
            <Link
              key={paper.year}
              href={`/rbse-papers/${grade}/${subject}/${paper.year}`}
              className={styles.paperCard}
            >
              <span className={styles.paperYear}>{paper.year}</span>

              <span className={styles.paperTitle}>
                RBSE Class {grade} {subject}
              </span>

              <span className={styles.paperSubtitle}>
                Previous Year Question Paper →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <AdsenseAd slot="5595662634" variant="multiplex" />

      <Script
        id="paper-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",

            name: `RBSE Class ${grade} ${subject} Previous Year Question Paper ${year}`,

            description: `Download RBSE Class ${grade} ${subject} Previous Year Question Paper ${year} PDF.`,

            url: `https://www.pathshalanoteshub.in/rbse-papers/${grade}/${subject}/${year}`,

            inLanguage: "en-IN",

            publisher: {
              "@type": "Organization",
              name: "Pathshala Notes Hub",
            },

            mainEntity: {
              "@type": "CreativeWork",
              name: `${subject} ${year} Question Paper`,
            },
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
                name: "RBSE Previous Papers",
                item: "https://www.pathshalanoteshub.in/rbse-papers",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: `Class ${grade}`,
                item: `https://www.pathshalanoteshub.in/rbse-papers/${grade}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: subject,
                item: `https://www.pathshalanoteshub.in/rbse-papers/${grade}/${subject}`,
              },
              {
                "@type": "ListItem",
                position: 5,
                name: year,
                item: `https://www.pathshalanoteshub.in/rbse-papers/${grade}/${subject}/${year}`,
              }
            ],
          }),
        }}
      />
    </main>
  );
}
